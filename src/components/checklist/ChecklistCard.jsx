import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Calendar,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CATEGORIAS_CHECKLIST } from '@/services/checklist/checklistService.jsx';

/**
 * Componente de card individual do checklist
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.checklist - Dados do checklist
 * @param {Function} props.onEdit - Função para editar o checklist
 * @param {Function} props.onDelete - Função para excluir o checklist
 * @param {Function} props.onAddItem - Função para adicionar item
 * @param {Function} props.onEditItem - Função para editar item
 * @param {Function} props.onDeleteItem - Função para excluir item
 * @param {Function} props.onToggleItem - Função para marcar/desmarcar item
 * @param {Function} props.onMarcarTodos - Função para marcar/desmarcar todos os itens
 */
const ChecklistCard = ({ 
  checklist, 
  onEdit, 
  onDelete, 
  onAddItem, 
  onEditItem, 
  onDeleteItem, 
  onToggleItem,
  onMarcarTodos
}) => {
  const [novoItem, setNovoItem] = useState('');
  const [adicionandoItem, setAdicionandoItem] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState('');

  // Obter informações da categoria
  const categoria = CATEGORIAS_CHECKLIST.find(cat => cat.value === checklist.categoria);
  
  // Calcular estatísticas
  const totalItens = checklist.itens.length;
  const itensConcluidos = checklist.itens.filter(item => item.concluido).length;
  const progresso = totalItens > 0 ? (itensConcluidos / totalItens) * 100 : 0;

  // Adicionar novo item
  const handleAdicionarItem = async () => {
    if (novoItem.trim()) {
      try {
        await onAddItem(checklist.id, novoItem.trim());
        setNovoItem('');
        setAdicionandoItem(false);
      } catch (error) {
        console.error('Erro ao adicionar item:', error);
      }
    }
  };

  // Iniciar edição de item
  const iniciarEdicao = (item) => {
    setEditandoItem(item.id);
    setTextoEdicao(item.texto);
  };

  // Salvar edição de item
  const salvarEdicao = async () => {
    if (textoEdicao.trim()) {
      try {
        await onEditItem(checklist.id, editandoItem, textoEdicao.trim());
        setEditandoItem(null);
        setTextoEdicao('');
      } catch (error) {
        console.error('Erro ao editar item:', error);
      }
    }
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoItem(null);
    setTextoEdicao('');
  };

  // Cancelar adição de item
  const cancelarAdicao = () => {
    setAdicionandoItem(false);
    setNovoItem('');
  };

  return (
  <Card className="w-full hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Categoria em overlay */}
      {categoria && (
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <Badge className={`${categoria.cor || 'bg-foreground'} text-white shadow-sm`}>{categoria.label}</Badge>
        </div>
      )}
      <CardHeader className="pt-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="h-5" />
            <h3 className="font-semibold text-lg truncate" title={checklist.titulo}>
              {checklist.titulo}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(checklist)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMarcarTodos && onMarcarTodos(checklist.id, true)}>
                <Check className="h-4 w-4 mr-2" />
                Marcar todos concluídos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMarcarTodos && onMarcarTodos(checklist.id, false)}>
                <X className="h-4 w-4 mr-2" />
                Reabrir todos os itens
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(checklist.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Informações de criação e progresso */}
        <div className="space-y-2 mt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Criado em {checklist.timestampCriacao}</span>
          </div>
          
          {checklist.concluido && checklist.timestampFinalizacao && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Clock className="h-3 w-3" />
              <span>Finalizado em {checklist.timestampFinalizacao}</span>
            </div>
          )}

          {/* Barra de progresso */}
          {totalItens > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">
                  {itensConcluidos}/{totalItens} concluídos
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(progresso)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4">
        {/* Lista de itens */}
        {/* Campo para adicionar novo item no topo */}
        {adicionandoItem ? (
          <div className="flex gap-2 p-2 border border-border rounded-md bg-muted mb-3">
            <Input
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              placeholder="Digite o item..."
              className="h-9 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdicionarItem();
                if (e.key === 'Escape') cancelarAdicao();
              }}
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleAdicionarItem} className="h-9 w-9 p-0">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelarAdicao} className="h-9 w-9 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAdicionandoItem(true)}
            className="w-full h-9 mb-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar item
          </Button>
        )}

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {checklist.itens.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-start gap-3 p-2 rounded-md border ${
                item.concluido ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-muted border-border'
              }`}
            >
              <Checkbox
                checked={item.concluido}
                onCheckedChange={() => onToggleItem(checklist.id, item.id)}
                className="mt-0.5"
              />
              
              <div className="flex-1 min-w-0">
                {editandoItem === item.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={textoEdicao}
                      onChange={(e) => setTextoEdicao(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') salvarEdicao();
                        if (e.key === 'Escape') cancelarEdicao();
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={salvarEdicao} className="h-8 w-8 p-0">
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelarEdicao} className="h-8 w-8 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="group">
                    <p 
                      className={`text-sm cursor-pointer ${
                        item.concluido ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                      onClick={() => iniciarEdicao(item)}
                    >
                      {item.texto}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground">
                        {item.timestampFinalizacao ? (
                          <span className="text-green-600">Concluído: {item.timestampFinalizacao}</span>
                        ) : (
                          <span>Criado: {item.timestampCriacao}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteItem(checklist.id, item.id)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Nenhum input no final da lista (apenas no topo) */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;