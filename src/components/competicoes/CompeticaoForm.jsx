import React, { useState, useEffect } from 'react';
import { X, Plus, Trash, Upload, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { OPCOES_COLOCACAO } from '../../services/competicoes/competicoesService';

/**
 * Componente de formulário para adicionar/editar competições
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Function} props.onSave - Função para salvar a competição
 * @param {Object} props.competicaoAtual - Competição a ser editada (ou null para nova)
 */
const CompeticaoForm = ({ isOpen, onClose, onSave, competicaoAtual = null }) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    nomeEvento: '',
    cidade: '',
    data: '',
    modalidade: 'gi',
    colocacao: '1º lugar',
    numeroLutas: 0,
    numeroVitorias: 0,
    numeroDerrotas: 0,
    numeroFinalizacoes: 0,
    observacoes: '',
    imagens: [],
    isPublico: false
  });

  // Estado para arquivos temporários (ainda não carregados)
  const [arquivosTemp, setArquivosTemp] = useState([]);

  // Preencher o formulário quando estiver editando
  useEffect(() => {
    if (competicaoAtual) {
      // Formatação da data para o formato do input (YYYY-MM-DD)
      const formatarDataParaInput = (dataString) => {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toISOString().split('T')[0];
      };

      setFormData({
        ...competicaoAtual,
        data: formatarDataParaInput(competicaoAtual.data)
      });
    } else {
      // Reset do formulário para nova competição
      setFormData({
        nomeEvento: '',
        cidade: '',
        data: '',
        modalidade: 'gi',
        colocacao: '1º lugar',
        numeroLutas: 0,
        numeroVitorias: 0,
        numeroDerrotas: 0,
        numeroFinalizacoes: 0,
        observacoes: '',
        imagens: [],
        isPublico: false
      });
    }
    
    // Limpar arquivos temporários
    setArquivosTemp([]);
  }, [competicaoAtual, isOpen]);

  // Manipulador de alterações no formulário
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Converter para número quando for um campo numérico
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Manipulador para alteração de select
  const handleSelectChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Manipulador para alteração de switch
  const handleSwitchChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  // Adicionar imagem (simulado)
  const handleAddImagem = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Criar URLs temporárias para as imagens selecionadas
    const novasImagens = Array.from(files).map(file => {
      const url = URL.createObjectURL(file);
      return { file, url };
    });

    setArquivosTemp([...arquivosTemp, ...novasImagens]);
  };

  // Remover imagem temporária
  const handleRemoverImagemTemp = (index) => {
    const novoArquivosTemp = [...arquivosTemp];
    
    // Liberar URL para evitar vazamento de memória
    URL.revokeObjectURL(novoArquivosTemp[index].url);
    
    novoArquivosTemp.splice(index, 1);
    setArquivosTemp(novoArquivosTemp);
  };

  // Remover imagem existente
  const handleRemoverImagem = (index) => {
    const novasImagens = [...formData.imagens];
    novasImagens.splice(index, 1);
    setFormData({
      ...formData,
      imagens: novasImagens
    });
  };

  // Salvar competição
  const handleSave = () => {
    // Em uma aplicação real, aqui faria o upload das imagens para um servidor
    // e depois salvaria os URLs retornados

    // Simular adição das novas imagens às existentes
    const imagensSimuladas = arquivosTemp.map(arquivo => arquivo.url);
    
    // Preparar dados para salvar
    const dadosParaSalvar = {
      ...formData,
      // Adicionar novas imagens às existentes
      imagens: [...formData.imagens, ...imagensSimuladas]
    };
    
    onSave(dadosParaSalvar);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {competicaoAtual ? 'Editar Competição' : 'Nova Competição'}
          </DialogTitle>
          <DialogDescription>
            {competicaoAtual
              ? 'Atualize os detalhes da sua competição'
              : 'Registre os detalhes da competição que você participou'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeEvento">Nome do Evento</Label>
              <Input
                id="nomeEvento"
                name="nomeEvento"
                value={formData.nomeEvento}
                onChange={handleChange}
                placeholder="Ex: Campeonato Brasileiro de Jiu-Jitsu"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade/Estado</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Detalhes da Participação */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modalidade">Modalidade</Label>
              <Select
                value={formData.modalidade}
                onValueChange={(value) => handleSelectChange('modalidade', value)}
              >
                <SelectTrigger id="modalidade">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gi">Gi (Kimono)</SelectItem>
                  <SelectItem value="nogi">No-Gi (Sem Kimono)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colocacao">Colocação</Label>
              <Select
                value={formData.colocacao}
                onValueChange={(value) => handleSelectChange('colocacao', value)}
              >
                <SelectTrigger id="colocacao">
                  <SelectValue placeholder="Selecione a colocação" />
                </SelectTrigger>
                <SelectContent>
                  {OPCOES_COLOCACAO.map((opcao) => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroLutas">Número de Lutas</Label>
              <Input
                id="numeroLutas"
                name="numeroLutas"
                type="number"
                min="0"
                value={formData.numeroLutas}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroVitorias">Número de Vitórias</Label>
              <Input
                id="numeroVitorias"
                name="numeroVitorias"
                type="number"
                min="0"
                max={formData.numeroLutas}
                value={formData.numeroVitorias}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroDerrotas">Número de Derrotas</Label>
              <Input
                id="numeroDerrotas"
                name="numeroDerrotas"
                type="number"
                min="0"
                max={formData.numeroLutas}
                value={formData.numeroDerrotas}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroFinalizacoes">Finalizações</Label>
              <Input
                id="numeroFinalizacoes"
                name="numeroFinalizacoes"
                type="number"
                min="0"
                max={formData.numeroVitorias}
                value={formData.numeroFinalizacoes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Descreva suas impressões, técnicas usadas, desafios enfrentados..."
              rows={4}
            />
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-2">
            <Label>Imagens</Label>
            
            {/* Exibição de imagens existentes */}
            {formData.imagens && formData.imagens.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {formData.imagens.map((imagem, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={imagem}
                      alt={`Competição ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoverImagem(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Exibição de imagens temporárias */}
            {arquivosTemp.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {arquivosTemp.map((arquivo, index) => (
                  <div key={`temp-${index}`} className="relative group">
                    <img
                      src={arquivo.url}
                      alt={`Nova imagem ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoverImagemTemp(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Botão de upload */}
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4">
              <label htmlFor="upload-image" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Clique para adicionar imagens</span>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddImagem}
                />
              </label>
            </div>
          </div>

          {/* Compartilhamento */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublico"
              checked={formData.isPublico}
              onCheckedChange={(checked) => handleSwitchChange('isPublico', checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="isPublico" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar com a comunidade
              </Label>
              <p className="text-sm text-muted-foreground">
                Outros usuários poderão ver esta competição na aba Comunidade
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Plus className="h-4 w-4 mr-2" /> 
            {competicaoAtual ? 'Atualizar Competição' : 'Adicionar Competição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompeticaoForm;
