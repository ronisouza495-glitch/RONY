import React, { useState } from 'react';
import { motion } from 'motion/react';
import { signInWithGoogle } from '../lib/firebase';
import { LogIn, ShieldCheck, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError('Falha ao autenticar. Verifique sua conexão.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-8"
      >
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20" />
          <div className="relative p-4 bg-blue-600 rounded-2xl shadow-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Acesso Administrativo</h1>
          <p className="text-slate-400 text-sm">
            Somente administradores autorizados podem acessar o painel de gerenciamento.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-950 font-bold rounded-2xl transition-all hover:bg-blue-500 hover:text-white shadow-xl hover:shadow-blue-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Entrar com Google
          </span>
        </button>

        <div className="pt-4 border-t border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-600 tracking-[0.2em]">
            Central de Jogos • Segurança Google
          </p>
        </div>
      </motion.div>
    </div>
  );
}
