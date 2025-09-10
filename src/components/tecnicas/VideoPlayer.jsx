import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Componente de player de vídeo simplificado para técnicas
 * 
 * @param {Object} props
 * @param {string} props.src - URL do vídeo
 * @param {string} props.posterSrc - URL da imagem de capa do vídeo (opcional)
 * @param {string} props.className - Classes CSS adicionais (opcional)
 * @param {boolean} props.loop - Se o vídeo deve repetir ao finalizar (opcional, default: false)
 */
const VideoPlayer = ({ 
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

  return (
    <div className={`relative rounded-md overflow-hidden ${className}`}>
      {/* Vídeo com preload="none" para não carregar automaticamente */}
      <video 
        ref={videoRef}
        src={src}
        poster={posterSrc || undefined}
        preload="none"
        muted
        playsInline
        loop={loop}
        className="w-full rounded-md"
        style={{ width: "100%", height: "auto" }}
        onEnded={handleEnded}
      />
      
      {/* Overlay com botão de play/pause */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
        onClick={togglePlay}
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

export default VideoPlayer;
