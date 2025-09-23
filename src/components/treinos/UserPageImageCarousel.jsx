import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageSheet from "../ui/ImageSheet";

/**
 * Componente de carrossel otimizado para exibição em perfil de usuário
 * @param {Object} props Propriedades do componente
 * @param {Array} props.images Lista de URLs das imagens
 * @returns {JSX.Element} Componente React
 */
const UserPageImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const ignoreNextClickRef = useRef(false);

  useEffect(() => {
    if (images.length <= 1) return;

    // Carrossel automático a cada 4 segundos (apenas quando não estiver em tela cheia)
    const interval = setInterval(() => {
      if (!isFullscreen) {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isFullscreen]);

  // Se não houver imagens, não renderiza nada
  if (!images.length) return null;
  
  // Função para obter o URL correto da imagem
  const getImageUrl = (image) => {
    // Se a imagem já for um objeto com url, verifica se já é um URL completo
    if (typeof image === 'object' && image.url) {
      if (image.url.startsWith('http://') || image.url.startsWith('https://')) {
        return image.url;
      }
      return `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/treinos/${image.url}`;
    }
    
    // Se for string, verifica se já é um URL completo
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      return `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/treinos/${image}`;
    }
    
    // Se tiver um caminho relativo no objeto
    if (typeof image === 'object' && image.path) {
      if (image.path.startsWith('http://') || image.path.startsWith('https://')) {
        return image.path;
      }
      return `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/treinos/${image.path}`;
    }
    
    // Fallback para uma imagem padrão ou placeholder
    return null;
  };

  // Alternar entre modo normal e tela cheia
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const openSheet = () => {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }
    setSheetOpen(true);
  };
  
  // Se houver apenas uma imagem, exibe-a sem controles de navegação
  if (images.length === 1) {
    const imageUrl = getImageUrl(images[0]);
    if (!imageUrl) return null;
    
    if (isFullscreen) {
      return (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <button 
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
            onClick={toggleFullscreen}
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={imageUrl} 
            alt="Foto do treino" 
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    }
    
    return (
      <div 
        className="relative w-full rounded-lg overflow-hidden aspect-video bg-muted cursor-pointer"
        onClick={openSheet}
      >
        <img 
          src={imageUrl} 
          alt="Foto do treino" 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Erro ao carregar imagem:", imageUrl);
            e.target.src = "/placeholder-image.jpg"; // Imagem de fallback
          }}
        />
        <ImageSheet 
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) {
              ignoreNextClickRef.current = true;
              setTimeout(() => {
                ignoreNextClickRef.current = false;
              }, 200);
            }
          }}
          src={imageUrl}
          alt="Foto do treino"
        />
      </div>
    );
  }

  // Se houver múltiplas imagens, exibe o carrossel completo
  // Modo tela cheia
  if (isFullscreen) {
    const imageUrl = getImageUrl(images[currentIndex]);
    
    return (
      <div 
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onClick={toggleFullscreen}
      >
        <button 
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
        >
          <X className="h-6 w-6" />
        </button>
        
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
          }}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        
        <img 
          src={imageUrl} 
          alt={`Foto do treino ${currentIndex + 1}`} 
          className="max-h-[90vh] max-w-[90vw] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
          }}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
        
        {/* Contador de imagens */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    );
  }
  
  // Modo normal (carrossel)
  return (
    <div className="relative w-full rounded-lg overflow-hidden aspect-video bg-muted cursor-pointer">
      {images.map((image, index) => {
        const imageUrl = getImageUrl(image);
        if (!imageUrl) return null;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            onClick={openSheet}
          >
            <img 
              src={imageUrl} 
              alt={`Foto do treino ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", imageUrl);
                e.target.src = "/placeholder-image.jpg"; // Imagem de fallback
              }}
            />
          </div>
        );
      })}
      
      {/* Indicadores de página */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            aria-label={`Ver imagem ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Contador de imagens */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
        {currentIndex + 1}/{images.length}
      </div>
      
      {/* Botões de navegação */}
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
            }}
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
            }}
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
          <ImageSheet 
            open={sheetOpen}
            onOpenChange={(open) => {
              setSheetOpen(open);
              if (!open) {
                ignoreNextClickRef.current = true;
                setTimeout(() => {
                  ignoreNextClickRef.current = false;
                }, 200);
              }
            }}
            src={getImageUrl(images[currentIndex])}
            alt={`Foto do treino ${currentIndex + 1}`}
          />
        </>
      )}
    </div>
  );
};

export default UserPageImageCarousel;