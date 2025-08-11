import React, { useState } from "react";
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

// components
import { Informacoes } from "@/components/perfil/Informacoes";
import { AlterarSenha } from "@/components/perfil/AlterarSenha";
import { Configuracoes } from "@/components/perfil/Configuracoes";


const UserProfile = () => {
  
  // DADOS PERFIL
  const [profileData, setProfileData] = useState({
    nome: 'Weslei Casali',
    email: 'weslei.casali@example.com',
    idade: 28,
    peso: 75,
    faixa: 'Azul',
    imagem: '',
    telefone: '(11) 98765-4321',
    instagram: '@instagram',
    tiktok: '@tiktok',
    youtube: '@youtube',
    perfilPublico: 'Fechado',
    academia: 'Gracie Barra',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    estilo: 'Guardeiro',
    competidor: 'Sim',
    finalizacao: 'Triângulo',
    bio: 'Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações.',
    plano: 'Plus'
  });
  
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
              <h1 className="text-2xl mb-2 font-bold text-foreground">Academy</h1>
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
              <Tabs defaultValue="profile" className="w-full">

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
