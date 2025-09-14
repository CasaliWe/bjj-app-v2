import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Lock, 
  User,
  MapPin,
  Building,
  Trophy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Componente que exibe um perfil fechado/privado de usuário
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.profile - Dados do perfil do usuário
 * @returns {JSX.Element} Componente React
 */
const PrivateProfile = ({ profile }) => {
  /**
   * Função para obter a cor da faixa do usuário
   * @returns {string} Classe CSS com a cor correspondente à faixa
   */
  const getBeltColor = () => {
    switch (profile?.faixa?.toLowerCase()) {
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
    if (!profile?.nome) return 'U';
    
    const names = profile.nome.split(' ');
    if (names.length === 1) return names[0].charAt(0);
    
    return names[0].charAt(0) + names[names.length - 1].charAt(0);
  };

  return (
    <div className="space-y-6">
      {/* Informações básicas do perfil */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4">
        {/* Container para foto de perfil e badge */}
        <div className="flex flex-col items-center relative">
          {/* Foto de perfil */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-bjj-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-yellow-500">
            {profile?.imagem ? (
              <img 
                src={`${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${profile.imagem}`}
                alt={`Foto de ${profile.nome}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-bjj-gold/10 text-bjj-gold text-4xl font-bold">
                {getInitials()}
              </div>
            )}
          </div>
          
          {/* Badge de experiência - Fora do container da imagem */}
          {profile?.exp && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1 z-10">
              <Trophy className="h-3 w-3" />
              <span>{profile.exp} Pontos</span>
            </div>
          )}
        </div>
        
        {/* Dados básicos - Limitados apenas para perfil privado */}
        <div className="flex flex-col items-center md:items-start space-y-2 flex-grow">
          <h2 className="text-2xl font-bold">{profile?.nome || 'Usuário'}</h2>
          
          <div className="flex items-center space-x-2">
            <Badge className={getBeltColor()}>
              {profile?.faixa || 'Faixa não informada'}
            </Badge>
            
            {profile?.idade && (
              <Badge variant="outline" className="text-xs">
                {profile.idade} anos
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 mt-2 w-full items-center md:items-start">
            {profile?.academia && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground w-full md:w-auto">
                <Building className="h-4 w-4 flex-shrink-0" />
                <span>{profile.academia}</span>
              </div>
            )}
            
            {(profile?.cidade || profile?.estado) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground w-full md:w-auto">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>
                  {profile?.cidade}
                  {profile?.cidade && profile?.estado && ', '}
                  {profile?.estado}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mensagem de perfil privado */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
        <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Perfil Privado</h3>
          <CardDescription className="text-center max-w-md">
            Este usuário optou por manter seu perfil privado. 
            Apenas as informações básicas estão disponíveis para visualização.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivateProfile;