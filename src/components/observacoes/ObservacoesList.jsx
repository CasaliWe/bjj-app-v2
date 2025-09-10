import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, MoreVertical, PencilLine, Tag, Trash2 } from 'lucide-react';
import { TagBadge, TextoExpandivel, formatarDataCurta } from './ObservacoesUtils';

/**
 * Componente para listar observações
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.observacoes - Lista de observações a exibir
 * @param {boolean} props.loading - Indica se está carregando
 * @param {Function} props.onEdit - Função chamada ao editar
 * @param {Function} props.onDelete - Função chamada ao excluir
 */
const ObservacoesList = ({ observacoes, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!observacoes.length) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <FileText className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-xl font-semibold mb-1">Nenhuma observação encontrada</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Tente mudar seus filtros ou adicione uma nova observação
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {observacoes.map((observacao) => (
        <Card key={observacao.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
          <div className="relative">
            <div className="absolute top-0 left-0 z-10">
              <TagBadge categoria={observacao.tag} />
            </div>
            
            <CardHeader className="pt-10 pb-2 space-y-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatarDataCurta(observacao.data)}
                  </span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onSelect={(e) => {
                        e.preventDefault();
                        onEdit(observacao);
                      }}
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onSelect={() => onDelete(observacao.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <CardTitle className="text-lg">{observacao.titulo}</CardTitle>
            </CardHeader>
          </div>
          <CardContent className="pt-2 flex-grow">
            <TextoExpandivel texto={observacao.conteudo} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ObservacoesList;
