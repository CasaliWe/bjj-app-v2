import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service Worker registrado com sucesso:', registration);
      
      // Verifica se há atualizações do service worker a cada hora
      setInterval(() => {
        registration.update();
        console.log('Verificando atualizações do Service Worker...');
      }, 60 * 60 * 1000); // 1 hora
      
    }).catch(error => {
      console.log('Falha ao registrar o Service Worker:', error);
    });
  });
  
  // Ouve por mensagens quando o service worker é atualizado
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('Service Worker atualizado, recarregando...');
    // Não recarregamos aqui para evitar perda de dados - deixamos o usuário decidir quando atualizar
  });
}

createRoot(document.getElementById("root")).render(<App />);
