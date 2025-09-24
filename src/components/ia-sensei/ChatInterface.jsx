import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from './ChatMessage';
import { TypingAnimation } from './TypingAnimation';
import { useIASensei } from '@/hooks/use-ia-sensei.jsx';
import { useIAUserData } from '@/hooks/use-ia-user-data.jsx';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Componente principal do chat da IA Sensei
 */
export const ChatInterface = () => {
  const [mensagemAtual, setMensagemAtual] = useState('');
  const scrollAreaRef = useRef(null);
  const textareaRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { 
    mensagens, 
    carregando, 
    erro, 
    enviarMensagem, 
    limparHistorico, 
    contarInteracoes 
  } = useIASensei();
  
  const { coletarDadosUsuario } = useIAUserData();

  // Auto scroll para a última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [mensagens, carregando]);

  // Foco no textarea quando não está carregando
  useEffect(() => {
    if (!carregando && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [carregando]);

  const handleEnviarMensagem = async () => {
    if (!mensagemAtual.trim() || carregando) return;

    const mensagemParaEnviar = mensagemAtual.trim();
    setMensagemAtual(''); // Limpar input imediatamente

    try {
      // Coleta dados do usuário
      const dadosUsuario = await coletarDadosUsuario();
      
      // Enviar mensagem
      await enviarMensagem(mensagemParaEnviar, dadosUsuario);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Restaurar mensagem em caso de erro
      setMensagemAtual(mensagemParaEnviar);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleLimparChat = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico do chat?')) {
      limparHistorico();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header do Chat */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-3 md:px-6">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            IA Sensei
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground">
            Assistente especializado em Jiu-Jitsu {!isMobile && `• ${contarInteracoes} interações`}
          </p>
        </div>
        {mensagens.length > 0 && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            onClick={handleLimparChat}
            className="flex items-center gap-1 md:gap-2"
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
            {!isMobile && "Limpar"}
          </Button>
        )}
      </CardHeader>

      {/* Área de mensagens */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 px-3 md:px-4"
        >
          <div className="space-y-3 md:space-y-4 pb-4">
            {mensagens.length === 0 ? (
              <div className="text-center py-8 md:py-12 px-4">
                <div className="mb-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    🥋
                  </div>
                  <h3 className="text-base md:text-lg font-medium mb-2">Olá! Eu sou a IA Sensei</h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-sm md:max-w-md mx-auto">
                    Estou aqui para ajudar com suas dúvidas sobre Jiu-Jitsu. 
                    Posso analisar seus treinos, técnicas, competições e muito mais!
                  </p>
                </div>
                <div className="grid gap-2 max-w-sm md:max-w-md mx-auto">
                  <div className="text-xs md:text-sm text-muted-foreground">Exemplos do que posso ajudar:</div>
                  <div className="text-xs text-left space-y-1">
                    <div>• "Como posso melhorar minha guarda?"</div>
                    <div>• "Analise meus últimos treinos"</div>
                    <div>• "Quais técnicas devo focar?"</div>
                    <div>• "Dicas para minha próxima competição"</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mensagens.map((mensagem) => (
                  <ChatMessage key={mensagem.id} mensagem={mensagem} />
                ))}
                
                {carregando && (
                  <div className="flex justify-start">
                    <Card className="max-w-[85%] md:max-w-[80%] p-2 md:p-3 bg-muted">
                      <TypingAnimation />
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input de mensagem */}
        <div className="border-t p-3 md:p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Digite sua pergunta sobre Jiu-Jitsu..."
              value={mensagemAtual}
              onChange={(e) => setMensagemAtual(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[50px] md:min-h-[60px] max-h-[100px] md:max-h-[120px] resize-none text-sm md:text-base"
              disabled={carregando}
            />
            <Button
              onClick={handleEnviarMensagem}
              disabled={!mensagemAtual.trim() || carregando}
              className="self-end"
              size={isMobile ? "default" : "lg"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {erro && (
            <div className="text-xs md:text-sm text-destructive mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-3 md:w-3" />
              {erro}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            {isMobile ? "Enter para enviar" : "Pressione Enter para enviar, Shift+Enter para quebrar linha"}
          </div>
        </div>
      </CardContent>
    </div>
  );
};