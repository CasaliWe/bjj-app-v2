/**
 * Configurações dos tutoriais para cada página
 * Adicione ou edite as informações aqui para atualizar os tutoriais
 */

export const TUTORIAIS = {
  tecnicas: {
    titulo: "Minhas Técnicas",
    descricao: "Aprenda a organizar e gerenciar sua biblioteca pessoal de técnicas de Jiu-Jitsu. Registre o passo a passo, adicione vídeos e mantenha suas técnicas favoritas sempre à mão.",
    gif: "tecnicas.gif"
  },
  
  treinos: {
    titulo: "Meus Treinos",
    descricao: "Descubra como registrar seus treinos de forma completa. Adicione fotos, anote observações importantes e acompanhe sua evolução ao longo do tempo.",
    gif: "treinos.gif"
  },
  
  competicoes: {
    titulo: "Competições",
    descricao: "Mantenha o histórico completo de suas competições. Registre resultados, adicione fotos das medalhas e analise seu desempenho para melhorar continuamente.",
    gif: "competicoes.gif"
  },
  
  "plano-de-jogo": {
    titulo: "Plano de Jogo",
    descricao: "Monte estratégias personalizadas para treinos e competições. Organize suas táticas favoritas e tenha sempre um plano para cada situação.",
    gif: "plano-de-jogo.gif"
  },
  
  checklist: {
    titulo: "Checklist",
    descricao: "Crie checklists personalizadas para treinos e competições. Nunca mais esqueça equipamentos importantes ou procedimentos essenciais.",
    gif: "checklist.gif"
  },
  
  observacoes: {
    titulo: "Observações",
    descricao: "Organize suas anotações e insights técnicos de forma inteligente. Categorize por temas e tenha acesso rápido às suas observações mais importantes.",
    gif: "observacoes.gif"
  }
};

/**
 * Função para obter tutorial por rota da página
 * @param {string} pathname - Caminho da página atual
 * @returns {Object|null} Dados do tutorial ou null se não encontrado
 */
export const getTutorialByPath = (pathname) => {
  // Remove o "/" inicial e obtém a rota base
  const route = pathname.replace('/', '');
  
  return TUTORIAIS[route] || null;
};

/**
 * Função para verificar se a página tem tutorial
 * @param {string} pathname - Caminho da página atual  
 * @returns {boolean} True se a página tem tutorial
 */
export const hasPageTutorial = (pathname) => {
  const route = pathname.replace('/', '');
  return !!TUTORIAIS[route];
};