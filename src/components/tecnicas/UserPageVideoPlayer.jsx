import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Componente de player de vídeo simplificado para técnicas em página de perfil
 * 
 * @param {Object} props
 * @param {string} props.src - URL do vídeo
 * @param {string} props.posterSrc - URL da imagem de capa do vídeo (opcional)
 * @param {string} props.className - Classes CSS adicionais (opcional)
 * @param {boolean} props.loop - Se o vídeo deve repetir ao finalizar (opcional, default: false)
 */
const UserPageVideoPlayer = ({ 
  src, 
  posterSrc, 
  className = "",
  loop = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Função para iniciar o vídeo
  const playVideo = () => {
    if (videoRef.current) {
      // Garantir que o vídeo seja carregado quando clicar em play
      if (videoRef.current.preload === 'none') {
        videoRef.current.preload = 'auto';
      }
      
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.error("Erro ao reproduzir vídeo:", e);
          setIsPlaying(false);
        });
    }
  };

  // Função para pausar o vídeo
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Alternar entre play e pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  // Tratamento quando o vídeo termina
  const handleEnded = () => {
    if (!loop) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  // Certifique-se de que a URL do vídeo é completa
  const getFullVideoUrl = (url) => {
    if (!url) return null;
    
    // Se a URL já estiver completa, retorne-a
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    
    // Caso contrário, prefixe com a URL base da API
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  const fullVideoUrl = getFullVideoUrl(src);
  const posterUrl = posterSrc ? getFullVideoUrl(posterSrc) : null;
  
  // Se não houver URL de vídeo, não renderiza nada
  if (!fullVideoUrl) {
    return null;
  }

  return (
    <div
      className={`relative rounded-md overflow-hidden w-full ${className}`}
      style={{ width: "100%" }}
    >
      {/* Vídeo ocupa 100% da largura, altura automática, adaptada à proporção natural */}
      <video
        ref={videoRef}
        src={fullVideoUrl}
        poster={posterUrl}
        preload="none"
        muted
        playsInline
        loop={loop}
        className="rounded-md w-full h-auto"
        style={{ width: "100%", height: "auto", display: "block" }}
        onEnded={handleEnded}
        onError={(e) => {
          console.error("Erro ao carregar vídeo:", fullVideoUrl);
          e.target.parentElement.style.minHeight = "200px";
          e.target.parentElement.style.backgroundColor = "#f1f1f1";
          e.target.style.display = "none";
        }}
      />
      {/* Overlay com botão de play/pause */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
        onClick={togglePlay}
        style={{ pointerEvents: "auto" }}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 hover:bg-white border-none"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-blue-600" />
          ) : (
            <Play className="h-6 w-6 text-blue-600" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserPageVideoPlayer;