import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Filter, 
  Plus, 
  Trash2, 
  PencilLine, 
  MoreVertical, 
  Search,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

// Definindo as categorias de tags disponíveis
const CATEGORIAS_TAGS = [
  { value: "treino", label: "Treino", cor: "bg-blue-500 hover:bg-blue-600" },
  { value: "competicao", label: "Competição", cor: "bg-red-500 hover:bg-red-600" },
  { value: "posicao", label: "Posição", cor: "bg-green-500 hover:bg-green-600" },
  { value: "finalizacao", label: "Finalização", cor: "bg-purple-500 hover:bg-purple-600" },
  { value: "mentalidade", label: "Mentalidade", cor: "bg-yellow-500 hover:bg-yellow-600" },
  { value: "alimentacao", label: "Alimentação", cor: "bg-orange-500 hover:bg-orange-600" },
];

// Componente de tag personalizada com cores diferentes
const TagBadge = ({ categoria, tamanho = "normal" }) => {
  const tagInfo = CATEGORIAS_TAGS.find(tag => tag.value === categoria) || {
    value: categoria,
    label: categoria,
    cor: "bg-gray-500 hover:bg-gray-600"
  };
  
  const tamanhoClasses = tamanho === "pequeno" 
    ? "text-xs py-0 px-2" 
    : "py-1";

  return (
    <Badge className={`${tagInfo.cor} text-white font-medium ${tamanhoClasses}`}>
      {tagInfo.label}
    </Badge>
  );
};

// Componente para exibir texto com opção de expandir
const TextoExpandivel = ({ texto, linhas = 3 }) => {
  const [expandido, setExpandido] = useState(false);
  const excedeLimite = texto.length > 150; // Verifica se o texto é longo o suficiente para precisar expandir
  
  return (
    <div>
      <p className={`text-sm ${!expandido && excedeLimite ? `line-clamp-${linhas}` : ''}`}>
        {texto}
      </p>
      {excedeLimite && (
        <Button 
          variant="link" 
          size="sm" 
          className="p-0 h-auto text-xs text-muted-foreground hover:text-primary mt-1"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Mostrar menos" : "Mostrar mais"}
        </Button>
      )}
    </div>
  );
};

