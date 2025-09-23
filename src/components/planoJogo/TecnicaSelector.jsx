import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTecnicas } from "@/hooks/use-tecnicas.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TecnicaSelector({ isOpen, onClose, onSelectTecnica }) {
  const { tecnicas, carregarTecnicas, carregando, posicoesCadastradas } = useTecnicas();
  const [pesquisa, setPesquisa] = useState("");
  const [tecnicasFiltradas, setTecnicasFiltradas] = useState([]);
  const [acaoNome, setAcaoNome] = useState("");
  const [posicaoPesquisa, setPosicaoPesquisa] = useState("");
  const [posicoesFiltradas, setPosicoesFiltradas] = useState([]);

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

  // Filtrar posições baseado na pesquisa
  useEffect(() => {
    const lista = Array.isArray(posicoesCadastradas) ? posicoesCadastradas : [];
    if (!posicaoPesquisa.trim()) {
      setPosicoesFiltradas(lista);
      return;
    }
    const termoLower = posicaoPesquisa.toLowerCase();
    setPosicoesFiltradas(
      lista.filter((pos) => typeof pos === 'string' && pos.toLowerCase().includes(termoLower))
    );
  }, [posicaoPesquisa, posicoesCadastradas]);

  const handleSearch = (e) => {
    setPesquisa(e.target.value);
  };

  const handleSelectTecnica = (tecnica) => {
    onSelectTecnica(tecnica);
  };

  const handleSelectPosicao = (posicao) => {
    if (!posicao) return;
    // Enviar como uma ação com a propriedade posicao para compatibilidade com a API
    onSelectTecnica({ nome: posicao, descricao: "", tipo: "acao", posicao });
  };

  const handleAddAcao = () => {
    const nome = acaoNome.trim();
    if (!nome) return;
    // Dispara no mesmo contrato do onSelectTecnica, mas marcando como ação custom
    onSelectTecnica({ nome, descricao: "", tipo: "acao" });
    setAcaoNome("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="tecnica-selector-desc" className="w-[calc(100%-2rem)] sm:max-w-[640px] max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar Técnica</DialogTitle>
          <p id="tecnica-selector-desc" className="sr-only">Selecione uma técnica, posição ou adicione uma ação manual</p>
        </DialogHeader>

        <Tabs defaultValue="tecnicas" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="tecnicas">Técnicas</TabsTrigger>
            <TabsTrigger value="posicoes">Posições</TabsTrigger>
            <TabsTrigger value="acao">Ação manual</TabsTrigger>
          </TabsList>

          <TabsContent value="tecnicas">
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
              <LoadingSpinner message="Carregando técnicas..." className="py-10" />
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
              <ScrollArea className="h-[300px] sm:h-[400px] w-full overflow-x-hidden pr-2">
                <div className="grid grid-cols-1 gap-3 w-full">
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
          </TabsContent>

          <TabsContent value="acao">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Digite apenas o nome da ação. Ex.: "Viro o quadril e ajusto a pegada"</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex.: Viro o quadril e ajusto a pegada"
                  value={acaoNome}
                  onChange={(e) => setAcaoNome(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddAcao(); }}
                />
                <Button onClick={handleAddAcao} disabled={!acaoNome.trim()}>Adicionar</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posicoes">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar posição..."
                className="pl-8"
                value={posicaoPesquisa}
                onChange={(e) => setPosicaoPesquisa(e.target.value)}
              />
            </div>

            {Array.isArray(posicoesCadastradas) && posicoesCadastradas.length === 0 && !carregando ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-muted-foreground mb-2">Você ainda não cadastrou posições.</p>
                <p className="text-xs text-muted-foreground">Vá para a seção "Técnicas" → aba "Posições" para gerenciar suas posições.</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] sm:h-[400px] w-full overflow-x-hidden pr-2">
                <div className="grid grid-cols-1 gap-2 w-full">
                  {carregando ? (
                    <LoadingSpinner message="Carregando posições..." className="py-10" />
                  ) : posicoesFiltradas.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                      Nenhuma posição encontrada
                    </div>
                  ) : (
                    posicoesFiltradas.map((posicao, idx) => (
                      <Card 
                        key={`${posicao}-${idx}`} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleSelectPosicao(posicao)}
                      >
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">{posicao}</CardTitle>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}