// Nome do cache
const CACHE_NAME = 'bjj-app-cache-v1';

// Versão do aplicativo - aumente este número a cada novo build importante
const APP_VERSION = '1.0.0';

// Lista de recursos a serem cacheados
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Instalação do service worker e armazenamento dos recursos em cache
self.addEventListener('install', event => {
  // Use skipWaiting para forçar a ativação imediata do service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: network first, depois cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a resposta for válida, clona-a e armazena no cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tenta buscar do cache
        return caches.match(event.request);
      })
  );
});

// Limpeza de caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Toma o controle imediatamente, sem esperar o próximo carregamento
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Toma controle de todas as páginas/clientes sem recarregar
      self.clients.claim(),
      
      // Notifica os clientes (páginas abertas) sobre a atualização
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            version: APP_VERSION
          });
        });
      })
    ])
  );
});
