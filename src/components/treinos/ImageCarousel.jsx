import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageSheet from "@/components/ui/ImageSheet";

/**
 * Componente de carrossel para exibir múltiplas imagens
 * @param {Object} props Propriedades do componente
 * @param {Array} props.images Lista de URLs das imagens
 * @returns {JSX.Element} Componente React
 */
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    // Carrossel automático a cada 4 segundos
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Se não houver imagens, não renderiza nada
  if (!images.length) return null;
  
  // Se houver apenas uma imagem, exibe-a sem controles de navegação
  if (images.length === 1) {
    return (
      <>
        <div className="relative w-full rounded-lg overflow-hidden aspect-video bg-muted">
          <img 
            src={images[0].url} 
            alt="Foto do treino" 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setSheetOpen(true)}
          />
        </div>
        <ImageSheet open={sheetOpen} onOpenChange={setSheetOpen} src={images[0].url} alt="Foto do treino" side="right" />
      </>
    );
  }

  // Se houver múltiplas imagens, exibe o carrossel completo
  return (
    <div className="relative w-full rounded-lg overflow-hidden aspect-video bg-muted">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={image.url} 
            alt={`Foto do treino ${index + 1}`} 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setSheetOpen(true)}
          />
        </div>
      ))}
      
      {/* Indicadores de página */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ver imagem ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Contador de imagens */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>
      
      {/* Botões de navegação */}
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
            onClick={() => setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
            onClick={() => setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </>
      )}

      {/* Sheet da imagem atual */}
      <ImageSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        src={images[currentIndex]?.url}
        alt={`Foto do treino ${currentIndex + 1}`}
        side="right"
      />
    </div>
  );
};

export default ImageCarousel;
