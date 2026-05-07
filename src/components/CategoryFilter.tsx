import { CATEGORIES, Category } from '../types';
import { cn } from '../lib/utils';

interface CategoryFilterProps {
  selected: Category | 'Todos';
  onSelect: (category: Category | 'Todos') => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect('Todos')}
        className={cn(
          "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
          selected === 'Todos'
            ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20"
            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
        )}
      >
        Todos
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
            selected === cat
              ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
