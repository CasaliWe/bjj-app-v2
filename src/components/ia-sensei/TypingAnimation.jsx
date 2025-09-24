import { useEffect, useState } from 'react';

/**
 * Componente de animação de digitação para indicar que a IA está processando
 */
export const TypingAnimation = ({ text = "IA Sensei está digitando" }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span className="text-xs md:text-sm font-medium">
        {text}<span className="inline-block w-4 text-left">{dots}</span>
      </span>
    </div>
  );
};