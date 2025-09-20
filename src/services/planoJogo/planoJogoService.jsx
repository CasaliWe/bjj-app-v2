/**
 * Serviço para gerenciar os planos de jogo do usuário
 * Este serviço implementa o gerenciamento de planos de jogo, inicialmente com cookies
 * mas preparado para futura integração com API
 */

// URL base da API (para futura implementação)
const BASE_URL = import.meta.env.VITE_API_URL || '';

// Chave do localStorage que armazenará os planos de jogo
const STORAGE_KEY = 'plano_jogo_data';

// Criando um evento personalizado para notificar os componentes quando houver mudanças
export const PLANO_JOGO_UPDATE_EVENT = 'plano_jogo_update';

// Função para disparar o evento de atualização
export const notifyUpdate = () => {
  // Dispara um evento global para todos os componentes que estão ouvindo
  window.dispatchEvent(new CustomEvent(PLANO_JOGO_UPDATE_EVENT));
};

/**
 * Função auxiliar para obter o header de autenticação
 * @returns {Object} Header com token de autenticação
 */
const getAuthHeader = () => {
  // Placeholder para futura autenticação com API
  return {};
};

/**
 * Obtém todos os planos de jogo do usuário
 * @returns {Array} Lista de planos de jogo
 */
export const getPlanos = () => {
  try {
    const planosString = localStorage.getItem(STORAGE_KEY);
    if (!planosString) return [];
    const planos = JSON.parse(planosString);
    return Array.isArray(planos) ? planos : [];
  } catch (error) {
    console.error('Erro ao obter planos de jogo:', error);
    return [];
  }
};

/**
 * Salva a lista completa de planos de jogo
 * @param {Array} planos - Lista de planos de jogo
 */
export const salvarPlanos = (planos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planos));
    notifyUpdate(); // Notifica os componentes sobre a mudança
    return true;
  } catch (error) {
    console.error('Erro ao salvar planos de jogo:', error);
    return false;
  }
};

/**
 * Cria um novo plano de jogo
 * @param {Object} plano - Dados do novo plano
 * @returns {Object} Plano criado com ID
 */
