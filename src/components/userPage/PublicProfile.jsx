import React from 'react';
import { 
  MapPin, 
  User, 
  Building,
  Weight,
  Trophy,
  Heart,
  BookOpen,
  Globe,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

/**
 * Componente que exibe o perfil público de um usuário
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.profile - Dados do perfil do usuário
 * @returns {JSX.Element} Componente React
 */
const PublicProfile = ({ profile }) => {
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

  /**
   * Função para formatar link de rede social
   * @param {string} url - URL da rede social
   * @returns {string} URL formatada
   */
  const formatSocialLink = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
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
        
        {/* Dados básicos */}
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
          
          {profile?.bio && (
            <p className="text-sm text-muted-foreground mt-2 text-center md:text-left">
              {profile.bio}
            </p>
          )}
          
          {/* Informações pessoais - layout responsivo */}
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
            
            {profile?.peso && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground w-full md:w-auto">
                <Weight className="h-4 w-4 flex-shrink-0" />
                <span>{profile.peso} kg</span>
              </div>
            )}
          </div>
          
          {/* Redes sociais */}
          <div className="flex flex-wrap gap-4 mt-2">
            {profile?.instagram && (
              <a 
                href={formatSocialLink(profile.instagram)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="Instagram"
              >
                <img src="/instagram.png" alt="Instagram" style={{ width: '24px', height: '24px' }} className="sm:w-5 sm:h-5" />
              </a>
            )}
            
            {profile?.youtube && (
              <a 
                href={formatSocialLink(profile.youtube)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="YouTube"
              >
                <img src="/youtube.png" alt="YouTube" style={{ width: '24px', height: '24px' }} className="sm:w-5 sm:h-5" />
              </a>
            )}
            
            {profile?.tiktok && (
              <a 
                href={formatSocialLink(profile.tiktok)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="TikTok"
              >
                <img src="/tiktok.png" alt="TikTok" style={{ width: '24px', height: '24px' }} className="sm:w-5 sm:h-5" />
              </a>
            )}
            
            {profile?.whatsapp && (
              <a 
                href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="WhatsApp"
              >
                <img src="/whatsapp.png" alt="WhatsApp" style={{ width: '24px', height: '24px' }} className="sm:w-5 sm:h-5" />
              </a>
            )}
            
            {profile?.email && (
              <a 
                href={`mailto:${profile.email}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="Email"
              >
                <img src="/email.png" alt="Email" style={{ width: '24px', height: '24px' }} className="sm:w-5 sm:h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Informações de Jiu-Jitsu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile?.graduacao && (
          <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Graduação</h3>
            <p className="text-lg font-semibold">{profile.graduacao}</p>
          </div>
        )}
        
        {profile?.competidor && (
          <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Competidor</h3>
            <p className="text-lg font-semibold">{profile.competidor}</p>
          </div>
        )}
        
        {profile?.estilo && (
          <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Estilo</h3>
            <p className="text-lg font-semibold">{profile.estilo}</p>
          </div>
        )}
        
        {profile?.guarda && (
          <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Guarda</h3>
            <p className="text-lg font-semibold">{profile.guarda}</p>
          </div>
        )}
        
        {profile?.posicao && (
          <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Posição</h3>
            <p className="text-lg font-semibold">{profile.posicao}</p>
          </div>
        )}
        
        {profile?.finalizacao && (
          <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Finalização</h3>
            <p className="text-lg font-semibold">{profile.finalizacao}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;