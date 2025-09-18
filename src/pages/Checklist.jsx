import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { useGetUser } from "@/hooks/use-getUser";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const Checklist = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          
          <main className="flex-1 flex flex-col">
            <div className="flex items-center h-16 px-4 border-b bg-background md:px-6">
              <div className="hidden md:block">
                {/* <SidebarTrigger /> */}
              </div>
              <div className="md:hidden">
                <MobileNav />
              </div>              
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <h1 className="text-xl font-bold">Checklist</h1>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Em breve
                </h2>
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Organize seus objetivos e tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/4 flex justify-center">
                      <CheckSquare className="h-32 w-32 text-primary opacity-80" />
                    </div>
                    <div className="md:w-3/4">
                      <p className="text-lg mb-6">
                        Estamos trabalhando para disponibilizar em breve uma ferramenta completa 
                        de checklist para organizar seus objetivos, tarefas e progresso no Jiu-Jitsu.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-4">Funcionalidades que estarão disponíveis:</h3>
                        <ul className="space-y-3 pl-1">
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Criação de listas de verificação personalizadas para treinos</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Acompanhamento de progresso e metas de treino</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Organização de tarefas por categorias (técnicas, preparação física, etc.)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Lembretes e notificações para suas metas principais</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

    </SidebarProvider>
  );
};

export default Checklist;