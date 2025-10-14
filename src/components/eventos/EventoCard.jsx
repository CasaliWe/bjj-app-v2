import { Calendar, MapPin, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Componente para exibir um card de evento
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.evento - Dados do evento
 * @param {string} props.tipoEvento - Tipo do evento ('sou-competidor' ou 'ibjjf')
 * @returns {JSX.Element} Card do evento
 */
const EventoCard = ({ evento, tipoEvento = 'sou-competidor' }) => {
  // Função para abrir link do evento
  const abrirLink = () => {
    let linkParaAbrir = evento.link;
    
    // Se for evento IBJJF e não tiver link específico, usa o link padrão
    if (tipoEvento === 'ibjjf' && !evento.link) {
      linkParaAbrir = 'https://ibjjf.com/events/calendar';
    }
    
    if (linkParaAbrir) {
      window.open(linkParaAbrir, '_blank', 'noopener,noreferrer');
    }
  };

  // Função para tratar erro de imagem
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  // Função para verificar se a imagem é válida e se deve mostrar (apenas para sou-competidor)
  const temImagemValida = tipoEvento === 'sou-competidor' && 
    evento.imagem && 
    evento.imagem !== null && 
    evento.imagem !== 'null' && 
    evento.imagem.trim() !== '';

  // Verifica se deve mostrar a seção de imagem
  const mostrarImagem = tipoEvento === 'sou-competidor';

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-yellow-400 transition-all duration-200 group">
      <CardContent className="p-0">
        <div className={`flex flex-col ${mostrarImagem ? 'sm:flex-row' : ''}`}>
          {/* Imagem do evento - apenas para sou-competidor */}
          {mostrarImagem && (
            <div className="relative w-full sm:w-48 h-auto sm:h-auto bg-gray-700 flex-shrink-0">
              {temImagemValida ? (
                <>
                  <img
                    src={evento.imagem}
                    alt={evento.nome}
                    className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                    onError={handleImageError}
                  />
                  {/* Fallback para quando a imagem falha */}
                  <div 
                    className="hidden w-full h-full items-center justify-center bg-gray-700 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  >
                    <ImageIcon className="h-8 w-8 text-gray-500" />
                  </div>
                </>
              ) : (
                /* Placeholder quando não há imagem */
                <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none">
                  <ImageIcon className="h-8 w-8 text-gray-500" />
                </div>
              )}
              
              {/* Badge do estado */}
              <Badge 
                className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold"
              >
                {evento.estado}
              </Badge>
            </div>
          )}

          {/* Conteúdo do evento */}
          <div className="flex-1 p-4">
            <div className="flex flex-col h-full">
              {/* Badge do estado - para eventos IBJJF (sem imagem) */}
              {!mostrarImagem && (
                <div className="flex justify-end mb-2">
                  <Badge 
                    className="bg-yellow-400 text-black text-xs font-semibold"
                  >
                    {evento.estado}
                  </Badge>
                </div>
              )}

              {/* Nome do evento */}
              <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                {evento.nome}
              </h3>

              {/* Informações do evento */}
              <div className="space-y-2 flex-1">
                {/* Data */}
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                  <span>{evento.data}</span>
                </div>

                {/* Local */}
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="line-clamp-1">{evento.local}</span>
                </div>
              </div>

              {/* Botão de ação */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <Button
                  onClick={abrirLink}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {tipoEvento === 'ibjjf' ? 'Ver calendário IBJJF' : 'Ver evento'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventoCard;