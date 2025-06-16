import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";

export function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  
  useEffect(() => {
    // Verificar se o app já está instalado
    const checkIfInstalled = () => {
      if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
      }
    };
    
    checkIfInstalled();
    
    // Captura o evento para uso posterior
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // Detecta quando o app é instalado
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);
  
  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      
      setInstallPrompt(null);
    });
  };
  
  if (isAppInstalled) {
    return (
      <Button variant="ghost" className="w-full gap-2 cursor-default" disabled>
        <Check className="h-4 w-4 text-green-500" />
        App instalado
      </Button>
    );
  }
  
  if (!installPrompt) {
    return null; // Não mostra nada se o app não for instalável
  }
  
  return (
    <Button onClick={handleInstallClick} className="w-full gap-2" variant="outline">
      <Download className="h-4 w-4" />
      Instalar aplicativo
    </Button>
  );
}
