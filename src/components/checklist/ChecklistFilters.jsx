import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CATEGORIAS_CHECKLIST } from '@/services/checklist/checklistService.jsx';

/**
 * Componente de filtros para checklists
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.filtros - Filtros atuais
 * @param {Function} props.onFiltroChange - Função chamada quando os filtros mudam
 */
const ChecklistFilters = ({ filtros, onFiltroChange }) => {
  // Manipular mudança no termo de busca
  const handleTermoChange = (e) => {
    const novoTermo = e.target.value;
    onFiltroChange({
      ...filtros,
      termo: novoTermo
    });
  };

  // Manipular mudança na categoria
  const handleCategoriaChange = (novaCategoria) => {
    onFiltroChange({
      ...filtros,
      categoria: novaCategoria
    });
  };

  // Limpar filtros
  const limparFiltros = () => {
    onFiltroChange({
      categoria: 'todas',
      termo: ''
    });
  };

  // Verificar se há filtros ativos
  const temFiltrosAtivos = filtros.categoria !== 'todas' || filtros.termo.trim() !== '';

  // Obter categoria atual
  const categoriaAtual = CATEGORIAS_CHECKLIST.find(cat => cat.value === filtros.categoria);

  return (
    <div className="space-y-4 mb-6">
      {/* Top bar: busca + dropdown de categoria + limpar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar checklists..."
            value={filtros.termo}
            onChange={handleTermoChange}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filtros.categoria === 'todas' ? 'Todas categorias' : categoriaAtual?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Categoria</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCategoriaChange('todas')}>
                Todas
              </DropdownMenuItem>
              {CATEGORIAS_CHECKLIST.map((categoria) => (
                <DropdownMenuItem key={categoria.value} onClick={() => handleCategoriaChange(categoria.value)}>
                  <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${categoria.cor}`}></span>
                  {categoria.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {temFiltrosAtivos && (
            <Button variant="ghost" size="sm" onClick={limparFiltros} className="h-8 px-2 text-xs">
              <X className="h-3 w-3 mr-1" /> Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Resumo compacto dos filtros ativos */}
      {temFiltrosAtivos && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
          {filtros.categoria !== 'todas' && (
            <span className="mr-2">Categoria: <strong>{categoriaAtual?.label}</strong></span>
          )}
          {filtros.termo.trim() && (
            <span>Busca: <strong>"{filtros.termo}"</strong></span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChecklistFilters;