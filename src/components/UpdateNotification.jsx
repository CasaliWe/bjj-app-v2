import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verifica atualizações quando o componente é montado
    if ('serviceWorker' in navigator) {
      // Ouve por mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          console.log('Nova atualização disponível:', event.data.version);
          setUpdateAvailable(true);
          
          toast({
            title: "Nova atualização disponível!",
            description: "Existe uma nova versão do aplicativo pronta para ser instalada.",
            action: (
              <Button 
                className="gap-2 bg-bjj-gold hover:bg-bjj-gold/90" 
                onClick={updateApplication}
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            ),
            duration: 10000,
          });
        }
      });
      
      // Verifica se há um service worker controlando a página
      if (navigator.serviceWorker.controller) {
        // Verifica atualizações manualmente
        navigator.serviceWorker.ready.then(registration => {
          registration.update();
        });
      }
    }
  }, [toast]);

  // Função para atualizar o aplicativo
  const updateApplication = () => {
    // Força a atualização recarregando a página
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={updateApplication} 
        className="gap-2 bg-bjj-gold hover:bg-bjj-gold/90 shadow-lg"
      >
        <RefreshCw className="h-4 w-4 animate-spin-slow" />
        Atualizar Aplicativo
      </Button>
    </div>
  );
}
