import React from 'react';
import { Pencil, Trash2, Eye, Share2, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

/**
 * Componente para exibir uma competição em formato de card
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.competicao - Dados da competição
 * @param {boolean} props.isComunidade - Se está na visualização de comunidade
 * @param {Function} props.onView - Função para visualizar detalhes
 * @param {Function} props.onEdit - Função para editar (apenas minhas competições)
 * @param {Function} props.onDelete - Função para excluir (apenas minhas competições)
 * @param {Function} props.onShare - Função para compartilhar/descompartilhar
 */
const CompeticaoCard = ({ 
  competicao, 
  isComunidade = false,
  onView, 
  onEdit, 
  onDelete, 
  onShare 
}) => {
  // Formatação da data
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Badge de modalidade
  const ModalidadeBadge = () => (
    <Badge variant={competicao.modalidade === 'gi' ? 'default' : 'secondary'}>
      {competicao.modalidade === 'gi' ? 'Gi (Kimono)' : 'No-Gi (Sem Kimono)'}
    </Badge>
  );

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        {/* Cabeçalho com nome do evento e data */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-1">{competicao.nomeEvento}</h3>
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

        {/* Informações da competição */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Colocação:</span>
            <span className="font-semibold">{competicao.colocacao}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Lutas:</span>
            <span>
              {competicao.numeroVitorias}/{competicao.numeroLutas} (
              {competicao.numeroFinalizacoes} finalizações)
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Modalidade:</span>
            <ModalidadeBadge />
          </div>
        </div>

        {/* Informações do usuário (apenas na visualização da comunidade) */}
        {isComunidade && competicao.usuario && (
          <div className="flex items-center gap-2 mt-2 border-t pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={competicao.usuario.foto} alt={competicao.usuario.nome} />
              <AvatarFallback>{competicao.usuario.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{competicao.usuario.nome}</span>
            <Badge variant="outline" className="ml-auto">
              Faixa {competicao.usuario.faixa}
            </Badge>
          </div>
        )}
      </CardContent>

      {/* Botões de ação */}
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
