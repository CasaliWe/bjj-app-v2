import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

/**
 * Componente para exibir detalhes de uma competição
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Object} props.competicao - Competição a ser exibida
 * @param {boolean} props.isComunidade - Se está na visualização de comunidade
 */
const CompeticaoDetalhes = ({ isOpen, onClose, competicao, isComunidade = false }) => {
  const [imagemAtual, setImagemAtual] = useState(0);

  // Se não houver competição, não renderizar
  if (!competicao) return null;

  // Formatação da data
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Navegar para a próxima imagem
  const proximaImagem = () => {
    if (competicao.imagens && competicao.imagens.length > 0) {
      setImagemAtual((prev) => (prev + 1) % competicao.imagens.length);
    }
  };

  // Navegar para a imagem anterior
  const imagemAnterior = () => {
    if (competicao.imagens && competicao.imagens.length > 0) {
      setImagemAtual((prev) => (prev - 1 + competicao.imagens.length) % competicao.imagens.length);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{competicao.nomeEvento}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do usuário (apenas na visualização da comunidade) */}
          {isComunidade && competicao.usuario && (
            <div className="flex items-center gap-3 pb-3 border-b">
              <Avatar>
                <AvatarImage src={competicao.usuario.foto} alt={competicao.usuario.nome} />
                <AvatarFallback>{competicao.usuario.nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{competicao.usuario.nome}</span>
                <Badge variant="outline" className="w-fit">
                  Faixa {competicao.usuario.faixa}
                </Badge>
              </div>
            </div>
          )}

          {/* Galeria de imagens */}
          {competicao.imagens && competicao.imagens.length > 0 ? (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={competicao.imagens[imagemAtual]}
                alt={`Competição ${competicao.nomeEvento}`}
                className="w-full h-64 object-cover"
              />
              
              {competicao.imagens.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={imagemAnterior}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={proximaImagem}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {competicao.imagens.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full ${
                          index === imagemAtual ? 'bg-primary' : 'bg-background/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Sem imagens</span>
            </div>
          )}

          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Local</span>
              <p className="font-medium">{competicao.cidade || 'Não informado'}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Data</span>
              <p className="font-medium">{formatarData(competicao.data)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Modalidade</span>
              <p>
                <Badge variant={competicao.modalidade === 'gi' ? 'default' : 'secondary'}>
                  {competicao.modalidade === 'gi' ? 'Gi (Kimono)' : 'No-Gi (Sem Kimono)'}
                </Badge>
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Colocação</span>
              <p className="font-medium">{competicao.colocacao}</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Total de Lutas</span>
                <p className="font-medium">{competicao.numeroLutas}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Vitórias</span>
                <p className="font-medium">{competicao.numeroVitorias}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Derrotas</span>
                <p className="font-medium">{competicao.numeroDerrotas}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Finalizações</span>
                <p className="font-medium">{competicao.numeroFinalizacoes}</p>
              </div>
            </div>
          </div>

          {/* Observações */}
          {competicao.observacoes && (
            <div>
              <h3 className="font-semibold mb-2">Observações</h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm whitespace-pre-line">{competicao.observacoes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompeticaoDetalhes;
