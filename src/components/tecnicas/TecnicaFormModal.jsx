import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TecnicaForm from "./TecnicaForm";

/**
 * Componente modal para adicionar ou editar uma técnica
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Object} props.tecnica - Dados da técnica sendo editada ou objeto vazio para nova técnica
 * @param {Function} props.onSave - Função para salvar a técnica
 * @param {Array} props.posicoesCadastradas - Lista de posições cadastradas
 */
const TecnicaFormModal = ({ 
  isOpen, 
  onClose, 
  tecnica, 
  onSave,
  posicoesCadastradas,
  uploadPercent,
  uploadPhase
}) => {
  const [formData, setFormData] = useState({
    ...tecnica,
    passos: tecnica.passos?.length > 0 ? tecnica.passos : [""],
    observacoes: tecnica.observacoes?.length > 0 ? tecnica.observacoes : [""]
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // Função para adicionar novo passo ou observação
  const adicionarItem = (tipo) => {
    if (tipo === "passo") {
      setFormData({
        ...formData,
        passos: [...formData.passos, ""]
      });
    } else if (tipo === "observacao") {
      setFormData({
        ...formData,
        observacoes: [...formData.observacoes, ""]
      });
    }
  };

  // Função para atualizar passo ou observação
  const atualizarItem = (tipo, indice, valor) => {
    if (tipo === "passo") {
      const novosPassos = [...formData.passos];
      novosPassos[indice] = valor;
      setFormData({ ...formData, passos: novosPassos });
    } else if (tipo === "observacao") {
      const novasObservacoes = [...formData.observacoes];
      novasObservacoes[indice] = valor;
      setFormData({ ...formData, observacoes: novasObservacoes });
    }
  };

  // Função para remover passo ou observação
  const removerItem = (tipo, indice) => {
    if (tipo === "passo") {
      const novosPassos = formData.passos.filter((_, i) => i !== indice);
      setFormData({ ...formData, passos: novosPassos });
    } else if (tipo === "observacao") {
      const novasObservacoes = formData.observacoes.filter((_, i) => i !== indice);
      setFormData({ ...formData, observacoes: novasObservacoes });
    }
  };

  // Validar dados antes de salvar
  const validarFormulario = () => {
    if (!formData.nome?.trim()) {
      setErro("O nome da técnica é obrigatório.");
      return false;
    }
    
    if (!formData.categoria) {
      setErro("A categoria é obrigatória.");
      return false;
    }
    
    if (!formData.posicao && !formData.novaPosicao) {
      setErro("A posição é obrigatória.");
      return false;
    }
    
    // Validar se existe pelo menos um passo não vazio
    const temPassoValido = formData.passos.some(passo => passo.trim() !== "");
    if (!temPassoValido) {
      setErro("Adicione pelo menos um passo para a técnica.");
      return false;
    }
    
    return true;
  };

  // Manipular o salvamento do formulário com feedback visual
  const handleSave = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    setErro("");
    setSucesso(false);
    
    try {
      // Verificar o arquivo de vídeo antes de enviar
      let dadosParaSalvar = {...formData};
      
      if (formData.videoFile && !(formData.videoFile instanceof File)) {
        setErro("Erro no arquivo de vídeo. Por favor, selecione o arquivo novamente.");
        setLoading(false);
        return;
      }
      
      await onSave(dadosParaSalvar);
      setSucesso(true);
      
      // Fechar modal após sucesso
      setTimeout(() => {
        setSucesso(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Erro ao salvar técnica:", err);
      setErro(err.message || "Erro ao salvar técnica. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Inicializa o formData apenas ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const initialData = {
        ...tecnica,
        passos: Array.isArray(tecnica.passos) && tecnica.passos.length > 0 
          ? [...tecnica.passos] 
          : [""],
        observacoes: Array.isArray(tecnica.observacoes) && tecnica.observacoes.length > 0 
          ? [...tecnica.observacoes] 
          : [""]
      };
      
      setFormData(initialData);
      setErro("");
      setSucesso(false);
    }
  }, [isOpen, tecnica]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tecnica.id ? "Editar Técnica" : "Nova Técnica"}</DialogTitle>
          <DialogDescription>
            {tecnica.id
              ? "Edite os detalhes da técnica selecionada."
              : "Adicione uma nova técnica à sua biblioteca."}
          </DialogDescription>
        </DialogHeader>
        
        <TecnicaForm 
          tecnica={formData} 
          onChange={(novosDados) => {
            // Usar uma função de atualização para garantir que estamos usando o estado mais recente
            if (typeof novosDados === 'function') {
              setFormData(novosDados);
            } else {
              setFormData(novosDados);
            }
          }}
          posicoesCadastradas={posicoesCadastradas || []}
          onAddItem={adicionarItem}
          onUpdateItem={atualizarItem}
          onRemoveItem={removerItem}
        />

        {/* Feedback visual */}
        {(uploadPhase === 'upload' && typeof uploadPercent === 'number') && (
          <div className="my-2">
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="text-blue-600">Enviando vídeo...</span>
              <span className="text-blue-600">{uploadPercent}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded">
              <div className="h-2 bg-blue-600 rounded transition-all" style={{ width: `${uploadPercent}%` }}></div>
            </div>
          </div>
        )}
        {uploadPhase === 'waiting' && (
          <div className="flex items-center justify-center gap-2 text-blue-600 my-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processando vídeo no servidor... isso pode levar alguns segundos.</span>
          </div>
        )}
        {loading && (uploadPercent == null) && (
          <div className="text-center text-blue-600 my-2">Salvando técnica...</div>
        )}
        {erro && (
          <div className="text-center text-red-600 my-2">{erro}</div>
        )}
        {sucesso && (
          <div className="text-center text-green-600 my-2">Técnica salva com sucesso!</div>
        )}
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose} disabled={loading || uploadPhase === 'upload' || uploadPhase === 'waiting'}>
            Cancelar
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSave} disabled={loading || uploadPhase === 'upload' || uploadPhase === 'waiting'}>
            {uploadPhase === 'upload' ? 'Enviando vídeo...' : uploadPhase === 'waiting' ? 'Processando...' : (loading ? "Salvando..." : (tecnica.id ? "Salvar alterações" : "Adicionar técnica"))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TecnicaFormModal;
