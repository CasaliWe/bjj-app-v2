import React from 'react';
import { Activity } from 'lucide-react';

/**
 * Componente de Loading para exibir um indicador de carregamento
 * Pode ser usado em tela cheia ou dentro de um container
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem a ser exibida
 * @param {boolean} props.fullScreen - Se o loading deve ocupar a tela inteira
 * @param {string} props.className - Classes adicionais
 */
const LoadingSpinner = ({ 
  message = "Carregando...", 
  fullScreen = false,
  className = ""
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="animate-spin">
          <Activity className="h-10 w-10 text-primary" />
        </div>
        <p className="mt-4 text-lg text-muted-foreground">{message}</p>
      </div>
    );
  }
  
  return (
    <div className={`w-full flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="animate-spin">
        <Activity className="h-8 w-8 text-primary" />
      </div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingSpinner;