import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAdmin = user?.email === 'ronisouza495@gmail.com';

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
        <Navbar user={user} isAdmin={isAdmin} />
        <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={user && isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={user && isAdmin ? <Dashboard /> : <Navigate to="/admin/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
