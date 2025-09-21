import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIAS_CHECKLIST } from '@/services/checklist/checklistService.jsx';

/**
 * Componente de formulário para criar/editar checklists
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Controla se o modal está aberto
 * @param {Function} props.onClose - Função chamada ao fechar o modal
 * @param {Function} props.onSave - Função chamada ao salvar o checklist
 * @param {Object} props.checklistAtual - Checklist atual sendo editado (null para criação)
 */
const ChecklistForm = ({ isOpen, onClose, onSave, checklistAtual }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'treino',
  });
  const [errors, setErrors] = useState({});

  // Atualizar o formulário quando o checklist atual mudar
  useEffect(() => {
    if (checklistAtual) {
      setFormData({
        titulo: checklistAtual.titulo || '',
        categoria: checklistAtual.categoria || 'treino',
      });
    } else {
      setFormData({
        titulo: '',
        categoria: 'treino',
      });
    }
    setErrors({});
  }, [checklistAtual, isOpen]);

  // Manipulador para alteração nos campos do formulário
  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    
    // Limpar erro do campo que foi alterado
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: null }));
    }
  };

  // Validar o formulário
  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.titulo.trim()) {
      novosErros.titulo = 'Título é obrigatório';
    } else if (formData.titulo.trim().length < 3) {
      novosErros.titulo = 'Título deve ter pelo menos 3 caracteres';
    } else if (formData.titulo.trim().length > 100) {
      novosErros.titulo = 'Título deve ter no máximo 100 caracteres';
    }

    if (!formData.categoria) {
      novosErros.categoria = 'Categoria é obrigatória';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    const dados = {
      titulo: formData.titulo.trim(),
      categoria: formData.categoria
    };

    // Se estamos editando, incluir o ID
    if (checklistAtual && checklistAtual.id) {
      dados.id = checklistAtual.id;
    }

    onSave(dados);
  };

  // Obter label da categoria selecionada
  const obterLabelCategoria = (value) => {
    const categoria = CATEGORIAS_CHECKLIST.find(cat => cat.value === value);
    return categoria ? categoria.label : value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {checklistAtual ? 'Editar Checklist' : 'Novo Checklist'}
          </DialogTitle>
          <DialogDescription>
            {checklistAtual 
              ? 'Edite as informações do seu checklist.' 
              : 'Crie um novo checklist para organizar suas tarefas.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Campo Título */}
          <div className="grid gap-2">
            <Label htmlFor="titulo">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder="Ex: Preparação para competição"
              className={errors.titulo ? 'border-red-500' : ''}
              maxLength={100}
            />
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.titulo.length}/100 caracteres
            </p>
          </div>

          {/* Campo Categoria */}
          <div className="grid gap-2">
            <Label htmlFor="categoria">
              Categoria <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleChange('categoria', value)}
            >
              <SelectTrigger className={errors.categoria ? 'border-red-500' : ''}>
                <SelectValue>
                  {obterLabelCategoria(formData.categoria)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_CHECKLIST.map((categoria) => (
                  <SelectItem key={categoria.value} value={categoria.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${categoria.cor.split(' ')[0]}`}></div>
                      {categoria.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-sm text-red-500">{errors.categoria}</p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
              {checklistAtual ? 'Salvar Alterações' : 'Criar Checklist'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistForm;