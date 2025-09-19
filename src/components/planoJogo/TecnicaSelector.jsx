import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTecnicas } from "@/hooks/use-tecnicas.js";

export default function TecnicaSelector({ isOpen, onClose, onSelectTecnica }) {
  const { tecnicas, carregarTecnicas, carregando } = useTecnicas();
  const [pesquisa, setPesquisa] = useState("");
  const [tecnicasFiltradas, setTecnicasFiltradas] = useState([]);

  // Carregar técnicas quando o componente montar
  useEffect(() => {
    carregarTecnicas();
  }, [carregarTecnicas]);

  // Filtrar técnicas baseado na pesquisa
  useEffect(() => {
    if (!tecnicas) return;
    
    if (!pesquisa.trim()) {
      setTecnicasFiltradas(tecnicas);
      return;
    }
    
    const termoLower = pesquisa.toLowerCase();
    const filtradas = tecnicas.filter(tecnica => 
      tecnica.nome.toLowerCase().includes(termoLower) ||
      (tecnica.descricao && tecnica.descricao.toLowerCase().includes(termoLower)) ||
      (tecnica.categoria && tecnica.categoria.toLowerCase().includes(termoLower)) ||
      (tecnica.posicao && tecnica.posicao.toLowerCase().includes(termoLower))
    );
    
    setTecnicasFiltradas(filtradas);
  }, [pesquisa, tecnicas]);

  const handleSearch = (e) => {
    setPesquisa(e.target.value);
  };

  const handleSelectTecnica = (tecnica) => {
    onSelectTecnica(tecnica);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Técnica</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar técnica..."
            className="pl-8"
            value={pesquisa}
            onChange={handleSearch}
          />
        </div>

        {carregando ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tecnicasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-muted-foreground mb-4">
              {pesquisa 
                ? "Nenhuma técnica encontrada para sua pesquisa" 
                : "Você ainda não possui técnicas cadastradas"}
            </p>
            <p className="text-xs text-muted-foreground">
              Vá para a seção "Técnicas" para adicionar suas primeiras técnicas
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] sm:h-[400px] w-full pr-4">
            <div className="grid grid-cols-1 gap-3">
              {tecnicasFiltradas.map((tecnica) => (
                <Card 
                  key={tecnica.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectTecnica(tecnica)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{tecnica.nome}</CardTitle>
                    {tecnica.posicao && (
                      <CardDescription className="text-xs flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {tecnica.posicao}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  {tecnica.descricao && (
                    <CardContent className="py-2">
                      <p className="text-sm line-clamp-2">{tecnica.descricao}</p>
                    </CardContent>
                  )}
                  
                  <CardFooter className="pt-0 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {tecnica.categoria && (
                        <Badge variant="outline" className="text-xs">
                          {tecnica.categoria}
                        </Badge>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}