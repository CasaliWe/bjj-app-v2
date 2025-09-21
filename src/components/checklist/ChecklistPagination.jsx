import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente de paginação para checklists
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.paginacao - Informações de paginação
 * @param {Function} props.onPageChange - Função chamada quando a página muda
 */
const ChecklistPagination = ({ paginacao, onPageChange }) => {
  const { currentPage, totalPages, totalItems } = paginacao;

  // Não mostrar paginação se houver apenas uma página ou nenhum item
  if (totalPages <= 1) {
    return null;
  }

  // Calcular range de páginas a serem exibidas
  const getPageNumbers = () => {
    const delta = 2; // Número de páginas antes e depois da atual
    const range = [];
    const rangeWithDots = [];

    // Sempre incluir primeira página
    range.push(1);

    // Adicionar páginas ao redor da página atual
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Sempre incluir última página (se não for a primeira)
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Adicionar "..." onde necessário
    let last = 0;
    for (const page of range) {
      if (page - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (page - last !== 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      last = page;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t">
      {/* Informações dos resultados */}
      <div className="text-sm text-gray-600">
        Mostrando {Math.min((currentPage - 1) * 12 + 1, totalItems)} - {Math.min(currentPage * 12, totalItems)} de {totalItems} checklists
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-2">
        {/* Botão Anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {/* Números das páginas */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-gray-500">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-10 h-10 p-0"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Indicador de página atual (mobile) */}
        <div className="sm:hidden flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {currentPage} de {totalPages}
          </span>
        </div>

        {/* Botão Próximo */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="gap-1"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChecklistPagination;