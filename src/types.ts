export interface Game {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  officialLink: string;
  ipaUrl?: string;
  manifestUrl?: string;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
}

export interface Log {
  id: string;
  gameId: string;
  gameName: string;
  action: 'added' | 'updated' | 'deleted';
  timestamp: any;
  userEmail: string;
}

export type Category = 'Ação' | 'Aventura' | 'RPG' | 'Esportes' | 'Estratégia' | 'Puzzle' | 'Simulação' | 'Outros';

export const CATEGORIES: Category[] = [
  'Ação',
  'Aventura',
  'RPG',
  'Esportes',
  'Estratégia',
  'Puzzle',
  'Simulação',
  'Outros'
];
