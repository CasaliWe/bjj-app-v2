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
  Check,
  QrCode
} from "lucide-react";

import Assinatura from "./Assinatura";

import { getAuthToken } from '@/services/cookies/cookies';



export function Configuracoes({profileData, setProfileData}) {

  // Estados para o modal de visibilidade do perfil
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  const [newVisibility, setNewVisibility] = useState(null);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [visibilitySuccess, setVisibilitySuccess] = useState(false);

  // GERENCIAR VISIBILIDADE DO PERFIL
  const handleOpenVisibilityModal = () => {
    // Pega o valor atual e inverte para o oposto
    const currentVisibility = profileData.perfilPublico;
    const newVisibilityValue = currentVisibility === 'Aberto' ? 'Fechado' : 'Aberto';
    setNewVisibility(newVisibilityValue);
    setIsVisibilityModalOpen(true);
  };

  // ATUALIZAR VISIBILIDADE DO PERFIL ****************************
  const handleUpdateProfileVisibility = async () => {
    if (newVisibility === null) return;
    
    setIsUpdatingVisibility(true);

    // fazendo a chamada para a API para atualizar a visibilidade do perfil
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/atualizar-visibilidade.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          perfilPublico: newVisibility
        })
      });
      const data = await response.json();
      if(data.success){
        // Atualiza o estado com a nova visibilidade
        setProfileData(prev => ({
          ...prev,
          perfilPublico: newVisibility
        }));

        setIsUpdatingVisibility(false);
        setIsVisibilityModalOpen(false);
        
        // Exibe mensagem de sucesso
        setVisibilitySuccess(true);
        setTimeout(() => {
          setVisibilitySuccess(false);
        }, 4000);
      }else{
        console.error("Erro na resposta da API:", data.message);
        setIsUpdatingVisibility(false);
        setIsVisibilityModalOpen(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar visibilidade do perfil:", error);
      setIsUpdatingVisibility(false);
      setIsVisibilityModalOpen(false);
    }
  
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
                  onClick={() => handleOpenVisibilityModal()}
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
                  {newVisibility === 'Aberto' ? (
                    <Eye className="h-5 w-5 text-bjj-gold" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-bjj-gold" />
                  )}
                  Alterar Visibilidade do Perfil
                </DialogTitle>
                <DialogDescription>
                  Você está prestes a tornar seu perfil {newVisibility === 'Aberto' ? "aberto" : "fechado"}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="p-3 rounded-lg border border-border/50 bg-card/30">
                  {newVisibility === 'Aberto' ? (
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
                  className={`${newVisibility === 'Aberto' ? "bg-green-600 hover:bg-green-700" : "bg-slate-600 hover:bg-slate-700"} text-white`}
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
          
          {/* Assinatura do app - apenas PIX */}
          <div className="p-3 rounded-lg border border-border/50 bg-card/30">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20">
                  <QrCode className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Assinatura Premium</p>
                  <p className="text-xs text-muted-foreground">
                    Desbloqueie todos os recursos premium com pagamento via PIX.
                  </p>
                </div>
              </div>
              
              <div className="text-sm px-2">
                <ul className="text-xs space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                    Acesso ilimitado às técnicas e vídeos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                    Plano de treino personalizado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                    Assistente IA para dúvidas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                    Métricas avançadas de progresso
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                    E muito mais...
                  </li>
                </ul>
              </div>
              
              {/* Componente de Assinatura */}
              <Assinatura />
              {/* Componente de Assinatura */}
            </div>
          </div>
          {/* Assinatura do app */}
          
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
          
          {/* Seção de Suporte */}
          <Card className="bg-card/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-purple-500/20">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                </div>
                Precisa de Ajuda?
              </CardTitle>
              <CardDescription>
                Encontrou algum problema ou tem dúvidas sobre o aplicativo?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Nossa equipe de suporte está disponível para ajudar você com qualquer questão relacionada à sua conta, 
                  funcionalidades do aplicativo ou pagamentos.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => window.location.href = '/suporte'}
                >
                  Acessar Suporte
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Seção de Suporte */}
        </div>
      </div>
    </TabsContent>
  )
}

