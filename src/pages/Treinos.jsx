import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocation } from "react-router-dom";
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
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Componente de Carousel para as imagens do treino
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
          alt="Foto do treino" 
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
            alt={`Foto do treino ${index + 1}`} 
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
const MOCK_TREINOS = [
  {
    id: 1,
    numeroAula: 1,
    tipo: "gi",
    diaSemana: "segunda",
    horario: "19:30",
    data: "2025-06-10",
    imagens: [
      "https://images.unsplash.com/photo-1614151282806-fbb546ab4320?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593435221502-c5d7bfc26cab?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Trabalhamos muito na passagem de guarda. O professor mostrou técnicas de raspagem da meia guarda. Preciso melhorar minha defesa quando estou por baixo."
  },
  {
    id: 2,
    numeroAula: 2,
    tipo: "nogi",
    diaSemana: "quarta",
    horario: "18:00",
    data: "2025-06-12",
    imagens: [
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Treinamos finalizações da posição montada. Consegui aplicar um armlock com sucesso. Preciso trabalhar mais na transição da meia-guarda para a montada."
  },
  {
    id: 3,
    numeroAula: 3,
    tipo: "gi",
    diaSemana: "sexta",
    horario: "20:30",
    data: "2025-06-07",
    imagens: [],
    observacoes: "Aula focada em defesa pessoal. Aprendemos técnicas de defesa contra faca e socos. Foi uma aula intensa com bastante cardio."
  },
  {
    id: 4,
    numeroAula: 4,
    tipo: "nogi",
    diaSemana: "terça",
    horario: "06:30",
    data: "2025-06-11",
    imagens: [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Treino matinal super produtivo. Trabalhamos leg locks e heel hooks. Estou melhorando minha posição de ashi garami."
  },
  {
    id: 5,
    numeroAula: 5,
    tipo: "gi",
    diaSemana: "quinta",
    horario: "21:00",
    data: "2025-06-13",
    imagens: [
      "https://images.unsplash.com/photo-1583590019972-a146a712d72a?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Aula de drills e condicionamento. Muitos exercícios de ponte e fuga de quadril. Terminamos com 10 minutos de sparring leve."
  }
];

// Opções para horários de treino
const HORARIOS_TREINO = [
  { value: "06:30", label: "06:30" },
  { value: "10:00", label: "10:00" },
  { value: "12:00", label: "12:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:30", label: "19:30" },
  { value: "20:30", label: "20:30" },
  { value: "21:00", label: "21:00" },
  { value: "22:00", label: "22:00" }
];

// Dias da semana
const DIAS_SEMANA = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" }
];

const Treinos = () => {
  const [treinos, setTreinos] = useState(MOCK_TREINOS);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroDiaSemana, setFiltroDiaSemana] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoTreino, setEditandoTreino] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [novoTreino, setNovoTreino] = useState({
    tipo: "gi",
    diaSemana: "segunda",
    horario: "19:30",
    data: format(new Date(), "yyyy-MM-dd"),
    imagens: [],
    observacoes: ""
  });

  // Próximo número de aula baseado nos treinos existentes
  const proximoNumeroAula = treinos.length > 0 
    ? Math.max(...treinos.map(t => t.numeroAula)) + 1 
    : 1;

  // Função para adicionar imagem ao treino
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

  // Função para salvar treino (novo ou editado)
  const salvarTreino = () => {
    // Preparar o treino com os dados atuais
    const treinoFinal = {
      ...novoTreino,
      imagens: imageUrls,
      numeroAula: editandoTreino ? editandoTreino.numeroAula : proximoNumeroAula,
      id: editandoTreino ? editandoTreino.id : treinos.length + 1
    };

    if (editandoTreino) {
      // Atualizar treino existente
      setTreinos(treinos.map(t => t.id === treinoFinal.id ? treinoFinal : t));
    } else {
      // Adicionar novo treino
      setTreinos([...treinos, treinoFinal]);
    }

    // Reset do formulário e fechamento do modal
    setNovoTreino({
      tipo: "gi",
      diaSemana: "segunda",
      horario: "19:30",
      data: format(new Date(), "yyyy-MM-dd"),
      imagens: [],
      observacoes: ""
    });
    setImageUrls([]);
    setModalAberto(false);
    setEditandoTreino(null);
  };

  // Função para editar treino
  const editarTreino = (treino) => {
    setEditandoTreino(treino);
    setNovoTreino({
      tipo: treino.tipo,
      diaSemana: treino.diaSemana,
      horario: treino.horario,
      data: treino.data,
      observacoes: treino.observacoes
    });
    setImageUrls(treino.imagens || []);
    setModalAberto(true);
  };

  // Função para excluir treino
  const excluirTreino = (id) => {
    setTreinos(treinos.filter(t => t.id !== id));
  };

  // Treinos filtrados de acordo com os filtros selecionados
  const treinosFiltrados = treinos.filter(treino => {
    const matchTipo = filtroTipo === "todos" || treino.tipo === filtroTipo;
    const matchDiaSemana = filtroDiaSemana === "todos" || treino.diaSemana === filtroDiaSemana;
    return matchTipo && matchDiaSemana;
  });

  // Ordenar treinos do mais recente para o mais antigo por número da aula (decrescente)
  const treinosOrdenados = [...treinosFiltrados].sort((a, b) => b.numeroAula - a.numeroAula);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Treinos</h1>
            </div>
            <Button
              onClick={() => {
                setEditandoTreino(null);
                setNovoTreino({
                  tipo: "gi",
                  diaSemana: "segunda",
                  horario: "19:30",
                  data: format(new Date(), "yyyy-MM-dd"),
                  imagens: [],
                  observacoes: ""
                });
                setImageUrls([]);
                setModalAberto(true);
              }}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Treino
            </Button>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                <h2 className="text-2xl font-bold hidden md:block">Histórico de Treinos</h2>
                {/* Botão de novo treino removido daqui pois já existe no header */}
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
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select 
                      value={filtroTipo} 
                      onValueChange={setFiltroTipo}
                    >
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="gi">Com Kimono (Gi)</SelectItem>
                        <SelectItem value="nogi">Sem Kimono (No-Gi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="dia-semana">Dia da Semana</Label>
                    <Select 
                      value={filtroDiaSemana} 
                      onValueChange={setFiltroDiaSemana}
                    >
                      <SelectTrigger id="dia-semana">
                        <SelectValue placeholder="Todos os dias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {DIAS_SEMANA.map((dia) => (
                          <SelectItem key={dia.value} value={dia.value}>
                            {dia.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>              {/* Contador de resultados */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-muted-foreground">
                  {treinosOrdenados.length} treinos encontrados
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFiltroTipo("todos");
                    setFiltroDiaSemana("todos");
                  }}
                  className={(filtroTipo === "todos" && filtroDiaSemana === "todos") ? "hidden" : ""}
                >
                  Limpar filtros
                </Button>
              </div>

              {/* Lista de Treinos */}
              {treinosOrdenados.length > 0 ? (
                <div className="space-y-4">
                  {treinosOrdenados.map((treino) => (                    <Card key={treino.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
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
                                <span>
                                  {treino.diaSemana === "quinta" ? "Quinta-feira" : 
                                   DIAS_SEMANA.find(d => d.value === treino.diaSemana)?.label.split('-')[0] || treino.diaSemana}
                                </span>
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
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => editarTreino(treino)}>
                                  <PencilLine className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => excluirTreino(treino.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>                      <CardContent className="px-0 pb-0">
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Nenhum treino encontrado</h3>
                  <p className="text-muted-foreground">
                    {filtroTipo !== "todos" || filtroDiaSemana !== "todos"
                      ? "Tente mudar os filtros ou"
                      : "Comece"}{" "}
                    adicionando um novo treino.
                  </p>
                  <Button className="mt-4" onClick={() => setModalAberto(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Treino
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de adição/edição de treino */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-[95%] w-full md:max-w-[600px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editandoTreino ? "Editar Treino" : "Novo Treino"}</DialogTitle>
            <DialogDescription>
              {editandoTreino
                ? "Edite os detalhes do treino selecionado."
                : "Adicione um novo treino ao seu histórico."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Tipo de Treino */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="tipo-treino">Tipo</Label>
                <Select
                  value={novoTreino.tipo}
                  onValueChange={(value) => setNovoTreino({ ...novoTreino, tipo: value })}
                >
                  <SelectTrigger id="tipo-treino">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gi">Com Kimono (Gi)</SelectItem>
                    <SelectItem value="nogi">Sem Kimono (No-Gi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Número da Aula (automático) */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="numero-aula">Número da Aula</Label>
                <Input
                  id="numero-aula"
                  value={editandoTreino ? editandoTreino.numeroAula : proximoNumeroAula}
                  readOnly
                  disabled
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Dia da Semana */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="dia-semana-treino">Dia da Semana</Label>
                <Select
                  value={novoTreino.diaSemana}
                  onValueChange={(value) => setNovoTreino({ ...novoTreino, diaSemana: value })}
                >
                  <SelectTrigger id="dia-semana-treino">
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAS_SEMANA.map((dia) => (
                      <SelectItem key={dia.value} value={dia.value}>
                        {dia.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Horário do Treino */}
              <div className="grid gap-2 flex-1">
                <Label htmlFor="horario-treino">Horário</Label>
                <Select
                  value={novoTreino.horario}
                  onValueChange={(value) => setNovoTreino({ ...novoTreino, horario: value })}
                >
                  <SelectTrigger id="horario-treino">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {HORARIOS_TREINO.map((horario) => (
                      <SelectItem key={horario.value} value={horario.value}>
                        {horario.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Data do Treino */}
            <div className="grid gap-2">
              <Label htmlFor="data-treino">Data</Label>
              <Input
                id="data-treino"
                type="date"
                value={novoTreino.data}
                onChange={(e) => setNovoTreino({ ...novoTreino, data: e.target.value })}
              />
            </div>
            
            {/* Fotos do Treino */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Fotos do Treino (max: 5)</Label>
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
              <Label htmlFor="observacoes-treino">Observações</Label>
              <Textarea
                id="observacoes-treino"
                placeholder="Anote o que foi trabalhado no treino, técnicas aprendidas, etc."
                value={novoTreino.observacoes}
                onChange={(e) => setNovoTreino({ ...novoTreino, observacoes: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
            <DialogFooter className="mt-4 sm:mt-6 pb-2 flex flex-col-reverse sm:flex-row gap-3">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" onClick={salvarTreino}>
              {editandoTreino ? "Salvar alterações" : "Adicionar treino"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Treinos;
