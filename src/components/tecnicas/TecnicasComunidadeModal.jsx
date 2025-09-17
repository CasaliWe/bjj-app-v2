import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Search, Book } from "lucide-react";
import TecnicaCard from "./TecnicaCard";
import VideoPlayer from "./VideoPlayer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Componente modal para exibir técnicas da comunidade
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Array} props.tecnicasComunidade - Lista de técnicas da comunidade
 * @param {Object} props.paginacao - Informações de paginação da API
 * @param {Function} props.onSearch - Função para pesquisar técnicas
 * @param {boolean} props.carregando - Indica se está carregando dados
 */
const TecnicasComunidadeModal = ({ 
  isOpen, 
  onClose, 
  tecnicasComunidade,
  paginacao,
  onSearch,
  carregando = false
}) => {
  const [termoPesquisa, setTermoPesquisa] = useState("");

  // Reset da pesquisa quando o modal é aberto
  const handleModalChange = (open) => {
    if (open) {
      setTermoPesquisa("");
      // Carregar primeira página sem termo de pesquisa
      if (onSearch) {
        onSearch("", 1);
      }
    }
    if (!open) {
      onClose();
    }
  };

  // Pesquisar técnicas (sempre volta para página 1)
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(termoPesquisa, 1);
    }
  };

  // Mudar página mantendo o termo de pesquisa atual
  const mudarPagina = (novaPagina) => {
    if (onSearch && novaPagina >= 1 && novaPagina <= paginacao.totalPaginas) {
      onSearch(termoPesquisa, novaPagina);
    }
  };

  // Função para compartilhar técnica (a ser implementada com API)
  const handleShare = (tecnica) => {
    console.log("Compartilhar técnica:", tecnica);
    // TODO: Implementar compartilhamento via API
    alert("Função de compartilhamento será implementada em breve!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="max-w-[95%] w-full md:max-w-[900px] max-h-[90vh] overflow-hidden p-4 pt-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Técnicas da Comunidade
          </DialogTitle>
          <DialogDescription>
            Descubra técnicas compartilhadas por outros usuários.
          </DialogDescription>
        </DialogHeader>
        
        {/* Campo de pesquisa */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Pesquisar técnicas..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
        
        {/* Resultados */}
        <ScrollArea className="max-h-[50vh]">
          {carregando ? (
            <LoadingSpinner message="Carregando técnicas..." className="py-8" />
          ) : tecnicasComunidade.length > 0 ? (
            <div className="space-y-4">
              {/* Grid de técnicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                {tecnicasComunidade.map(tecnica => (
                  <TecnicaCard 
                    key={tecnica.id}
                    tecnica={tecnica}
                    showAutor={true}
                    onShare={handleShare}
                  />
                ))}
              </div>

              {/* Paginação */}
              {paginacao && paginacao.totalPaginas > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => mudarPagina(paginacao.paginaAtual - 1)}
                    disabled={paginacao.paginaAtual <= 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(paginacao.totalPaginas)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === paginacao.paginaAtual ? "default" : "outline"}
                          size="sm"
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
                    size="sm"
                    onClick={() => mudarPagina(paginacao.paginaAtual + 1)}
                    disabled={paginacao.paginaAtual >= paginacao.totalPaginas}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Book className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Nenhuma técnica encontrada</p>
              <p className="text-muted-foreground mt-1">
                {termoPesquisa 
                  ? "Tente outro termo de pesquisa."
                  : "As técnicas compartilhadas pela comunidade aparecerão aqui."}
              </p>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <div className="flex items-center justify-between w-full">
            {/* Contador de resultados */}
            {paginacao && paginacao.totalItens > 0 && !carregando && (
              <p className="text-sm text-muted-foreground">
                Mostrando {Math.min(paginacao.itensPorPagina * (paginacao.paginaAtual - 1) + 1, paginacao.totalItens)} - {Math.min(paginacao.itensPorPagina * paginacao.paginaAtual, paginacao.totalItens)} de {paginacao.totalItens} técnicas
              </p>
            )}
            
            <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TecnicasComunidadeModal;

/**
 * API Notes:
 * 
 * Endpoints necessários para a funcionalidade de comunidade:
 * 
 * 1. GET /api/tecnicas/comunidade
 *    - Retorna técnicas públicas compartilhadas por outros usuários
 *    - Deve incluir detalhes do autor (id, nome, imagem, bjjId)
 *    - Deve permitir filtragem por termo de pesquisa
 * 
 * 2. POST /api/tecnicas/compartilhar/{id}
 *    - Compartilha uma técnica específica com a comunidade
 *    - Deve atualizar o campo 'publica' para true
 * 
 * 3. DELETE /api/tecnicas/compartilhar/{id}
 *    - Remove o compartilhamento de uma técnica
 *    - Deve atualizar o campo 'publica' para false
 */
