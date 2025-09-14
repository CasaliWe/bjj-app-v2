/**
 * Serviço para gerenciar a visualização de perfil de usuários
 * Este serviço implementa a integração com a API para obter dados de perfil de usuários
 */

// URL base da API
const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Busca os dados de perfil de um usuário específico
 * @param {string} bjjId - ID do usuário a ser visualizado
 * @returns {Promise<Object>} Dados do perfil do usuário
 */
export const getUserProfile = async (bjjId) => {
  try {
    const url = `${BASE_URL}endpoint/user/getProfile.php?bjj_id=${bjjId}`;
    
    const response = await fetch(url, {
      method: 'GET'
    });
    
    // Tratamento especial para código 403 (perfil privado)
    if (response.status === 403) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Este perfil é privado e não pode ser visualizado.');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar dados do perfil do usuário');
    }
    
    const data = await response.json();
    
    // Log para debug
    console.log("API Response - Profile Data:", data.data.profile);
    
    return data.data.profile || {};
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
};

/**
 * Busca os treinos públicos de um usuário específico
 * @param {string} bjjId - ID do usuário
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 10)
 * @returns {Promise<Object>} Treinos públicos do usuário e informações de paginação
 */
export const getUserPublicTrainings = async (bjjId, pagina = 1, limite = 10) => {
  try {
    const url = `${BASE_URL}endpoint/user/getPublicTrainings.php?bjj_id=${bjjId}&pagina=${pagina}&limite=${limite}`;
    
    const response = await fetch(url, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar treinos públicos do usuário');
    }
    
    const data = await response.json();
    
    return {
      treinos: data.data.treinos || [],
      paginacao: data.data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar treinos públicos do usuário:", error);
    throw error;
  }
};

/**
 * Busca as competições públicas de um usuário específico
 * @param {string} bjjId - ID do usuário
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 10)
 * @returns {Promise<Object>} Competições públicas do usuário e informações de paginação
 */
export const getUserPublicCompetitions = async (bjjId, pagina = 1, limite = 10) => {
  try {
    const url = `${BASE_URL}endpoint/user/getPublicCompetitions.php?bjj_id=${bjjId}&pagina=${pagina}&limite=${limite}`;
    
    const response = await fetch(url, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar competições públicas do usuário');
    }
    
    const data = await response.json();
    
    // Log apenas para desenvolvimento
    console.log('Resposta da API de competições:', data);
    
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
    console.error("Erro ao buscar competições públicas do usuário:", error);
    throw error;
  }
};

/**
 * Busca as técnicas públicas de um usuário específico
 * @param {string} bjjId - ID do usuário
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 10)
 * @returns {Promise<Object>} Técnicas públicas do usuário e informações de paginação
 */
export const getUserPublicTechniques = async (bjjId, pagina = 1, limite = 10) => {
  try {
    const url = `${BASE_URL}endpoint/user/getPublicTechniques.php?bjj_id=${bjjId}&pagina=${pagina}&limite=${limite}`;
    
    const response = await fetch(url, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar técnicas públicas do usuário');
    }
    
    const data = await response.json();
    
    // Log para depuração
    console.log('Resposta da API de técnicas:', data);
    
    return {
      tecnicas: data.data.tecnicas || [],
      paginacao: data.data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar técnicas públicas do usuário:", error);
    throw error;
  }
};