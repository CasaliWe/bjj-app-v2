import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TreinoCard from "./TreinoCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Componente que exibe a lista de treinos
 * @param {Object} props Propriedades do componente
 * @param {Array} props.treinos Lista de treinos para exibir
 * @param {boolean} props.loading Indica se está carregando
 * @param {Function} props.onEditar Função chamada ao editar um treino
 * @param {Function} props.onExcluir Função chamada ao excluir um treino
 * @param {Function} props.onAlterarVisibilidade Função chamada ao alterar visibilidade
 * @param {Function} props.onNovo Função chamada ao clicar em "Novo Treino"
 * @param {Object} props.paginacao Informações de paginação
 * @param {Function} props.onMudarPagina Função chamada ao mudar de página
 * @returns {JSX.Element} Componente React
 */
const ListaTreinos = ({
  treinos,
  loading,
  onEditar,
  onExcluir,
  onAlterarVisibilidade,
  onNovo,
  paginacao,
  onMudarPagina
}) => {
  // Renderização condicional para estado de carregamento
  if (loading) {
    return <LoadingSpinner message="Carregando treinos..." />;
  }
  
  // Se não houver treinos, mostra mensagem e botão para adicionar
  if (treinos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhum treino encontrado</h3>
        <p className="text-muted-foreground">
          Comece adicionando um novo treino.
        </p>
        <Button className="mt-4" onClick={onNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Treino
        </Button>
      </div>
    );
  }
  
  // Renderiza a lista de treinos
  return (
    <div className="space-y-4">
      {treinos.map((treino) => (
        <TreinoCard 
          key={treino.id} 
          treino={treino} 
          onEditar={onEditar}
          onExcluir={onExcluir}
          onAlterarVisibilidade={onAlterarVisibilidade}
        />
      ))}
      
      {/* Paginação */}
      {paginacao && paginacao.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMudarPagina(paginacao.currentPage - 1)}
            disabled={paginacao.currentPage === 1}
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
              return uniquePages.map((page) => (
                <Button
                  key={page}
                  variant={page === paginacao.currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0 min-w-[2rem]"
                  onClick={() => onMudarPagina(page)}
                >
                  {page}
                </Button>
              ));
            })()}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMudarPagina(paginacao.currentPage + 1)}
            disabled={paginacao.currentPage === paginacao.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
      
      {/* Informação sobre total de itens */}
      {paginacao && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          Exibindo {treinos.length} de {paginacao.totalItems} treinos
        </div>
      )}
    </div>
  );
};

export default ListaTreinos;
