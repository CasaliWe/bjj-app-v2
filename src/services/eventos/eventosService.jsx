/**
 * Serviço para gerenciar os eventos de grappling
 * Este serviço implementa a integração com a API para buscar eventos de competições
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
 * Busca eventos do Sou Competidor organizados por estado
 * @returns {Promise<Object>} Promessa que resolve para um objeto com eventos por estado
 */
export const getEventosSouCompetidor = async () => {
  try {
    const url = `${BASE_URL}endpoint/eventos/sou-competidor.php`;
    
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
      // Retorna os dados da resposta da API
      return {
        eventos_por_estado: data.data.eventos_por_estado || {},
        total_estados: data.data.total_estados || 0,
        total_eventos: data.data.total_eventos || 0,
        estados_disponiveis: Object.keys(data.data.eventos_por_estado || {}).sort(),
        tipo: 'sou-competidor'
      };
    } else {
      throw new Error(data.message || 'Erro ao buscar eventos');
    }
    
  } catch (error) {
    console.error('Erro ao buscar eventos do Sou Competidor:', error);
    
    // Em caso de erro, retorna estrutura vazia
    throw new Error(
      error.message || 'Não foi possível carregar os eventos. Verifique sua conexão.'
    );
  }
};

/**
 * Busca eventos da IBJJF
 * @returns {Promise<Object>} Promessa que resolve para um objeto com eventos organizados
 */
export const getEventosIBJJF = async () => {
  try {
    const url = `${BASE_URL}endpoint/eventos/ibjjf.php`;
    
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
      // Organiza os eventos da IBJJF por cidade (extraída do local)
      const eventosPorCidade = {};
      const eventos = data.data.eventos || [];
      
      eventos.forEach(evento => {
        // Extrai a cidade do local (assumindo formato "Local, Cidade")
        const cidade = evento.local.split(',').pop().trim();
        
        if (!eventosPorCidade[cidade]) {
          eventosPorCidade[cidade] = {
            eventos: [],
            total_eventos: 0
          };
        }
        
        eventosPorCidade[cidade].eventos.push({
          ...evento,
          estado: cidade, // Para compatibilidade com o sistema existente
          // Eventos IBJJF não têm imagem nem link
          imagem: null,
          link: null
        });
        eventosPorCidade[cidade].total_eventos++;
      });
      
      return {
        eventos_por_estado: eventosPorCidade,
        total_estados: Object.keys(eventosPorCidade).length,
        total_eventos: data.data.total_eventos || eventos.length,
        estados_disponiveis: Object.keys(eventosPorCidade).sort(),
        tipo: 'ibjjf'
      };
    } else {
      throw new Error(data.message || 'Erro ao buscar eventos IBJJF');
    }
    
  } catch (error) {
    console.error('Erro ao buscar eventos IBJJF:', error);
    
    // Em caso de erro, retorna estrutura vazia
    throw new Error(
      error.message || 'Não foi possível carregar os eventos IBJJF. Verifique sua conexão.'
    );
  }
};

/**
 * Busca eventos baseado no tipo selecionado
 * @param {string} tipo - Tipo de evento ('sou-competidor' ou 'ibjjf')
 * @returns {Promise<Object>} Promessa que resolve para um objeto com eventos
 */
export const getEventos = async (tipo = 'sou-competidor') => {
  if (tipo === 'ibjjf') {
    return await getEventosIBJJF();
  } else {
    return await getEventosSouCompetidor();
  }
};

/**
 * Função auxiliar para filtrar eventos por estado
 * @param {Object} eventos_por_estado - Objeto com eventos organizados por estado
 * @param {string} estadoSelecionado - Estado para filtrar (vazio = todos)
 * @returns {Object} Eventos filtrados
 */
export const filtrarEventosPorEstado = (eventos_por_estado, estadoSelecionado) => {
  if (!estadoSelecionado || estadoSelecionado === 'todos') {
    return eventos_por_estado;
  }
  
  if (eventos_por_estado[estadoSelecionado]) {
    return {
      [estadoSelecionado]: eventos_por_estado[estadoSelecionado]
    };
  }
  
  return {};
};

/**
 * Função auxiliar para obter estatísticas dos eventos
 * @param {Object} eventos_por_estado - Objeto com eventos organizados por estado
 * @returns {Object} Estatísticas dos eventos
 */
export const getEstatisticasEventos = (eventos_por_estado) => {
  const estados = Object.keys(eventos_por_estado || {});
  let totalEventos = 0;
  
  estados.forEach(estado => {
    totalEventos += eventos_por_estado[estado].total_eventos || 0;
  });
  
  return {
    total_estados: estados.length,
    total_eventos: totalEventos,
    estados_disponiveis: estados.sort()
  };
};