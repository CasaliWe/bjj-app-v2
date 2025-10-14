/**
 * Serviço para gerenciar os vídeos do YouTube
 * Este serviço implementa a integração com a API para buscar vídeos do YouTube
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
 * Busca vídeos do YouTube
 * @returns {Promise<Object>} Promessa que resolve para um objeto com dados dos vídeos
 */
export const getVideosYoutube = async () => {
  try {
    const url = `${BASE_URL}endpoint/videos-youtube/index.php`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Erro ao buscar vídeos');
    }

    return data.data;
  } catch (error) {
    console.error('Erro ao buscar vídeos do YouTube:', error);
    throw error;
  }
};

/**
 * Busca vídeos do YouTube com filtro de busca
 * @param {string} termoBusca - Termo de busca para filtrar vídeos
 * @param {Array} videos - Lista de vídeos para filtrar
 * @returns {Array} Lista de vídeos filtrados
 */
export const buscarVideos = (termoBusca, videos) => {
  if (!termoBusca || !termoBusca.trim()) {
    return videos;
  }

  const termo = termoBusca.toLowerCase().trim();
  
  return videos.filter(video => 
    video.titulo.toLowerCase().includes(termo)
  );
};

/**
 * Converte URL do YouTube para formato embed
 * @param {string} url - URL original do vídeo
 * @returns {string} URL no formato embed
 */
export const formatarUrlEmbed = (url) => {
  // Se já está no formato embed, retorna como está
  if (url.includes('/embed/')) {
    return url;
  }
  
  // Converte formato watch para embed
  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Converte formato youtu.be para embed
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

/**
 * Extrai ID do vídeo da URL
 * @param {string} url - URL do vídeo
 * @returns {string} ID do vídeo
 */
export const extrairVideoId = (url) => {
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1].split('?')[0];
  }
  
  if (url.includes('watch?v=')) {
    return url.split('watch?v=')[1].split('&')[0];
  }
  
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }
  
  return '';
};

/**
 * Gera URL da thumbnail do vídeo
 * @param {string} url - URL do vídeo
 * @returns {string} URL da thumbnail
 */
export const obterThumbnail = (url) => {
  const videoId = extrairVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return '';
};