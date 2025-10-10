/**
 * Serviço para gerenciar o título da página
 * 
 * Uso:
 * import { setPageTitle } from '@/services/title';
 * 
 * // Na página:
 * setPageTitle('Nome da Página | BJJ App');
 */

const appName = "BJJ ACADEMY";

/**
 * Atualiza o título da página
 * @param {string} pageTitle - Título da página (opcional)
 * @param {boolean} includeAppName - Se deve incluir o nome do app no título (padrão: true)
 */
export const setPageTitle = (pageTitle = "", includeAppName = true) => {
  // Se o título estiver vazio, usa apenas o nome do app
  if (!pageTitle) {
    document.title = appName;
    return;
  }
  
  // Se includeAppName for true, adiciona o nome do app ao título
  if (includeAppName) {
    document.title = `${pageTitle} | ${appName}`;
  } else {
    document.title = pageTitle;
  }
};

/**
 * Define o título da página com base na rota atual
 * @param {string} path - Caminho da rota atual
 */
export const setTitleByRoute = (path) => {
  const routes = {
    "/app": "Dashboard",
    "/perfil": "Meu Perfil",
    "/login": "Login",
    "/register": "Registro",
    "/recuperar-senha": "Recuperar Senha",
    "/termos-de-uso": "Termos de Uso",
    "/politica-de-privacidade": "Política de Privacidade",
    "/suporte": "Suporte",
    "/sobre-nos": "Sobre Nós",
    "/contato": "Contato",
    "/ia-sensei": "IA Sensei",
    "/aprender": "Aprender",
    "/tecnicas": "Técnicas",
    "/treinos": "Treinos",
    "/competicoes": "Competições",
    "/objetivos": "Objetivos",
    "/observacoes": "Observações",
    "/plano-de-jogo": "Plano de Jogo",
    "/videos": "Vídeos",
    "/noticias": "Notícias",
    "/metricas": "Métricas",
    "/dojo-market": "Dojo Market",
    "/drills": "Drills",
    "/alongamentos": "Alongamentos",
    "/": "Bem-vindo"
  };

  const title = routes[path] || "Página não encontrada";
  setPageTitle(title);
};
