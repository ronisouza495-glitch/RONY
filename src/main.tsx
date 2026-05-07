import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler to help diagnose white screens
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #0f172a; color: #ef4444; font-family: sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="max-width: 500px; width: 100%;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Erro de Inicialização</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 16px;">Ocorreu um erro ao carregar o aplicativo. Tente limpar o cache do navegador.</p>
          <div style="background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 20px;">
            <p style="color: #f8fafc; font-size: 12px; font-family: monospace; margin: 0; white-space: pre-wrap; word-break: break-all;">${message}</p>
          </div>
          <button onclick="window.location.reload()" style="width: 100%; background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer;">
            Recarregar Página
          </button>
        </div>
      </div>
    `;
  }
  return false;
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Service Worker for PWA (moved to end)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
