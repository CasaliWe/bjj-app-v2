import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useIsMobile } from '../../hooks/use-mobile';

/**
 * Componente para filtros de competições
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.filtros - Filtros atuais
 * @param {Function} props.onFiltroChange - Função chamada quando um filtro é alterado
 */
const CompeticoesFilters = ({ filtros, onFiltroChange }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Manipulador para alteração de filtro
  const handleFiltroChange = (tipo, valor) => {
    onFiltroChange({ ...filtros, [tipo]: valor });
  };

  return (
    <div className="w-full bg-card shadow rounded-lg p-4 mb-4">
      {/* Conteúdo dos filtros (colapsável no mobile) */}
      <Collapsible open={isMobile ? isOpen : true}>
        {/* Título e botão de colapso (mobile) */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          {isMobile && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                <Filter className={`h-5 w-5 ${isOpen ? 'text-primary' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

        <CollapsibleContent className="space-y-4">
          {/* Filtro de modalidade */}
          <div className="flex flex-col gap-2">
            <label htmlFor="modalidade" className="text-sm font-medium">
              Modalidade
            </label>
            <Select 
              value={filtros.modalidade || 'todos'} 
              onValueChange={(value) => handleFiltroChange('modalidade', value)}
            >
              <SelectTrigger id="modalidade" className="w-full">
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="gi">Gi (Kimono)</SelectItem>
                <SelectItem value="nogi">No-Gi (Sem Kimono)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Barra de pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar competições..."
              className="w-full pl-10 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filtros.busca || ''}
              onChange={(e) => handleFiltroChange('busca', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CompeticoesFilters;
