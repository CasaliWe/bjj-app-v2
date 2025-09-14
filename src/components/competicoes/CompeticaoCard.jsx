import React from 'react';

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
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-1">{competicao.nome}</h3>
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
            <div className="text-sm text-muted-foreground">{competicao.local}</div>
            <div className="text-sm font-medium">{formatarData(competicao.data)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Categoria:</span>
            <span className="font-semibold">{competicao.categoria}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Modalidade:</span>
            <Badge variant={competicao.modalidade === 'gi' ? 'default' : 'secondary'}>
              {competicao.modalidade === 'gi' ? 'Gi (Kimono)' : 'No-Gi (Sem Kimono)'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Resultado:</span>
            <span className="font-semibold">{competicao.resultado}</span>
          </div>
        </div>

        {competicao.observacoes && (
          <div className="mt-2 p-2 rounded bg-muted/30">
            <span className="text-xs text-muted-foreground">{competicao.observacoes}</span>
          </div>
        )}

        {isComunidade && competicao.usuario && (
          <div className="flex items-center gap-2 mt-2 border-t pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={competicao.usuario.imagem} alt={competicao.usuario.nome} />
              <AvatarFallback>{competicao.usuario.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{competicao.usuario.nome}</span>
            <Badge variant="outline" className="ml-auto">
              Faixa {competicao.usuario.faixa}
            </Badge>
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
