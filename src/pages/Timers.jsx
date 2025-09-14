import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Clock, Timer, Users, Award } from "lucide-react";
import { setPageTitle } from '@/services/title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componentes de Timer
import TabataTimer from '@/components/timers/TabataTimer';
import CircuitTimer from '@/components/timers/CircuitTimer';
import RolaTimer from '@/components/timers/RolaTimer';
import CompetitionTimer from '@/components/timers/CompetitionTimer';

// Hook de usuário
import { useGetUser } from "@/hooks/use-getUser";
import { useIsMobile } from "@/hooks/use-mobile";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

/**
 * Página de Timers para BJJ
 * Contém diferentes tipos de temporizadores para treinos e competições
 */
const Timers = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("tabata");
  const { fetchUserData } = useGetUser();

  // Definir o título da página ao carregar o componente
  useEffect(() => {
    setPageTitle('Timers');
    fetchUserData();
  }, []);

  return (
    <SidebarProvider>
      <div className="grid lg:grid-cols-[280px_1fr] min-h-screen">
        <AppSidebar />
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 lg:h-[65px] lg:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Timers</h1>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Timers para treino</h2>
                  <p className="text-muted-foreground">
                    Utilize diferentes timers para otimizar seu treino e preparação física.
                  </p>
                </div>
              </div>

              {/* Tabs para os diferentes tipos de timer */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  <TabsTrigger value="tabata" className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span>Tabata</span>
                  </TabsTrigger>
                  <TabsTrigger value="circuito" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Circuito</span>
                  </TabsTrigger>
                  <TabsTrigger value="rola" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Rola em Equipe</span>
                  </TabsTrigger>
                  <TabsTrigger value="competicao" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Competição</span>
                  </TabsTrigger>
                </TabsList>

                {/* Conteúdo das Tabs */}
                <TabsContent value="tabata">
                  <TabataTimer />
                </TabsContent>
                
                <TabsContent value="circuito">
                  <CircuitTimer />
                </TabsContent>
                
                <TabsContent value="rola">
                  <RolaTimer />
                </TabsContent>
                
                <TabsContent value="competicao">
                  <CompetitionTimer />
                </TabsContent>
              </Tabs>
            </div>
          </main>
          
          <MobileNav />

          {/* Modal de upgrade para o plano Plus */}
          <UpgradeModal />
          {/* Modal de upgrade para o plano Plus */}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Timers;