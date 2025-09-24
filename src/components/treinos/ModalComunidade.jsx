import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TreinoCard from "./TreinoCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Componente para o modal de treinos da comunidade
 * @param {Object} props Propriedades do componente
 * @param {boolean} props.aberto Estado do modal (aberto/fechado)
 * @param {Function} props.setAberto Função para alterar estado do modal
 * @param {Array} props.treinos Lista de treinos da comunidade
 * @param {Object} props.paginacao Informações de paginação
 * @param {boolean} props.carregando Estado de carregamento
 * @param {Function} props.onMudarPagina Função chamada ao mudar de página
 * @returns {JSX.Element} Componente React
 */
const ModalComunidade = ({
  aberto,
  setAberto,
  treinos,
  paginacao,
  carregando,
  onMudarPagina
}) => {
  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="max-w-[95%] w-full md:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Treinos da Comunidade
          </DialogTitle>
          <DialogDescription>
            Veja treinos compartilhados por outros praticantes. 
            Para compartilhar seus treinos, marque-os como públicos ao criar ou editar.
          </DialogDescription>
        </DialogHeader>
        
        {carregando ? (
          <LoadingSpinner message="Carregando treinos..." className="py-8" />
        ) : treinos.length === 0 ? (
          <div className="py-8 text-center">
            <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum treino compartilhado ainda</p>
            <p className="text-muted-foreground mt-1">
              Seja o primeiro a compartilhar um treino com a comunidade!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {treinos.map((treino) => (
                <TreinoCard 
                  key={treino.id} 
                  treino={treino} 
                  onEditar={() => {}} // Somente visualização
                  onExcluir={() => {}} // Somente visualização
                  isComunidade={true}
                />
              ))}
            </div>
            
            {/* Paginação */}
            {paginacao.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
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
            <div className="text-center text-sm text-muted-foreground mt-2">
              Exibindo {treinos.length} de {paginacao.totalItems} treinos
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalComunidade;
