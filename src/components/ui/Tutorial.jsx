import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { HelpCircle } from "lucide-react";
import { getTutorialByPath } from "@/data/tutoriais";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// DialogContent customizado sem botão X
const CustomDialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg w-[95%] md:w-[40%] max-h-[90vh] overflow-hidden flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

/**
 * Componente de Tutorial para páginas específicas
 * Mostra um botão que abre um modal com descrição e GIF tutorial
 * @returns {JSX.Element|null} Componente React ou null se não há tutorial para a página
 */
const Tutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Obter dados do tutorial para a página atual
  const tutorial = getTutorialByPath(location.pathname);
  
  // Se não há tutorial para esta página, não renderiza nada
  if (!tutorial) {
    return null;
  }
  
  const abrirTutorial = () => {
    setIsOpen(true);
  };
  
  const fecharTutorial = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão Tutorial */}
      <Button
        onClick={abrirTutorial}
        variant="outline"
        size="sm"
        className="border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10 px-2 md:px-3"
      >
        <HelpCircle className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Tutorial</span>
      </Button>

      {/* Modal do Tutorial */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CustomDialogContent className="p-0">
          {/* Header */}
          <DialogHeader className="p-4 pb-2 flex-shrink-0 border-b">
            <DialogTitle className="text-lg font-semibold text-foreground text-center">
              {tutorial.titulo}
            </DialogTitle>
          </DialogHeader>

          {/* Conteúdo com scroll */}
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-80px)]">
            <div className="p-4 flex flex-col items-center">
              {/* Container com largura fixa para alinhar texto e GIF */}
              <div className="w-full max-w-[280px] md:max-w-[320px] space-y-6">
                {/* Descrição */}
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                  {tutorial.descricao}
                </p>

                {/* GIF Tutorial com moldura de celular */}
                <div className="relative">
                  {/* Moldura do celular */}
                  <div className="bg-gray-800 rounded-[20px] p-2 shadow-2xl">
                    {/* Tela do celular */}
                    <div className="bg-black rounded-[16px] p-1">
                      {/* Área da tela */}
                      <div className="bg-white rounded-[12px] overflow-hidden relative">
                        {/* Notch/barra superior */}
                        <div className="h-6 bg-black relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-3 bg-black rounded-full"></div>
                        </div>
                        
                        {/* Conteúdo do GIF */}
                        <img
                          src={`/tutoriais/${tutorial.gif}`}
                          alt={`Tutorial ${tutorial.titulo}`}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            console.warn(`GIF do tutorial não encontrado: ${tutorial.gif}`);
                            e.target.style.display = 'none';
                            // Mostrar placeholder se GIF não carregar
                            const parent = e.target.parentElement;
                            if (parent && !parent.querySelector('.gif-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'gif-placeholder flex items-center justify-center h-64 text-muted-foreground text-sm bg-gray-100';
                              placeholder.innerHTML = `
                                <div class="text-center">
                                  <div class="text-4xl mb-2">📱</div>
                                  <p class="text-gray-600">GIF do tutorial será adicionado em breve</p>
                                </div>
                              `;
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                        
                        {/* Barra inferior do celular */}
                        <div className="h-2 bg-black"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão para fechar */}
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={fecharTutorial}
                    variant="default"
                    size="sm"
                    className="bg-bjj-gold text-black hover:bg-bjj-gold/90"
                  >
                    Entendi, Vamos lá!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CustomDialogContent>
      </Dialog>
    </>
  );
};

export default Tutorial;