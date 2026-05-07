import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Gamepad2, LayoutDashboard, LogIn, LogOut, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { label: 'Início', path: '/', icon: Home },
    ...(isAdmin ? [{ label: 'Painel', path: '/admin/dashboard', icon: LayoutDashboard }] : []),
    ...(!user ? [{ label: 'Admin', path: '/admin/login', icon: LogIn }] : []),
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Central de Jogos</span>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-400",
                  location.pathname === item.path ? "text-blue-500" : "text-slate-400"
                )}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-6 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-blue-500" : "text-slate-400"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-3 w-8 h-1 bg-blue-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
          {user && (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 text-slate-400"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Sair</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
