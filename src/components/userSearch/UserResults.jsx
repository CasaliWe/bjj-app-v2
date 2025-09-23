import React, { useMemo, useState } from 'react';
import UserCard from './UserCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Componente que exibe uma lista de usuários encontrados
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.usuarios - Lista de usuários
 * @param {boolean} props.isLoading - Indica se está carregando
 * @returns {JSX.Element} Componente React
 */
const UserResults = ({ usuarios = [], isLoading = false }) => {
  const [page, setPage] = useState(1);
  const pageSize = 50; 
  const total = usuarios.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Corrigir página fora de faixa se a lista mudar
  if (page > totalPages) {
    // eslint-disable-next-line no-constant-condition
    setTimeout(() => setPage(totalPages), 0);
  }

  const currentSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return usuarios.slice(start, start + pageSize);
  }, [usuarios, page]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
      </div>
    );
  }

  if (!usuarios.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum usuário encontrado com os critérios informados.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info de paginação */}
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Exibindo {(page - 1) * pageSize + 1}
          -{Math.min(page * pageSize, total)} de {total}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {currentSlice.map((usuario, index) => (
          <UserCard key={usuario.bjj_id || index} usuario={usuario} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="px-2">
          <PaginationContent className="flex flex-wrap gap-1 justify-center">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className="select-none"
              />
            </PaginationItem>

            {/* Apenas dois números entre as setas */}
            {(() => {
              const pages = [];
              if (totalPages === 1) {
                pages.push(1);
              } else if (page === 1) {
                pages.push(1, 2);
              } else if (page === totalPages) {
                pages.push(totalPages - 1, totalPages);
              } else {
                pages.push(page, Math.min(totalPages, page + 1));
              }
              const uniquePages = Array.from(new Set(pages));
              return uniquePages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={page === p}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                    className="select-none"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ));
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className="select-none"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UserResults;