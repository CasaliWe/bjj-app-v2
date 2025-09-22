import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Star, 
  Trash2, 
  PencilLine, 
  MoreVertical, 
  Youtube,
  Instagram,
  ExternalLink,
  Heart,
  Globe
} from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router-dom";

/**
 * Componente de Card de Técnica - exibe os detalhes de uma técnica individual
 * 
 * @param {Object} props
 * @param {Object} props.tecnica - Dados da técnica
 * @param {Function} props.onEdit - Função para editar a técnica
 * @param {Function} props.onDelete - Função para excluir a técnica
 * @param {Function} props.onToggleDestaque - Função para alternar destaque
 * @param {boolean} props.showAutor - Se deve mostrar informações do autor (para técnicas da comunidade)
 * @param {Function} props.onShare - Função para alternar visibilidade pública/privada
 */
const TecnicaCard = ({ 
  tecnica, 
  onEdit, 
  onDelete, 
  onToggleDestaque,
  showAutor = false,
  onShare
}) => {
  const navigate = useNavigate();
  
  return (
    <Card key={tecnica.id} className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2 pt-3 px-4">
        {/* Autor no topo (se aplicável) */}
        {showAutor && tecnica.autor && (
          <div 
            className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.href = `/usuario?bjj_id=${tecnica.autor.bjj_id}`}
            title="Ver perfil do usuário"
          >
            <div className="h-6 w-6 rounded-full bg-bjj-gold/10 flex items-center justify-center overflow-hidden">
              {tecnica.autor.imagem ? (
                <img 
                  src={tecnica.autor.tipo_acesso === 'Google' ? tecnica.autor.imagem : tecnica.autor.imagem.startsWith('http') ? tecnica.autor.imagem : `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${tecnica.autor.imagem}`} 
                  alt={tecnica.autor.nome}
                  className="h-full w-full rounded-full object-cover"
                  {...(tecnica.autor.tipo_acesso === 'Google' && {
                      referrerPolicy: "no-referrer",
                      crossOrigin: "anonymous"
                  })}
                  onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = parent.querySelector('.author-fallback');
                      if (fallback) {
                          fallback.style.display = 'flex';
                      }
                  }}
                />
              ) : null}
              <div 
                className={`author-fallback w-full h-full bg-bjj-gold/10 rounded-full flex items-center justify-center text-bjj-gold text-xs font-bold ${tecnica.autor.imagem ? 'hidden' : ''}`}
                style={{ display: tecnica.autor.imagem ? 'none' : 'flex' }}
              >
                {tecnica.autor.nome ? tecnica.autor.nome.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">{tecnica.autor.nome}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {tecnica.autor.faixa || "Faixa Branca"}
              </Badge>
            </div>
          </div>
        )}
      
        <div className="flex justify-between items-start mb-1">
          {/* Título da técnica */}
          <div className="flex-1 min-w-0">
            <CardTitle className={`${showAutor ? "text-lg" : "text-base"} leading-tight truncate`}>
              {tecnica.nome}
            </CardTitle>
          </div>
          
          {/* Menu de opções - apenas para técnicas do usuário */}
          {!showAutor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(tecnica)}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleDestaque(tecnica.id)}>
                  <Heart className="mr-2 h-4 w-4" />
                  {tecnica.destacado ? "Remover destaque" : "Destacar"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(tecnica.id)}>
                  <Globe className="mr-2 h-4 w-4" />
                  {tecnica.publica ? "Tornar privada" : "Tornar pública"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(tecnica.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Categoria e posição */}
        <div className="flex items-center justify-between mt-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={tecnica.categoria === "guardeiro" ? "secondary" : "default"} className="text-xs px-2 py-0.5 h-5">
              {tecnica.categoria === "guardeiro" ? "Guardeiro" : "Passador"}
            </Badge>
            <span className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[150px]">
              {tecnica.posicao}
            </span>
          </div>
        </div>
        
        {/* Avaliação e links de vídeo */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="mr-1 text-xs text-muted-foreground">Avaliação:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <Star
                  key={estrela}
                  className={`h-3 w-3 ${
                    estrela <= tecnica.nota
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          
          {tecnica.video && (
            <div className="flex items-center">
              <span className="mr-1 text-xs text-muted-foreground">Vídeo:</span>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-6 w-6 p-0 rounded-full"
              >
                <a 
                  href={tecnica.video} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {tecnica.video.includes("youtube") ? (
                    <Youtube className="h-4 w-4 text-red-500" />
                  ) : tecnica.video.includes("instagram") ? (
                    <Instagram className="h-4 w-4 text-purple-500" />
                  ) : (
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  )}
                </a>
              </Button>
            </div>
          )}
        </div>
        
        {/* Status de destaque e visibilidade - apenas para técnicas do usuário */}
        {!showAutor && (tecnica.destacado || tecnica.publica) && (
          <div className="flex items-center gap-3 mt-1.5 mb-0.5">
            {tecnica.destacado && (
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                <span className="text-xs text-muted-foreground">Destacado</span>
              </div>
            )}
            {tecnica.publica && (
              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs text-muted-foreground">Público</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-0 pb-0 pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detalhes" className="border-b-0">
            <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
              Ver detalhes
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-4">
                {/* Vídeo curto (se disponível) */}
                {tecnica.video_url && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 border-b pb-1">Vídeo:</h4>
                    <VideoPlayer 
                      src={tecnica.video_url} 
                      posterSrc={tecnica.video_poster}
                      className="mb-3 w-full"
                      loop={true}
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-sm mb-2 border-b pb-1">Passo a passo:</h4>
                  <ol className="pl-5 list-decimal">
                    {tecnica.passos.map((passo, index) => (
                      <li key={index} className="text-sm mb-2">{passo}</li>
                    ))}
                  </ol>
                </div>
                
                {tecnica.observacoes && tecnica.observacoes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 border-b pb-1">Observações:</h4>
                    <ul className="pl-5 list-disc">
                      {tecnica.observacoes.map((obs, index) => (
                        <li key={index} className="text-sm mb-2">{obs}</li>
                      ))}
                    </ul>
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

export default TecnicaCard;
