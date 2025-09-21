import React from 'react';
import ChecklistCard from "./ChecklistCard";
import ChecklistPagination from "./ChecklistPagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Componente lista de checklists
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.checklists - Array de checklists
 * @param {boolean} props.loading - Estado de carregamento
 * @param {Function} props.onEdit - Função para editar checklist
 * @param {Function} props.onDelete - Função para excluir checklist
 * @param {Function} props.onAddItem - Função para adicionar item
 * @param {Function} props.onEditItem - Função para editar item
 * @param {Function} props.onDeleteItem - Função para excluir item
 * @param {Function} props.onToggleItem - Função para marcar/desmarcar item
 * @param {Function} props.onMarcarTodos - Função para marcar/desmarcar todos itens
 */
const ChecklistList = ({ 
  checklists, 
  loading, 
  onEdit, 
  onDelete, 
  onAddItem, 
  onEditItem, 
  onDeleteItem, 
  onToggleItem,
  onMarcarTodos
}) => {
  // Loading state
  if (loading) {
    return <LoadingSpinner message="Carregando checklists..." />;
  }

  // Empty state
  if (!checklists || checklists.length === 0) {
    return (
      <div className="py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-1">Nenhum checklist encontrado</h3>
            <p className="text-sm text-muted-foreground">Crie seu primeiro checklist para começar a organizar suas tarefas.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {checklists.map((checklist) => (
        <ChecklistCard
          key={checklist.id}
          checklist={checklist}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onToggleItem={onToggleItem}
          onMarcarTodos={onMarcarTodos}
        />
      ))}
    </div>
  );
};

export default ChecklistList;