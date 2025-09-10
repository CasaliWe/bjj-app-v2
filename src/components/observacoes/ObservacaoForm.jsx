import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIAS_TAGS } from '@/services/observacoes/observacoesService';

/**
 * Componente de formulário para criar/editar observações
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Controla se o modal está aberto
 * @param {Function} props.onClose - Função chamada ao fechar o modal
 * @param {Function} props.onSave - Função chamada ao salvar a observação
 * @param {Object} props.observacaoAtual - Observação atual sendo editada (null para criação)
 */
const ObservacaoForm = ({ isOpen, onClose, onSave, observacaoAtual }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    tag: 'treino',
  });
  const [errors, setErrors] = useState({});

  // Atualizar o formulário quando a observação atual mudar
  useEffect(() => {
    if (observacaoAtual) {
      setFormData({
        titulo: observacaoAtual.titulo || '',
        conteudo: observacaoAtual.conteudo || '',
        tag: observacaoAtual.tag || 'treino',
      });
    } else {
      setFormData({
        titulo: '',
        conteudo: '',
        tag: 'treino',
      });
    }
    setErrors({});
  }, [observacaoAtual, isOpen]);

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
      novosErros.titulo = 'O título é obrigatório';
    }
    
    if (!formData.conteudo.trim()) {
      novosErros.conteudo = 'O conteúdo é obrigatório';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Manipulador para salvar a observação
  const handleSave = () => {
    if (validarFormulario()) {
      const dadosParaSalvar = observacaoAtual 
        ? { ...observacaoAtual, ...formData }
        : formData;
        
      onSave(dadosParaSalvar);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {observacaoAtual ? 'Editar Observação' : 'Nova Observação'}
          </DialogTitle>
          <DialogDescription>
            {observacaoAtual 
              ? 'Edite sua nota, dica ou insight.'
              : 'Adicione notas, dicas e insights para consulta futura.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Campo Título */}
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input 
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder="Ex: Dica de passagem de guarda"
              className={errors.titulo ? 'border-red-500' : ''}
            />
            {errors.titulo && (
              <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
            )}
          </div>
          
          {/* Campo Tag */}
          <div className="grid gap-2">
            <Label htmlFor="tag">Categoria</Label>
            <Select 
              value={formData.tag}
              onValueChange={(valor) => handleChange('tag', valor)}
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
              value={formData.conteudo}
              onChange={(e) => handleChange('conteudo', e.target.value)}
              placeholder="Descreva aqui sua observação com detalhes..."
              className={errors.conteudo ? 'border-red-500' : ''}
            />
            {errors.conteudo && (
              <p className="text-red-500 text-xs mt-1">{errors.conteudo}</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button 
            type="button"
            className="w-full sm:w-auto"
            onClick={handleSave}
          >
            {observacaoAtual ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ObservacaoForm;
