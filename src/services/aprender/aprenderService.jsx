/**
 * Serviço para gerenciar os módulos de aprendizado
 * Este serviço implementa a integração com a API para buscar módulos e técnicas
 */

// URL base da API
const BASE_URL = import.meta.env.VITE_API_URL || '';

// Importando o service do cookies
import { getAuthToken } from '@/services/cookies/cookies';

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
 * Busca todos os módulos de aprendizado com suas técnicas
 * @returns {Promise<Object>} Promessa que resolve para um objeto com módulos
 */
export const getModulos = async () => {
  try {
    const url = `${BASE_URL}endpoint/aprender/buscar-modulos.php`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      // Se não conseguir buscar, retorna estrutura vazia
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Organizar os módulos por ordem
      const modulosOrdenados = data.data?.modulos?.sort((a, b) => a.ordem - b.ordem) || [];
      
      // Organizar as técnicas dentro de cada módulo por ordem
      modulosOrdenados.forEach(modulo => {
        if (modulo.tecnicas && Array.isArray(modulo.tecnicas)) {
          modulo.tecnicas.sort((a, b) => a.ordem - b.ordem);
        }
      });
      
      return {
        modulos: modulosOrdenados,
        total_modulos: data.data?.total_modulos || 0
      };
    } else {
      throw new Error(data.message || 'Erro ao buscar módulos de aprendizado');
    }
    
  } catch (error) {
    console.error('Erro ao buscar módulos:', error);
    throw error;
  }
};

/**
 * Busca um módulo específico por ID
 * @param {number} moduloId - ID do módulo
 * @returns {Promise<Object>} Promessa que resolve para o módulo encontrado
 */
export const getModulo = async (moduloId) => {
  try {
    // Como a API atual retorna todos os módulos, vamos filtrar pelo ID
    const data = await getModulos();
    const modulo = data.modulos.find(m => m.id === parseInt(moduloId));
    
    if (!modulo) {
      throw new Error('Módulo não encontrado');
    }
    
    return modulo;
  } catch (error) {
    console.error('Erro ao buscar módulo:', error);
    throw error;
  }
};

/**
 * Busca uma técnica específica por ID dentro de um módulo
 * @param {number} moduloId - ID do módulo
 * @param {number} tecnicaId - ID da técnica
 * @returns {Promise<Object>} Promessa que resolve para a técnica encontrada
 */
export const getTecnica = async (moduloId, tecnicaId) => {
  try {
    const modulo = await getModulo(moduloId);
    const tecnica = modulo.tecnicas?.find(t => t.id === parseInt(tecnicaId));
    
    if (!tecnica) {
      throw new Error('Técnica não encontrada');
    }
    
    return {
      ...tecnica,
      modulo: {
        id: modulo.id,
        nome: modulo.nome,
        descricao: modulo.descricao
      }
    };
  } catch (error) {
    console.error('Erro ao buscar técnica:', error);
    throw error;
  }
};