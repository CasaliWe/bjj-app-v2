import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Target } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Componente modal para gerenciar posições
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Array} props.posicoes - Lista de posições cadastradas
 * @param {Function} props.onAdicionarPosicao - Função para adicionar nova posição
 * @param {Function} props.onExcluirPosicao - Função para excluir posição
 * @param {boolean} props.carregando - Indica se está carregando dados
 */
const PosicijesModal = ({ 
  isOpen, 
  onClose, 
  posicoes = [],
  onAdicionarPosicao,
  onExcluirPosicao,
  carregando = false
}) => {
  const [novaPosicao, setNovaPosicao] = useState("");
  const [posicaoParaExcluir, setPosicaoParaExcluir] = useState(null);
  const [confirmacaoExcluirAberta, setConfirmacaoExcluirAberta] = useState(false);
  const [adicionando, setAdicionando] = useState(false);

  // Reset do estado quando o modal é aberto/fechado
  const handleModalChange = (open) => {
    if (!open) {
      setNovaPosicao("");
      setPosicaoParaExcluir(null);
      setConfirmacaoExcluirAberta(false);
      onClose();
    }
  };

  // Adicionar nova posição
  const handleAdicionarPosicao = async (e) => {
    e.preventDefault();
    
    if (!novaPosicao.trim()) {
      return;
    }

    // Verificar se a posição já existe (case-insensitive)
    const posicaoExiste = posicoes.some(
      pos => pos.toLowerCase() === novaPosicao.trim().toLowerCase()
    );

    if (posicaoExiste) {
      alert("Esta posição já existe!");
      return;
    }

    setAdicionando(true);
    try {
      await onAdicionarPosicao(novaPosicao.trim());
      setNovaPosicao("");
    } catch (error) {
      console.error("Erro ao adicionar posição:", error);
      alert("Erro ao adicionar posição. Tente novamente.");
    } finally {
      setAdicionando(false);
    }
  };

  // Abrir confirmação de exclusão
  const abrirConfirmacaoExcluir = (posicao) => {
    setPosicaoParaExcluir(posicao);
    setConfirmacaoExcluirAberta(true);
  };

  // Fechar confirmação de exclusão
  const fecharConfirmacaoExcluir = () => {
    setPosicaoParaExcluir(null);
    setConfirmacaoExcluirAberta(false);
  };

  // Confirmar exclusão
  const confirmarExclusao = async () => {
    if (posicaoParaExcluir) {
      try {
        await onExcluirPosicao(posicaoParaExcluir);
        fecharConfirmacaoExcluir();
      } catch (error) {
        console.error("Erro ao excluir posição:", error);
        alert("Erro ao excluir posição. Tente novamente.");
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalChange}>
        <DialogContent className="max-w-[95%] w-full md:max-w-[600px] max-h-[90vh] overflow-hidden p-4 pt-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Gerenciar Posições
            </DialogTitle>
            <DialogDescription>
              Adicione novas posições ou remova posições existentes.
            </DialogDescription>
          </DialogHeader>
          
          {/* Formulário para adicionar nova posição */}
          <form onSubmit={handleAdicionarPosicao} className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Nome da nova posição..."
              value={novaPosicao}
              onChange={(e) => setNovaPosicao(e.target.value)}
              className="flex-1"
              disabled={adicionando}
            />
            <Button 
              type="submit" 
              disabled={!novaPosicao.trim() || adicionando}
              className="px-3"
            >
              {adicionando ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </form>
          
          {/* Lista de posições */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              Posições Cadastradas ({posicoes.length})
            </h4>
            
            <ScrollArea className="h-[300px] border rounded-md">
              {carregando ? (
                <LoadingSpinner message="Carregando posições..." className="py-8" />
              ) : posicoes.length > 0 ? (
                <div className="p-2 space-y-1">
                  {posicoes.map((posicao, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md group"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{posicao}</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => abrirConfirmacaoExcluir(posicao)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-8 w-8 mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma posição cadastrada ainda.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={confirmacaoExcluirAberta} onOpenChange={setConfirmacaoExcluirAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a posição "{posicaoParaExcluir}"? 
              <br />
              <strong>Atenção:</strong> Técnicas que usam esta posição não serão afetadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={fecharConfirmacaoExcluir}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarExclusao} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PosicijesModal;