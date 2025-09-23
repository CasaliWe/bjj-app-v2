import React from 'react';
import { Trophy, Medal, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Componente para exibir uma competição em formato de card na página de perfil
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.competicao - Dados da competição
 */
const UserPageCompeticaoCard = ({ 
  competicao
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

  // Obter a cor da medalha baseado na colocação
  const getMedalColor = () => {
    const resultado = competicao.resultado?.toLowerCase() || '';
    
    if (resultado.includes('ouro') || resultado.includes('1º') || resultado.includes('1 lugar')) {
      return 'text-yellow-500';
    } else if (resultado.includes('prata') || resultado.includes('2º') || resultado.includes('2 lugar')) {
      return 'text-gray-400';
    } else if (resultado.includes('bronze') || resultado.includes('3º') || resultado.includes('3 lugar')) {
      return 'text-amber-700';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Imagem da competição se disponível */}
        {competicao.imagens && competicao.imagens.length > 0 && (
          <div className="w-full h-40 relative">
            <img 
              src={competicao.imagens[0]} 
              alt={competicao.nome || "Competição"}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", competicao.imagens[0]);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="font-bold text-lg line-clamp-1 drop-shadow-md">{competicao.nome || "Competição"}</h3>
              
              <div className="flex items-center gap-2 mt-1">
                {competicao.local && (
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span className="drop-shadow-md">{competicao.local}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-xs ml-auto">
                  <Calendar className="h-3 w-3" />
                  <span className="drop-shadow-md">{formatarData(competicao.data)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Conteúdo sem imagem */}
        {(!competicao.imagens || competicao.imagens.length === 0) && (
          <div className="pt-4 px-4">
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex-shrink-0 p-2 rounded-full bg-muted ${getMedalColor()}`}>
                <Trophy className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg line-clamp-1">{competicao.nome || "Competição"}</h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatarData(competicao.data)}</span>
                  </div>
                  
                  {competicao.local && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{competicao.local}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 pt-3">
          {/* Colocação em destaque */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
            <Medal className={`h-5 w-5 ${getMedalColor()}`} />
            <div className="font-semibold">{competicao.resultado || "Participação"}</div>
          </div>
          
          {/* Estatísticas e informações */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Lutas</div>
              <div className="font-semibold text-lg">
                {competicao.numero_lutas !== undefined ? competicao.numero_lutas : '0'}
              </div>
            </div>
            
            <div className="rounded-lg border p-3 flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Vitórias</div>
              <div className="font-semibold text-lg">
                {competicao.numero_vitorias !== undefined ? competicao.numero_vitorias : '0'}
              </div>
            </div>
            
            <div className="rounded-lg border p-3 flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Finalizações</div>
              <div className="font-semibold text-lg">
                {competicao.numero_finalizacoes !== undefined ? competicao.numero_finalizacoes : '0'}
              </div>
            </div>
            
            <div className="rounded-lg border p-3 flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Derrotas</div>
              <div className="font-semibold text-lg">
                {competicao.numero_derrotas !== undefined ? competicao.numero_derrotas : '0'}
              </div>
            </div>
          </div>
          
          {/* Modalidade */}
          <div className="mt-4 flex justify-center">
            <Badge variant={competicao.modalidade?.toLowerCase() === 'gi' ? 'default' : 'secondary'} className="text-xs px-3 py-1">
              {competicao.modalidade?.toLowerCase() === 'gi' ? 'Gi (Kimono)' : 'No-Gi (Sem Kimono)'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPageCompeticaoCard;