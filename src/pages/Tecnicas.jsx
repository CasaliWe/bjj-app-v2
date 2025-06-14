import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book, 
  Filter, 
  Plus, 
  Star, 
  Trash2, 
  PencilLine, 
  MoreVertical, 
  Youtube,
  Instagram,
  ExternalLink,
  Heart,
} from "lucide-react";

// Dados fictícios simulando os dados que virão da API
const MOCK_TECNICAS = [
  {
    id: 1,
    nome: "Armlock da Guarda",
    categoria: "guardeiro",
    posicao: "Guarda Fechada",
    passos: [
      "Segure a manga e o punho do oponente",
      "Abra a guarda e posicione a perna sobre o peito",
      "Posicione o outro pé no quadril do oponente",
      "Puxe o braço do oponente para o seu peito",
      "Estenda as pernas e arqueia o quadril para finalizar"
    ],
    observacoes: [
      "Mantenha os joelhos unidos para maior força",
      "O cotovelo do oponente deve estar alinhado com seu peito"
    ],
    nota: 5,
    video: "https://www.youtube.com/watch?v=example1",
    destacado: true
  },
  {
    id: 2,
    nome: "Estrangulamento Triângulo",
    categoria: "guardeiro",
    posicao: "Guarda Aberta",
    passos: [
      "Controle um braço do oponente e puxe-o para baixo",
      "Posicione uma perna atrás do pescoço do oponente",
      "A outra perna forma um triângulo cruzando sobre a primeira",
      "Puxe a cabeça do oponente para baixo para apertar",
      "Estenda os quadris para aumentar a pressão"
    ],
    observacoes: [
      "Ajuste o ângulo para melhor pressão",
      "Corte o ângulo para o lado oposto do braço preso"
    ],
    nota: 4,
    video: "https://www.instagram.com/p/example2/",
    destacado: true
  },
  {
    id: 3,
    nome: "Passagem de Guarda 100kg",
    categoria: "passador",
    posicao: "100kg",
    passos: [
      "Posicione-se ao lado do oponente com o joelho próximo à axila",
      "Distribua seu peso sobre o peito do oponente",
      "Mantenha o braço mais próximo da cabeça do oponente controlado",
      "Use o braço livre para controlar os quadris",
      "Deslize o joelho sobre o abdômen para estabilizar a posição"
    ],
    observacoes: [
      "Mantenha pressão constante",
      "Não deixe espaço para o oponente escapar ou inserir a guarda"
    ],
    nota: 5,
    video: null,
    destacado: false
  },
  {
    id: 4,
    nome: "Americana",
    categoria: "passador",
    posicao: "Montada",
    passos: [
      "Posicione-se na montada ou 100kg",
      "Capture o braço do oponente no solo",
      "Coloque sua mão sob o pulso do oponente",
      "Com a outra mão, pegue seu próprio pulso formando um 'L'",
      "Rotacione o cotovelo do oponente para fora, mantendo-o no solo"
    ],
    observacoes: [
      "Mantenha o cotovelo do oponente no solo",
      "Use o peso do corpo, não apenas a força dos braços"
    ],
    nota: 3,
    video: "https://www.youtube.com/watch?v=example4",
    destacado: false
  },
  {
    id: 5,
    nome: "Kimura da Guarda",
    categoria: "guardeiro",
    posicao: "Meia Guarda",
    passos: [
      "Da posição de guarda, segure o pulso do oponente",
      "Passe seu braço por baixo do braço do oponente",
      "Segure seu próprio pulso formando um 'figure four'",
      "Controle o corpo do oponente com as pernas",
      "Rotacione o braço para trás para finalizar"
    ],
    observacoes: [
      "Mantenha o controle do oponente com as pernas",
      "Pode-se usar a transição para outras posições como omoplata"
    ],
    nota: 4,
    video: "https://www.instagram.com/p/example5/",
    destacado: false
  }
];

const MOCK_POSICOES = [
  "Guarda Fechada",
  "Guarda Aberta",
  "Meia Guarda",
  "100kg",
  "Montada",
  "Costas",
  "Quatro Apoios",
  "Raspagem"
];

