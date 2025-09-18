/**
 * Serviço para gerenciar as técnicas do usuário
 * Este serviço implementa a integração com a API para operações CRUD de técnicas
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
 * Busca todas as técnicas do usuário
 * @param {Object} filtros - Filtros para busca (opcional)
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 20)
 * @returns {Promise<Object>} Promessa que resolve para um objeto com técnicas e paginação
 */
export const getTecnicas = async (filtros = {}, pagina = 1, limite = 20) => {
  try {
    // Construir a URL com parâmetros de query
    let url = `${BASE_URL}endpoint/tecnicas/listar.php?pagina=${pagina}&limite=${limite}`;
    
    // Adicionar filtros se fornecidos
    if (filtros.categoria && filtros.categoria !== "todas") {
      url += `&categoria=${filtros.categoria}`;
    }
    
    if (filtros.posicao && filtros.posicao !== "todas") {
      url += `&posicao=${filtros.posicao}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar técnicas');
    }
    
    const data = await response.json();
    
    return {
      tecnicas: data.data.tecnicas || [],
      paginaAtual: data.data.pagination?.currentPage || pagina,
      totalPaginas: data.data.pagination?.totalPages || 1,
      totalItens: data.data.pagination?.totalItems || 0,
      itensPorPagina: data.data.pagination?.itemsPerPage || limite
    };
  } catch (error) {
    console.error("Erro ao buscar técnicas:", error);
    throw error;
  }
};

/**
 * Busca técnicas da comunidade com filtro opcional
 * @param {string} termo - Termo de pesquisa opcional
 * @param {number} pagina - Número da página (padrão: 1)
 * @param {number} limite - Itens por página (padrão: 20)
 * @returns {Promise<Object>} Promessa que resolve para um objeto com técnicas da comunidade e paginação
 */
export const getTecnicasComunidade = async (termo = "", pagina = 1, limite = 20) => {
  try {
    // Construir a URL com parâmetros de query
    let url = `${BASE_URL}endpoint/tecnicas/comunidade.php?pagina=${pagina}&limite=${limite}`;
    
    // Adicionar termo de busca se existir
    if (termo && termo.trim() !== "") {
      url += `&termo=${encodeURIComponent(termo.trim())}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar técnicas da comunidade');
    }
    
    const data = await response.json();
    
    // Retornar objeto completo com técnicas e paginação
    return {
      tecnicas: data.data.tecnicas || [],
      paginaAtual: data.data.pagination?.currentPage || pagina,
      totalPaginas: data.data.pagination?.totalPages || 1,
      totalItens: data.data.pagination?.totalItems || 0,
      itensPorPagina: data.data.pagination?.itemsPerPage || limite
    };
  } catch (error) {
    console.error("Erro ao buscar técnicas da comunidade:", error);
    throw error;
  }
};

/**
 * Busca as posições cadastradas pelo usuário e posições padrão
 * @returns {Promise<Array>} Promessa que resolve para um array de posições
 */
export const getPosicoes = async () => {
  try {
    const url = `${BASE_URL}endpoint/tecnicas/posicoes.php`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao listar posições');
    }
    
    const data = await response.json();
    
    // Garantir que estamos retornando um array de posições
    const posicoes = data.data?.posicoes || [];
    
    return posicoes;
  } catch (error) {
    console.error("Erro ao buscar posições:", error);
    throw error;
  }
};

/**
 * Salva uma nova técnica ou atualiza uma existente
 * @param {Object} tecnica - Dados da técnica a ser salva
 * @returns {Promise<Object>} Promessa que resolve para a técnica salva
 */
