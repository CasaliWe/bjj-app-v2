/**
 * Serviço para gerenciar competições
 * Este serviço realiza chamadas para a API para armazenamento e gerenciamento de competições
 */

// URL base da API
const BASE_URL = import.meta.env.VITE_API_URL || '';

// Importando o service do cookies
import { getAuthToken } from '@/services/cookies/cookies';

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

/**
 * Função auxiliar para obter o header de autenticação
 * @returns {Object} Header com token de autenticação
 */
const getAuthHeader = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Busca a lista de competições com base nos filtros e paginação
 * @param {Object} filtros - Filtros para busca (modalidade, busca)
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Promise<Object>} Competições filtradas e informações de paginação
 */
export const getCompeticoes = async (filtros = {}, pagina = 1, limite = 10) => {
  try {
    // Construir a URL com parâmetros de query
    let url = `${BASE_URL}endpoint/competicoes/listar.php?pagina=${pagina}&limite=${limite}`;
    
    // Adicionar filtros se não forem 'todos'
    if (filtros.modalidade && filtros.modalidade !== "todos") {
      url += `&modalidade=${filtros.modalidade}`;
    }
    
    // Adicionar termo de busca se existir
    if (filtros.busca && filtros.busca.trim() !== '') {
      url += `&busca=${encodeURIComponent(filtros.busca.trim())}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar competições');
    }
    
    const data = await response.json();
    
    return {
      competicoes: data.data.competicoes || [],
      paginacao: data.data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar competições:", error);
    throw error;
  }
};

/**
 * Busca a lista de competições da comunidade
 * @param {Object} filtros - Filtros para busca
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Promise<Object>} Competições da comunidade e informações de paginação
 */
export const getCompeticoesComunidade = async (filtros = {}, pagina = 1, limite = 10) => {
  try {
    // Construir a URL com parâmetros de query
    let url = `${BASE_URL}endpoint/competicoes/comunidade.php?pagina=${pagina}&limite=${limite}`;
    
    // Adicionar filtros se não forem 'todos'
    if (filtros.modalidade && filtros.modalidade !== "todos") {
      url += `&modalidade=${filtros.modalidade}`;
    }
    
    // Adicionar termo de busca se existir
    if (filtros.busca && filtros.busca.trim() !== '') {
      url += `&busca=${encodeURIComponent(filtros.busca.trim())}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar competições da comunidade');
    }
    
    const data = await response.json();
    
    return {
      competicoes: data.data.competicoes || [],
      paginacao: data.data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar competições da comunidade:", error);
    throw error;
  }
};

/**
 * Adiciona uma nova competição
 * @param {FormData} formData - FormData contendo os dados da competição a ser criada
 * @returns {Promise<Object>} Competição adicionada com ID
 */
export const addCompeticao = async (formData) => {
  try {
    const url = `${BASE_URL}endpoint/competicoes/criar.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
        // Content-Type é definido automaticamente pelo navegador quando usamos FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar competição');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao adicionar competição:", error);
    throw error;
  }
};

/**
 * Atualiza uma competição existente
 * @param {FormData} formData - FormData contendo os dados atualizados da competição
 * @returns {Promise<Object>} Competição atualizada
 */
export const updateCompeticao = async (formData) => {
  try {
    const url = `${BASE_URL}endpoint/competicoes/atualizar.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
        // Content-Type é definido automaticamente pelo navegador quando usamos FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar competição');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao atualizar competição:", error);
    throw error;
  }
};

/**
 * Exclui uma competição
 * @param {number} id - ID da competição a ser excluída
 * @returns {Promise<boolean>} true se a exclusão for bem-sucedida
 */
export const deleteCompeticao = async (id) => {
  try {
    const url = `${BASE_URL}endpoint/competicoes/excluir.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir competição');
    }
    
    await response.json();
    return true;
  } catch (error) {
    console.error("Erro ao excluir competição:", error);
    throw error;
  }
};

/**
 * Altera a visibilidade de uma competição (pública/privada)
 * @param {number} id - ID da competição
 * @param {boolean} isPublico - Nova visibilidade
 * @returns {Promise<Object>} Competição atualizada
 */
export const alterarVisibilidadeCompeticao = async (id, isPublico) => {
  try {
    const url = `${BASE_URL}endpoint/competicoes/visibilidade.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, isPublico })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao alterar visibilidade da competição');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao alterar visibilidade da competição:", error);
    throw error;
  }
};

/**
 * Função para remover uma imagem específica de uma competição
 * @param {number} competicaoId - ID da competição
 * @param {number} imagemId - ID da imagem a ser removida
 * @returns {Promise<Object>} - Objeto com dados atualizados da competição
 */
export const removerImagemCompeticao = async (competicaoId, imagemId) => {
  try {
    const url = `${BASE_URL}endpoint/competicoes/remover-imagem.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ competicaoId, imagemId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao remover imagem da competição');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao remover imagem da competição:", error);
    throw error;
  }
};
