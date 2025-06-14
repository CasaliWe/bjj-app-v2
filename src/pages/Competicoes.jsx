import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  Calendar, 
  Plus, 
  Trash2, 
  PencilLine, 
  MoreVertical,
  ImagePlus,
  MapPin,
  Medal,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";

// Componente de Carousel para as imagens da competição
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;
  
  if (images.length === 1) {
    return (
      <div className="relative w-full rounded-lg overflow-hidden aspect-video bg-muted">
        <img 
          src={images[0]} 
          alt="Foto da competição" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden aspect-video bg-muted">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={image} 
            alt={`Foto da competição ${index + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
            onClick={() => setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1"
            onClick={() => setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

// Dados fictícios simulando os dados que virão da API
const MOCK_COMPETICOES = [
  {
    id: 1,
    nomeEvento: "Copa São Paulo de Jiu-Jitsu",
    cidade: "São Paulo, SP",
    data: "2025-05-15",
    modalidade: "gi",
    colocacao: "1º lugar",
    numeroLutas: 4,
    numeroVitorias: 4,
    numeroDerrotas: 0,
    numeroFinalizacoes: 2,
    observacoes: "Consegui finalizar na semifinal com um armlock e na final com um triângulo. Precisei trabalhar muito na passagem de guarda.",
    imagens: [
      "https://images.unsplash.com/photo-1587386331766-10e5749170b9?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1974&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    nomeEvento: "Brasileiro de Jiu-Jitsu",
    cidade: "Rio de Janeiro, RJ",
    data: "2025-04-22",
    modalidade: "nogi",
    colocacao: "3º lugar",
    numeroLutas: 3,
    numeroVitorias: 2,
    numeroDerrotas: 1,
    numeroFinalizacoes: 1,
    observacoes: "Perdi na semifinal para o campeão da categoria por decisão dos árbitros após empate. Consegui uma finalização na primeira luta com heel hook.",
    imagens: [
      "https://images.unsplash.com/photo-1574997316859-33aa1af3570a?q=80&w=1974&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    nomeEvento: "Open Rio",
    cidade: "Rio de Janeiro, RJ",
    data: "2025-02-10",
    modalidade: "gi",
    colocacao: "2º lugar",
    numeroLutas: 3,
    numeroVitorias: 2,
    numeroDerrotas: 1,
    numeroFinalizacoes: 0,
    observacoes: "Competição de alto nível. Ganhei as duas primeiras por pontos, mas perdi a final por vantagens. Preciso trabalhar mais na guarda aberta.",
    imagens: []
  },
  {
    id: 4,
    nomeEvento: "ADCC Trials Brasil",
    cidade: "Belo Horizonte, MG",
    data: "2024-11-05",
    modalidade: "nogi",
    colocacao: "Quartas de final",
    numeroLutas: 2,
    numeroVitorias: 1,
    numeroDerrotas: 1,
    numeroFinalizacoes: 1,
    observacoes: "Competição de altíssimo nível técnico. Consegui uma vitória na primeira luta com um mata-leão, mas perdi nas quartas por pontos para o campeão da categoria.",
    imagens: [
      "https://images.unsplash.com/photo-1519311726-5cced8867358?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556817411-aa9c46fc5bf9?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608138278561-4b1ade407411?q=80&w=1974&auto=format&fit=crop"
    ]
  }
];

// Opções para colocações
const OPCOES_COLOCACAO = [
  { value: "1º lugar", label: "1º lugar" },
  { value: "2º lugar", label: "2º lugar" },
  { value: "3º lugar", label: "3º lugar" },
  { value: "Semifinal", label: "Semifinal" },
  { value: "Quartas de final", label: "Quartas de final" },
  { value: "Oitavas de final", label: "Oitavas de final" },
  { value: "Fase de grupos", label: "Fase de grupos" },
  { value: "Participação", label: "Participação" }
];

const Competicoes = () => {
  const [competicoes, setCompeticoes] = useState(MOCK_COMPETICOES);
  const [filtroModalidade, setFiltroModalidade] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoCompeticao, setEditandoCompeticao] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [novaCompeticao, setNovaCompeticao] = useState({
    nomeEvento: "",
    cidade: "",
    data: format(new Date(), "yyyy-MM-dd"),
    modalidade: "gi",
    colocacao: "Participação",
    numeroLutas: 0,
    numeroVitorias: 0,
    numeroDerrotas: 0,
    numeroFinalizacoes: 0,
    observacoes: "",
    imagens: []
  });

  // Função para adicionar imagem à competição
  const adicionarImagem = () => {
    if (imageUrls.length < 5) {
      const url = prompt("Insira a URL da imagem:");
      if (url && url.trim() !== "") {
        setImageUrls([...imageUrls, url.trim()]);
      }
    } else {
      alert("Máximo de 5 imagens permitido.");
    }
  };

  // Função para remover imagem
  const removerImagem = (index) => {
    const novasImagens = [...imageUrls];
    novasImagens.splice(index, 1);
    setImageUrls(novasImagens);
  };

  // Função para salvar competição (nova ou editada)
  const salvarCompeticao = () => {
    // Validar se o nome do evento foi preenchido
    if (!novaCompeticao.nomeEvento.trim()) {
      alert("Por favor, informe o nome do evento.");
      return;
    }

    // Validar se a cidade foi preenchida
    if (!novaCompeticao.cidade.trim()) {
      alert("Por favor, informe a cidade do evento.");
      return;
    }

    // Preparar a competição com os dados atuais
    const competicaoFinal = {
      ...novaCompeticao,
      imagens: imageUrls,
      id: editandoCompeticao ? editandoCompeticao.id : competicoes.length + 1
    };

    if (editandoCompeticao) {
      // Atualizar competição existente
      setCompeticoes(competicoes.map(c => c.id === competicaoFinal.id ? competicaoFinal : c));
    } else {
      // Adicionar nova competição
      setCompeticoes([...competicoes, competicaoFinal]);
    }

    // Reset do formulário e fechamento do modal
    setNovaCompeticao({
      nomeEvento: "",
      cidade: "",
      data: format(new Date(), "yyyy-MM-dd"),
      modalidade: "gi",
      colocacao: "Participação",
      numeroLutas: 0,
      numeroVitorias: 0,
      numeroDerrotas: 0,
      numeroFinalizacoes: 0,
      observacoes: "",
      imagens: []
    });
    setImageUrls([]);
    setModalAberto(false);
    setEditandoCompeticao(null);
  };

  // Função para editar competição
  const editarCompeticao = (competicao) => {
    setEditandoCompeticao(competicao);
    setNovaCompeticao({
      nomeEvento: competicao.nomeEvento,
      cidade: competicao.cidade,
      data: competicao.data,
      modalidade: competicao.modalidade,
      colocacao: competicao.colocacao,
      numeroLutas: competicao.numeroLutas,
      numeroVitorias: competicao.numeroVitorias,
      numeroDerrotas: competicao.numeroDerrotas,
      numeroFinalizacoes: competicao.numeroFinalizacoes,
      observacoes: competicao.observacoes
    });
    setImageUrls(competicao.imagens || []);
    setModalAberto(true);
  };

  // Função para excluir competição
  const excluirCompeticao = (id) => {
    setCompeticoes(competicoes.filter(c => c.id !== id));
  };

  // Competições filtradas de acordo com o filtro selecionado
  const competicoesFiltradas = competicoes.filter(competicao => {
    return filtroModalidade === "todos" || competicao.modalidade === filtroModalidade;
  });

  // Ordenar competições da mais recente para a mais antiga por data
  const competicoesOrdenadas = [...competicoesFiltradas].sort((a, b) => 
    new Date(b.data) - new Date(a.data)
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Competições</h1>
            </div>
            <Button
              onClick={() => {
                setEditandoCompeticao(null);
                setNovaCompeticao({
                  nomeEvento: "",
                  cidade: "",
                  data: format(new Date(), "yyyy-MM-dd"),
                  modalidade: "gi",
                  colocacao: "Participação",
                  numeroLutas: 0,
                  numeroVitorias: 0,
                  numeroDerrotas: 0,
                  numeroFinalizacoes: 0,
                  observacoes: "",
                  imagens: []
                });
                setImageUrls([]);
                setModalAberto(true);
              }}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Competição
            </Button>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                <h2 className="text-2xl font-bold hidden md:block">Histórico de Competições</h2>
              </div>

              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="modalidade">Modalidade</Label>
                    <Select 
                      value={filtroModalidade} 
                      onValueChange={setFiltroModalidade}
                    >
                      <SelectTrigger id="modalidade">
                        <SelectValue placeholder="Todas as modalidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas</SelectItem>
                        <SelectItem value="gi">Com Kimono (Gi)</SelectItem>
                        <SelectItem value="nogi">Sem Kimono (No-Gi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Contador de resultados */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-muted-foreground">
                  {competicoesOrdenadas.length} competições encontradas
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltroModalidade("todos")}
                  className={filtroModalidade === "todos" ? "hidden" : ""}
                >
                  Limpar filtros
                </Button>
              </div>

              {/* Lista de Competições */}
              {competicoesOrdenadas.length > 0 ? (
                <div className="space-y-4">
                  {competicoesOrdenadas.map((competicao) => (
                    <Card key={competicao.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge 
                                className="text-xs h-5 px-1.5" 
                                variant={competicao.modalidade === "gi" ? "default" : "secondary"}
                              >
                                {competicao.modalidade === "gi" ? "GI" : "NO-GI"}
                              </Badge>
                              <div className="text-sm font-medium">{competicao.nomeEvento}</div>
                            </div>
                            
                            <div className="flex flex-wrap mt-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{competicao.cidade}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>
                                  {format(new Date(competicao.data), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Medal className="h-3.5 w-3.5" />
                                <span>{competicao.colocacao}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => editarCompeticao(competicao)}>
                                  <PencilLine className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => excluirCompeticao(competicao.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  <div className="bg-muted/30 p-2 rounded-md text-center">
                                    <p className="text-xs text-muted-foreground">Lutas</p>
                                    <p className="font-medium">{competicao.numeroLutas}</p>
                                  </div>
                                  <div className="bg-muted/30 p-2 rounded-md text-center">
                                    <p className="text-xs text-muted-foreground">Vitórias</p>
                                    <p className="font-medium text-green-600">{competicao.numeroVitorias}</p>
                                  </div>
                                  <div className="bg-muted/30 p-2 rounded-md text-center">
                                    <p className="text-xs text-muted-foreground">Derrotas</p>
                                    <p className="font-medium text-red-600">{competicao.numeroDerrotas}</p>
                                  </div>
                                  <div className="bg-muted/30 p-2 rounded-md text-center">
                                    <p className="text-xs text-muted-foreground">Finalizações</p>
                                    <p className="font-medium text-blue-600">{competicao.numeroFinalizacoes}</p>
                                  </div>
                                </div>

                                {competicao.imagens && competicao.imagens.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Fotos:</h4>
                                    <ImageCarousel images={competicao.imagens} />
                                  </div>
                                )}
                                
                                {competicao.observacoes && (
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Observações:</h4>
                                    <p className="text-sm whitespace-pre-line">{competicao.observacoes}</p>
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
                  <Calendar className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Nenhuma competição encontrada</h3>
                  <p className="text-muted-foreground">
                    {filtroModalidade !== "todos" 
                      ? "Tente mudar os filtros ou" 
                      : "Comece"}{" "}
                    adicionando uma nova competição.
                  </p>
                  <Button className="mt-4" onClick={() => setModalAberto(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Competição
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de adição/edição de competição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-[95%] w-full md:max-w-[600px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editandoCompeticao ? "Editar Competição" : "Nova Competição"}</DialogTitle>
            <DialogDescription>
              {editandoCompeticao
                ? "Edite os detalhes da competição selecionada."
                : "Adicione uma nova competição ao seu histórico."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Nome do Evento */}
            <div className="grid gap-2">
              <Label htmlFor="nome-evento">Nome do Evento *</Label>
              <Input
                id="nome-evento"
                placeholder="Ex: Copa São Paulo de Jiu-Jitsu"
                value={novaCompeticao.nomeEvento}
                onChange={(e) => setNovaCompeticao({ ...novaCompeticao, nomeEvento: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Cidade */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  placeholder="Ex: São Paulo, SP"
                  value={novaCompeticao.cidade}
                  onChange={(e) => setNovaCompeticao({ ...novaCompeticao, cidade: e.target.value })}
                  required
                />
              </div>
              
              {/* Data da Competição */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="data-competicao">Data</Label>
                <Input
                  id="data-competicao"
                  type="date"
                  value={novaCompeticao.data}
                  onChange={(e) => setNovaCompeticao({ ...novaCompeticao, data: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Modalidade */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="modalidade-competicao">Modalidade</Label>
                <Select
                  value={novaCompeticao.modalidade}
                  onValueChange={(value) => setNovaCompeticao({ ...novaCompeticao, modalidade: value })}
                >
                  <SelectTrigger id="modalidade-competicao">
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gi">Com Kimono (Gi)</SelectItem>
                    <SelectItem value="nogi">Sem Kimono (No-Gi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Colocação */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="colocacao">Colocação</Label>
                <Select
                  value={novaCompeticao.colocacao}
                  onValueChange={(value) => setNovaCompeticao({ ...novaCompeticao, colocacao: value })}
                >
                  <SelectTrigger id="colocacao">
                    <SelectValue placeholder="Selecione a colocação" />
                  </SelectTrigger>
                  <SelectContent>
                    {OPCOES_COLOCACAO.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Número de Lutas */}
              <div className="grid gap-2">
                <Label htmlFor="num-lutas">Lutas</Label>
                <Input
                  id="num-lutas"
                  type="number"
                  min="0"
                  value={novaCompeticao.numeroLutas}
                  onChange={(e) => setNovaCompeticao({ 
                    ...novaCompeticao, 
                    numeroLutas: parseInt(e.target.value) || 0 
                  })}
                />
              </div>

              {/* Número de Vitórias */}
              <div className="grid gap-2">
                <Label htmlFor="num-vitorias">Vitórias</Label>
                <Input
                  id="num-vitorias"
                  type="number"
                  min="0"
                  value={novaCompeticao.numeroVitorias}
                  onChange={(e) => setNovaCompeticao({ 
                    ...novaCompeticao, 
                    numeroVitorias: parseInt(e.target.value) || 0 
                  })}
                />
              </div>

              {/* Número de Derrotas */}
              <div className="grid gap-2">
                <Label htmlFor="num-derrotas">Derrotas</Label>
                <Input
                  id="num-derrotas"
                  type="number"
                  min="0"
                  value={novaCompeticao.numeroDerrotas}
                  onChange={(e) => setNovaCompeticao({ 
                    ...novaCompeticao, 
                    numeroDerrotas: parseInt(e.target.value) || 0 
                  })}
                />
              </div>

              {/* Número de Finalizações */}
              <div className="grid gap-2">
                <Label htmlFor="num-finalizacoes">Finalizações</Label>
                <Input
                  id="num-finalizacoes"
                  type="number"
                  min="0"
                  value={novaCompeticao.numeroFinalizacoes}
                  onChange={(e) => setNovaCompeticao({ 
                    ...novaCompeticao, 
                    numeroFinalizacoes: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
            </div>
            
            {/* Fotos da Competição */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Fotos da Competição (max: 5)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarImagem}
                  disabled={imageUrls.length >= 5}
                >
                  <ImagePlus className="h-4 w-4 mr-1" /> Adicionar Foto
                </Button>
              </div>
              
              {imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Foto ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removerImagem(index)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma imagem adicionada
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={adicionarImagem}
                    className="mt-2"
                  >
                    Adicionar
                  </Button>
                </div>
              )}
            </div>
            
            {/* Observações */}
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações sobre o evento</Label>
              <Textarea
                id="observacoes"
                placeholder="Anote suas impressões sobre a competição, pontos fortes, pontos a melhorar, etc."
                value={novaCompeticao.observacoes}
                onChange={(e) => setNovaCompeticao({ ...novaCompeticao, observacoes: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
            <DialogFooter className="mt-4 sm:mt-6 pb-2 flex flex-col-reverse sm:flex-row gap-3">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" onClick={salvarCompeticao}>
              {editandoCompeticao ? "Salvar alterações" : "Adicionar competição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Competicoes;
