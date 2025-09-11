import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  CalendarIcon, 
  Clock, 
  MoreVertical, 
  PencilLine, 
  Trash2,
  Share2,
  Lock
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DIAS_SEMANA } from "@/services/treinos/treinosService.jsx";
import ImageCarousel from "./ImageCarousel";

/**
 * Componente que exibe um cartão de treino
 * @param {Object} props Propriedades do componente
 * @param {Object} props.treino Dados do treino
 * @param {Function} props.onEditar Função chamada ao editar
 * @param {Function} props.onExcluir Função chamada ao excluir
 * @param {Function} props.onAlterarVisibilidade Função chamada ao alterar visibilidade
 * @param {boolean} props.isComunidade Flag indicando se está na visualização da comunidade
 * @returns {JSX.Element} Componente React
 */
const TreinoCard = ({ treino, onEditar, onExcluir, onAlterarVisibilidade, isComunidade = false }) => {
  const navigate = useNavigate();
  
  // Função para obter o label do dia da semana
  const getDiaSemanaLabel = (value) => {
    if (value === "quinta") return "Quinta-feira";
    return DIAS_SEMANA.find(d => d.value === value)?.label.split('-')[0] || value;
  };

  // Função para obter as iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return "U";
    return nome.split(" ").map(n => n.charAt(0)).join("").slice(0, 2).toUpperCase();
  };
  
  // Formatar nome da faixa com inicial maiúscula
  const formatarFaixa = (faixa) => {
    if (!faixa) return "Branca";
    
    const faixasValidas = {
      "branca": "Branca",
      "azul": "Azul",
      "roxa": "Roxa",
      "marrom": "Marrom",
      "preta": "Preta"
    };
    
    return faixasValidas[faixa.toLowerCase()] || "Branca";
  };
  
  // Cores das faixas
  const getBeltColor = (faixa) => {
    switch(faixa?.toLowerCase()) {
      case "branca": return "bg-white text-black border border-gray-200";
      case "azul": return "bg-blue-500 text-white";
      case "roxa": return "bg-purple-700 text-white";
      case "marrom": return "bg-amber-800 text-white";
      case "preta": return "bg-black text-white";
      default: return "bg-white text-black border border-gray-200";
    }
  };
  
  return (
    <Card key={treino.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isComunidade && treino.usuario && (
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-50 transition-opacity"
                onClick={() => navigate(`/usuario?bjj_id=${treino.usuario.bjj_id}`)}
                title="Ver perfil do usuário"
              >
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src={treino.usuario.imagem} alt={treino.usuario.nome} />
                  <AvatarFallback>{getIniciais(treino.usuario.nome)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm truncate max-w-[160px] md:max-w-none">{treino.usuario.nome}</div>
                  <Badge className={`text-xs ${getBeltColor(treino.usuario.faixa)}`}>
                    {formatarFaixa(treino.usuario.faixa)}
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="flex items-center flex-wrap gap-2">
              <Badge 
                className="text-xs h-5 px-1.5" 
                variant={treino.tipo === "gi" ? "default" : "secondary"}
              >
                {treino.tipo === "gi" ? "GI" : "NO-GI"}
              </Badge>
              <div className="text-sm font-medium">Aula #{treino.numeroAula}</div>
              {treino.isPublico !== undefined && !isComunidade && (
                <Badge variant={treino.isPublico ? "outline" : "secondary"} className="text-xs h-5">
                  {treino.isPublico ? (
                    <Share2 className="h-3 w-3 mr-1" />
                  ) : (
                    <Lock className="h-3 w-3 mr-1" />
                  )}
                  <span className="hidden xs:inline">{treino.isPublico ? "Público" : "Privado"}</span>
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap mt-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{getDiaSemanaLabel(treino.diaSemana)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{treino.horario}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>
                  {format(new Date(treino.data), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
          {!isComunidade && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditar(treino)}>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  {onAlterarVisibilidade && (
                    <DropdownMenuItem 
                      onClick={() => onAlterarVisibilidade(treino.id, !treino.isPublico)}
                    >
                      {treino.isPublico ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Tornar privado
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-2 h-4 w-4" />
                          Tornar público
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onExcluir(treino.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detalhes" className="border-b-0">
            <AccordionTrigger className="px-4 py-1.5 text-xs hover:no-underline">
              Ver detalhes
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-4">
                {treino.imagens && treino.imagens.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Fotos:</h4>
                    <ImageCarousel images={treino.imagens} />
                  </div>
                )}
                
                {treino.observacoes && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Observações:</h4>
                    <p className="text-sm whitespace-pre-line">{treino.observacoes}</p>
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

export default TreinoCard;
