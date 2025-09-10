/**
 * Serviço para gerenciar observações
 * Este serviço simula uma API para armazenamento e gerenciamento de observações
 */

// Definindo as categorias de tags disponíveis
export const CATEGORIAS_TAGS = [
  { value: "treino", label: "Treino", cor: "bg-blue-500 hover:bg-blue-600" },
  { value: "competicao", label: "Competição", cor: "bg-red-500 hover:bg-red-600" },
  { value: "posicao", label: "Posição", cor: "bg-green-500 hover:bg-green-600" },
  { value: "finalizacao", label: "Finalização", cor: "bg-purple-500 hover:bg-purple-600" },
  { value: "mentalidade", label: "Mentalidade", cor: "bg-yellow-500 hover:bg-yellow-600" },
  { value: "alimentacao", label: "Alimentação", cor: "bg-orange-500 hover:bg-orange-600" },
];

// Dados fictícios simulando os dados que virão da API
const observacoes = [
  {
    id: 1,
    titulo: "Passagem de guarda aberta",
    conteudo: "Hoje aprendi uma técnica eficaz para passar a guarda aberta. Manter a pressão no joelho e antecipar a movimentação do oponente foi crucial.",
    tag: "posicao",
    data: "2025-06-10T14:30:00",
    usuarioId: 1
  },
  {
    id: 2,
    titulo: "Preparação para campeonato",
    conteudo: "Preciso aumentar condicionamento físico para o campeonato do próximo mês. Focar em treinos de resistência e explosão.",
    tag: "competicao",
    data: "2025-06-05T09:15:00",
    usuarioId: 1
  },
  {
    id: 3,
    titulo: "Controle mental durante lutas",
    conteudo: "Trabalhar na respiração e foco durante momentos difíceis na luta. Manter a calma mesmo em posições desfavoráveis.",
    tag: "mentalidade",
    data: "2025-06-01T18:45:00",
    usuarioId: 1
  },
  {
    id: 4,
    titulo: "Estrangulamento com lapela",
    conteudo: "Pratiquei o estrangulamento com lapela hoje e descobri que posso melhorar o controle se mantiver a pressão constante e ajustar o ângulo do meu pulso. Funcionou melhor quando apliquei a partir da posição de montada.",
    tag: "finalizacao",
    data: "2025-05-28T16:20:00",
    usuarioId: 1
  },
  {
    id: 5,
    titulo: "Alimentação pré-treino",
    conteudo: "Notei que tenho mais energia quando como uma refeição rica em carboidratos complexos cerca de 2 horas antes do treino. Banana e aveia parecem ser uma boa combinação para manter o ritmo durante toda a sessão.",
    tag: "alimentacao",
    data: "2025-05-20T10:00:00",
    usuarioId: 1
  },
];

/**
 * Busca a lista de observações com base nos filtros e paginação
 * @param {Object} filtros - Filtros para busca (tag, termo)
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Object} Observações filtradas e informações de paginação
 */
export const getObservacoes = (filtros = {}, pagina = 1, limite = 12) => {
  // Aplicar filtros
  let observacoesFiltradas = [...observacoes];
  
  // Filtrar por tag
  if (filtros.tag && filtros.tag !== "todas") {
    observacoesFiltradas = observacoesFiltradas.filter(obs => obs.tag === filtros.tag);
  }
  
  // Filtrar por termo de busca
  if (filtros.termo && filtros.termo.trim() !== '') {
    const termoBusca = filtros.termo.trim().toLowerCase();
    observacoesFiltradas = observacoesFiltradas.filter(obs => 
      obs.titulo.toLowerCase().includes(termoBusca) || 
      obs.conteudo.toLowerCase().includes(termoBusca)
    );
  }
  
  // Ordenar por data (mais recente primeiro)
  observacoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  // Calcular paginação
  const totalItems = observacoesFiltradas.length;
  const totalPages = Math.ceil(totalItems / limite);
  const startIndex = (pagina - 1) * limite;
  const endIndex = Math.min(startIndex + limite, totalItems);
  
  return {
    observacoes: observacoesFiltradas.slice(startIndex, endIndex),
    paginacao: {
      currentPage: pagina,
      totalPages,
      totalItems,
    }
  };
};

/**
 * Adiciona uma nova observação
 * @param {Object} observacao - Dados da observação a ser adicionada
 * @returns {Object} Observação adicionada com ID gerado
 */
export const addObservacao = (observacao) => {
  const novaObservacao = {
    id: Math.max(0, ...observacoes.map(o => o.id)) + 1,
    ...observacao,
    data: observacao.data || new Date().toISOString(),
    usuarioId: 1 // Na integração real, isso viria do contexto de autenticação
  };
  
  observacoes.unshift(novaObservacao);
  return novaObservacao;
};

/**
 * Atualiza uma observação existente
 * @param {Object} observacao - Dados atualizados da observação
 * @returns {Object} Observação atualizada
 */
export const updateObservacao = (observacao) => {
  const index = observacoes.findIndex(o => o.id === observacao.id);
  
  if (index === -1) {
    throw new Error(`Observação com ID ${observacao.id} não encontrada`);
  }
  
  observacoes[index] = {
    ...observacoes[index],
    ...observacao
  };
  
  return observacoes[index];
};

/**
 * Exclui uma observação
 * @param {number} id - ID da observação a ser excluída
 * @returns {boolean} Indica se a exclusão foi bem-sucedida
 */
export const deleteObservacao = (id) => {
  const index = observacoes.findIndex(o => o.id === id);
  
  if (index === -1) {
    return false;
  }
  
  observacoes.splice(index, 1);
  return true;
};

/**
 * Obtém uma observação pelo ID
 * @param {number} id - ID da observação
 * @returns {Object|null} Observação encontrada ou null se não existir
 */
export const getObservacaoPorId = (id) => {
  return observacoes.find(o => o.id === id) || null;
};
