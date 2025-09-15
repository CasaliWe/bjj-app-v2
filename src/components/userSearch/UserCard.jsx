import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home } from "lucide-react";

/**
 * Componente que exibe um cartão de usuário
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.usuario - Dados do usuário
 * @returns {JSX.Element} Componente React
 */
const UserCard = ({ usuario }) => {
  const navigate = useNavigate();

  // Cores das faixas (baseado em outras partes da aplicação)
  const getBeltColor = (faixa) => {
    const faixaLower = faixa?.toLowerCase() || '';
    
    if (faixaLower.includes('branca')) return 'bg-white text-black border border-gray-300';
    if (faixaLower.includes('azul')) return 'bg-blue-600 text-white';
    if (faixaLower.includes('roxa')) return 'bg-purple-600 text-white';
    if (faixaLower.includes('marrom')) return 'bg-amber-800 text-white';
    if (faixaLower.includes('preta')) return 'bg-black text-white';
    if (faixaLower.includes('coral')) return 'bg-red-300 text-black';
    if (faixaLower.includes('vermelha')) return 'bg-red-600 text-white';
    
    return 'bg-gray-200 text-gray-800';
  };
  
  /**
   * Função para obter as iniciais do nome do usuário
   * @returns {string} Iniciais do nome
   */
  const getInitials = () => {
    if (!usuario?.nome) return 'U';
    
    const names = usuario.nome.split(' ');
    if (names.length === 1) return names[0].charAt(0);
    
    return names[0].charAt(0) + names[names.length - 1].charAt(0);
  };

  const handleUserClick = () => {
    navigate(`/usuario?bjj_id=${usuario.bjj_id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-t-4 border-t-bjj-gold"
      onClick={handleUserClick}
    >
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                {usuario.imagem && usuario.imagem.trim() !== null ? (
                  <img 
                    src={usuario.imagem} 
                    alt={`Foto de ${usuario.nome || 'perfil'}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-bjj-gold/10 text-bjj-gold text-xl font-bold">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground mb-1">
                  {usuario.nome || 'Nome não disponível'}
                </CardTitle>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <span>BJJ ID: {usuario.bjj_id || 'Não disponível'}</span>
                </div>
              </div>
            </div>
            
            <Badge className={`${getBeltColor(usuario.faixa)} px-3 py-1`}>
              {usuario.faixa || 'Faixa não informada'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mt-2">
            {usuario.cidade && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{usuario.cidade}</span>
              </div>
            )}
            
            {usuario.academia && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>{usuario.academia}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;