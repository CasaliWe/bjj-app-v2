/**
 * Serviço para pesquisa de usuários
 * Este serviço implementa a integração com a API para buscar usuários por nome ou BJJ ID
 */

// URL base da API
const BASE_URL = import.meta.env.VITE_API_URL || '';

// importnado o service do cookies
import { getAuthToken } from '@/services/cookies/cookies';

/**
 * Busca usuários pelo nome ou BJJ ID
 * @param {string} query - Termo de pesquisa (nome ou BJJ ID)
 * @param {string} searchBy - Tipo de pesquisa ('nome' ou 'bjj_id')
 * @returns {Promise<Array>} Lista de usuários encontrados
 */
export const searchUsers = async (query, searchBy = 'nome') => {
  try {
    // Quando não houver query, a API retorna todos os usuários se nenhum parâmetro for enviado
    const hasQuery = !!(query && query.trim() !== '');
    const url = hasQuery
      ? `${BASE_URL}endpoint/user/pesquisar-usuario.php?query=${encodeURIComponent(query)}&search_by=${searchBy}`
      : `${BASE_URL}endpoint/user/pesquisar-usuario.php`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao pesquisar usuários');
    }
    
    const data = await response.json();
    
    // A API retorna os usuários diretamente em data.data (array)
    return {
      usuarios: data.data || []
    };
  } catch (error) {
    console.error("Erro ao pesquisar usuários:", error);
    throw error;
  }
};

/**
 * Busca usuários com suporte a paginação
 * @param {string} query - Termo de pesquisa (nome ou BJJ ID)
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Número de itens por página (padrão: 50)
 * @param {string} searchBy - Tipo de pesquisa ('nome' ou 'bjj_id')
 * @returns {Promise<Object>} Lista de usuários encontrados com informações de paginação
 */
export const buscarUsuarios = async (query = '', pagina = 1, limite = 50, searchBy = 'nome') => {
  try {
    // Quando não houver query, a API retorna todos os usuários se nenhum parâmetro for enviado
    const hasQuery = !!(query && query.trim() !== '');
    let url = `${BASE_URL}endpoint/user/pesquisar-usuario.php?pagina=${pagina}&limite=${limite}`;
    
    if (hasQuery) {
      url += `&query=${encodeURIComponent(query)}&search_by=${searchBy}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar usuários');
    }
    
    const data = await response.json();
    
    // A API retorna os usuários diretamente em data.data (array)
    return {
      usuarios: data.data || [],
      paginacao: data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};