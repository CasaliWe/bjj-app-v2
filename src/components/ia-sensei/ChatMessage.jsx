import { Bot, User, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * Componente para renderizar uma mensagem individual do chat
 */
export const ChatMessage = ({ mensagem }) => {
  const { tipo, conteudo, autor, timestamp } = mensagem;

  const getIcon = () => {
    switch (tipo) {
      case 'usuario':
        return <User className="h-4 w-4" />;
      case 'ia':
        return <Bot className="h-4 w-4" />;
      case 'erro':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageStyle = () => {
    switch (tipo) {
      case 'usuario':
        return 'ml-auto bg-primary text-primary-foreground';
      case 'ia':
        return 'mr-auto bg-muted';
      case 'erro':
        return 'mr-auto bg-destructive/10 border-destructive/20 text-destructive';
      default:
        return 'mr-auto bg-muted';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex w-full mb-3 md:mb-4 ${tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
      <Card className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 ${getMessageStyle()}`}>
        <div className="flex items-start gap-2">
          <div className="mt-0.5 md:mt-1">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium">{autor}</span>
              {timestamp && (
                <span className="text-xs opacity-70">
                  {formatTime(timestamp)}
                </span>
              )}
            </div>
            <div className="text-xs md:text-sm whitespace-pre-wrap break-words">
              {conteudo}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};