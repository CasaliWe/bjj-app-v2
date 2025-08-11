import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TabsContent
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Shield,
  Eye,
  EyeOff,
  Check
} from "lucide-react";


export function Configuracoes({profileData, setProfileData}) {

  // Estados para o modal de visibilidade do perfil
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  const [newVisibility, setNewVisibility] = useState(null);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [visibilitySuccess, setVisibilitySuccess] = useState(false);

  // GERENCIAR VISIBILIDADE DO PERFIL
  const handleOpenVisibilityModal = (isAberto) => {
    setNewVisibility(isAberto);
    setIsVisibilityModalOpen(true);
  };

  // ATUALIZAR VISIBILIDADE DO PERFIL ****************************
  const handleUpdateProfileVisibility = async () => {
    if (newVisibility === null) return;
    
    setIsUpdatingVisibility(true);
    
    // Simulação de envio para a API
    setTimeout(() => {
      // Chamada à API simulada para atualizar apenas a visibilidade
      const novaVisibilidade = newVisibility ? 'Aberto' : 'Fechado';
      console.log("Atualizando visibilidade do perfil para:", novaVisibilidade);
      
      // Atualiza o estado com a nova visibilidade
      setProfileData(prev => ({
        ...prev,
        perfilPublico: novaVisibilidade
      }));
      
      setIsUpdatingVisibility(false);
      setIsVisibilityModalOpen(false);
      
      // Exibe mensagem de sucesso
      setVisibilitySuccess(true);
      setTimeout(() => {
        setVisibilitySuccess(false);
      }, 4000);
    }, 1500);
  };

  return(
    <TabsContent value="settings">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-4">

          {/* titulo */}
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Shield className="h-5 w-5 text-bjj-gold" />
            Configurações do Aplicativo
          </h3>
          {/* titulo */}

          {/* perfil fechado */}
          <div className="space-y-3">                        
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg border border-border/50 bg-card/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profileData.perfilPublico === 'Aberto' ? "bg-green-500/20" : "bg-slate-500/20"}`}>
                    {profileData.perfilPublico === 'Aberto' ? (
                      <Eye className="h-5 w-5 text-green-400" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{profileData.perfilPublico === 'Aberto' ? "Perfil Aberto" : "Perfil Fechado"}</p>
                    <p className="text-xs text-muted-foreground">
                      {profileData.perfilPublico === 'Aberto' 
                        ? "Seu perfil é visível para todos os usuários." 
                        : "Apenas você pode ver seu perfil."}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVisibilityModal(profileData.perfilPublico === 'Fechado')}
                  className="border-border/40 h-8"
                >
                  {profileData.perfilPublico === 'Aberto' ? "Tornar Fechado" : "Tornar Aberto"}
                </Button>
              </div>
              
              {visibilitySuccess && (
                <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2 rounded-md text-sm flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  Visibilidade do perfil atualizada com sucesso!
                </div>
              )}
            </div>
          </div>
          {/* perfil fechado */}
          
          {/* Modal para confirmar alteração de visibilidade do perfil */}
          <Dialog open={isVisibilityModalOpen} onOpenChange={setIsVisibilityModalOpen}>
            <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  {newVisibility ? (
                    <Eye className="h-5 w-5 text-bjj-gold" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-bjj-gold" />
                  )}
                  Alterar Visibilidade do Perfil
                </DialogTitle>
                <DialogDescription>
                  Você está prestes a tornar seu perfil {newVisibility ? "aberto" : "fechado"}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="p-3 rounded-lg border border-border/50 bg-card/30">
                  {newVisibility ? (
                    <p className="text-sm">
                      Com um perfil <span className="font-bold text-green-400">aberto</span>, todos os usuários da plataforma poderão visualizar suas informações, incluindo academia, faixa, estatísticas e outros dados de perfil.
                    </p>
                  ) : (
                    <p className="text-sm">
                      Com um perfil <span className="font-bold text-slate-400">fechado</span>, apenas você verá suas informações. Isso oferece maior privacidade para seus dados.
                    </p>
                  )}
                </div>
              </div>
              
              <DialogFooter className="sm:justify-between flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsVisibilityModalOpen(false)}
                  className="border-border/40"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateProfileVisibility}
                  disabled={isUpdatingVisibility}
                  className={`${newVisibility ? "bg-green-600 hover:bg-green-700" : "bg-slate-600 hover:bg-slate-700"} text-white`}
                >
                  {isUpdatingVisibility ? (
                    <>
                      <span className="animate-pulse mr-2">●</span>
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Alteração
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Modal para confirmar alteração de visibilidade do perfil */}
          
          {/* Explicação download pwa  */}
          <Card className="bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Instalar Aplicativo</CardTitle>
              <CardDescription>
                Instale o BJJ Academy na tela inicial do seu dispositivo para acesso rápido e melhor experiência.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* explicação de como fazer */}
              <ol className="list-decimal pl-5 space-y-2">
                <li className="text-sm">Acesse o site do BJJ Academy no seu navegador.</li>
                <li className="text-sm">Toque no ícone de compartilhamento (geralmente um quadrado com uma seta para cima).</li>
                <li className="text-sm">Selecione "Adicionar à Tela Inicial" ou "Instalar Aplicativo".</li>
                <li className="text-sm">Siga as instruções na tela para concluir a instalação.</li>
              </ol>
            </CardContent>
          </Card>
          {/* Explicação download pwa  */}
        </div>
      </div>
    </TabsContent>
  )
}

