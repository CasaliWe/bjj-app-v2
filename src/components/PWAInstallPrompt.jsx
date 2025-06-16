import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { 
  shouldShowInstallPrompt, 
  markPromptDismissed, 
  markAppInstalled,
  getPromptDelay 
} from "@/lib/pwa-utils";

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
    useEffect(() => {
    // Verificar se o app já está instalado
    // Isso é uma heurística, não há uma API confiável para verificar 100%
    const checkIfInstalled = () => {
      // No iOS
      if (window.navigator.standalone) {
        setIsAppInstalled(true);
        return;
      }
      
      // No Android/Desktop Chrome
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
        return;
      }
    };
    
    checkIfInstalled();
    
    let installPromptEvent = null;
    let promptTimer = null;
    
    const handler = (e) => {
      // Se o app já estiver instalado, não mostra o prompt
      if (isAppInstalled) return;
      
      // Impede o prompt padrão do navegador
      e.preventDefault();
      
      // Armazena o evento para acioná-lo posteriormente quando for apropriado
      installPromptEvent = e;
      
      // Verifica se devemos mostrar o prompt com base na lógica de preferências
      if (shouldShowInstallPrompt()) {
        // Atrasa um pouco a exibição do prompt para não interromper imediatamente
        promptTimer = setTimeout(() => {
          setInstallPrompt(installPromptEvent);
          setIsDialogOpen(true);
        }, getPromptDelay());
      }
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // Detecta quando a instalação é concluída
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setIsDialogOpen(false);
      markAppInstalled();
      console.log('App instalado com sucesso');
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (promptTimer) clearTimeout(promptTimer);
    };
  }, [isAppInstalled]);
  
  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    
    // Mostra o prompt de instalação
    installPrompt.prompt();
    
  // Aguarda a escolha do usuário
  installPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
      markAppInstalled();
      setIsAppInstalled(true);
    } else {
      console.log('Usuário recusou a instalação');
      markPromptDismissed();
    }
    
    // Limpa o prompt salvo, não pode ser usado novamente
    setInstallPrompt(null);
    setIsDialogOpen(false);
  });
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Instalar BJJ ACADEMY</DialogTitle>
          <DialogDescription>
            Instale nosso aplicativo para ter acesso offline e uma melhor experiência!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            Você pode instalar o BJJ ACADEMY diretamente no seu dispositivo para:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Acesso rápido direto da tela inicial</li>
            <li>Uso offline</li>
            <li>Experiência completa de app</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setIsDialogOpen(false);
            markPromptDismissed();
          }}>Agora não</Button>
          <Button onClick={handleInstallClick} className="gap-2">
            <Download className="h-4 w-4" />
            Instalar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
