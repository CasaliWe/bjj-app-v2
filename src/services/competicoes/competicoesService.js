/**
 * Serviço para gerenciar competições
 * Este serviço simula uma API para armazenamento e gerenciamento de competições
 */

// Dados fictícios simulando os dados que virão da API
const MOCK_COMPETICOES = [
  {
    id: 1,
    nomeEvento: "Copa São Paulo de Jiu-Jitsu",
    cidade: "São Paulo, SP",
    data: "2025-05-15",
    modalidade: "gi",
    colocacao: "1º lugar",
    numeroLutas: 4,
    numeroVitorias: 4,
    numeroDerrotas: 0,
    numeroFinalizacoes: 2,
    observacoes: "Consegui finalizar na semifinal com um armlock e na final com um triângulo. Precisei trabalhar muito na passagem de guarda.",
    imagens: [
      "https://images.unsplash.com/photo-1587386331766-10e5749170b9?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1974&auto=format&fit=crop"
    ],
    isPublico: true,
    usuario: {
      id: 1,
      nome: "João Silva",
      foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop",
      faixa: "roxa"
    }
  },
  {
    id: 2,
    nomeEvento: "Brasileiro de Jiu-Jitsu",
    cidade: "Rio de Janeiro, RJ",
    data: "2025-04-22",
    modalidade: "nogi",
    colocacao: "3º lugar",
    numeroLutas: 3,
    numeroVitorias: 2,
    numeroDerrotas: 1,
    numeroFinalizacoes: 1,
    observacoes: "Perdi na semifinal para o campeão da categoria por decisão dos árbitros após empate. Consegui uma finalização na primeira luta com heel hook.",
    imagens: [
      "https://images.unsplash.com/photo-1574997316859-33aa1af3570a?q=80&w=1974&auto=format&fit=crop"
    ],
    isPublico: false
  },
  {
    id: 3,
    nomeEvento: "Open Rio",
    cidade: "Rio de Janeiro, RJ",
    data: "2025-02-10",
    modalidade: "gi",
    colocacao: "2º lugar",
    numeroLutas: 3,
    numeroVitorias: 2,
    numeroDerrotas: 1,
    numeroFinalizacoes: 0,
    observacoes: "Competição de alto nível. Ganhei as duas primeiras por pontos, mas perdi a final por vantagens. Preciso trabalhar mais na guarda aberta.",
    imagens: [],
    isPublico: false
  },
  {
    id: 4,
    nomeEvento: "ADCC Trials Brasil",
    cidade: "Belo Horizonte, MG",
    data: "2024-11-05",
    modalidade: "nogi",
    colocacao: "Quartas de final",
    numeroLutas: 2,
    numeroVitorias: 1,
    numeroDerrotas: 1,
    numeroFinalizacoes: 1,
    observacoes: "Competição de altíssimo nível técnico. Consegui uma vitória na primeira luta com um mata-leão, mas perdi nas quartas por pontos para o campeão da categoria.",
    imagens: [
      "https://images.unsplash.com/photo-1519311726-5cced8867358?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556817411-aa9c46fc5bf9?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608138278561-4b1ade407411?q=80&w=1974&auto=format&fit=crop"
    ],
    isPublico: true,
    usuario: {
      id: 1,
      nome: "João Silva",
      foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop",
      faixa: "roxa"
    }
  }
];

// Opções para colocações
export const OPCOES_COLOCACAO = [
  { value: "1º lugar", label: "1º lugar" },
  { value: "2º lugar", label: "2º lugar" },
  { value: "3º lugar", label: "3º lugar" },
  { value: "Semifinal", label: "Semifinal" },
  { value: "Quartas de final", label: "Quartas de final" },
  { value: "Oitavas de final", label: "Oitavas de final" },
  { value: "Fase de grupos", label: "Fase de grupos" },
  { value: "Participação", label: "Participação" }
];

// Cópia local dos dados
let competicoes = [...MOCK_COMPETICOES];
let competicoesComunidade = MOCK_COMPETICOES.filter(comp => comp.isPublico);

/**
 * Busca a lista de competições com base nos filtros e paginação
 * @param {Object} filtros - Filtros para busca (modalidade)
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Object} Competições filtradas e informações de paginação
 */
export const getCompeticoes = (filtros = {}, pagina = 1, limite = 10) => {
  // Aplicar filtros
  let competicoesFiltradas = [...competicoes];
  
  if (filtros.modalidade && filtros.modalidade !== "todos") {
    competicoesFiltradas = competicoesFiltradas.filter(comp => 
      comp.modalidade === filtros.modalidade
    );
  }
  
  // Filtrar por termo de busca (case insensitive)
  if (filtros.busca && filtros.busca.trim() !== '') {
    const termoBusca = filtros.busca.trim().toLowerCase();
    competicoesFiltradas = competicoesFiltradas.filter(comp => 
      comp.nomeEvento.toLowerCase().includes(termoBusca) || 
      comp.cidade.toLowerCase().includes(termoBusca) ||
      comp.colocacao.toLowerCase().includes(termoBusca) ||
      (comp.observacoes && comp.observacoes.toLowerCase().includes(termoBusca))
    );
  }
  
  // Ordenar por data (mais recente primeiro)
  competicoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  // Calcular paginação
  const totalItems = competicoesFiltradas.length;
  const totalPages = Math.ceil(totalItems / limite);
  const startIndex = (pagina - 1) * limite;
  const endIndex = Math.min(startIndex + limite, totalItems);
  
  return {
    competicoes: competicoesFiltradas.slice(startIndex, endIndex),
    paginacao: {
      currentPage: pagina,
      totalPages,
      totalItems,
    }
  };
};

/**
 * Busca a lista de competições da comunidade
 * @param {Object} filtros - Filtros para busca
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Object} Competições da comunidade e informações de paginação
 */
