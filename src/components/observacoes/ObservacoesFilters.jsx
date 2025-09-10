import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CATEGORIAS_TAGS } from '@/services/observacoes/observacoesService';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Componente para filtros de observações
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.filtros - Filtros atuais
 * @param {Function} props.onFiltroChange - Função chamada quando um filtro é alterado
 */
const ObservacoesFilters = ({ filtros, onFiltroChange }) => {
  const isMobile = useIsMobile();

  // Manipulador para alteração de filtro
  const handleFiltroChange = (tipo, valor) => {
    onFiltroChange({ ...filtros, [tipo]: valor });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      {/* Campo de busca */}
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar observações..." 
          className="pl-8 w-full"
          value={filtros.termo || ''}
          onChange={(e) => handleFiltroChange('termo', e.target.value)}
        />
      </div>
      
      {/* Filtro por Tag */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>{isMobile ? '' : 'Filtrar'}</span>
            {filtros.tag !== "todas" && (
              <Badge variant="secondary" className="ml-1">
                {CATEGORIAS_TAGS.find(cat => cat.value === filtros.tag)?.label || filtros.tag}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleFiltroChange('tag', 'todas')}
          >
            <span className={filtros.tag === "todas" ? "font-bold" : ""}>Todas as categorias</span>
          </DropdownMenuItem>
          {CATEGORIAS_TAGS.map((cat) => (
            <DropdownMenuItem
              key={cat.value}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleFiltroChange('tag', cat.value)}
            >
              <div className={`w-2 h-2 rounded-full ${cat.cor.split(" ")[0]}`} />
              <span className={filtros.tag === cat.value ? "font-bold" : ""}>{cat.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ObservacoesFilters;
