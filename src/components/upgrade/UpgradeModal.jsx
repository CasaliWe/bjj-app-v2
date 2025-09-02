import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";


const UpgradeModal = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  // Verifica se o usuário não é Plus
  const checkTrialPeriod = () => {
    return user && user.plano !== 'Plus';
  };

  // Função para lidar com upgrade
  const handleUpgrade = () => {
    navigate('/perfil?tab=configuracoes');

    setIsOpen(false);
  };
  
  // Verificar período de avaliação quando o componente for montado ou o usuário mudar
  useEffect(() => {
    let timer;
    if (user) {
      const trialExpired = checkTrialPeriod();
      
      if (trialExpired) {
        // Atraso de 2 segundos para exibir o modal
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
      } else {
        setIsOpen(false);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user]);
  
  
  // Função para lidar com o clique no botão de upgrade
  const handleUpgradeClick = () => {
    handleUpgrade();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent className="sm:max-w-md border border-amber-500/30 bg-gradient-to-b from-background to-background/95" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-amber-500" />
            </div>
            <span className="text-2xl font-bold">Faça upgrade para o plano Plus</span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Para continuar tendo acesso à plataforma, faça upgrade para o plano <span className="text-amber-500 font-semibold">PLUS</span> e continue aproveitando todos os recursos do BJJ Academy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-card p-4 rounded-lg border border-border space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-amber-500" />
              Benefícios do Plano Plus
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5"></div>
                <span>Acesso ilimitado a todas as funcionalidades</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5"></div>
                <span>Recursos avançados de acompanhamento de progresso</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5"></div>
                <span>Acesso ao I.A Sensei para dúvidas e orientações</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5"></div>
                <span>Biblioteca completa de técnicas e drills</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-col gap-2">
          <Button 
            onClick={handleUpgradeClick}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:from-amber-600 hover:to-yellow-700 border border-amber-600/30"
          >
            <SparklesIcon className="mr-2 h-4 w-4" />
            Fazer Upgrade para PLUS
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Ao fazer upgrade, você terá acesso completo ao BJJ Academy
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
