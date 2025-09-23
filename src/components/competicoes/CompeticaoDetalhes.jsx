import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import ImageSheet from '@/components/ui/ImageSheet';

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  // Redefinir o índice da imagem atual quando a competição mudar ou quando o array de imagens mudar
  useEffect(() => {
    // Verifica se há imagens e se o índice atual é válido
    if (competicao?.imagens) {
      if (imagemAtual >= competicao.imagens.length) {
        setImagemAtual(competicao.imagens.length > 0 ? competicao.imagens.length - 1 : 0);
      }
    } else {
      setImagemAtual(0);
    }
  }, [competicao, competicao?.imagens, imagemAtual]);

  // Função para navegar para a página do usuário
  const irParaPaginaUsuario = (usuario) => {
    if (usuario && usuario.bjj_id) {
      onClose(); // Fechar o modal antes de navegar
      navigate(`/usuario?bjj_id=${usuario.bjj_id}`);
    }
  };

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
            <div 
              className="flex items-center gap-3 pb-3 border-b cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              onClick={() => irParaPaginaUsuario(competicao.usuario)}
              title={`Ver perfil de ${competicao.usuario.nome}`}
            >
              <Avatar>
                <AvatarImage 
                  src={competicao.usuario.tipo_acesso === 'Google' ? competicao.usuario.foto : competicao.usuario.foto ? (competicao.usuario.foto.startsWith('http') ? competicao.usuario.foto : `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${competicao.usuario.foto}`) : null} 
                  alt={competicao.usuario.nome}
                  {...(competicao.usuario.tipo_acesso === 'Google' && {
                      referrerPolicy: "no-referrer",
                      crossOrigin: "anonymous"
                  })}
                  onError={(e) => {
                    console.error("Erro ao carregar imagem de usuário:", e);
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallback = parent.querySelector('[data-radix-avatar-fallback]');
                    if (fallback) {
                        fallback.style.display = 'flex';
                    }
                  }}
                />
                <AvatarFallback>{competicao.usuario.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
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
              {competicao.imagens[imagemAtual] && (
                <img
                  src={competicao.imagens[imagemAtual].url}
                  alt={`Competição ${competicao.nomeEvento || competicao.nome}`}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                  onError={(e) => {
                    console.error("Erro ao carregar imagem:", e);
                    e.target.src = `${import.meta.env.VITE_API_URL || ''}/imagens/placeholder.jpg`;
                  }}
                />
              )}
              
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
              {/* Sheet de pré-visualização por cima do Dialog */}
              <ImageSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                src={competicao.imagens[imagemAtual]?.url}
                alt={`Competição ${competicao.nomeEvento || competicao.nome}`}
                side="right"
              />
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
              <div>
                <Badge variant={competicao.modalidade === 'gi' ? 'default' : 'secondary'}>
                  {competicao.modalidade === 'gi' ? 'Gi (Kimono)' : 'No-Gi (Sem Kimono)'}
                </Badge>
              </div>
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
