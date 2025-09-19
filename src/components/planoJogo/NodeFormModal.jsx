import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function NodeFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: "tecnica"
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

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
    
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar técnica manualmente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da técnica</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Triângulo"
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
              placeholder="Descreva a técnica ou adicione observações"
              rows={3}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}