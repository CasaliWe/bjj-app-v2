import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, X, ExternalLink } from "lucide-react";
import { formatarUrlEmbed, obterThumbnail } from "@/services/videos/videosService";

const VideoCard = ({ video }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemCarregada, setImagemCarregada] = useState(true);

  const urlEmbed = formatarUrlEmbed(video.url);
  const thumbnail = obterThumbnail(video.url);

  const abrirModal = () => {
    setModalAberto(true);
    // Previne scroll no body quando modal está aberto
    document.body.style.overflow = 'hidden';
  };

  const fecharModal = () => {
    setModalAberto(false);
    // Restaura scroll no body
    document.body.style.overflow = 'unset';
  };

  // Cleanup quando componente desmonta
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fecha modal com ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        fecharModal();
      }
    };
    
    if (modalAberto) {
      document.addEventListener('keydown', handleEsc, false);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, [modalAberto]);

  const abrirNoYoutube = () => {
    const videoId = video.url.split('/embed/')[1]?.split('?')[0];
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <>
      {/* Card do Vídeo */}
      <Card className="bg-gray-800 border-gray-700 hover:border-yellow-400 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-900 overflow-hidden">
            {imagemCarregada && thumbnail && (
              <img
                src={thumbnail}
                alt={video.titulo}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImagemCarregada(false)}
                loading="lazy"
              />
            )}
            
            {/* Overlay de Play */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={abrirModal}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 p-0"
              >
                <Play className="h-8 w-8 ml-1" fill="currentColor" />
              </Button>
            </div>
            
            {/* Badge do YouTube */}
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              YouTube
            </div>
          </div>

          {/* Informações do Vídeo */}
          <div className="p-4">
            <h3 
              className="text-white font-medium text-sm leading-tight mb-3 line-clamp-2 cursor-pointer hover:text-yellow-400 transition-colors"
              onClick={abrirModal}
              title={video.titulo}
            >
              {video.titulo}
            </h3>
            
            <div className="flex justify-between items-center">
              <Button
                onClick={abrirModal}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 flex-1 mr-2"
              >
                <Play className="h-4 w-4 mr-2" />
                Assistir
              </Button>
              
              <Button
                onClick={abrirNoYoutube}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400 p-2"
                title="Abrir no YouTube"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal do Vídeo */}
      {modalAberto && (
        <div 
          className="fixed inset-0 z-50 bg-black md:bg-black/90 md:flex md:items-center md:justify-center md:p-4"
          onClick={fecharModal}
        >
          <div 
            className="relative w-full h-full md:h-auto md:max-w-6xl bg-gray-900 md:rounded-lg overflow-hidden flex flex-col md:max-h-[90vh] mb-24 md:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-700 flex-shrink-0 bg-gray-900">
              <h2 className="text-white font-medium text-xs sm:text-sm md:text-base pr-2 line-clamp-2 flex-1">
                {video.titulo}
              </h2>
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <Button
                  onClick={abrirNoYoutube}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400 p-2"
                  title="Abrir no YouTube"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  onClick={fecharModal}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Container do vídeo */}
            <div className="flex-1 relative">
              {/* Vídeo - fullscreen no mobile, aspect ratio correto no desktop */}
              <div className="absolute inset-0 md:relative md:pb-[37.5%] md:h-0 md:inset-auto">
                <iframe
                  src={`${urlEmbed}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.titulo}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;