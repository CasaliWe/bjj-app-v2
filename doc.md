### vite.config.ts:
- ajustar o pwa;

### index.html:
- entrada de dados;

### /public:
- arquivos estáticos;

### /components:
- /ui = contém todos os components do shadcn UI;
- AppSidebar.jsx = menu lateral com todos os links;
- MetricCard.jsx = métricas que aparecem na rota /app;
- MobileNav.jsx = navegação que aparece fixa no bottom apenas no mobile;
- PWAInstallPrompt.jsx = aviso de instalação pwa após tempo inicial de acesso do user;
- QuickActions.jsx = ações rápidas que aparecem na rota /app;

### /hooks:
- use-mobile.jsx e use-toast.ts = global sistema;

### /lib:
- pwa-utils.js = ações relacionadas a instalação e atualização do PWA;
- utils.ts = sistema global;

### /pages:
- Index.jsx = rota /app (privada) que seria a dashboard inicial, consts -> user, metrics, recentActivities, treinosDados;
- UserProfile.jsx = rota perfil (privada) que seria para atualizar infos, senha e configs;

### /services:
- /auth/logout.js = fazer logout do sistema;

### app.jsx:
- arquivo principal de importações, organizações de páginas e rotas privadas | publicas;

### main.jsx:
- worker pwa config;
- start aplicação;

### index.css:
- estilo global e importação tailwind;
