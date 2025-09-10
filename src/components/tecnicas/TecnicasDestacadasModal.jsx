import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Star, Youtube, Instagram, ExternalLink } from "lucide-react";

/**
 * Componente de modal para exibir técnicas destacadas
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Array} props.tecnicasDestacadas - Lista de técnicas destacadas
 * @param {Function} props.onRemoveDestaque - Função para remover destaque de uma técnica
 */
const TecnicasDestacadasModal = ({ 
  isOpen, 
  onClose, 
  tecnicasDestacadas,
  onRemoveDestaque
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] w-full md:max-w-[700px] max-h-[90vh] overflow-hidden p-4 pt-6">
        <DialogHeader>
          <DialogTitle>Técnicas Destacadas</DialogTitle>
          <DialogDescription>
            {tecnicasDestacadas.length > 0
              ? "Suas técnicas favoritas em um só lugar."
              : "Você ainda não destacou nenhuma técnica."}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] py-1">
          {tecnicasDestacadas.length > 0 ? (
            <div className="space-y-4">
              {tecnicasDestacadas.map((tecnica) => (
                <Card key={tecnica.id}>
                  <CardHeader className="py-3 pb-1">
                    {/* Nome da técnica e coração */}
                    <div className="flex justify-between items-center mb-2">
                      <CardTitle className="text-base truncate pr-2">{tecnica.nome}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => onRemoveDestaque(tecnica.id)}
                      >
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      </Button>
                    </div>
                    
                    {/* Categoria e posição */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={tecnica.categoria === "guardeiro" ? "secondary" : "default"} className="text-xs">
                        {tecnica.categoria === "guardeiro" ? "Guardeiro" : "Passador"}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {tecnica.posicao}
                      </span>
                    </div>
                    
                    {/* Avaliação e vídeo */}
                    <div className="flex items-center justify-between mb-1">
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
                  </CardHeader>
                  <CardContent className="px-0 pt-0 pb-3">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="detalhes" className="border-b-0">
                        <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
                          Ver detalhes
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 sm:px-6 pb-2 space-y-3 max-h-[40vh] sm:max-h-60 overflow-y-auto">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Passo a passo:</h4>
                              <ol className="pl-5 list-decimal">
                                {tecnica.passos.map((passo, index) => (
                                  <li key={index} className="text-sm mb-1">{passo}</li>
                                ))}
                              </ol>
                            </div>
                            
                            {tecnica.observacoes && tecnica.observacoes.length > 0 && (
                              <div className="mt-3">
                                <h4 className="font-medium text-sm mb-1">Observações:</h4>
                                <ul className="pl-5 list-disc">
                                  {tecnica.observacoes.map((obs, index) => (
                                    <li key={index} className="text-sm mb-1">{obs}</li>
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Heart className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Destaque suas técnicas favoritas para acessá-las rapidamente.
              </p>
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="mt-4 sm:mt-6 pb-2">
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TecnicasDestacadasModal;
