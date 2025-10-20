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
  Award
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
      className={`bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-200 cursor-pointer ${
        isPodium ? 'ring-2 ring-bjj-gold/30 shadow-lg' : ''
      }`}
      onClick={irParaPaginaUsuario}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Posição e Medalha */}
          <div className="flex items-center gap-2 min-w-[60px]">
            {isPodium ? (
              <div className="flex items-center gap-1">
                {medalIcon}
                <span className="font-bold text-lg text-bjj-gold">#{posicao}</span>
              </div>
            ) : (
              <span className="font-semibold text-lg text-muted-foreground">#{posicao}</span>
            )}
          </div>

          {/* Foto de perfil */}
          <div className="w-16 h-16 rounded-full bg-bjj-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-bjj-gold/20">
            {usuario?.imagem ? (
              <img 
                src={usuario.tipo_acesso === 'Google' ? usuario.imagem : `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${usuario.imagem}`}
                alt={`Foto de ${usuario.nome}`} 
                className="w-full h-full object-cover"
                {...(usuario.tipo_acesso === 'Google' && {
                    referrerPolicy: "no-referrer",
                    crossOrigin: "anonymous"
                })}
                onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallbackDiv = parent.querySelector('.fallback-initials-ranking');
                    if (fallbackDiv) {
                        fallbackDiv.style.display = 'flex';
                    }
                }}
                onLoad={(e) => {
                    const parent = e.target.parentElement;
                    const fallbackDiv = parent.querySelector('.fallback-initials-ranking');
                    if (fallbackDiv) {
                        fallbackDiv.style.display = 'none';
                    }
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center bg-bjj-gold/10 text-bjj-gold text-xl font-bold fallback-initials-ranking ${usuario?.imagem ? 'hidden' : ''}`} style={{ display: usuario?.imagem ? 'none' : 'flex' }}>
              {getInitials()}
            </div>
          </div>

          {/* Informações do usuário */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Nome e badges */}
              <div className="min-w-0">
                <h3 className="font-semibold text-lg text-foreground truncate">
                  {usuario?.nome || 'Nome não informado'}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {usuario?.faixa && (
                    <Badge className={`${getBeltColor()} text-xs`}>
                      {usuario.faixa}
                    </Badge>
                  )}
                  
                  {usuario?.idade && (
                    <Badge variant="outline" className="text-xs">
                      {usuario.idade} anos
                    </Badge>
                  )}

                  {usuario?.graduacao && (
                    <Badge variant="secondary" className="text-xs">
                      {usuario.graduacao}
                    </Badge>
                  )}
                </div>
              </div>

              {/* EXP */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                <Trophy className="h-4 w-4" />
                <span>{usuario?.exp || 0} EXP</span>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              {usuario?.academia && (
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{usuario.academia}</span>
                </div>
              )}
              
              {(usuario?.cidade || usuario?.estado) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {usuario?.cidade}
                    {usuario?.cidade && usuario?.estado && ', '}
                    {usuario?.estado}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingUserCard;