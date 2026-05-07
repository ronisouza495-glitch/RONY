import React from 'react';
import { ExternalLink, Gamepad, Info, FileCode, Smartphone } from 'lucide-react';
import { Game } from '../types';
import { motion } from 'motion/react';

interface GameCardProps {
  game: Game;
  key?: string | number;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${game.name}/800/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm border border-blue-400/30">
            {game.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {game.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
          {game.description}
        </p>

        <div className="flex flex-col gap-2">
          <a
            href={game.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-950 rounded-xl font-bold text-sm transition-all hover:bg-blue-500 hover:text-white"
          >
            Baixar Oficial
            <ExternalLink className="w-4 h-4" />
          </a>

          {game.ipaUrl && (
            <div className="space-y-2">
              <a
                href={game.ipaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 text-blue-400 rounded-xl font-bold text-sm border border-slate-700 transition-all hover:bg-slate-700 hover:text-blue-300"
              >
                Download IPA
                <FileCode className="w-4 h-4" />
              </a>
            </div>
          )}

          {game.manifestUrl && (
            <div className="space-y-2">
              <a
                href={game.manifestUrl}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500"
              >
                Instalação Direta (iOS)
                <Smartphone className="w-4 h-4" />
              </a>
              <p className="text-[10px] text-center text-slate-500 font-medium italic">
                Instale agora sem computador (Via iPhone)
              </p>
            </div>
          )}
          
          {(game.ipaUrl || game.manifestUrl) && !game.manifestUrl && (
            <p className="text-[10px] text-center text-slate-500 font-medium">
              Use <span className="text-slate-400">GBox</span> ou <span className="text-slate-400">AltStore</span> para instalar.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
