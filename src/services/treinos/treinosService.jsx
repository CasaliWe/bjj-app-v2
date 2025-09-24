// Constantes para o serviço de treinos
export const DIAS_SEMANA = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

export const HORARIOS_TREINO = [
  { value: "06:30", label: "06:30" },
  { value: "07:00", label: "07:00" },
  { value: "07:30", label: "07:30" },
  { value: "10:00", label: "10:00" },
  { value: "12:00", label: "12:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "19:30", label: "19:30" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
  { value: "21:30", label: "21:30" },
  { value: "22:00", label: "22:00" },
];

// URL base da API
const BASE_URL = import.meta.env.VITE_API_URL || '';

// importnado o service do cookies
import { getAuthToken } from '@/services/cookies/cookies';

// Função auxiliar para obter o token de autenticação
const getAuthHeader = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Função para listar treinos do usuário com filtragem e paginação
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 20)
 * @param {string} tipo - Filtro por tipo de treino (ex: 'kimono', 'nogi', ou 'todos')
 * @param {string} diaSemana - Filtro por dia da semana (ex: 'segunda', 'terca', ou 'todos')
 * @returns {Promise<Object>} - Objeto com treinos e dados de paginação
 */
export const getTreinos = async (pagina = 1, limite = 20, tipo = 'todos', diaSemana = 'todos') => {
  try {
    // Construir a URL com parâmetros de query
    let url = `${BASE_URL}endpoint/treinos/listar.php?pagina=${pagina}&limite=${limite}`;
    
    // Adicionar filtros se não forem 'todos'
    if (tipo !== 'todos') {
      url += `&tipo=${tipo}`;
    }
    
    if (diaSemana !== 'todos') {
      url += `&diaSemana=${diaSemana}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar treinos');
    }
    
    const data = await response.json();
    
    return {
      treinos: data.data.treinos || [],
      pagination: data.data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);
    throw error;
  }
};

/**
 * Função para listar treinos da comunidade
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 20)
 * @returns {Promise<Object>} - Objeto com treinos e dados de paginação
 */
export const getTreinosComunidade = async (pagina = 1, limite = 20) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/comunidade.php?pagina=${pagina}&limite=${limite}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar treinos da comunidade');
    }
    
    const data = await response.json();
    
    return {
      treinos: data.data.treinos || [],
      pagination: data.data.pagination || {
        currentPage: pagina,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limite
      }
    };
  } catch (error) {
    console.error("Erro ao buscar treinos da comunidade:", error);
    throw error;
  }
};

/**
 * Função para criar um novo treino
 * @param {FormData} formData - FormData contendo os dados do treino a ser criado
 * @returns {Promise<Object>} - Objeto com o treino criado
 */
export const criarTreino = async (formData) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/criar.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
        // O Content-Type é definido automaticamente pelo navegador com boundary quando usamos FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar treino');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    throw error;
  }
};

/**
 * Função para atualizar um treino existente
 * @param {FormData} formData - FormData contendo os dados do treino a ser atualizado
 * @returns {Promise<Object>} - Objeto com o treino atualizado
 */
export const atualizarTreino = async (formData) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/atualizar.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
        // O Content-Type é definido automaticamente pelo navegador com boundary quando usamos FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar treino');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao atualizar treino:", error);
    throw error;
  }
};

/**
 * Função para excluir um treino
 * @param {number} id - ID do treino a ser excluído
 * @returns {Promise<boolean>} - true se o treino foi excluído com sucesso
 */
export const excluirTreino = async (id) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/excluir.php`;
    
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
      throw new Error(errorData.message || 'Erro ao excluir treino');
    }
    
    await response.json();
    return true;
  } catch (error) {
    console.error("Erro ao excluir treino:", error);
    throw error;
  }
};

/**
 * Função para alterar a visibilidade de um treino
 * @param {number} id - ID do treino
 * @param {boolean} isPublico - Se o treino deve ser público ou não
 * @returns {Promise<Object>} - Objeto com dados atualizados do treino
 */
export const alterarVisibilidadeTreino = async (id, isPublico) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/visibilidade.php`;
    
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
      throw new Error(errorData.message || 'Erro ao alterar visibilidade do treino');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao alterar visibilidade do treino:", error);
    throw error;
  }
};

/**
 * Função para remover uma imagem específica de um treino
 * @param {number} treinoId - ID do treino
 * @param {number} imagemId - ID da imagem a ser removida
 * @returns {Promise<Object>} - Objeto com dados atualizados do treino
 */
export const removerImagemTreino = async (treinoId, imagemId) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/remover-imagem.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ treinoId, imagemId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao remover imagem do treino');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao remover imagem do treino:", error);
    throw error;
  }
};

/**
 * Função para upload de imagens para um treino existente
 * NOTA: Esta função está mantida por compatibilidade, mas não deve mais ser usada.
 * Use a função atualizarTreino em vez disso, que aceita um FormData com imagens.
 * 
 * @param {number} treinoId - ID do treino
 * @param {FileList|Array<File>} files - Arquivos de imagem a serem enviados
 * @returns {Promise<Array<string>>} - Array com URLs das imagens enviadas
 * @deprecated Use atualizarTreino passando FormData com campo imagens[] em vez desta função
 */
export const uploadImagensTreino = async (treinoId, files) => {
  try {
    const url = `${BASE_URL}endpoint/treinos/atualizar.php`;
    
    const formData = new FormData();
    formData.append('id', treinoId);
    
    // Converter FileList para Array se necessário
    const filesArray = Array.from(files);
    
    filesArray.forEach(file => {
      formData.append('imagens[]', file);
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao fazer upload de imagens');
    }
    
    const data = await response.json();
    
    // Retornar as URLs das imagens enviadas
    return data.data.imagens || [];
  } catch (error) {
    console.error("Erro ao fazer upload de imagens:", error);
    throw error;
  }
};
