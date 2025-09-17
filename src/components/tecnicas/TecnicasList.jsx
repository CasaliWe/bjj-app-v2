import React from "react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import TecnicaCard from "./TecnicaCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Componente para exibir uma lista paginada de técnicas com paginação da API
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.tecnicas - Lista de técnicas da página atual 
 * @param {Object} props.paginacao - Informações de paginação da API
 * @param {boolean} props.loading - Indica se está carregando
 * @param {Function} props.onPageChange - Função para mudar de página
 * @param {Function} props.onEdit - Função para editar técnica
 * @param {Function} props.onDelete - Função para excluir técnica
 * @param {Function} props.onToggleDestaque - Função para alternar destaque
 * @param {Function} props.onShare - Função para compartilhar/descompartilhar
 * @param {Function} props.onAddNew - Função para adicionar nova técnica
 */
const TecnicasList = ({
  tecnicas,
  paginacao,
  loading = false,
  onPageChange,
  onEdit,
  onDelete,
  onToggleDestaque,
  onShare,
  onAddNew
}) => {
  // Renderização condicional para estado de carregamento
  if (loading) {
    return <LoadingSpinner message="Carregando técnicas..." />;
  }

  // Renderização condicional para lista vazia
  if (!tecnicas || tecnicas.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 text-center">
        <Book className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma técnica encontrada</h3>
        <p className="text-muted-foreground max-w-md">
          Comece a registrar suas técnicas para criar sua biblioteca pessoal de Jiu-Jitsu.
        </p>
        {onAddNew && (
          <Button className="mt-4" onClick={onAddNew}>
            Nova Técnica
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tecnicas.map((tecnica) => (
          <TecnicaCard
            key={tecnica.id}
            tecnica={tecnica}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleDestaque={onToggleDestaque}
            onShare={onShare}
          />
        ))}
      </div>

      {/* Paginação */}
      {paginacao && paginacao.totalPaginas > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(paginacao.paginaAtual - 1)}
            disabled={paginacao.paginaAtual <= 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: paginacao.totalPaginas }, (_, index) => {
              const pageNumber = index + 1;
              
              // Em telas pequenas, mostrar apenas páginas próximas da atual
              const shouldShow = 
                pageNumber === 1 || 
                pageNumber === paginacao.totalPaginas || 
                (pageNumber >= paginacao.paginaAtual - 1 && pageNumber <= paginacao.paginaAtual + 1);
              
              if (!shouldShow) {
                if (pageNumber === 2 || pageNumber === paginacao.totalPaginas - 1) {
                  return <span key={pageNumber} className="mx-1">...</span>;
                }
                return null;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === paginacao.paginaAtual ? "default" : "outline"}
                  className="w-8 h-8 p-0"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => onPageChange(paginacao.paginaAtual + 1)}
            disabled={paginacao.paginaAtual >= paginacao.totalPaginas}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};

export default TecnicasList;