export const criarPlano = (plano) => {
  try {
    const planos = getPlanos();
    const novoPlano = {
      ...plano,
      id: `plano-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      dataCriacao: new Date().toISOString(),
      nodes: [] // Inicializa sem nós (árvore vazia)
    };
    
    planos.push(novoPlano);
    salvarPlanos(planos);
    
    return novoPlano;
  } catch (error) {
    console.error('Erro ao criar plano de jogo:', error);
    throw error;
  }
};

/**
 * Obtém um plano de jogo específico pelo ID
 * @param {string} id - ID do plano de jogo
 * @returns {Object|null} Plano de jogo ou null se não encontrado
 */
export const getPlanoById = (id) => {
  try {
    const planos = getPlanos();
    const found = planos.find(plano => plano.id === id) || null;
    return found ? JSON.parse(JSON.stringify(found)) : null; // retorna cópia para evitar mutações externas
  } catch (error) {
    console.error('Erro ao buscar plano de jogo:', error);
    return null;
  }
};

/**
 * Atualiza um plano de jogo existente
 * @param {string} id - ID do plano a ser atualizado
 * @param {Object} dadosAtualizados - Novos dados do plano
 * @returns {Object|null} Plano atualizado ou null se falhou
 */
export const atualizarPlano = (id, dadosAtualizados) => {
  try {
    const planos = getPlanos();
    const index = planos.findIndex(plano => plano.id === id);
    
    if (index === -1) return null;
    
    const planoAtualizado = {
      ...planos[index],
      ...dadosAtualizados,
      dataAtualizacao: new Date().toISOString()
    };
    
    planos[index] = planoAtualizado;
    salvarPlanos(planos);
    
    return JSON.parse(JSON.stringify(planoAtualizado));
  } catch (error) {
    console.error('Erro ao atualizar plano de jogo:', error);
    return null;
  }
};

/**
 * Adiciona um nó (técnica) ao plano de jogo
 * @param {string} planoId - ID do plano
 * @param {Object} node - Nó a ser adicionado
 * @param {string|null} parentId - ID do nó pai (null para nó raiz)
 * @returns {Object|null} Plano atualizado ou null se falhou
 */
export const adicionarNode = (planoId, node, parentId = null) => {
  try {
    const planos = getPlanos();
    const index = planos.findIndex(p => p.id === planoId);
    if (index === -1) return null;
    const plano = planos[index];
    
    const novoNode = {
      ...node,
      id: `${Date.now().toString()}-${Math.random().toString(36).slice(2,7)}`,
      parentId,
      children: []
    };
    
    // Função recursiva para encontrar o nó pai e adicionar o filho
    const adicionarAoParent = (nodes, parent) => {
      if (!parent) {
        // Adicionar como nó raiz
        nodes.push(novoNode);
        return true;
      }
      
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === parent) {
          if (!Array.isArray(nodes[i].children)) {
            nodes[i].children = [];
          }
          nodes[i].children.push(novoNode);
          return true;
        }
        
        if (nodes[i].children && nodes[i].children.length >= 0) {
          const adicionado = adicionarAoParent(nodes[i].children, parent);
          if (adicionado) return true;
        }
      }
      
      return false;
    };
    
    if (!Array.isArray(plano.nodes)) {
      plano.nodes = [];
    }
    const adicionado = adicionarAoParent(plano.nodes, parentId);
    
    if (adicionado) {
      planos[index] = { ...plano, nodes: plano.nodes, dataAtualizacao: new Date().toISOString() };
      salvarPlanos(planos);
      return JSON.parse(JSON.stringify(planos[index]));
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao adicionar nó ao plano:', error);
    return null;
  }
};

/**
 * Remove um nó (técnica) do plano de jogo
 * @param {string} planoId - ID do plano
 * @param {string} nodeId - ID do nó a ser removido
 * @returns {Object|null} Plano atualizado ou null se falhou
 */
export const removerNode = (planoId, nodeId) => {
  try {
    const planos = getPlanos();
    const index = planos.findIndex(p => p.id === planoId);
    if (index === -1) return null;
    const plano = planos[index];
    
    // Função recursiva para encontrar e remover o nó
    const removerDoArray = (nodes) => {
      const index = nodes.findIndex(node => node.id === nodeId);
      
      if (index !== -1) {
        nodes.splice(index, 1);
        return true;
      }
      
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children && nodes[i].children.length > 0) {
          const removido = removerDoArray(nodes[i].children);
          if (removido) return true;
        }
      }
      
      return false;
    };
    
    if (!Array.isArray(plano.nodes)) {
      plano.nodes = [];
    }
    const removido = removerDoArray(plano.nodes);
    
    if (removido) {
      planos[index] = { ...plano, nodes: plano.nodes, dataAtualizacao: new Date().toISOString() };
      salvarPlanos(planos);
      return JSON.parse(JSON.stringify(planos[index]));
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao remover nó do plano:', error);
    return null;
  }
};

/**
 * Exclui um plano de jogo
 * @param {string} id - ID do plano a ser excluído
 * @returns {boolean} true se excluído com sucesso
 */
export const excluirPlano = (id) => {
  try {
    const planos = getPlanos();
    const novaLista = planos.filter(plano => plano.id !== id);
    
    if (novaLista.length === planos.length) {
      return false; // Plano não encontrado
    }
    
    salvarPlanos(novaLista);
    return true;
  } catch (error) {
    console.error('Erro ao excluir plano de jogo:', error);
    return false;
  }
};

/**
 * Limpa todos os planos de jogo
 * @returns {boolean} true se limpo com sucesso
 */
export const limparPlanos = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyUpdate();
    return true;
  } catch (error) {
    console.error('Erro ao limpar planos de jogo:', error);
    return false;
  }
};

// Preparação para futura implementação com API
// Estas funções serão implementadas quando a API estiver pronta

/**
 * Obtém todos os planos de jogo do usuário (futura implementação com API)
 * @returns {Promise<Array>} Promise com lista de planos de jogo
 */
export const getPlanosFuturo = async () => {
  try {
    const response = await fetch(`${BASE_URL}endpoint/planoJogo/listar.php`, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao listar planos de jogo');
    }
    
    const data = await response.json();
    return data.data.planos || [];
  } catch (error) {
    console.error('Erro ao buscar planos de jogo da API:', error);
    // Fallback para cookies se a API falhar
    return getPlanos();
  }
};

/**
 * Cria um novo plano de jogo (futura implementação com API)
 * @param {Object} plano - Dados do novo plano
 * @returns {Promise<Object>} Promise com plano criado
 */
export const criarPlanoFuturo = async (plano) => {
  try {
    const response = await fetch(`${BASE_URL}endpoint/planoJogo/criar.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(plano)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar plano de jogo');
    }
    
    const data = await response.json();
    return data.data.plano;
  } catch (error) {
    console.error('Erro ao criar plano de jogo na API:', error);
    // Fallback para cookies se a API falhar
    return criarPlano(plano);
  }
};