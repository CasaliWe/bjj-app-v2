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