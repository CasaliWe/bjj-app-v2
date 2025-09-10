import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  posicoesCadastradas
}) => {
  const [formData, setFormData] = useState(tecnica);
  
  // Função para adicionar novo passo ou observação
  const adicionarItem = (tipo) => {
    if (tipo === "passo") {
      setFormData({
        ...formData,
        passos: [...formData.passos, ""]
      });
    } else {
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
    } else {
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
    } else {
      const novasObservacoes = formData.observacoes.filter((_, i) => i !== indice);
      setFormData({ ...formData, observacoes: novasObservacoes });
    }
  };

  // Manipular o salvamento do formulário
  const handleSave = () => {
    onSave(formData);
  };

  // Atualizar formData quando tecnica mudar (quando abrir o modal com nova técnica)
  useState(() => {
    setFormData(tecnica);
  }, [tecnica]);

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
          onChange={setFormData}
          posicoesCadastradas={posicoesCadastradas}
          onAddItem={adicionarItem}
          onUpdateItem={atualizarItem}
          onRemoveItem={removerItem}
        />
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            {tecnica.id ? "Salvar alterações" : "Adicionar técnica"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TecnicaFormModal;
