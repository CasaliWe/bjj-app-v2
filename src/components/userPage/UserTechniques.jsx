import React from 'react';
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Importando o componente de card de técnica específico para perfil de usuário
import UserPageTecnicaCard from "@/components/tecnicas/UserPageTecnicaCard";

/**
 * Componente que exibe as técnicas públicas de um usuário
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.techniques - Lista de técnicas do usuário
 * @param {Object} props.pagination - Informações de paginação
 * @param {boolean} props.isLoading - Indica se está carregando
 * @param {string} props.error - Mensagem de erro, se houver
 * @param {Function} props.onPageChange - Função chamada ao mudar de página
 * @returns {JSX.Element} Componente React
 */
const UserTechniques = ({
  techniques,
  pagination,
  isLoading,
  error,
  onPageChange
}) => {
  
  // Renderização condicional para estado de carregamento
  if (isLoading) {
    return <LoadingSpinner message="Carregando técnicas..." />;
  }
  
  // Se houver erro, mostra mensagem
  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }
  
  // Se não houver técnicas, mostra mensagem
  if (!techniques || techniques.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhuma técnica pública encontrada</h3>
        <p className="text-muted-foreground">
          Este usuário não possui técnicas públicas para exibir.
        </p>
      </div>
    );
  }
  
  // Renderiza a lista de técnicas
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {techniques.map((tecnica) => (
          <UserPageTecnicaCard 
            key={tecnica.id} 
            tecnica={tecnica} 
          />
        ))}
      </div>
      
      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {/* Apenas dois números entre as setas */}
            {(() => {
              const pages = [];
              if (pagination.totalPages === 1) {
                pages.push(1);
              } else if (pagination.currentPage === 1) {
                pages.push(1, 2);
              } else if (pagination.currentPage === pagination.totalPages) {
                pages.push(pagination.totalPages - 1, pagination.totalPages);
              } else {
                pages.push(pagination.currentPage, Math.min(pagination.totalPages, pagination.currentPage + 1));
              }
              const uniquePages = Array.from(new Set(pages));
              return uniquePages.map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0 min-w-[2rem]"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ));
            })()}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
      
      {/* Informação sobre total de itens */}
      {pagination && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          Exibindo {techniques.length} de {pagination.totalItems} técnicas
        </div>
      )}
    </div>
  );
};

export default UserTechniques;