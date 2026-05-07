import React from 'react';
import { ExternalLink, Download, Shield, Zap, PackageOpen, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

const TOOLS = [
  {
    name: 'GBox',
    description: 'Instalador estável com suporte a certificados.',
    link: 'https://gbox.run/',
    icon: <PackageOpen className="w-5 h-5" />,
    color: 'bg-blue-600'
  },
  {
    name: 'Scarlet',
    description: 'Fácil instalação direta via navegador.',
    link: 'https://usescarlet.com/',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-red-600'
  },
  {
    name: 'ESign',
    description: 'Poderoso e cheio de recursos avançados.',
    link: 'https://esign.yyyue.xyz/',
    icon: <Cpu className="w-5 h-5" />,
    color: 'bg-emerald-600'
  },
  {
    name: 'Feather',
    description: 'Nova opção leve e rápida para iOS.',
    link: 'https://feather-app.com/',
    icon: <Download className="w-5 h-5" />,
    color: 'bg-indigo-600'
  },
  {
    name: 'AltStore',
    description: 'Método via PC (o mais seguro de todos).',
    link: 'https://altstore.io/',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-orange-600'
  }
];

export default function InstallTools() {
  return (
    <div className="mb-12 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
          <Download className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Instaladores Recomendados</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Escolha seu aplicativo para instalar arquivos IPA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {TOOLS.map((tool, idx) => (
          <motion.a
            key={tool.name}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-5 transition-all hover:border-blue-500/50 hover:bg-slate-900/80 active:scale-95"
          >
            <div className={`w-12 h-12 ${tool.color}/20 rounded-2xl flex items-center justify-center border border-${tool.color.split('-')[1]}-500/30 mb-4 group-hover:scale-110 transition-transform`}>
              {React.cloneElement(tool.icon as React.ReactElement, { className: `w-6 h-6 text-${tool.color.split('-')[1]}-500` })}
            </div>
            
            <h4 className="font-black text-white text-lg mb-1">{tool.name}</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
              {tool.description}
            </p>

            <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase tracking-widest mt-auto">
              Baixar Agora
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.a>
        ))}
      </div>
      
      <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-4 text-center">
        <p className="text-xs text-blue-400 font-medium">
          Dica: Se você não sabe qual escolher, o <span className="font-bold">GBox</span> ou <span className="font-bold">Scarlet</span> são os mais fáceis para iniciantes.
        </p>
      </div>
    </div>
  );
}