export const saveTecnica = async (tecnica) => {
  try {
    // Determinar se é uma criação ou atualização
    const isUpdate = !!tecnica.id;
    
    // Criar um FormData para envio
    const formData = new FormData();
    
    // Adicionar campos de texto
    formData.append('nome', tecnica.nome || '');
    formData.append('categoria', tecnica.categoria || '');
    formData.append('posicao', tecnica.posicao || '');
    formData.append('nota', tecnica.nota || 3);
    formData.append('destacado', tecnica.destacado ? '1' : '0');
    formData.append('publica', tecnica.publica ? '1' : '0');
    
    // Adicionar URL do vídeo externo se existir
    if (tecnica.video) {
      formData.append('video', tecnica.video);
    }
    
    // Adicionar ID se for atualização
    if (isUpdate) {
      formData.append('id', tecnica.id);
      
      // Se estamos atualizando e queremos manter o vídeo existente
      if (tecnica.manterVideoExistente) {
        formData.append('manter_video_existente', '1');
      }
    }
    
    // Adicionar passos e observações como JSON
    formData.append('passos', JSON.stringify(tecnica.passos || []));
    formData.append('observacoes', JSON.stringify(tecnica.observacoes || []));
    
    // Gerenciar upload de arquivo de vídeo
    const videoFile = tecnica.videoFile instanceof File 
      ? tecnica.videoFile 
      : window._ultimoArquivoVideo;
      
    if (videoFile instanceof File) {
      // Adicionar o arquivo ao FormData
      formData.append('videoFile', videoFile);
      
      // Sempre enviar as dimensões do vídeo para a API poder gerar o poster
      if (tecnica.videoWidth && tecnica.videoHeight) {
        formData.append('video_width', String(tecnica.videoWidth));
        formData.append('video_height', String(tecnica.videoHeight));
      }
    }
    
    // Configurar o endpoint
    const endpoint = isUpdate ? 'atualizar.php' : 'criar.php';
    const url = `${BASE_URL}endpoint/tecnicas/${endpoint}`;
    
    // Fazer a requisição com timeout mais longo para uploads
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Não definir Content-Type, o navegador configura automaticamente para multipart/form-data
        },
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Obter o texto da resposta
      const responseText = await response.text();
      
      // Tentar converter a resposta para JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Resposta inválida da API: ${responseText.substring(0, 200)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ao ${isUpdate ? 'atualizar' : 'criar'} técnica: ${response.status}`);
      }
      
      return data.data || data;
    } catch (fetchError) {
      throw fetchError;
    }
  } catch (error) {
    console.error("Erro ao salvar técnica:", error);
    throw error;
  }
};/**
 * Exclui uma técnica
 * @param {number} id - ID da técnica a ser excluída
 * @returns {Promise<boolean>} Promessa que resolve para true se a exclusão for bem-sucedida
 */
export const deleteTecnica = async (id) => {
  try {
    const url = `${BASE_URL}endpoint/tecnicas/excluir.php`;
    
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
      throw new Error(errorData.message || 'Erro ao excluir técnica');
    }
    
    await response.json();
    return true;
  } catch (error) {
    console.error("Erro ao excluir técnica:", error);
    throw error;
  }
};

/**
 * Atualiza o destaque de uma técnica
 * @param {number} id - ID da técnica
 * @param {boolean} destacado - Se a técnica deve ser destacada ou não
 * @returns {Promise<Object>} Promessa que resolve para a técnica atualizada
 */
export const updateDestaque = async (id, destacado) => {
  try {
    const url = `${BASE_URL}endpoint/tecnicas/destaque.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, destacado })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar destaque');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao atualizar destaque:", error);
    throw error;
  }
};

/**
 * Atualiza a visibilidade pública de uma técnica
 * @param {number} id - ID da técnica
 * @param {boolean} publica - Se a técnica deve ser pública ou não
 * @returns {Promise<Object>} Promessa que resolve para a técnica atualizada
 */
export const updatePublica = async (id, publica) => {
  try {
    const url = `${BASE_URL}endpoint/tecnicas/visibilidade.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, publica })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar visibilidade');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao atualizar visibilidade:", error);
    throw error;
  }
};

/**
 * Adiciona uma nova posição
 * @param {string} nomePosicao - Nome da nova posição
 * @returns {Promise<Object>} Promessa que resolve para os dados da nova posição
 */
export const adicionarPosicao = async (nomePosicao) => {
  try {
    const url = `${BASE_URL}endpoint/tecnicas/adicionar-posicoes.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        nome: nomePosicao.trim()
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao adicionar posição');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao adicionar posição:", error);
    throw error;
  }
};

/**
 * Exclui uma posição existente
 * @param {string} nomePosicao - Nome da posição a ser excluída
 * @returns {Promise<boolean>} Promessa que resolve para true se excluída com sucesso
 */
export const excluirPosicao = async (nomePosicao) => {
  try {
    const url = `${BASE_URL}endpoint/tecnicas/excluir-posicoes.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        nome: nomePosicao
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir posição');
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir posição:", error);
    throw error;
  }
};