const Tecnicas = () => {  const [tecnicas, setTecnicas] = useState(MOCK_TECNICAS);
  const [posicoesCadastradas, setPosicoesCadastradas] = useState(MOCK_POSICOES);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroPosicao, setFiltroPosicao] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDestaques, setModalDestaques] = useState(false);
  const [editandoTecnica, setEditandoTecnica] = useState(null);
  const [novaTecnica, setNovaTecnica] = useState({
    nome: "",
    categoria: "",
    posicao: "",
    novaPosicao: "",
    passos: [""],
    observacoes: [""],
    nota: 3,
    video: "",
    destacado: false
  });

  // Função para adicionar novo passo ou observação
  const adicionarItem = (tipo) => {
    if (tipo === "passo") {
      setNovaTecnica({
        ...novaTecnica,
        passos: [...novaTecnica.passos, ""]
      });
    } else {
      setNovaTecnica({
        ...novaTecnica,
        observacoes: [...novaTecnica.observacoes, ""]
      });
    }
  };

  // Função para atualizar passo ou observação
  const atualizarItem = (tipo, indice, valor) => {
    if (tipo === "passo") {
      const novosPassos = [...novaTecnica.passos];
      novosPassos[indice] = valor;
      setNovaTecnica({ ...novaTecnica, passos: novosPassos });
    } else {
      const novasObservacoes = [...novaTecnica.observacoes];
      novasObservacoes[indice] = valor;
      setNovaTecnica({ ...novaTecnica, observacoes: novasObservacoes });
    }
  };

  // Função para remover passo ou observação
  const removerItem = (tipo, indice) => {
    if (tipo === "passo") {
      const novosPassos = novaTecnica.passos.filter((_, i) => i !== indice);
      setNovaTecnica({ ...novaTecnica, passos: novosPassos });
    } else {
      const novasObservacoes = novaTecnica.observacoes.filter((_, i) => i !== indice);
      setNovaTecnica({ ...novaTecnica, observacoes: novasObservacoes });
    }
  };

  // Função para salvar técnica (nova ou editada)
  const salvarTecnica = () => {
    // Verificar se é uma nova posição
    if (novaTecnica.novaPosicao && !posicoesCadastradas.includes(novaTecnica.novaPosicao)) {
      setPosicoesCadastradas([...posicoesCadastradas, novaTecnica.novaPosicao]);
      novaTecnica.posicao = novaTecnica.novaPosicao;
    }

    // Remover campos vazios
    const passosLimpos = novaTecnica.passos.filter(passo => passo.trim() !== "");
    const observacoesLimpas = novaTecnica.observacoes.filter(obs => obs.trim() !== "");

    const tecnicaFinal = {
      ...novaTecnica,
      passos: passosLimpos,
      observacoes: observacoesLimpas,
      id: editandoTecnica ? editandoTecnica.id : tecnicas.length + 1
    };

    delete tecnicaFinal.novaPosicao;

    if (editandoTecnica) {
      // Atualizar técnica existente
      setTecnicas(tecnicas.map(t => t.id === tecnicaFinal.id ? tecnicaFinal : t));
    } else {
      // Adicionar nova técnica
      setTecnicas([...tecnicas, tecnicaFinal]);
    }

    // Reset do formulário e fechamento do modal
    setNovaTecnica({
      nome: "",
      categoria: "",
      posicao: "",
      novaPosicao: "",
      passos: [""],
      observacoes: [""],
      nota: 3,
      video: "",
      destacado: false
    });
    setModalAberto(false);
    setEditandoTecnica(null);
  };

  // Função para editar técnica
  const editarTecnica = (tecnica) => {
    setEditandoTecnica(tecnica);
    setNovaTecnica({
      ...tecnica,
      novaPosicao: ""
    });
    setModalAberto(true);
  };

  // Função para excluir técnica
  const excluirTecnica = (id) => {
    setTecnicas(tecnicas.filter(t => t.id !== id));
  };

  // Função para destacar/remover destaque da técnica
  const toggleDestaque = (id) => {
    setTecnicas(
      tecnicas.map(t => 
        t.id === id ? { ...t, destacado: !t.destacado } : t
      )
    );
  };
  // Técnicas filtradas de acordo com os filtros selecionados
  const tecnicasFiltradas = tecnicas.filter(tecnica => {
    const matchCategoria = !filtroCategoria || filtroCategoria === "todas" || tecnica.categoria === filtroCategoria;
    const matchPosicao = !filtroPosicao || filtroPosicao === "todas" || tecnica.posicao === filtroPosicao;
    return matchCategoria && matchPosicao;
  });

  // Técnicas destacadas
  const tecnicasDestacadas = tecnicas.filter(t => t.destacado);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Técnicas</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setModalDestaques(true)}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                <Heart className="mr-2 h-4 w-4" />
                Destaques ({tecnicasDestacadas.length})
              </Button>
              <Button
                onClick={() => {
                  setEditandoTecnica(null);
                  setNovaTecnica({
                    nome: "",
                    categoria: "",
                    posicao: "",
                    novaPosicao: "",
                    passos: [""],
                    observacoes: [""],
                    nota: 3,
                    video: "",
                    destacado: false
                  });
                  setModalAberto(true);
                }}
                size="sm"
                className="hidden md:flex"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Técnica
              </Button>
            </div>
          </header>

          <MobileNav />
            <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            <div className="mb-6 space-y-4"><div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold hidden md:block">Biblioteca de Técnicas</h2>
                <div className="flex gap-2 md:hidden w-full">
                  <Button
                    onClick={() => {
                      setEditandoTecnica(null);
                      setNovaTecnica({
                        nome: "",
                        categoria: "",
                        posicao: "",
                        novaPosicao: "",
                        passos: [""],
                        observacoes: [""],
                        nota: 3,
                        video: "",
                        destacado: false
                      });
                      setModalAberto(true);
                    }}
                    className="flex-1"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Técnica
                  </Button>
                  
                  <Button
                    onClick={() => setModalDestaques(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Destaques ({tecnicasDestacadas.length})
                  </Button>
                </div>
              </div>

              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    Filtrar Técnicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select 
                      value={filtroCategoria} 
                      onValueChange={setFiltroCategoria}
                    >                      <SelectTrigger id="categoria">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="guardeiro">Guardeiro</SelectItem>
                        <SelectItem value="passador">Passador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="posicao">Posição</Label>
                    <Select 
                      value={filtroPosicao} 
                      onValueChange={setFiltroPosicao}
                      disabled={!filtroCategoria}
                    >                      <SelectTrigger id="posicao">
                        <SelectValue placeholder="Todas as posições" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        {posicoesCadastradas.map((posicao, idx) => (
                          <SelectItem key={idx} value={posicao}>
                            {posicao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Contador de resultados */}              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  {tecnicasFiltradas.length} técnicas encontradas
                </p>                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFiltroCategoria("todas");
                    setFiltroPosicao("todas");
                  }}
                  className={(filtroCategoria === "todas" || !filtroCategoria) && 
                             (filtroPosicao === "todas" || !filtroPosicao) ? "hidden" : ""}
                >
                  Limpar filtros
                </Button>
              </div>              {/* Lista de Técnicas */}
              {tecnicasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tecnicasFiltradas.map((tecnica) => (
                    <Card key={tecnica.id} className="flex flex-col h-full overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg flex-grow">{tecnica.nome}</CardTitle>
                              {tecnica.destacado && (
                                <Heart className="h-5 w-5 text-red-500 fill-red-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <Badge variant={tecnica.categoria === "guardeiro" ? "secondary" : "default"}>
                                {tecnica.categoria === "guardeiro" ? "Guardeiro" : "Passador"}
                              </Badge>
                              <span>• {tecnica.posicao}</span>
                            </div>
                          </div>
                          <div className="flex items-center ml-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => editarTecnica(tecnica)}>
                                  <PencilLine className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleDestaque(tecnica.id)}>
                                  <Heart className="mr-2 h-4 w-4" />
                                  {tecnica.destacado ? "Remover destaque" : "Destacar"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => excluirTecnica(tecnica.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Avaliação e links de vídeo */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs text-muted-foreground">Avaliação:</span>
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
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Vídeo:</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-6 w-6 rounded-full"
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
                      </CardHeader>                      <CardContent className="px-0 pb-0">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="detalhes" className="border-b-0">
                            <AccordionTrigger className="px-6 py-2 text-sm hover:no-underline">
                              Ver detalhes
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="px-6 pb-4 space-y-3 max-h-60 overflow-y-auto">
                                <div>
                                  <h4 className="font-medium text-sm mb-1">Passo a passo:</h4>
                                  <ol className="pl-5 list-decimal">
                                    {tecnica.passos.map((passo, index) => (
                                      <li key={index} className="text-sm">{passo}</li>
                                    ))}
                                  </ol>
                                </div>
                                
                                {tecnica.observacoes.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm mb-1">Observações:</h4>
                                    <ul className="pl-5 list-disc">
                                      {tecnica.observacoes.map((obs, index) => (
                                        <li key={index} className="text-sm">{obs}</li>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Book className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Nenhuma técnica encontrada</h3>
                  <p className="text-muted-foreground">
                    {filtroCategoria || filtroPosicao
                      ? "Tente mudar os filtros ou"
                      : "Comece"}{" "}
                    adicionando uma nova técnica.
                  </p>
                  <Button className="mt-4" onClick={() => setModalAberto(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Técnica
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de adição/edição de técnica */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-[90%] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editandoTecnica ? "Editar Técnica" : "Nova Técnica"}</DialogTitle>
            <DialogDescription>
              {editandoTecnica
                ? "Edite os detalhes da técnica selecionada."
                : "Adicione uma nova técnica à sua biblioteca."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Categoria */}
            <div className="grid gap-2">
              <Label htmlFor="categoria-tecnica">Categoria</Label>
              <Select
                value={novaTecnica.categoria}
                onValueChange={(value) => setNovaTecnica({ ...novaTecnica, categoria: value })}
                required
              >
                <SelectTrigger id="categoria-tecnica">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guardeiro">Guardeiro</SelectItem>
                  <SelectItem value="passador">Passador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Posição */}
            <div className="grid gap-2">
              <Label htmlFor="posicao-tecnica">Posição</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Select
                  value={novaTecnica.posicao}
                  onValueChange={(value) => setNovaTecnica({ ...novaTecnica, posicao: value })}
                >
                  <SelectTrigger id="posicao-tecnica">
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {posicoesCadastradas.map((posicao, idx) => (
                      <SelectItem key={idx} value={posicao}>
                        {posicao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">ou</span>
                  <Input
                    placeholder="Digite nova posição"
                    value={novaTecnica.novaPosicao}
                    onChange={(e) =>
                      setNovaTecnica({ ...novaTecnica, novaPosicao: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            
            {/* Nome da Finalização */}
            <div className="grid gap-2">
              <Label htmlFor="nome-tecnica">Nome da Finalização</Label>
              <Input
                id="nome-tecnica"
                placeholder="Ex: Armlock da Guarda"
                value={novaTecnica.nome}
                onChange={(e) => setNovaTecnica({ ...novaTecnica, nome: e.target.value })}
                required
              />
            </div>
            
            {/* Passo a Passo */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Passo a Passo</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adicionarItem("passo")}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Passo
                </Button>
              </div>
              <div className="space-y-2">
                {novaTecnica.passos.map((passo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-10">#{index + 1}</span>
                    <Input
                      placeholder={`Passo ${index + 1}`}
                      value={passo}
                      onChange={(e) => atualizarItem("passo", index, e.target.value)}
                    />
                    {novaTecnica.passos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removerItem("passo", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Observações */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Observações</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adicionarItem("observacao")}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Observação
                </Button>
              </div>
              <div className="space-y-2">
                {novaTecnica.observacoes.map((obs, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-10">•</span>
                    <Input
                      placeholder="Observação"
                      value={obs}
                      onChange={(e) => atualizarItem("observacao", index, e.target.value)}
                    />
                    {novaTecnica.observacoes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removerItem("observacao", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Nota */}
            <div className="grid gap-2">
              <Label>Nota (1-5)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <Button
                    key={estrela}
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setNovaTecnica({ ...novaTecnica, nota: estrela })}
                    className={`rounded-full ${
                      estrela <= novaTecnica.nota ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        estrela <= novaTecnica.nota ? "fill-yellow-500" : ""
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Link do Vídeo */}
            <div className="grid gap-2">
              <Label htmlFor="video-url">Link do Vídeo (Opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="video-url"
                  placeholder="URL do YouTube ou Instagram"
                  value={novaTecnica.video || ""}
                  onChange={(e) => setNovaTecnica({ ...novaTecnica, video: e.target.value })}
                />
                <div className="flex gap-1">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <Instagram className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            {/* Destacar */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="destacar"
                className="h-4 w-4"
                checked={novaTecnica.destacado}
                onChange={(e) =>
                  setNovaTecnica({ ...novaTecnica, destacado: e.target.checked })
                }
              />
              <Label htmlFor="destacar" className="text-sm">
                Destacar esta técnica
              </Label>
            </div>
          </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" onClick={salvarTecnica}>
              {editandoTecnica ? "Salvar alterações" : "Adicionar técnica"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de técnicas destacadas */}
      <Dialog open={modalDestaques} onOpenChange={setModalDestaques}>
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
              <div className="space-y-4">                {tecnicasDestacadas.map((tecnica) => (
                  <Card key={tecnica.id}>                    <CardHeader className="py-3 pb-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <CardTitle className="text-base flex-1 sm:flex-initial">{tecnica.nome}</CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="sm:hidden h-7 w-7 p-0"
                              onClick={() => toggleDestaque(tecnica.id)}
                            >
                              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            </Button>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                            <Badge variant={tecnica.categoria === "guardeiro" ? "secondary" : "default"}>
                              {tecnica.categoria === "guardeiro" ? "Guardeiro" : "Passador"}
                            </Badge>
                            <span className="whitespace-nowrap">• {tecnica.posicao}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleDestaque(tecnica.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          </Button>
                        </div>
                        <div className="flex sm:hidden items-center mt-1">
                          <span className="text-xs text-muted-foreground mr-1">Avaliação:</span>
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
                      </div>
                        {/* Informações de vídeo, se houver */}
                      {tecnica.video && (
                        <div className="mt-2 flex justify-start sm:justify-end">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Vídeo:</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-6 w-6 rounded-full"
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
                        </div>
                      )}
                    </CardHeader>
                      <CardContent className="px-0 pt-0 pb-3">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="detalhes" className="border-b-0">
                          <AccordionTrigger className="px-4 sm:px-6 py-2 text-sm hover:no-underline">
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
                              
                              {tecnica.observacoes.length > 0 && (
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
          </ScrollArea>          <DialogFooter className="mt-4 sm:mt-6 pb-2">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setModalDestaques(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Tecnicas;
