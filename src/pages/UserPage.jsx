import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  EyeOff
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { setPageTitle } from "@/services/title";

// Components de perfil
import PrivateProfile from "@/components/userPage/PrivateProfile";
import PublicProfile from "@/components/userPage/PublicProfile";
import UserTabs from "@/components/userPage/UserTabs";

// Hook personalizado
import { useUserPage } from "@/hooks/use-userPage";

/**
 * Página que exibe o perfil de um usuário
 * @returns {JSX.Element} Componente React
 */
const UserPage = () => {
  // Obter o ID do usuário da query string (bjj_id)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bjjId = queryParams.get('bjj_id');
  const navigate = useNavigate();

  // Usar o hook personalizado para obter os dados do usuário
  const {
    // Dados do perfil
    userProfile,
    isLoadingProfile,
    profileError,
    
    // Treinos
    userTrainings,
    trainingsPagination,
    isLoadingTrainings,
    trainingsError,
    
    // Competições
    userCompetitions,
    competitionsPagination,
    isLoadingCompetitions,
    competitionsError,
    
    // Técnicas
    userTechniques,
    techniquesPagination,
    isLoadingTechniques,
    techniquesError,
    
    // Controle de tabs
    activeTab,
    
    // Métodos
    fetchUserProfile,
    changeTrainingsPage,
    changeCompetitionsPage,
    changeTechniquesPage,
    loadTabData
  } = useUserPage(bjjId);

  // A lógica agora é simples:
  // Se temos dados do perfil e não temos erro, exibimos o perfil público
  // O perfil privado será tratado como um erro 403 pelo backend

  // Atualizar o título da página quando o perfil for carregado
  useEffect(() => {
    if (isLoadingProfile) {
      setPageTitle("Carregando perfil...");
    } else if (profileError) {
      setPageTitle("Perfil não encontrado");
    } else if (userProfile) {
      setPageTitle(`${userProfile.nome || 'Usuário'}`);
    } else {
      setPageTitle("Perfil de Usuário");
    }
  }, [isLoadingProfile, profileError, userProfile]);

  // Voltar para a página anterior
  const handleBack = () => {
    navigate(-1);
  };

  // Carregar dados iniciais quando a tab mudar
  const handleTabChange = (tab) => {
    loadTabData(tab);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Perfil de Usuário</h1>
            </div>
            <Button
              onClick={handleBack}
              size="sm"
              variant="outline"
              className="px-2 md:px-3"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Voltar</span>
            </Button>
          </header>

          <MobileNav />

          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            {/* Círculos decorativos sutis */}
            <div className="fixed top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
            <div className="fixed bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
            {/* Círculos decorativos sutis */}

            {/* Estado de carregamento */}
            {isLoadingProfile && (
              <div className="flex-grow flex items-center justify-center">
                <LoadingSpinner message="Carregando perfil do usuário..." />
              </div>
            )}

            {/* Mensagem de erro - Perfil não encontrado ou erro genérico */}
            {!isLoadingProfile && profileError && (
              <div className="flex-grow flex items-center justify-center">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 max-w-md w-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <EyeOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {profileError.includes("privado") ? "Perfil Privado" : "Perfil Não Encontrado"}
                    </h3>
                    <p className="text-center text-muted-foreground mb-4">
                      {profileError}
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button onClick={() => navigate('/app')} variant="outline">
                        Ir para página inicial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Conteúdo principal */}
            {!isLoadingProfile && !profileError && userProfile && (
              <div className="flex-grow animate-fade-in">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4 md:p-6">
                    {/* Log para debug */}
                    {console.log("Perfil dados:", userProfile)}
                    
                    {/* 
                      Verifica se o perfil é fechado com uma lógica mais robusta que 
                      considera diferentes possibilidades de tipos e valores
                    */}
                    {(
                      userProfile.perfilPublico === 'Fechado' || 
                      userProfile.perfil_publico === 'Fechado' ||
                      userProfile.perfilPublico === false ||
                      userProfile.perfil_publico === false
                    ) ? (
                      <PrivateProfile profile={userProfile} />
                    ) : (
                      <>
                        <PublicProfile profile={userProfile} />
                        
                        {/* Tabs para conteúdo público */}
                        <UserTabs 
                          activeTab={activeTab}
                          onTabChange={handleTabChange}
                          trainings={userTrainings}
                          trainingsPagination={trainingsPagination}
                          isLoadingTrainings={isLoadingTrainings}
                          trainingsError={trainingsError}
                          onTrainingsPageChange={changeTrainingsPage}
                          competitions={userCompetitions}
                          competitionsPagination={competitionsPagination}
                          isLoadingCompetitions={isLoadingCompetitions}
                          competitionsError={competitionsError}
                          onCompetitionsPageChange={changeCompetitionsPage}
                          techniques={userTechniques}
                          techniquesPagination={techniquesPagination}
                          isLoadingTechniques={isLoadingTechniques}
                          techniquesError={techniquesError}
                          onTechniquesPageChange={changeTechniquesPage}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>

          {/* Copyright footer */}
          <div className="text-center mt-6 mb-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
          </div>
          {/* Copyright footer */}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserPage;