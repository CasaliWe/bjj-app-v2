import React, { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import TecnicaCard from "./TecnicaCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Componente para exibir uma lista paginada de técnicas
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.tecnicas - Lista completa de técnicas 
 * @param {number} props.itensPorPagina - Número de itens por página (padrão: 9)
 * @param {boolean} props.loading - Indica se está carregando
 * @param {Function} props.onEdit - Função para editar técnica
 * @param {Function} props.onDelete - Função para excluir técnica
 * @param {Function} props.onToggleDestaque - Função para alternar destaque
 * @param {Function} props.onShare - Função para compartilhar/descompartilhar
 * @param {Function} props.onAddNew - Função para adicionar nova técnica
 */
const TecnicasList = ({
  tecnicas,
  itensPorPagina = 9,
  loading = false,
  onEdit,
  onDelete,
  onToggleDestaque,
  onShare,
  onAddNew
}) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [tecnicasPaginadas, setTecnicasPaginadas] = useState([]);
  const totalPaginas = Math.ceil(tecnicas.length / itensPorPagina);

  // Atualizar paginação quando as técnicas mudarem
  useEffect(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    setTecnicasPaginadas(tecnicas.slice(inicio, fim));
  }, [tecnicas, paginaAtual, itensPorPagina]);

  // Função para mudar de página
  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  // Mostrar spinner de carregamento
  if (loading) {
    return <LoadingSpinner message="Carregando técnicas..." />;
  }

  // Renderização condicional para lista vazia
  if (tecnicas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Book className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhuma técnica encontrada</h3>
        <p className="text-muted-foreground">
          Comece adicionando uma nova técnica.
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
        {tecnicasPaginadas.map((tecnica) => (
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
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual <= 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPaginas }, (_, index) => {
              const pageNumber = index + 1;
              
              // Em telas pequenas, mostrar apenas páginas próximas da atual
              const shouldShow = 
                pageNumber === 1 || 
                pageNumber === totalPaginas || 
                (pageNumber >= paginaAtual - 1 && pageNumber <= paginaAtual + 1);
              
              if (!shouldShow) {
                if (pageNumber === 2 || pageNumber === totalPaginas - 1) {
                  return <span key={pageNumber} className="mx-1">...</span>;
                }
                return null;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === paginaAtual ? "default" : "outline"}
                  className="w-8 h-8 p-0"
                  onClick={() => mudarPagina(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual >= totalPaginas}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};

export default TecnicasList;