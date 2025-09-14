import { 
  Card, 
  CardContent, 
  CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Star, 
  Youtube,
  Instagram,
  ExternalLink,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserPageVideoPlayer from "./UserPageVideoPlayer";

/**
 * Componente de Card de Técnica otimizado para visualização em perfil de usuário
 * 
 * @param {Object} props
 * @param {Object} props.tecnica - Dados da técnica
 */
const UserPageTecnicaCard = ({ tecnica }) => {
  // Função para verificar se a técnica tem vídeo
  const hasVideo = () => {
    return tecnica.video_url || tecnica.videoUrl;
  };

  // Função para obter a URL do poster
  const getPosterUrl = () => {
    return tecnica.video_poster || tecnica.videoPoster;
  };

  // Função para obter a URL do vídeo
  const getVideoUrl = () => {
    return tecnica.video_url || tecnica.videoUrl;
  };

  // Função para renderizar ícone de link externo para o vídeo
  const renderVideoIcon = () => {
    if (!tecnica.video) return null;
    
    if (tecnica.video.includes("youtube")) {
      return <Youtube className="h-4 w-4 text-red-500" />;
    } else if (tecnica.video.includes("instagram")) {
      return <Instagram className="h-4 w-4 text-purple-500" />;
    } else {
      return <ExternalLink className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 pt-4 px-4">
        {/* Título e dificuldade */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-tight mb-1">{tecnica.nome}</h3>
            
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <Badge variant={tecnica.categoria === "guardeiro" ? "secondary" : "default"} className="text-xs px-2 py-0.5 h-5">
                {tecnica.categoria === "guardeiro" ? "Guardeiro" : "Passador"}
              </Badge>
              
              <span className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[150px]">
                {tecnica.posicao}
              </span>
            </div>
          </div>
          
          {/* Avaliação com estrelas */}
          <div className="flex bg-muted/40 p-1 px-2 rounded-md">
            {[1, 2, 3, 4, 5].map((estrela) => (
              <Star
                key={estrela}
                className={`h-4 w-4 ${
                  estrela <= tecnica.nota
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Miniatura de vídeo (se disponível) */}
        {hasVideo() && (
          <div className="mt-3 rounded-md overflow-hidden">
            <UserPageVideoPlayer 
              src={getVideoUrl()} 
              posterSrc={getPosterUrl()}
              className="w-full max-h-[180px]"
              loop={true}
            />
          </div>
        )}
        
        {/* Link para vídeo externo (se disponível) */}
        {tecnica.video && (
          <div className="flex items-center mt-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-3 text-xs"
            >
              <a 
                href={tecnica.video} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                {renderVideoIcon()}
                <span>Ver vídeo completo</span>
              </a>
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-0 pb-0 pt-0 flex-grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detalhes" className="border-b-0">
            <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
              Ver passo a passo
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-4">
                {/* Passos da técnica */}
                <div>
                  <h4 className="font-medium text-sm mb-2 border-b pb-1 flex items-center gap-1.5">
                    <BarChart className="h-4 w-4 text-primary" />
                    Passo a passo:
                  </h4>
                  <ol className="pl-5 list-decimal">
                    {Array.isArray(tecnica.passos) && tecnica.passos.map((passo, index) => (
                      <li key={index} className="text-sm mb-2">{passo}</li>
                    ))}
                  </ol>
                </div>
                
                {/* Observações (se disponíveis) */}
                {tecnica.observacoes && Array.isArray(tecnica.observacoes) && tecnica.observacoes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 border-b pb-1">Observações:</h4>
                    <ul className="pl-5 list-disc">
                      {tecnica.observacoes.map((obs, index) => (
                        <li key={index} className="text-sm mb-2">{obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Observações como string (compatibilidade) */}
                {tecnica.observacoes && typeof tecnica.observacoes === 'string' && tecnica.observacoes.trim() !== '' && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 border-b pb-1">Observações:</h4>
                    <p className="text-sm whitespace-pre-line">{tecnica.observacoes}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default UserPageTecnicaCard;