const Observacoes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
    // Estados
  const [observacoes, setObservacoes] = useState([]);
  const [novaObservacao, setNovaObservacao] = useState({
    titulo: "",
    conteudo: "",
    tag: "treino",
    data: ""
  });
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [termoBusca, setTermoBusca] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  const [dialogEdicaoAberto, setDialogEdicaoAberto] = useState(false);
  
  // Efeito para carregar dados
  useEffect(() => {
    // Simulando dados iniciais (em um app real isso viria de uma API)
    const dadosIniciais = [
      {
        id: 1,
        titulo: "Passagem de guarda aberta",
        conteudo: "Hoje aprendi uma técnica eficaz para passar a guarda aberta. Manter a pressão no joelho e antecipar a movimentação do oponente foi crucial.",
        tag: "posicao",
        data: "2025-06-10T14:30:00"
      },
      {
        id: 2,
        titulo: "Preparação para campeonato",
        conteudo: "Preciso aumentar condicionamento físico para o campeonato do próximo mês. Focar em treinos de resistência e explosão.",
        tag: "competicao",
        data: "2025-06-05T09:15:00"
      },
      {
        id: 3,
        titulo: "Controle mental durante lutas",
        conteudo: "Trabalhar na respiração e foco durante momentos difíceis na luta. Manter a calma mesmo em posições desfavoráveis.",
        tag: "mentalidade",
        data: "2025-06-01T18:45:00"
      },
    ];
    setObservacoes(dadosIniciais);
  }, []);
  
  // Função para adicionar nova observação
  const adicionarObservacao = () => {
    if (!novaObservacao.titulo || !novaObservacao.conteudo) return;
    
    const dataAtual = new Date().toISOString();
    const novoItem = {
      id: observacoes.length ? Math.max(...observacoes.map(o => o.id)) + 1 : 1,
      ...novaObservacao,
      data: dataAtual
    };
    
    setObservacoes([novoItem, ...observacoes]);
    limparFormulario();
  };
  
  // Função para atualizar observação existente
  const atualizarObservacao = () => {
    if (!novaObservacao.titulo || !novaObservacao.conteudo) return;
    
    const observacoesAtualizadas = observacoes.map(obs => 
      obs.id === idEdicao ? { ...obs, ...novaObservacao } : obs
    );
    
    setObservacoes(observacoesAtualizadas);
    limparFormulario();
    setModoEdicao(false);
    setIdEdicao(null);
  };
  
  // Função para excluir uma observação
  const excluirObservacao = (id) => {
    setObservacoes(observacoes.filter(obs => obs.id !== id));
  };
    // Função para editar uma observação existente
  const editarObservacao = (observacao) => {
    setNovaObservacao({
      titulo: observacao.titulo,
      conteudo: observacao.conteudo,
      tag: observacao.tag,
      data: observacao.data
    });
    setModoEdicao(true);
    setIdEdicao(observacao.id);
    setDialogEdicaoAberto(true);
  };
  
  // Função para limpar o formulário
  const limparFormulario = () => {
    setNovaObservacao({
      titulo: "",
      conteudo: "",
      tag: "treino",
      data: ""
    });
  };
    // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  // Função para formatar data de forma curta
  const formatarDataCurta = (dataString) => {
    const data = new Date(dataString);
    return format(data, "dd 'de' MMM 'às' HH:mm", { locale: ptBR });
  };
  
  // Filtragem das observações
  const observacoesFiltradas = observacoes
    .filter(obs => filtroAtivo === "todas" || obs.tag === filtroAtivo)
    .filter(obs => 
      termoBusca === "" || 
      obs.titulo.toLowerCase().includes(termoBusca.toLowerCase()) || 
      obs.conteudo.toLowerCase().includes(termoBusca.toLowerCase())
    );
  
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          
          <main className="flex-1 flex flex-col">
            <div className="flex items-center h-16 px-4 border-b bg-background md:px-6">
              <div>
                <SidebarTrigger />
              </div>
              <div className="md:hidden">
                <MobileNav />
              </div>
              <div className="ms-3 flex items-center w-full justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Observações Gerais</h1>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
              {/* Cabeçalho com botões de ação */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Minhas Observações</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Campo de busca */}
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar observações..." 
                      className="pl-8 w-full sm:w-60"
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                    />
                  </div>
                  
                  {/* Filtro por Tag */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filtrar</span>
                        {filtroAtivo !== "todas" && (
                          <Badge variant="secondary" className="ml-1">
                            {CATEGORIAS_TAGS.find(cat => cat.value === filtroAtivo)?.label || filtroAtivo}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setFiltroAtivo("todas")}
                      >
                        <span className={filtroAtivo === "todas" ? "font-bold" : ""}>Todas as categorias</span>
                      </DropdownMenuItem>
                      {CATEGORIAS_TAGS.map((cat) => (
                        <DropdownMenuItem
                          key={cat.value}
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setFiltroAtivo(cat.value)}
                        >
                          <div className={`w-2 h-2 rounded-full ${cat.cor.split(" ")[0]}`} />
                          <span className={filtroAtivo === cat.value ? "font-bold" : ""}>{cat.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>                  {/* Botão para adicionar nova observação */}
                  <Dialog
                    onOpenChange={(open) => {
                      if (!open) {
                        setModoEdicao(false);
                        limparFormulario();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Nova Observação</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>                        <DialogTitle>
                          Nova Observação
                        </DialogTitle>
                        <DialogDescription>
                          Adicione notas, dicas e insights para consulta futura.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        {/* Campo Título */}
                        <div className="grid gap-2">
                          <Label htmlFor="titulo">Título</Label>
                          <Input 
                            id="titulo"
                            value={novaObservacao.titulo}
                            onChange={(e) => setNovaObservacao({...novaObservacao, titulo: e.target.value})}
                            placeholder="Ex: Dica de passagem de guarda"
                          />
                        </div>
                        
                        {/* Campo Tag */}
                        <div className="grid gap-2">
                          <Label htmlFor="tag">Categoria</Label>
                          <Select 
                            value={novaObservacao.tag}
                            onValueChange={(valor) => setNovaObservacao({...novaObservacao, tag: valor})}
                          >
                            <SelectTrigger id="tag">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIAS_TAGS.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${cat.cor.split(" ")[0]}`} />
                                    <span>{cat.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Campo Conteúdo */}
                        <div className="grid gap-2">
                          <Label htmlFor="conteudo">Conteúdo</Label>
                          <Textarea 
                            id="conteudo"
                            rows={5}
                            value={novaObservacao.conteudo}
                            onChange={(e) => setNovaObservacao({...novaObservacao, conteudo: e.target.value})}
                            placeholder="Descreva aqui sua observação com detalhes..."
                          />
                        </div>
                      </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <DialogClose asChild>
                          <Button variant="outline" type="button" className="w-full sm:w-auto">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button 
                            type="button"
                            className="w-full sm:w-auto"                            onClick={adicionarObservacao}
                            disabled={!novaObservacao.titulo || !novaObservacao.conteudo}
                          >
                            Salvar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>                </div>
              </div>
              
              {/* Modal de Edição */}
              <Dialog
                open={dialogEdicaoAberto}
                onOpenChange={(open) => {
                  setDialogEdicaoAberto(open);
                  if (!open) {
                    setModoEdicao(false);
                    limparFormulario();
                  }
                }}
              >
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Editar Observação</DialogTitle>
                    <DialogDescription>
                      Edite sua nota, dica ou insight.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    {/* Campo Título */}
                    <div className="grid gap-2">
                      <Label htmlFor="titulo-edicao">Título</Label>
                      <Input 
                        id="titulo-edicao"
                        value={novaObservacao.titulo}
                        onChange={(e) => setNovaObservacao({...novaObservacao, titulo: e.target.value})}
                        placeholder="Ex: Dica de passagem de guarda"
                      />
                    </div>
                    
                    {/* Campo Tag */}
                    <div className="grid gap-2">
                      <Label htmlFor="tag-edicao">Categoria</Label>
                      <Select 
                        value={novaObservacao.tag}
                        onValueChange={(valor) => setNovaObservacao({...novaObservacao, tag: valor})}
                      >
                        <SelectTrigger id="tag-edicao">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS_TAGS.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${cat.cor.split(" ")[0]}`} />
                                <span>{cat.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Campo Conteúdo */}
                    <div className="grid gap-2">
                      <Label htmlFor="conteudo-edicao">Conteúdo</Label>
                      <Textarea 
                        id="conteudo-edicao"
                        rows={5}
                        value={novaObservacao.conteudo}
                        onChange={(e) => setNovaObservacao({...novaObservacao, conteudo: e.target.value})}
                        placeholder="Descreva aqui sua observação com detalhes..."
                      />
                    </div>
                  </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <DialogClose asChild>
                      <Button variant="outline" type="button" className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button 
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={atualizarObservacao}
                        disabled={!novaObservacao.titulo || !novaObservacao.conteudo}
                      >
                        Atualizar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Lista de Observações */}
              {observacoesFiltradas.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-xl font-semibold mb-1">Nenhuma observação encontrada</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      {termoBusca || filtroAtivo !== "todas" 
                        ? "Tente mudar seus filtros ou termo de busca" 
                        : "Clique em 'Nova Observação' para adicionar sua primeira nota"}
                    </p>
                  </CardContent>
                </Card>
              ) : (                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {observacoesFiltradas.map((observacao) => (
                    <Card key={observacao.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
                      <div className="relative">
                        <div className="absolute top-0 left-0 z-10">
                          <TagBadge categoria={observacao.tag} />
                        </div>
                        
                        <CardHeader className="pt-10 pb-2 space-y-0">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3 text-muted-foreground" />                            <span className="text-xs text-muted-foreground">
                              {formatarDataCurta(observacao.data)}
                            </span>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>                              <DropdownMenuContent align="end">                                <DropdownMenuItem 
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    editarObservacao(observacao);
                                  }}
                                >
                                  <PencilLine className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600" 
                                  onSelect={() => excluirObservacao(observacao.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <CardTitle className="text-lg">{observacao.titulo}</CardTitle>
                        </CardHeader>
                      </div>
                        <CardContent className="pt-2 flex-grow">
                        <TextoExpandivel texto={observacao.conteudo} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Observacoes;
