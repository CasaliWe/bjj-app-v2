### CORRIGIR BUG (OU FAZER):
- Colocar anúncios;
- Notícias blog (eu add pelo admin);
- Teste seu conhecimento (usando IA);


### Documentação:
- Deps: api url (VITE_API_URL), cloudflare (VITE_CLOUDFLARE_TURNSTILE), google auth (VITE_GOOGLE_CLIENT_ID) e ia (VITE_IA_URL);
- Sempre ao fazer o build precisa atualizar a .env antes;
- Usar o upload-dist-to-vps.sh para mandar arquivos a vps prod;
- Todas as páginas após logado deve ter o hook que busca os dados do user, assim aparece o plus ao lado da logo;
- Todas as páginas após logado tem o modal upgrade (quando o plano está grátis);
- Modal de adicionar exp sempre ao criar algo, está presente atualmente nas páginas: tecnicas, treinos, competições, observações, checklist 2x;
- Sempre usar o loading padrão (component);
- Modal welcome apenas na dashboard no primeiro acesso;
- Todos os form publicos precisam ter o turnstile;
- Modal pwa instalar em tudo;
- Precisa importar o titlePage em todas as páginas para definir o titulo da página;
- Precisa ajusta o G-tag do analytics na App.jsx e no index.html;
- Precisa ajusta o adsense index.html e ???;


### Páginas atualmente dentro do app:
- /app;
- /tecnicas;
- /treinos;
- /competicoes;
- /obervacoes;
- /pesquisar-usuario;
- /plano-de-jogo;
- /usuario;
- /perfil;
- /checklist;
- /ia-sensei;
- /treinos-cronometrados;
- /aprender;
- /eventos;
- /videos;
- /ranking;
- /lutas-epicas;


### Páginas atualmente fora do app:
- /login;
- /register;
- /recuperar-senha;
- /termos-de-uso;
- /politica-de-privacidade;
- /suporte;
- /sobre-nos;
- /contato;


### Precisa de atenção:
- Componente Exp;
- Componente Assinatura (cód promo);
- Componente Upgrade modal;
- Componente Welcome;
- Componente PWAInstall (apenas windows e android);

