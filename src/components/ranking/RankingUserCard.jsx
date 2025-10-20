import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building, 
  User,
  Trophy,
  Crown,
  Medal,
  Award,
  Home
} from "lucide-react";

/**
 * Componente para exibir um usuário no ranking
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.usuario - Dados do usuário
 * @param {number} props.posicao - Posição no ranking
 * @param {boolean} props.isPodium - Se está no pódium (top 3)
 * @param {JSX.Element} props.medalIcon - Ícone da medalha para o pódium
 * @returns {JSX.Element} Componente React
 */
const RankingUserCard = ({ usuario, posicao, isPodium, medalIcon }) => {
  const navigate = useNavigate();

  /**
   * Função para obter a cor da faixa do usuário
   * @returns {string} Classe CSS com a cor correspondente à faixa
   */
  const getBeltColor = () => {
    switch (usuario?.faixa?.toLowerCase()) {
      case 'branca':
        return 'bg-gray-300 text-gray-800';
      case 'azul':
        return 'bg-blue-500 text-white';
      case 'roxa':
        return 'bg-purple-500 text-white';
      case 'marrom':
        return 'bg-amber-800 text-white';
      case 'preta':
        return 'bg-black text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
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

  /**
   * Função para navegar para o perfil do usuário
   */
  const irParaPaginaUsuario = () => {
    navigate(`/usuario?bjj_id=${usuario.bjj_id}`);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 border-t-4 ${
        isPodium ? 'border-t-bjj-gold' : 'border-t-bjj-gold'
      }`}
      onClick={irParaPaginaUsuario}
    >
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col gap-2">
          {/* Primeira linha: Posição + Medalha (se tiver) */}
          <div className="flex items-center gap-2 mb-2">
            {isPodium ? (
              <div className="flex items-center gap-2">
                {medalIcon}
                <span className="font-bold text-lg text-bjj-gold">#{posicao}</span>
              </div>
            ) : (
              <span className="font-semibold text-lg text-muted-foreground">#{posicao}</span>
            )}
            
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm ml-auto">
              <Trophy className="h-4 w-4" />
              <span>{usuario?.exp || 0} EXP</span>
            </div>
          </div>

          {/* Layout igual à pesquisa de usuários */}
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
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {usuario?.nome || 'Nome não informado'}
                </h3>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <span>BJJ ID: {usuario?.bjj_id || 'Não disponível'}</span>
                </div>
              </div>
            </div>
            
            <Badge className={`${getBeltColor()} px-3 py-1`}>
              {usuario?.faixa || 'Faixa não informada'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mt-2">
            {usuario?.cidade && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{usuario.cidade}</span>
              </div>
            )}
            
            {usuario?.academia && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{usuario.academia}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingUserCard;