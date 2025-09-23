import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, Check, X, Trash2, Edit, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlanoJogo } from "@/hooks/use-plano-jogo";
import { cn } from "@/lib/utils";
import NodeFormModal from "./NodeFormModal";
import TecnicaSelector from "./TecnicaSelector";
import TecnicaDetailsModal from "./modals/TecnicaDetailsModal";

export default function PlanoTreeView({ plano, onBack }) {
  const { adicionarNode, adicionarRespostaCerto, adicionarRespostaErrado, removerNode, carregarPlanos, selecionarPlano } = usePlanoJogo();
  const [expandedNodes, setExpandedNodes] = useState({});
  const [nodeParaAdicionar, setNodeParaAdicionar] = useState(null);
  const [formNodeOpen, setFormNodeOpen] = useState(false);
  const [seletorTecnicaOpen, setSeletorTecnicaOpen] = useState(false);
  const [actionPerformed, setActionPerformed] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [detalhesTecnica, setDetalhesTecnica] = useState({ tecnicaId: null, tecnicaInline: null });
  const [processing, setProcessing] = useState({}); // { [nodeId_action]: true }
  
  // Evita recarregamentos redundantes; as ações já atualizam o estado via hook
  useEffect(() => {
    if (actionPerformed) {
      setActionPerformed(false);
    }
  }, [actionPerformed]);

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

  const handleNodeCreate = async (node, parentId) => {
    const processKey = parentId ? parentId + '_add' : 'root_add';
    setProcessing(prev => ({ ...prev, [processKey]: true }));
    const novoNode = await adicionarNode(plano.id, node, parentId);
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
    setProcessing(prev => ({ ...prev, [processKey]: false }));
  };

  const handleAddRespostaCerto = async (parentId) => {
    setProcessing(prev => ({ ...prev, [parentId + '_certo']: true }));
    const resposta = {
      nome: "Deu certo",
      descricao: "",
      tipo: "certo"
    };
    const novoNode = await adicionarRespostaCerto(plano.id, parentId, resposta);
    if (novoNode) {
      // Expandir o nó pai automaticamente
      setExpandedNodes(prev => ({
        ...prev,
        [parentId]: true
      }));
      
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
    setProcessing(prev => ({ ...prev, [parentId + '_certo']: false }));
  };

  const handleAddRespostaErrado = async (parentId) => {
    setProcessing(prev => ({ ...prev, [parentId + '_errado']: true }));
    const resposta = {
      nome: "Deu errado",
      descricao: "",
      tipo: "errado"
    };
    const novoNode = await adicionarRespostaErrado(plano.id, parentId, resposta);
    if (novoNode) {
      // Expandir o nó pai automaticamente
      setExpandedNodes(prev => ({
        ...prev,
        [parentId]: true
      }));
      
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
    setProcessing(prev => ({ ...prev, [parentId + '_errado']: false }));
  };

  const handleDeleteNode = async (nodeId) => {
    setProcessing(prev => ({ ...prev, [nodeId + '_delete']: true }));
    const planoAtualizado = await removerNode(plano.id, nodeId);
    if (planoAtualizado) {
      // Indicar que uma ação foi realizada
      setActionPerformed(true);
    }
    setProcessing(prev => ({ ...prev, [nodeId + '_delete']: false }));
  };

  const handleTecnicaSelected = async (tecnica) => {
    const newNode = {
      nome: tecnica.nome,
      descricao: tecnica.descricao || "",
      tipo: tecnica.tipo || "tecnica",
      ...(tecnica.id ? { tecnicaId: tecnica.id } : {}),
      // Guardar alguns campos úteis para exibição futura (fallback se não achar por ID)
      categoria: tecnica.categoria,
      posicao: tecnica.posicao,
      passos: Array.isArray(tecnica.passos) ? tecnica.passos : [],
      observacoes: Array.isArray(tecnica.observacoes) ? tecnica.observacoes : [],
      video_url: tecnica.video_url,
      video_poster: tecnica.video_poster,
      video: tecnica.video
    };
    
    setSeletorTecnicaOpen(false);
    await handleNodeCreate(newNode, nodeParaAdicionar);
    
    // Indicar que uma ação foi realizada
    setActionPerformed(true);
  };

  const abrirDetalhesTecnica = (node) => {
    if (node.tipo === 'tecnica' && (node.tecnicaId || node.nome)) {
      setDetalhesTecnica({
        tecnicaId: node.tecnicaId || null,
        tecnicaInline: node.tecnicaId ? null : {
          nome: node.nome,
          categoria: node.categoria,
          posicao: node.posicao,
          passos: node.passos || [],
          observacoes: node.observacoes || [],
          video_url: node.video_url,
          video_poster: node.video_poster,
          video: node.video
        }
      });
      setDetalhesOpen(true);
    }
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
                  <button
                    type="button"
                    className={cn(
                      "flex-1 min-w-0 text-left text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-full mr-2 sm:mr-4",
                      node.tipo === 'tecnica' ? "hover:underline" : "pointer-events-none"
                    )}
                    onClick={() => abrirDetalhesTecnica(node)}
                    disabled={node.tipo !== 'tecnica'}
                    title={node.tipo === 'tecnica' ? 'Ver detalhes da técnica' : undefined}
                  >
                    {node.nome}
                  </button>
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
                        disabled={!!processing[node.id + '_certo']}
                        title="Adicionar resposta positiva"
                      >
                        {processing[node.id + '_certo'] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 sm:h-6 sm:w-6 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        onClick={() => handleAddRespostaErrado(node.id)}
                        disabled={!!processing[node.id + '_errado']}
                        title="Adicionar resposta negativa"
                      >
                        {processing[node.id + '_errado'] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => handleAddNode(node.id)}
                    disabled={!!processing[node.id + '_add']}
                    title="Adicionar técnica"
                  >
                    {processing[node.id + '_add'] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 sm:h-6 sm:w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => handleDeleteNode(node.id)}
                    disabled={!!processing[node.id + '_delete']}
                    title="Remover"
                  >
                    {processing[node.id + '_delete'] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
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
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-bold truncate">{plano.nome}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="px-2"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <Button 
            onClick={() => handleAddNode(null)} 
            variant="outline" 
            size="sm"
            disabled={!!processing['root_add']}
            className="whitespace-nowrap px-2"
          >
            {processing['root_add'] ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Adicionar Técnica Raiz</span>
          </Button>
        </div>
      </div>
      
      {plano.descricao && (
        <p className="text-muted-foreground text-sm">{plano.descricao}</p>
      )}
      
      <div 
        className="bg-muted/20 rounded-lg p-4 border w-full overflow-x-auto overscroll-contain touch-pan-x touch-pan-y overflow-y-auto max-h-[60vh] sm:max-h-[70vh]"
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
          disabled={!!processing['root_add']}
        >
          {processing['root_add'] ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
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

      {/* Modal de detalhes da técnica */}
      {detalhesOpen && (
        <TecnicaDetailsModal
          isOpen={detalhesOpen}
          onClose={() => setDetalhesOpen(false)}
          tecnicaId={detalhesTecnica.tecnicaId}
          tecnicaInline={detalhesTecnica.tecnicaInline}
        />
      )}
    </div>
  );
}