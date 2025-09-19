import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlanoJogo } from "@/hooks/use-plano-jogo";

export default function PlanoFormModal({ isOpen, onClose, onSubmit, planoParaEditar = null }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: ""
  });
  const [errors, setErrors] = useState({});
  const { atualizarPlano } = usePlanoJogo();

  // Carregar dados do plano para edição
  useEffect(() => {
    if (planoParaEditar) {
      setFormData({
        nome: planoParaEditar.nome || "",
        descricao: planoParaEditar.descricao || "",
        categoria: planoParaEditar.categoria || ""
      });
    } else {
      // Resetar form para novo plano
      setFormData({
        nome: "",
        descricao: "",
        categoria: ""
      });
    }
  }, [planoParaEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro do campo se ele for preenchido
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (planoParaEditar) {
      // Atualizando plano existente
      const planoAtualizado = atualizarPlano(planoParaEditar.id, formData);
      if (planoAtualizado) {
        onClose();
      }
    } else {
      // Criando novo plano
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {planoParaEditar ? "Editar plano de jogo" : "Criar novo plano de jogo"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do plano</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Plano para Competição"
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && (
              <p className="text-destructive text-xs">{errors.nome}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o objetivo deste plano de jogo"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria (opcional)</Label>
            <Input
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ex: Competição, Treino, Específica"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{planoParaEditar ? "Salvar alterações" : "Criar plano"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}