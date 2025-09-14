import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  CalendarIcon, 
  Clock
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DIAS_SEMANA } from "@/services/treinos/treinosService.jsx";
import UserPageImageCarousel from "./UserPageImageCarousel";

/**
 * Componente que exibe um cartão de treino na página de perfil de usuário
 * @param {Object} props Propriedades do componente
 * @param {Object} props.treino Dados do treino
 * @returns {JSX.Element} Componente React
 */
const UserPageTreinoCard = ({ treino }) => {
  
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
            <div className="flex items-center flex-wrap gap-2">
              <Badge 
                className="text-xs h-5 px-1.5" 
                variant={treino.tipo === "gi" ? "default" : "secondary"}
              >
                {treino.tipo === "gi" ? "GI" : "NO-GI"}
              </Badge>
              <div className="text-sm font-medium">Aula #{treino.numeroAula}</div>
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
                  {format(new Date(treino.data + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
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
                    <UserPageImageCarousel images={treino.imagens} />
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

export default UserPageTreinoCard;