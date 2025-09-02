import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Map, 
  Download, 
  Star,
  Calendar,
  Bookmark,
  Trophy,
  Menu,
  Bell,
  CheckCircle2
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import "./WelcomeModal.css";

// Componente CustomDialogContent customizado sem botão de fechar
const WelcomeModal = ({ forceShow = false }) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("intro");
  const [visitedTabs, setVisitedTabs] = useState({ intro: true, features: false, install: false });
  const [allTabsVisited, setAllTabsVisited] = useState(false);
  
  // Verifica se é o primeiro acesso do usuário 
  const isFirstAccess = () => {
    if(user.primeiroAcesso){
        return true;
    }else{
        return false;
    }
  };

  // Função para fechar o modal e att api ************************************************
  const handleClose = () => {
    // Somente permitir fechar se todas as abas foram visitadas
    if (allTabsVisited) {
      setIsOpen(false);
      
      // fazer req para api salvando o welcome
    }
  };
  
  // Função para gerenciar mudanças de tab e rastrear quais tabs foram visitadas
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Marca a tab como visitada
    setVisitedTabs(prev => ({
      ...prev,
      [value]: true
    }));
    
    // Verifica se todas as tabs foram visitadas
    const updatedVisitedTabs = {
      ...visitedTabs,
      [value]: true
    };
    
    if (updatedVisitedTabs.intro && updatedVisitedTabs.features && updatedVisitedTabs.install) {
      setAllTabsVisited(true);
    }
  };
  
  // Verificar primeiro acesso quando o componente for montado ou o usuário mudar
  useEffect(() => {
    let timer;
    
    if (user || forceShow) {
      const firstAccess = forceShow || isFirstAccess();
      
      if (firstAccess) {
        // Atraso de 1 segundo para exibir o modal
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);
      } else {
        setIsOpen(false);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, forceShow]);
  
  // Adicionar event listener para prevenir o fechamento pelo ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Previne o fechamento do modal ao pressionar ESC
      if (e.key === 'Escape' && isOpen && !allTabsVisited) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, allTabsVisited]);
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Impede o fechamento do modal clicando fora ou no X
        // O modal só pode ser fechado pelo botão na última aba
        if (open) setIsOpen(true);
      }}
      modal={true}
      className="welcome-modal-dialog"
    >
      <DialogContent 
        className="sm:max-w-xl md:max-w-2xl border border-bjj-gold/30 bg-gradient-to-b from-background to-background/95 max-h-[90vh] overflow-hidden flex flex-col min-h-[550px] welcome-modal-content"
      >
        <DialogHeader className="flex-shrink-0 pb-2">
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-bjj-gold/20 flex items-center justify-center">
              <Award className="h-6 w-6 text-bjj-gold" />
            </div>
            <span className="text-2xl font-bold">Bem-vindo ao BJJ Academy!</span>
          </DialogTitle>
          <DialogDescription className="text-center pt-1 text-sm">
            Tudo para melhorar seu Jiu-Jitsu em um só lugar!
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow pr-1 py-2 overflow-x-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="intro" className="data-[state=active]:bg-bjj-gold/20 data-[state=active]:text-bjj-gold flex items-center gap-1">
                {visitedTabs.intro && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                Plano Grátis
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-bjj-gold/20 data-[state=active]:text-bjj-gold flex items-center gap-1">
                {visitedTabs.features && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                Recursos
              </TabsTrigger>
              <TabsTrigger value="install" className="data-[state=active]:bg-bjj-gold/20 data-[state=active]:text-bjj-gold flex items-center gap-1">
                {visitedTabs.install && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                Instalar App
              </TabsTrigger>
            </TabsList>
            
            {/* Tab 1: Plano Grátis */}
            <TabsContent value="intro" className="space-y-4 min-h-[300px] px-1 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
              <div className="bg-card p-5 rounded-lg border border-border space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 text-bjj-gold" />
                  Você tem 7 dias de acesso gratuito!
                </h3>
                <p className="text-sm">
                  Como um faixa branca ansioso pelo primeiro stripe, você tem 7 dias para explorar todas as funcionalidades do BJJ Academy.
                </p>
                <p className="text-sm">
                  Após esse período, será necessário fazer upgrade para o plano PLUS para continuar acessando todos os recursos. É menos que o preço de um açaí pós-treino!
                </p>
              </div>
            </TabsContent>
            
            {/* Tab 2: Recursos */}
            <TabsContent value="features" className="space-y-4 min-h-[300px] px-1 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
              <div className="bg-card p-5 rounded-lg border border-border space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold flex items-center gap-2">
                  <Map className="h-4 w-4 text-bjj-gold" />
                  Centralize sua jornada no Jiu-Jitsu
                </h3>
                <p className="text-sm">
                  Como um bom armlock, o BJJ Academy combina tudo o que você precisa em um só lugar:
                </p>
                <ul className="space-y-2 text-sm mt-2">
                  <li className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-bjj-gold mt-0.5" />
                    <span>Registre seus treinos e acompanhe seu progresso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Bookmark className="h-4 w-4 text-bjj-gold mt-0.5" />
                    <span>Catálogo de técnicas e drills para estudar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="h-4 w-4 text-bjj-gold mt-0.5" />
                    <span>Gerencie suas competições e resultados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Bell className="h-4 w-4 text-bjj-gold mt-0.5" />
                    <span>Receba lembretes e estatísticas personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Menu className="h-4 w-4 text-bjj-gold mt-0.5" />
                    <span>E muito mais recursos para explorar!</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            {/* Tab 3: Instalar App */}
            <TabsContent value="install" className="space-y-4 min-h-[300px] px-1 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
              <div className="bg-card p-5 rounded-lg border border-border space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4 text-bjj-gold" />
                  Instale o app na sua tela inicial
                </h3>
                <p className="text-sm">
                  O BJJ Academy é um PWA (Progressive Web App), o que significa que você pode instalá-lo diretamente na tela inicial do seu celular ou computador - sem precisar baixar nada da loja de apps!
                </p>
                <p className="text-sm">
                  É mais rápido que uma raspagem bem executada:
                </p>
                <ul className="space-y-2 text-sm mt-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-bjj-gold mt-1.5"></div>
                    <span><strong>No celular:</strong> Toque no menu do navegador e selecione "Adicionar à tela inicial"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-bjj-gold mt-1.5"></div>
                    <span><strong>No desktop:</strong> Clique no ícone de instalação na barra de endereço do navegador</span>
                  </li>
                </ul>
                <p className="text-sm mt-2">
                  Assim você terá acesso rápido ao app, como um armlock pronto para ser aplicado!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="flex-shrink-0 flex flex-col sm:flex-col gap-2 mt-2">
          {activeTab === "intro" && (
            <Button 
              onClick={() => handleTabChange("features")}
              className="w-full bg-gradient-to-r from-bjj-gold to-amber-600 text-black hover:from-bjj-gold/90 hover:to-amber-700 border border-bjj-gold/30 font-medium"
            >
              Próximo: Recursos do BJJ Academy
            </Button>
          )}
          
          {activeTab === "features" && (
            <Button 
              onClick={() => handleTabChange("install")}
              className="w-full bg-gradient-to-r from-bjj-gold to-amber-600 text-black hover:from-bjj-gold/90 hover:to-amber-700 border border-bjj-gold/30 font-medium"
            >
              Próximo: Como instalar o app
            </Button>
          )}
          
          {activeTab === "install" && (
            <Button 
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-bjj-gold to-amber-600 text-black hover:from-bjj-gold/90 hover:to-amber-700 border border-bjj-gold/30 font-medium"
            >
              <Award className="mr-2 h-5 w-5" />
              Começar minha jornada!
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground pt-1">
            {activeTab !== "install" 
              ? `Passo ${activeTab === "intro" ? "1" : "2"} de 3 - Navegue por todas as abas para conhecer o BJJ Academy`
              : `Estamos felizes em ter você na família BJJ Academy!`}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
