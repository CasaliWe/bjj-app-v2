import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * Componente de paginação para a lista de observações
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.paginacao - Objeto de paginação com currentPage e totalPages
 * @param {Function} props.onPageChange - Função chamada ao mudar de página
 */
const ObservacoesPagination = ({ paginacao, onPageChange }) => {
  const { currentPage, totalPages } = paginacao;

  // Se houver apenas uma página, não exibe a paginação
  if (totalPages <= 1) {
    return null;
  }

  // Função para gerar os itens de página
  const renderPageItems = () => {
    const items = [];
    
    // Função para adicionar um item de página
    const addPageItem = (pageNum, isActive = false) => {
      items.push(
        <PaginationItem key={`page-${pageNum}`}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageNum);
            }}
            href="#"
            isActive={isActive}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      );
    };

    // Lógica para determinar quais páginas mostrar
    // Sempre mostra a primeira, a última e algumas ao redor da atual
    
    // Primeira página
    addPageItem(1, currentPage === 1);
    
    // Elipse antes se necessário
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Páginas ao redor da atual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue; // Evita duplicar primeira/última página
      addPageItem(i, i === currentPage);
    }
    
    // Elipse depois se necessário
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Última página (apenas se não for a primeira)
    if (totalPages > 1) {
      addPageItem(totalPages, currentPage === totalPages);
    }
    
    return items;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>
        
        {renderPageItems()}
        
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          >
            Próxima
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ObservacoesPagination;
