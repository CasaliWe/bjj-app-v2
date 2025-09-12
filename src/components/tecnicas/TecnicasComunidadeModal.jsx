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
 * @param {Function} props.onSearch - Função para pesquisar técnicas
 * @param {boolean} props.carregando - Indica se está carregando dados
 */
const TecnicasComunidadeModal = ({ 
  isOpen, 
  onClose, 
  tecnicasComunidade,
  onSearch,
  carregando = false
}) => {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  
  // Filtrar técnicas com base no termo de pesquisa
  const tecnicasFiltradas = tecnicasComunidade.filter(tecnica => {
    const termoLowerCase = termoPesquisa.toLowerCase();
    return (
      tecnica.nome.toLowerCase().includes(termoLowerCase) ||
      tecnica.categoria.toLowerCase().includes(termoLowerCase) ||
      tecnica.posicao.toLowerCase().includes(termoLowerCase) ||
      (tecnica.autor && tecnica.autor.nome.toLowerCase().includes(termoLowerCase))
    );
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(termoPesquisa);
    }
  };

  // Função para compartilhar técnica (a ser implementada com API)
  const handleShare = (tecnica) => {
    console.log("Compartilhar técnica:", tecnica);
    // TODO: Implementar compartilhamento via API
    alert("Função de compartilhamento será implementada em breve!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
        <ScrollArea className="max-h-[60vh]">
          {carregando ? (
            <LoadingSpinner message="Carregando técnicas..." className="py-8" />
          ) : tecnicasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {tecnicasFiltradas.map(tecnica => (
                <TecnicaCard 
                  key={tecnica.id}
                  tecnica={tecnica}
                  showAutor={true}
                  onShare={handleShare}
                />
              ))}
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
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
            Fechar
          </Button>
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
