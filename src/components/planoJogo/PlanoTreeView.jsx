import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, Check, X, Trash2, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlanoJogo } from "@/hooks/use-plano-jogo";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import NodeFormModal from "./NodeFormModal";
import TecnicaSelector from "./TecnicaSelector";

export default function PlanoTreeView({ plano, onBack }) {
  const { adicionarNode, adicionarRespostaCerto, adicionarRespostaErrado, removerNode, carregarPlanos, selecionarPlano } = usePlanoJogo();
  const [expandedNodes, setExpandedNodes] = useState({});
  const [nodeParaAdicionar, setNodeParaAdicionar] = useState(null);
  const [formNodeOpen, setFormNodeOpen] = useState(false);
  const [seletorTecnicaOpen, setSeletorTecnicaOpen] = useState(false);
  const [actionPerformed, setActionPerformed] = useState(false);
  const { toast } = useToast();
  
  // Força atualização do plano quando alterações são feitas
  useEffect(() => {
    if (plano) {
      // Recarregar o plano atual para garantir que esteja atualizado
      selecionarPlano(plano.id);
    }
  }, [plano?.id, selecionarPlano]);
  
  // Recarregar quando uma ação é executada
  useEffect(() => {
    if (actionPerformed && plano) {
      // Recarregar o plano atual para garantir que esteja atualizado após ações
      selecionarPlano(plano.id);
      carregarPlanos();
      setActionPerformed(false);
    }
  }, [actionPerformed, plano, selecionarPlano, carregarPlanos]);

  if (!plano) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Nenhum plano selecionado</p>
        <Button onClick={onBack} variant="outline">Voltar para a lista</Button>
      </div>
    );
  }

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleAddNode = (parentId = null) => {
    setNodeParaAdicionar(parentId);
    setSeletorTecnicaOpen(true);
  };

  const handleNodeCreate = (node, parentId) => {
    const novoNode = adicionarNode(plano.id, node, parentId);
    if (novoNode) {
      setFormNodeOpen(false);
      // Expandir o nó pai automaticamente
      if (parentId) {
        setExpandedNodes(prev => ({
          ...prev,
          [parentId]: true
        }));
      }
      
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
  };

  const handleAddRespostaCerto = (parentId) => {
    const resposta = {
      nome: "Deu certo",
      descricao: "",
      tipo: "certo"
    };
    
    const novoNode = adicionarRespostaCerto(plano.id, parentId, resposta);
    if (novoNode) {
      // Expandir o nó pai automaticamente
      setExpandedNodes(prev => ({
        ...prev,
        [parentId]: true
      }));
      
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
  };

  const handleAddRespostaErrado = (parentId) => {
    const resposta = {
      nome: "Deu errado",
      descricao: "",
      tipo: "errado"
    };
    
    const novoNode = adicionarRespostaErrado(plano.id, parentId, resposta);
    if (novoNode) {
      // Expandir o nó pai automaticamente
      setExpandedNodes(prev => ({
        ...prev,
        [parentId]: true
      }));
      
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
  };

  const handleDeleteNode = (nodeId) => {
    const planoAtualizado = removerNode(plano.id, nodeId);
    if (planoAtualizado) {
      toast({
        title: "Item removido",
        description: "O item foi removido do plano de jogo.",
      });
      
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
  };

  const handleTecnicaSelected = (tecnica) => {
    const newNode = {
      nome: tecnica.nome,
      descricao: tecnica.descricao || "",
      tipo: "tecnica",
      tecnicaId: tecnica.id
    };
    
    handleNodeCreate(newNode, nodeParaAdicionar);
    setSeletorTecnicaOpen(false);
    
    // Indicar que uma ação foi realizada
    setActionPerformed(true);
  };

  // Componente recursivo para renderizar a árvore
  const renderTreeNodes = (nodes, level = 0) => {
    if (!nodes || !nodes.length) {
      return (
        <div className="pl-3 py-2 text-muted-foreground text-xs sm:text-sm italic">
          Nenhum item adicionado
        </div>
      );
    }

    return (
      <div className="space-y-0.5 w-full" key={`tree-nodes-${Date.now()}`}>
        {nodes.map((node) => {
          const isExpanded = expandedNodes[node.id];
          const hasChildren = node.children && node.children.length > 0;
          const nodeColor = node.tipo === 'certo' 
            ? 'bg-transparent border-green-300' 
            : node.tipo === 'errado'
              ? 'bg-transparent border-red-300'
              : 'bg-background border-border';
              
          return (
            <div key={node.id} className="pl-1 sm:pl-2 w-full">
              <div 
                className={cn(
                  "flex items-center justify-between p-1 rounded-md border w-full",
                  nodeColor
                )}
              >
                <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                  {/* Ícone de expansão */}
                  {hasChildren ? (
                    <button
                      onClick={() => toggleNode(node.id)}
                      className="w-5 h-5 sm:w-6 sm:h-6 hover:bg-muted rounded-md flex items-center justify-center"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  
                  {/* Ícone de tipo */}
                  <div className="mr-1 sm:mr-2">
                    {node.tipo === 'certo' ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    ) : node.tipo === 'errado' ? (
                      <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    ) : (
                      <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-primary/20" />
                    )}
                  </div>
                  
                  {/* Nome do nó */}
                  <div className="flex-1 min-w-0 text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-full mr-2 sm:mr-4">
                    {node.nome}
                  </div>
                </div>
                
                {/* Ações */}
                <div className="flex space-x-1 sm:space-x-2 shrink-0">
                  {/* Botões de "deu certo" e "deu errado" aparecem apenas em técnicas (não em resultados) */}
                  {node.tipo !== 'certo' && node.tipo !== 'errado' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 sm:h-6 sm:w-6 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => handleAddRespostaCerto(node.id)}
                        title="Adicionar resposta positiva"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 sm:h-6 sm:w-6 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        onClick={() => handleAddRespostaErrado(node.id)}
                        title="Adicionar resposta negativa"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => handleAddNode(node.id)}
                    title="Adicionar técnica"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 sm:h-6 sm:w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => handleDeleteNode(node.id)}
                    title="Remover"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Nós filhos (recursivo) */}
              {isExpanded && hasChildren && (
                <div className="mt-0.5 border-l pl-3 sm:pl-4 w-full">
                  {renderTreeNodes(node.children, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <h2 className="text-lg sm:text-xl font-bold">{plano.nome}</h2>
        </div>
        <Button 
          onClick={() => handleAddNode(null)} 
          variant="outline" 
          size="sm"
          className="whitespace-nowrap"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Adicionar Técnica Raiz</span>
        </Button>
      </div>
      
      {plano.descricao && (
        <p className="text-muted-foreground text-sm">{plano.descricao}</p>
      )}
      
      <div 
        className="bg-muted/20 rounded-lg p-4 border w-full overflow-x-auto overscroll-contain touch-pan-x"
      >
        <div className="min-w-full w-max">
          {renderTreeNodes(plano.nodes)}
        </div>
      </div>
      
      {/* Menu de contexto móvel para ações rápidas */}
      <div className="sm:hidden fixed bottom-20 right-4 flex flex-col space-y-2 z-50">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => handleAddNode(null)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Modal para seleção de técnica */}
      {seletorTecnicaOpen && (
        <TecnicaSelector
          isOpen={seletorTecnicaOpen}
          onClose={() => {
            setSeletorTecnicaOpen(false);
            setNodeParaAdicionar(null);
          }}
          onSelectTecnica={handleTecnicaSelected}
        />
      )}
      
      {/* Modal para criar nó manualmente */}
      {formNodeOpen && (
        <NodeFormModal
          isOpen={formNodeOpen}
          onClose={() => {
            setFormNodeOpen(false);
            setNodeParaAdicionar(null);
          }}
          onSubmit={(node) => handleNodeCreate(node, nodeParaAdicionar)}
        />
      )}
    </div>
  );
}