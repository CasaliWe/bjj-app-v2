import React from 'react';
import { Activity } from 'lucide-react';
import CompeticaoCard from './CompeticaoCard';
import { Button } from '../ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Componente para exibir uma lista de competições
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.competicoes - Lista de competições a serem exibidas
 * @param {boolean} props.loading - Se está carregando dados
 * @param {boolean} props.isComunidade - Se está na visualização de comunidade
 * @param {Object} props.paginacao - Informações de paginação
 * @param {Function} props.onPageChange - Função para mudar de página
 * @param {Function} props.onView - Função para visualizar detalhes
 * @param {Function} props.onEdit - Função para editar (apenas minhas competições)
 * @param {Function} props.onDelete - Função para excluir (apenas minhas competições)
 * @param {Function} props.onShare - Função para compartilhar/descompartilhar
 */
const CompeticoesList = ({
  competicoes,
  loading,
  isComunidade = false,
  paginacao,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onShare
}) => {
  // Renderização condicional para estado de carregamento
  if (loading) {
    return <LoadingSpinner message="Carregando competições..." />;
  }

  // Renderização condicional para lista vazia
  if (!competicoes || competicoes.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 text-center">
        <Activity className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isComunidade
            ? 'Nenhuma competição compartilhada na comunidade'
            : 'Nenhuma competição registrada'}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {isComunidade
            ? 'Os usuários ainda não compartilharam suas competições. Volte mais tarde para ver as atualizações.'
            : 'Comece a registrar suas competições para acompanhar seu progresso no Jiu-Jitsu.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de competições */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competicoes.map((competicao) => (
          <CompeticaoCard
            key={competicao.id}
            competicao={competicao}
            isComunidade={isComunidade}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
          />
        ))}
      </div>

      {/* Paginação */}
      {paginacao && paginacao.totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(paginacao.currentPage - 1)}
            disabled={paginacao.currentPage <= 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {/* Apenas dois números entre as setas */}
            {(() => {
              const pages = [];
              if (paginacao.totalPages === 1) {
                pages.push(1);
              } else if (paginacao.currentPage === 1) {
                pages.push(1, 2);
              } else if (paginacao.currentPage === paginacao.totalPages) {
                pages.push(paginacao.totalPages - 1, paginacao.totalPages);
              } else {
                pages.push(paginacao.currentPage, Math.min(paginacao.totalPages, paginacao.currentPage + 1));
              }
              const uniquePages = Array.from(new Set(pages));
              return uniquePages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === paginacao.currentPage ? "default" : "outline"}
                  className="w-8 h-8 p-0"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ));
            })()}
          </div>
          
          <Button
            variant="outline"
            onClick={() => onPageChange(paginacao.currentPage + 1)}
            disabled={paginacao.currentPage >= paginacao.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompeticoesList;