export const getCompeticoesComunidade = (filtros = {}, pagina = 1, limite = 10) => {
  // Simular delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      // Aplicar filtros
      let competicoesFiltradas = [...competicoesComunidade];
      
      if (filtros.modalidade && filtros.modalidade !== "todos") {
        competicoesFiltradas = competicoesFiltradas.filter(comp => 
          comp.modalidade === filtros.modalidade
        );
      }
      
      // Filtrar por termo de busca (case insensitive)
      if (filtros.busca && filtros.busca.trim() !== '') {
        const termoBusca = filtros.busca.trim().toLowerCase();
        competicoesFiltradas = competicoesFiltradas.filter(comp => 
          comp.nomeEvento.toLowerCase().includes(termoBusca) || 
          comp.cidade.toLowerCase().includes(termoBusca) ||
          comp.colocacao.toLowerCase().includes(termoBusca) ||
          (comp.observacoes && comp.observacoes.toLowerCase().includes(termoBusca))
        );
      }
      
      // Calcular paginação
      const totalItems = competicoesFiltradas.length;
      const totalPages = Math.ceil(totalItems / limite);
      const startIndex = (pagina - 1) * limite;
      const endIndex = Math.min(startIndex + limite, totalItems);
      
      resolve({
        competicoes: competicoesFiltradas.slice(startIndex, endIndex),
        paginacao: {
          currentPage: pagina,
          totalPages,
          totalItems,
        }
      });
    }, 500);
  });
};

/**
 * Adiciona uma nova competição
 * @param {Object} competicao - Dados da competição
 * @returns {Object} Competição adicionada com ID
 */
export const addCompeticao = (competicao) => {
  const novaCompeticao = {
    ...competicao,
    id: competicoes.length > 0 ? Math.max(...competicoes.map(c => c.id)) + 1 : 1,
    isPublico: competicao.isPublico || false,
  };
  
  competicoes.unshift(novaCompeticao);
  
  if (novaCompeticao.isPublico) {
    // Adicionar dados do usuário para exibição na comunidade
    const competicaoPublica = {
      ...novaCompeticao,
      usuario: {
        id: 1,
        nome: "João Silva",
        foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop",
        faixa: "roxa"
      }
    };
    competicoesComunidade.unshift(competicaoPublica);
  }
  
  return novaCompeticao;
};

/**
 * Atualiza uma competição existente
 * @param {Object} competicao - Dados atualizados da competição
 * @returns {Object} Competição atualizada
 */
export const updateCompeticao = (competicao) => {
  const index = competicoes.findIndex(c => c.id === competicao.id);
  
  if (index !== -1) {
    // Verificar se o status público mudou
    const eraPublico = competicoes[index].isPublico;
    const seraTornandoPublico = !eraPublico && competicao.isPublico;
    const seraTornandoPrivado = eraPublico && !competicao.isPublico;
    
    // Atualizar na lista principal
    competicoes[index] = { ...competicao };
    
    // Atualizar na lista da comunidade se necessário
    if (seraTornandoPublico) {
      // Adicionar à comunidade com dados do usuário
      const competicaoPublica = {
        ...competicao,
        usuario: {
          id: 1,
          nome: "João Silva",
          foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop",
          faixa: "roxa"
        }
      };
      competicoesComunidade.unshift(competicaoPublica);
    } else if (seraTornandoPrivado) {
      // Remover da comunidade
      competicoesComunidade = competicoesComunidade.filter(c => c.id !== competicao.id);
    } else if (competicao.isPublico) {
      // Atualizar na comunidade
      const comunidadeIndex = competicoesComunidade.findIndex(c => c.id === competicao.id);
      if (comunidadeIndex !== -1) {
        competicoesComunidade[comunidadeIndex] = {
          ...competicao,
          usuario: competicoesComunidade[comunidadeIndex].usuario
        };
      }
    }
    
    return competicoes[index];
  }
  
  throw new Error("Competição não encontrada");
};

/**
 * Exclui uma competição
 * @param {number} id - ID da competição a ser excluída
 * @returns {boolean} True se a exclusão for bem-sucedida
 */
export const deleteCompeticao = (id) => {
  const index = competicoes.findIndex(c => c.id === id);
  
  if (index !== -1) {
    // Remover da lista principal
    competicoes.splice(index, 1);
    
    // Remover da lista da comunidade se estiver lá
    competicoesComunidade = competicoesComunidade.filter(c => c.id !== id);
    
    return true;
  }
  
  return false;
};

/**
 * Altera a visibilidade de uma competição (pública/privada)
 * @param {number} id - ID da competição
 * @param {boolean} isPublico - Nova visibilidade
 * @returns {Object} Competição atualizada
 */
export const alterarVisibilidadeCompeticao = (id, isPublico) => {
  const index = competicoes.findIndex(c => c.id === id);
  
  if (index !== -1) {
    // Atualizar na lista principal
    competicoes[index] = { 
      ...competicoes[index], 
      isPublico 
    };
    
    if (isPublico) {
      // Adicionar à comunidade
      const competicaoPublica = {
        ...competicoes[index],
        usuario: {
          id: 1,
          nome: "João Silva",
          foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop",
          faixa: "roxa"
        }
      };
      
      const comunidadeIndex = competicoesComunidade.findIndex(c => c.id === id);
      if (comunidadeIndex === -1) {
        competicoesComunidade.unshift(competicaoPublica);
      } else {
        competicoesComunidade[comunidadeIndex] = competicaoPublica;
      }
    } else {
      // Remover da comunidade
      competicoesComunidade = competicoesComunidade.filter(c => c.id !== id);
    }
    
    return competicoes[index];
  }
  
  throw new Error("Competição não encontrada");
};
