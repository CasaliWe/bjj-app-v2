import { useState, useEffect, useCallback } from "react";
import * as videosService from "@/services/videos/videosService.jsx";

/**
 * Hook personalizado para gerenciar o estado dos vídeos do YouTube
 * Centraliza toda a lógica de manipulação dos vídeos e filtros
 * 
 * @returns {Object} Funções e estado para manipular vídeos
 */
export const useVideosYoutube = () => {
  const [videos, setVideos] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Carregar todos os vídeos
  const carregarVideos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    
    try {
      const data = await videosService.getVideosYoutube();
      
      setVideos(data.videos || []);
      setTotalVideos(data.total_videos || 0);
      
      return data;
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setErro("Não foi possível carregar os vídeos. Tente novamente mais tarde.");
      setVideos([]);
      setTotalVideos(0);
      return { videos: [], total_videos: 0 };
    } finally {
      setCarregando(false);
    }
  }, []);

  // Buscar vídeos por termo
  const buscarVideos = useCallback((termoBusca) => {
    return videosService.buscarVideos(termoBusca, videos);
  }, [videos]);

  // Obter estatísticas dos vídeos
  const getEstatisticas = useCallback(() => {
    return {
      total_videos: totalVideos,
      videos_carregados: videos.length
    };
  }, [totalVideos, videos.length]);

  // Verificar se tem vídeos
  const temVideos = useCallback(() => {
    return videos.length > 0;
  }, [videos]);

  // Carregar vídeos na inicialização
  useEffect(() => {
    carregarVideos();
  }, [carregarVideos]);

  return {
    videos,
    totalVideos,
    carregando,
    erro,
    carregarVideos,
    buscarVideos,
    getEstatisticas,
    temVideos
  };
};