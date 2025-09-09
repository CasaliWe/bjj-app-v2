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
import { 
  Award, 
  ArrowRight,
  ArrowLeft,
  Download, 
  Star,
  Calendar,
  Bookmark,
  Trophy,
  Menu,
  Bell,
  Check,
  Clock,
  ChevronRight,
  Shield,
  Smartphone
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import "./WelcomeModal.css";

import { getAuthToken } from '@/services/cookies/cookies';


// Componente CustomDialogContent customizado sem botão de fechar
const WelcomeModal = ({ forceShow = false }) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Verifica se é o primeiro acesso do usuário 
  const isFirstAccess = () => {
    if(user.primeiroAcesso){
        return true;
    }else{
        return false;
    }
  };

  // Função para fechar o modal e att api ************************************************
  const handleClose = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/atualizar-primeiro-acesso.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          primeiroAcesso: 0
        })
      });
      const data = await response.json();
      if(data.success){
        setIsOpen(false);
      }else{
        console.error("Erro na resposta da API:", data.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar visibilidade do perfil:", error);
    }
  };
  
  // Funções para navegar entre os passos
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
      // Previne o fechamento do modal ao pressionar ESC se não estiver no último passo
      if (e.key === 'Escape' && isOpen && currentStep !== totalSteps) {
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
  }, [isOpen, currentStep]);

  // Renderiza o indicador de progresso dos passos
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[...Array(totalSteps)].map((_, index) => (
        <div 
          key={index} 
          className={`
            h-2.5 rounded-full transition-all duration-300 
            ${index + 1 === currentStep 
              ? "w-8 bg-bjj-gold" 
              : index + 1 < currentStep 
                ? "w-2.5 bg-bjj-gold/80" 
                : "w-2.5 bg-bjj-gold/30"}
          `}
        />
      ))}
    </div>
  );
  
  // Conteúdo do Passo 1: Plano Grátis
  const renderStep1 = () => (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-bjj-gold/20 flex items-center justify-center flex-shrink-0">
          <Clock className="h-9 w-9 text-bjj-gold" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-bjj-gold text-center sm:text-left">Acesso Gratuito por 7 Dias</h3>
          <p className="text-sm text-center sm:text-left">
            Dê os primeiros passos na sua evolução! Você tem 7 dias para explorar todas as funcionalidades do BJJ Academy.
          </p>
        </div>
      </div>
      
      <div className="bg-card p-5 rounded-xl border border-bjj-gold/30 shadow-md mb-4">
        <div className="flex items-start gap-3 mb-4">
          <Star className="h-5 w-5 text-bjj-gold mt-0.5 flex-shrink-0" />
          <h4 className="font-semibold">O que você ganha no plano gratuito:</h4>
        </div>
        
        <ul className="space-y-3 pl-4 sm:pl-8">
          <li className="flex items-center gap-2 text-sm">
            <ChevronRight className="h-4 w-4 text-bjj-gold flex-shrink-0" />
            <span>Acesso a todas as funcionalidades premium por 7 dias</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <ChevronRight className="h-4 w-4 text-bjj-gold flex-shrink-0" />
            <span>Teste completo do app para avaliar seu valor</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <ChevronRight className="h-4 w-4 text-bjj-gold flex-shrink-0" />
            <span>Sem compromisso ou cobrança automática</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-bjj-gold/10 p-4 rounded-lg border border-bjj-gold/20 text-sm mb-2">
        <p>Após esse período, será necessário fazer upgrade para o plano PLUS para continuar acessando todos os recursos. É menos que o preço de um açaí pós-treino!</p>
      </div>
    </div>
  );
  
  // Conteúdo do Passo 2: Recursos
  const renderStep2 = () => (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-bjj-gold/20 flex items-center justify-center flex-shrink-0">
          <Shield className="h-9 w-9 text-bjj-gold" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-bjj-gold text-center sm:text-left">Centralize sua Jornada no Jiu-Jitsu</h3>
          <p className="text-sm text-center sm:text-left">
            Como um bom armlock, o BJJ Academy combina tudo o que você precisa em um só lugar.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-card p-4 rounded-xl border border-bjj-gold/30 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-bjj-gold" />
            <h4 className="font-semibold">Registre seus Treinos</h4>
          </div>
          <p className="text-sm ml-7">
            Acompanhe cada sessão de treino, duração, técnicas praticadas e sua evolução ao longo do tempo com estatísticas personalizadas.
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-xl border border-bjj-gold/30 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-5 w-5 text-bjj-gold" />
            <h4 className="font-semibold">Anote suas Técnicas</h4>
          </div>
          <p className="text-sm ml-7">
            Crie uma biblioteca pessoal com suas posições e transições favoritas, com detalhes, vídeos e anotações específicas para seu jogo.
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-xl border border-bjj-gold/30 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-bjj-gold" />
            <h4 className="font-semibold">Monte seu Plano de Jogo</h4>
          </div>
          <p className="text-sm ml-7">
            Organize estratégias para competições e treinos, defina sequências de movimentos e prepare-se para diferentes tipos de adversários.
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-xl border border-bjj-gold/30 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-bjj-gold" />
            <h4 className="font-semibold">Converse com nossa IA</h4>
          </div>
          <p className="text-sm ml-7">
            Receba dicas, sugestões de treino e análises personalizadas da nossa IA especializada em jiu-jitsu para acelerar seu desenvolvimento.
          </p>
        </div>
      </div>
      
      <div className="bg-bjj-gold/10 p-4 rounded-lg border border-bjj-gold/20 text-sm mb-2">
        <p className="text-sm font-medium text-center flex items-center justify-center">
          <Menu className="h-4 w-4 text-bjj-gold inline mr-2" />
          E muitos outros recursos para melhorar sua experiência no jiu-jitsu!
        </p>
      </div>
    </div>
  );
  
  // Conteúdo do Passo 3: Instalar App
  const renderStep3 = () => (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-bjj-gold/20 flex items-center justify-center flex-shrink-0">
          <Smartphone className="h-9 w-9 text-bjj-gold" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-bjj-gold text-center sm:text-left">Instale o App na Sua Tela Inicial</h3>
          <p className="text-sm text-center sm:text-left">
            O BJJ Academy é um PWA (Progressive Web App) que pode ser instalado diretamente no seu dispositivo.
          </p>
        </div>
      </div>
      
      <div className="bg-card p-5 rounded-xl border border-bjj-gold/30 shadow-md mb-4">
        <h4 className="font-semibold flex items-center gap-2 mb-4">
          <Download className="h-5 w-5 text-bjj-gold" />
          Instalação Rápida e Fácil
        </h4>
        
        <div className="space-y-4">
          <div className="bg-bjj-gold/10 p-4 rounded-lg border border-bjj-gold/20">
            <h5 className="font-medium mb-2">No Celular:</h5>
            <ol className="space-y-2 text-sm pl-5 list-decimal">
              <li>Abra o site no seu navegador</li>
              <li>Toque no menu do navegador (três pontos)</li>
              <li>Selecione "Adicionar à tela inicial" ou "Instalar aplicativo"</li>
              <li>Confirme a instalação</li>
            </ol>
          </div>
          
          <div className="bg-bjj-gold/10 p-4 rounded-lg border border-bjj-gold/20">
            <h5 className="font-medium mb-2">No Desktop:</h5>
            <ol className="space-y-2 text-sm pl-5 list-decimal">
              <li>Abra o site no Chrome, Edge ou outro navegador compatível</li>
              <li>Clique no ícone de instalação na barra de endereço</li>
              <li>Confirme a instalação</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="bg-bjj-gold/10 p-4 rounded-lg border border-bjj-gold/20 text-sm mb-2">
        <p className="font-medium flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-bjj-gold mr-2" />
          Acesso rápido ao app, como um armlock pronto para ser aplicado!
        </p>
      </div>
    </div>
  );
  
  // Renderiza o conteúdo com base no passo atual
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };
  
  // Renderiza os botões de navegação conforme o passo atual
  const renderNavButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {currentStep > 1 && (
        <Button 
          onClick={prevStep} 
          variant="outline"
          className="border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10 font-medium flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      )}
      
      {currentStep < totalSteps ? (
        <Button 
          onClick={nextStep}
          className="bg-gradient-to-r from-bjj-gold to-amber-600 text-black hover:from-bjj-gold/90 hover:to-amber-700 border border-bjj-gold/30 font-medium flex-1"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={handleClose}
          className="bg-gradient-to-r from-bjj-gold to-amber-600 text-black hover:from-bjj-gold/90 hover:to-amber-700 border border-bjj-gold/30 font-medium flex-1"
        >
          <Award className="mr-2 h-5 w-5" />
          Começar minha jornada!
        </Button>
      )}
    </div>
  );
  
  // Texto do rodapé com base no passo atual
  const getFooterText = () => {
    if (currentStep === totalSteps) {
      return "Estamos felizes em ter você na família BJJ Academy!";
    }
    return `Passo ${currentStep} de ${totalSteps} - Conheça o BJJ Academy`;
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Impede o fechamento do modal clicando fora ou no X
        // O modal só pode ser fechado pelo botão no último passo
        if (open) setIsOpen(true);
      }}
      modal={true}
      className="welcome-modal-dialog relative"
    >
      <DialogContent 
        className="sm:max-w-xl md:max-w-2xl border border-bjj-gold/30 bg-gradient-to-b from-background to-background/95 max-h-[90vh] overflow-hidden flex flex-col min-h-[550px] welcome-modal-content w-[calc(100%-24px)] sm:w-auto mx-auto px-4 sm:px-6"
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
        
        <div className="mt-4">
          {renderStepIndicator()}
        </div>
        
        <div className="overflow-y-auto flex-grow pr-1 pb-4 overflow-x-hidden px-1">
          {renderStepContent()}
        </div>
        
        <DialogFooter className="flex-shrink-0 flex flex-col gap-2 mt-2 px-1">
          {renderNavButtons()}
          
          <p className="text-xs text-center text-muted-foreground pt-1">
            {getFooterText()}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
