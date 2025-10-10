import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  PlayCircle, 
  BookOpen, 
  Video,
  GraduationCap,
  Play
} from "lucide-react";
import TecnicaVideoModal from "./TecnicaVideoModal";

/**
 * Componente de Card de Módulo - exibe um módulo de aprendizado com suas técnicas em accordion
 * 
 * @param {Object} props
 * @param {Object} props.modulo - Dados do módulo
 * @param {Function} props.onSelecionarTecnica - Função para selecionar uma técnica
 * @param {string} props.accordionValue - Valor do accordion (para controle externo)
 */
const ModuloCard = ({ 
  modulo, 
  onSelecionarTecnica,
  accordionValue
}) => {
  const [tecnicaModal, setTecnicaModal] = useState(null);

  // Verificar se o módulo tem técnicas
  const temTecnicas = modulo.tecnicas && modulo.tecnicas.length > 0;
  const totalTecnicas = modulo.total_tecnicas || modulo.tecnicas?.length || 0;

  // Abrir modal de vídeo da técnica
  const abrirModalVideo = (tecnica, e) => {
    e.stopPropagation();
    setTecnicaModal(tecnica);
  };

  // Selecionar técnica
  const handleSelecionarTecnica = (tecnica, e) => {
    e.stopPropagation();
    if (onSelecionarTecnica) {
      onSelecionarTecnica(tecnica, modulo);
    }
  };

  return (
    <>
      <AccordionItem 
        value={modulo.id.toString()} 
        className="border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-4 text-left">
            <div className="p-2 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
              <GraduationCap className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {modulo.nome}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                  {totalTecnicas} {totalTecnicas === 1 ? 'técnica' : 'técnicas'}
                </Badge>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="px-6 pb-4">
          {modulo.descricao && (
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              {modulo.descricao}
            </p>
          )}
          
          {temTecnicas ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Técnicas do Módulo
              </h4>
              
              <div className="space-y-2">
                {modulo.tecnicas.map((tecnica) => (
                  <div
                    key={tecnica.id}
                    className="border border-gray-600 rounded-lg bg-gray-750 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                        <div className="p-1.5 bg-gray-600 rounded">
                          {tecnica.video ? (
                            <Video className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium text-white truncate">
                            {tecnica.nome}
                          </h5>
                        </div>
                      </div>
                      
                      {tecnica.video && (
                        <Button
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                          onClick={(e) => abrirModalVideo(tecnica, e)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Assistir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Nenhuma técnica disponível neste módulo
              </p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Modal de vídeo da técnica */}
      {tecnicaModal && (
        <TecnicaVideoModal
          tecnica={tecnicaModal}
          modulo={modulo}
          aberto={!!tecnicaModal}
          onClose={() => setTecnicaModal(null)}
        />
      )}
    </>
  );
};

export default ModuloCard;