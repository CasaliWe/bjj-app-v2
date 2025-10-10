import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  X,
  BookOpen
} from "lucide-react";

/**
 * Componente de Modal de Vídeo da Técnica - exibe o vídeo de uma técnica em modal
 * 
 * @param {Object} props
 * @param {Object} props.tecnica - Dados da técnica
 * @param {Object} props.modulo - Dados do módulo
 * @param {boolean} props.aberto - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 */
const TecnicaVideoModal = ({ 
  tecnica, 
  modulo,
  aberto,
  onClose
}) => {
  const [reproduzindo, setReproduzindo] = useState(false);
  const [slowMotion, setSlowMotion] = useState(false);
  const [erro, setErro] = useState(null);
  const videoRef = useRef(null);

  // Resetar estados quando abrir o modal
  useEffect(() => {
    if (aberto) {
      setReproduzindo(false);
      setSlowMotion(false);
      setErro(null);
    }
  }, [aberto]);

  // Pausar vídeo quando fechar o modal
  useEffect(() => {
    if (!aberto && videoRef.current) {
      videoRef.current.pause();
      setReproduzindo(false);
    }
  }, [aberto]);

  // Controlar reprodução
  const toggleReproducao = () => {
    if (videoRef.current) {
      if (reproduzindo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Erro ao reproduzir vídeo:', err);
          setErro('Erro ao reproduzir o vídeo');
        });
      }
    }
  };

  // Controlar slow motion
  const toggleSlowMotion = () => {
    if (videoRef.current) {
      if (slowMotion) {
        videoRef.current.playbackRate = 1.0; // Velocidade normal
      } else {
        videoRef.current.playbackRate = 0.25; // Slow motion
      }
      setSlowMotion(!slowMotion);
    }
  };

  // Entrar em tela cheia
  const entrarTelaCheia = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Handlers do vídeo
  const handlePlay = () => setReproduzindo(true);
  const handlePause = () => setReproduzindo(false);
  const handleError = () => {
    setErro('Erro ao carregar o vídeo');
    setReproduzindo(false);
  };

  // Verificar se tem vídeo
  const temVideo = tecnica?.video && tecnica.video.trim() !== '';

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] md:max-w-2xl max-h-[90vh] p-0 bg-gray-900 border-gray-700 overflow-y-auto [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{tecnica?.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-start justify-between p-4 border-b border-gray-700">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-semibold text-white mb-1">
              {tecnica?.nome}
            </h2>
            {modulo && (
              <p className="text-sm text-gray-400">
                {modulo.nome}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Conteúdo */}
        <div>
          {/* Vídeo 100% sem cortes */}
          <div className="relative bg-black">
            {temVideo ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  poster=""
                  preload="metadata"
                  muted={true}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onError={handleError}
                  controls={false}
                >
                  <source src={tecnica.video} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>

                {/* Overlay para play/pause */}
                <div 
                  className="absolute inset-0 cursor-pointer flex items-center justify-center"
                  onClick={toggleReproducao}
                >
                  {!reproduzindo && (
                    <div className="bg-black/50 rounded-full p-4">
                      <Play className="h-12 w-12 text-yellow-400" />
                    </div>
                  )}
                </div>

                {/* Controles minimalistas */}
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleSlowMotion}
                    className={`${slowMotion ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-black/50 text-white hover:bg-black/70'} rounded px-3 py-1`}
                  >
                    <span className="text-xs font-medium">slow motion</span>
                  </Button>
                </div>

                {/* Indicador de erro */}
                {erro && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-white text-center p-4">
                      <p className="text-sm mb-2">{erro}</p>
                      <Button
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        onClick={() => setErro(null)}
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Vídeo não disponível</p>
                </div>
              </div>
            )}
          </div>

          {/* Descrição da técnica */}
          {tecnica?.descricao && (
            <div className="p-4 pb-6">
              <h3 className="text-sm font-medium text-white mb-2">Descrição</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {tecnica.descricao}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TecnicaVideoModal;