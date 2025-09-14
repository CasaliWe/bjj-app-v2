import React from 'react';
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UserPageCompeticaoCard from "@/components/competicoes/UserPageCompeticaoCard";

/**
 * Componente que exibe as competições públicas de um usuário
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.competitions - Lista de competições do usuário
 * @param {Object} props.pagination - Informações de paginação
 * @param {boolean} props.isLoading - Indica se está carregando
 * @param {string} props.error - Mensagem de erro, se houver
 * @param {Function} props.onPageChange - Função chamada ao mudar de página
 * @returns {JSX.Element} Componente React
 */
const UserCompetitions = ({
  competitions,
  pagination,
  isLoading,
  error,
  onPageChange
}) => {
  // Renderização condicional para estado de carregamento
  if (isLoading) {
    return <LoadingSpinner message="Carregando competições..." />;
  }
  
  // Se houver erro, mostra mensagem
  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }
  
  // Se não houver competições, mostra mensagem
  if (!competitions || competitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhuma competição pública encontrada</h3>
        <p className="text-muted-foreground">
          Este usuário não possui competições públicas para exibir.
        </p>
      </div>
    );
  }
  
  // Depuração dos dados completos
  console.log("Todas as competições (dados brutos):", competitions);
  
  // Renderiza a lista de competições
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {competitions.map((competicao) => {
        // Log mais detalhado de cada competição com os dados originais da API
        console.log(`Competição ${competicao.id} dados completos:`, competicao);
        
        return (
          <UserPageCompeticaoCard 
            key={competicao.id} 
            competicao={competicao}
          />
        );
      })}
      
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
          
          <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
              // Em telas pequenas, mostrar apenas páginas próximas da atual
              const currentPage = pagination.currentPage;
              const shouldShowOnMobile = 
                page === 1 || 
                page === pagination.totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1);
              
              return shouldShowOnMobile ? (
                <Button
                  key={page}
                  variant={page === pagination.currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0 min-w-[2rem]"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ) : (
                <span key={page} className="md:hidden">
                  {page === currentPage - 2 || page === currentPage + 2 ? (
                    <span className="text-muted-foreground px-1">...</span>
                  ) : null}
                </span>
              );
            })}
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
          Exibindo {competitions.length} de {pagination.totalItems} competições
        </div>
      )}
    </div>
  );
};

export default UserCompetitions;