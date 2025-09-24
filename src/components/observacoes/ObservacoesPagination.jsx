import React from 'react';
import {
  Pagination,
  PaginationContent,
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

    // Lógica para mostrar apenas dois números entre as setas
    const pages = [];
    if (totalPages === 1) {
      pages.push(1);
    } else if (currentPage === 1) {
      pages.push(1, 2);
    } else if (currentPage === totalPages) {
      pages.push(totalPages - 1, totalPages);
    } else {
      pages.push(currentPage, Math.min(totalPages, currentPage + 1));
    }
    
    const uniquePages = Array.from(new Set(pages));
    uniquePages.forEach(pageNum => {
      addPageItem(pageNum, pageNum === currentPage);
    });
    
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
