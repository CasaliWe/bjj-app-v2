import React from 'react';
import { useNavigate } from 'react-router-dom';
// Removed duplicate import of React
import { Pencil, Trash2, Eye, Share2, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const CompeticaoCard = ({
  competicao,
  isComunidade = false,
  onView,
  onEdit,
  onDelete,
  onShare
}) => {
  const navigate = useNavigate();

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para navegar para a página do usuário
  const irParaPaginaUsuario = (usuario) => {
    if (usuario && usuario.bjj_id) {
      navigate(`/usuario?bjj_id=${usuario.bjj_id}`);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-1">{competicao.nomeEvento || competicao.nome}</h3>
            {!isComunidade && (
              <div className="flex items-center">
                {competicao.isPublico ? (
                  <Share2 className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">{competicao.cidade}</div>
            <div className="text-sm font-medium">{formatarData(competicao.data)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Categoria:</span>
            <span className="font-semibold">{competicao.categoria || 'Não informada'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Modalidade:</span>
            <Badge variant={competicao.modalidade === 'gi' ? 'default' : 'secondary'}>
              {competicao.modalidade === 'gi' ? 'Gi (Kimono)' : 'No-Gi (Sem Kimono)'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Resultado:</span>
            <span className="font-semibold">{competicao.colocacao || competicao.resultado || 'Não informado'}</span>
          </div>
        </div>

        {competicao.observacoes && (
          <div className="mt-2 p-2 rounded bg-muted/30">
            <span className="text-xs text-muted-foreground">{competicao.observacoes}</span>
          </div>
        )}

        {/* Sempre mostrar informações do usuário se disponíveis, não apenas em modo comunidade */}
        {competicao.usuario && (
          <div 
            className="flex items-center gap-2 mt-2 border-t pt-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            onClick={() => irParaPaginaUsuario(competicao.usuario)}
            title={`Ver perfil de ${competicao.usuario.nome}`}
          >
            <Avatar className="h-6 w-6">
              {competicao.usuario.foto ? (
                <AvatarImage 
                  src={competicao.usuario.foto} 
                  alt={competicao.usuario.nome} 
                  onError={(e) => {
                    console.error("Erro ao carregar imagem de usuário:", e);
                    e.target.src = "/user.jpeg";
                  }}
                />
              ) : (
                <AvatarFallback>{competicao.usuario.nome?.charAt(0) || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium">{competicao.usuario.nome}</span>
            {competicao.usuario.faixa && (
              <Badge variant="outline" className="ml-auto">
                Faixa {competicao.usuario.faixa}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button variant="outline" onClick={() => onView(competicao)} className="flex-1">
          <Eye className="h-4 w-4 mr-2" /> Detalhes
        </Button>
        {!isComunidade && (
          <>
            <Button
              variant={competicao.isPublico ? 'destructive' : 'default'}
              size="icon"
              onClick={() => onShare(competicao.id, !competicao.isPublico)}
              title={competicao.isPublico ? 'Tornar privado' : 'Compartilhar'}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(competicao)}
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(competicao.id)}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompeticaoCard;
