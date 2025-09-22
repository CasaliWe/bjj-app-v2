import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs,  
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  User
} from "lucide-react";

// contexts
import { useUser } from "@/contexts/UserContext";

// components
import { Informacoes } from "@/components/perfil/Informacoes";
import { AlterarSenha } from "@/components/perfil/AlterarSenha";
import { Configuracoes } from "@/components/perfil/Configuracoes";

// hooks
import { useGetUser } from "@/hooks/use-getUser";


const UserProfile = () => {
  // Usando o hook useLocation para acessar a URL atual
  const location = useLocation();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Usando o contexto do usuário
  const { user, setUser } = useUser();

  // Verificar se o usuário tem plano Plus
  const isPlus = user?.plano === 'Plus';
  
  // Estado local para edição - inicializado com valores padrão para evitar erro de controlled/uncontrolled input
  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    whatsapp_verificado: false,
    idade: '',
    peso: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    bio: '',
    faixa: '',
    estilo: '',
    competidor: '',
    finalizacao: '',
    academia: '',
    cidade: '',
    estado: '',
    pais: '',
    imagem: '',
    tipo_acesso: '',
    perfilPublico: 'Fechado' // Adicionado
  });
  
  // Estado para controlar a tab ativa
  const [activeTab, setActiveTab] = useState('profile');
  
  // Atualiza o profileData quando o usuário é carregado do contexto
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setProfileData({
        nome: user.nome || '',
        email: user.email || '',
        whatsapp: user.whatsapp || '',
        imagem: user.imagem || '',
        whatsapp_verificado: user.whatsapp_verificado || false,
        idade: user.idade || '',
        peso: user.peso || '',
        instagram: user.instagram || '',
        tiktok: user.tiktok || '',
        youtube: user.youtube || '',
        bio: user.bio || '',
        faixa: user.faixa || '',
        estilo: user.estilo || '',
        competidor: user.competidor || '',
        finalizacao: user.finalizacao || '',
        academia: user.academia || '',
        cidade: user.cidade || '',
        estado: user.estado || '',
        pais: user.pais || '',
        tipo_acesso: user.tipo_acesso || '',
        perfilPublico: user.perfilPublico || user.perfil_publico || 'Fechado', // Adicionado
      });
    }
  }, [user]);
  
  // Verifica se há parâmetros na URL e define a tab ativa
  useEffect(() => {
    // Obtém os parâmetros da URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    // Se houver um parâmetro 'tab', define a tab ativa de acordo
    if (tabParam) {
      switch (tabParam.toLowerCase()) {
        case 'configuracoes':
          setActiveTab('settings');
          break;
        case 'senha':
          setActiveTab('password');
          break;
        case 'perfil':
        case 'informacoes':
          setActiveTab('profile');
          break;
        default:
          // Mantém a tab padrão se o parâmetro não for reconhecido
          setActiveTab('profile');
      }
    }

    fetchUserData();
  }, [location.search]);
  
  // VOLTANDO PARA PÁG ANTERIOR
  const handleBack = () => {
    window.location.href = "/app"; 
  };

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col p-4">
      {/* Círculos decorativos sutis */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      {/* Círculos decorativos sutis */}

      {/* Content */}
      <div className="flex-grow flex flex-col max-w-5xl mx-auto w-full relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bjj-gold rounded-xl flex items-center justify-center">
              <span className="text-bjj-dark font-bold text-lg">BJJ</span>
            </div>
            <div>
              <h1 className="text-2xl mb-2 font-bold text-foreground">
                <span className="mr-1">Academy</span>
                {isPlus && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-black relative overflow-hidden animate-pulse-subtle border border-amber-600/30">
                    PLUS
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-100/30 to-transparent"></span>
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground text-xs">Perfil do Usuário</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-9 px-3 border-border hover:border-bjj-gold/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </header>
        {/* Header */}

        {/* Conteúdo Principal */}
        <div className="flex-grow animate-fade-in">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-bjj-gold" />
                Meu Perfil
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e credenciais de acesso
              </CardDescription>
            </CardHeader>

            <CardContent>              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-28 md:mb-16">
                  <TabsTrigger value="profile">Informações</TabsTrigger>
                  <TabsTrigger value="password">Alterar Senha</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>
                
                {/* informações */}
                <Informacoes profileData={profileData} setProfileData={setProfileData}  />
                {/* informações */}
                
                {/* alterar senha */}
                <AlterarSenha />
                {/* alterar senha */}
                
                {/* configurações */}
                <Configuracoes profileData={profileData} setProfileData={setProfileData}  />
                {/* configurações */}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        {/* Conteúdo Principal */}
        
        {/* Copyright footer */}
        <div className="text-center mt-6 mb-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
        </div>
        {/* Copyright footer */}
      </div>
      {/* Content */}
    </div>
  );
};

export default UserProfile;
