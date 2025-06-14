import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Videos = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

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
              </div>              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <h1 className="text-xl font-bold">Vídeos</h1>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Em breve
                </h2>
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Biblioteca de Vídeos de Jiu-Jitsu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/4 flex justify-center">
                      <Video className="h-32 w-32 text-primary opacity-80" />
                    </div>
                    <div className="md:w-3/4">
                      <p className="text-lg mb-6">
                        Estamos trabalhando para disponibilizar em breve uma biblioteca completa 
                        de vídeos selecionados do YouTube sobre Jiu-Jitsu, incluindo técnicas, 
                        competições, entrevistas e muito mais.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-4">Funcionalidades que estarão disponíveis:</h3>
                        <ul className="space-y-3 pl-1">
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Vídeos categorizados por técnicas, posições e situações</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Conteúdo de grandes nomes do Jiu-Jitsu mundial</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Análises de lutas importantes e campeonatos</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>Recomendações personalizadas de acordo com seu nível e interesses</span>
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
    </SidebarProvider>
  );
};

export default Videos;
