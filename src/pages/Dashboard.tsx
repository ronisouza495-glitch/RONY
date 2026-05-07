import React, { useState, useEffect, FormEvent } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import { Game, Log, CATEGORIES, Category } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  History, 
  Gamepad, 
  Search, 
  X, 
  Save, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  FileCode,
  ShieldCheck,
  Smartphone,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<'games' | 'logs'>('games');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0] as Category,
    imageUrl: '',
    description: '',
    officialLink: '',
    ipaUrl: '',
    manifestUrl: ''
  });
  const [ipaFile, setIpaFile] = useState<File | null>(null);

  useEffect(() => {
    const qGames = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
    const unsubGames = onSnapshot(qGames, (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'games');
    });

    const qLogs = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'logs');
    });

    return () => {
      unsubGames();
      unsubLogs();
    };
  }, []);

  const openModal = (game?: Game) => {
    setIpaFile(null);
    setUploadProgress(null);
    if (game) {
      setEditingGame(game);
      setFormData({
        name: game.name,
        category: game.category as Category,
        imageUrl: game.imageUrl,
        description: game.description,
        officialLink: game.officialLink,
        ipaUrl: game.ipaUrl || '',
        manifestUrl: game.manifestUrl || ''
      });
    } else {
      setEditingGame(null);
      setFormData({
        name: '',
        category: CATEGORIES[0] as Category,
        imageUrl: '',
        description: '',
        officialLink: '',
        ipaUrl: '',
        manifestUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGame(null);
    setIpaFile(null);
  };

  const createLog = async (gameId: string, gameName: string, action: Log['action']) => {
    try {
      await addDoc(collection(db, 'logs'), {
        gameId,
        gameName,
        action,
        timestamp: serverTimestamp(),
        userEmail: auth.currentUser?.email
      });
    } catch (e) {
      console.error('Error creating log:', e);
    }
  };

  const uploadIpa = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `ipas/${Date.now()}_${file.name}`);
    setUploadProgress(0);
    const snapshot = await uploadBytes(storageRef, file);
    setUploadProgress(100);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finalIpaUrl = formData.ipaUrl;

      if (ipaFile) {
        finalIpaUrl = await uploadIpa(ipaFile);
      }

      const submissionData = {
        ...formData,
        ipaUrl: finalIpaUrl,
      };

      if (editingGame) {
        const gameRef = doc(db, 'games', editingGame.id);
        await updateDoc(gameRef, {
          ...submissionData,
          updatedAt: serverTimestamp()
        });
        await createLog(editingGame.id, formData.name, 'updated');
        showSuccess('Jogo atualizado com sucesso!');
      } else {
        const docRef = await addDoc(collection(db, 'games'), {
          ...submissionData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.email
        });
        await createLog(docRef.id, formData.name, 'added');
        showSuccess('Jogo adicionado com sucesso!');
      }
      closeModal();
    } catch (err) {
      handleFirestoreError(err, editingGame ? OperationType.UPDATE : OperationType.CREATE, 'games');
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (game: Game) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${game.name}"?`)) return;
    
    try {
      await deleteDoc(doc(db, 'games', game.id));
      await createLog(game.id, game.name, 'deleted');
      showSuccess('Jogo excluído!');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'games');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Painel Admin</h1>
          <p className="text-slate-400">Gerencie a biblioteca de jogos e visualize o histórico de atividades.</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('games')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'games' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Gamepad className="w-4 h-4" />
            Jogos
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'logs' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <History className="w-4 h-4" />
            Histórico
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'games' ? (
          <motion.div
            key="games-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40"
              >
                <Plus className="w-5 h-5" />
                Novo Jogo
              </button>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Jogo</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Categoria</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {games.map((game) => (
                      <tr key={game.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={game.imageUrl} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-white">{game.name}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[200px]">{game.officialLink}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase rounded-md border border-slate-700">
                            {game.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal(game)}
                              className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(game)}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {games.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center text-slate-500">
                          Nenhum jogo cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="logs-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Atividade</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Admin</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            log.action === 'added' ? "bg-green-500" : 
                            log.action === 'updated' ? "bg-blue-500" : "bg-red-500"
                          )} />
                          <span className="text-white">
                            <span className="font-bold">{log.gameName}</span>
                            <span className="text-slate-400 text-sm ml-2">
                              {log.action === 'added' ? 'foi adicionado' : 
                               log.action === 'updated' ? 'foi editado' : 'foi removido'}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                        {log.userEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.timestamp?.toDate().toLocaleString('pt-BR')}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-slate-500">
                        Nenhuma atividade registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 md:bottom-10 z-[100] flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">
                  {editingGame ? 'Editar Jogo' : 'Adicionar Novo Jogo'}
                </h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nome do Jogo</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Categoria</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">URL da Imagem (Capa)</label>
                  <input
                    required
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Link Oficial (App Store / Site)</label>
                    <input
                      required
                      type="url"
                      placeholder="https://apps.apple.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.officialLink}
                      onChange={e => setFormData({ ...formData, officialLink: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-blue-500">Arquivo IPA (Manual)</label>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Apenas Arquivos .IPA
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Fazer Upload do PC</label>
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".ipa"
                            onChange={(e) => setIpaFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={cn(
                            "flex items-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-800 rounded-xl text-slate-400 group-hover:border-blue-500 transition-all",
                            ipaFile && "border-blue-500 bg-blue-500/5 text-blue-400"
                          )}>
                            <Upload className="w-4 h-4" />
                            <span className="text-sm truncate">
                              {ipaFile ? ipaFile.name : 'Selecionar arquivo...'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Ou Link Externo (Mega, Drive)</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="url"
                            placeholder="https://..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.ipaUrl}
                            onChange={e => setFormData({ ...formData, ipaUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-blue-500 italic">iPhone Direct Link (itms-services)</label>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Sem PC / Instalação Direta</span>
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                        <input
                          type="url"
                          placeholder="itms-services://?action=download-manifest&url=..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.manifestUrl}
                          onChange={e => setFormData({ ...formData, manifestUrl: e.target.value })}
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 px-1 italic">Dica: Use serviços como o 'install-on-air' ou hospede seu próprio arquivo .plist via HTTPS.</p>
                    </div>

                    {uploadProgress !== null && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-blue-500 uppercase">
                          <span>Enviando IPA...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Descrição</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className={cn(
                      "flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                    {editingGame ? 'Salvar Alterações' : 'Adicionar Jogo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
