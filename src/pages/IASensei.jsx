import { useState, useRef, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Bot, ChevronRight, LogOut, Send, User } from "lucide-react";

// hooks
import { useGetUser } from "@/hooks/use-getUser";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const IASensei = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Rolagem automática para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Simulação de resposta da IA
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulando o tempo de resposta da IA
    setTimeout(() => {
      // Exemplo de respostas possíveis com base em palavras-chave
      let aiResponse = "";
      const userInput = inputValue.toLowerCase();
      
      if (userInput.includes("guarda") && userInput.includes("passar")) {
        aiResponse = "Para passar a guarda com eficiência, foco em controlar os quadris e joelhos do oponente. Mantenha pressão constante, evite dar espaços e trabalhe para quebrar a postura do guardeiro. Técnicas como o toreando, o X-pass e o knee-cut são muito eficazes, mas a chave é treinar a sequência de movimentos até que se tornem fluidos.";
      } else if (userInput.includes("triangulo") || userInput.includes("triângulo")) {
        aiResponse = "O triângulo é uma das finalizações mais eficazes do Jiu-Jitsu. Para executá-lo corretamente, certifique-se de ter o braço do oponente cruzando o centro do corpo, feche o triângulo com as pernas alinhando o tornozelo à parte posterior do joelho oposto, e ajuste puxando a cabeça para baixo enquanto eleva os quadris. Não force apenas com as pernas, use todo o corpo para a finalização.";
      } else if (userInput.includes("competição") || userInput.includes("competicao") || userInput.includes("campeonato")) {
        aiResponse = "Para se preparar para competições, recomendo: 1) Intensifique seus treinos 6-8 semanas antes do evento; 2) Trabalhe situações específicas de luta que simulem o campeonato; 3) Desenvolva um plano de jogo claro para cada fase da luta; 4) Pratique o controle da respiração e técnicas de visualização para reduzir a ansiedade; 5) Ajuste sua alimentação e certifique-se de que seu peso está adequado para sua categoria.";
      } else if (userInput.includes("alongamento") || userInput.includes("flexibilidade")) {
        aiResponse = "A flexibilidade é crucial no Jiu-Jitsu. Recomendo uma rotina diária de alongamentos dinâmicos antes do treino (para aquecer) e estáticos após o treino (para melhorar a amplitude de movimento). Foque nas áreas mais exigidas: quadril, ombros, coluna e panturrilhas. O yoga também é um excelente complemento para melhorar sua flexibilidade e consciência corporal.";
      } else if (userInput.includes("lesão") || userInput.includes("lesao") || userInput.includes("machucado")) {
        aiResponse = "Lesões fazem parte do esporte, mas podem ser minimizadas. Sempre aqueça adequadamente, aprenda a bater antes que a dor se torne insuportável, e respeite os limites do seu corpo. Se já está lesionado, busque atendimento médico, siga o plano de recuperação à risca e, quando voltar aos treinos, comunique seus parceiros sobre suas limitações. Lembre-se que treinar com lesões mal curadas pode causar danos de longo prazo.";
      } else {
        aiResponse = "Entendi sua questão. Para aprimorar essa técnica ou estratégia específica de Jiu-Jitsu, recomendo que você trabalhe os fundamentos básicos primeiro, depois avance para as variações. A consistência nos treinos e a atenção aos detalhes técnicos são essenciais para o desenvolvimento no Jiu-Jitsu. Posso oferecer orientações mais específicas se você detalhar mais sua dúvida.";
      }

      const assistantMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };
  // Formatar a data para exibição
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Lidar com a tecla Enter para enviar mensagem
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}          <header className="bg-card border-b border-border p-4 md:p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden text-bjj-gold hover:text-bjj-gold/80 h-10 w-10 flex items-center justify-center" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bjj-gold/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-bjj-gold" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">I.A Sensei</h1>
                  <p className="text-sm text-muted-foreground hidden md:block">Seu assistente de Jiu-Jitsu alimentado por I.A</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate('/login')}
                variant="ghost"
                size="icon"
                title="Sair"
              >
                <LogOut className="h-5 w-5 text-bjj-gold" />
              </Button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">

            {/* Container principal de chat */}
            <div className="flex-1 flex flex-col h-full relative">
              {/* Área de mensagens */}
              <ScrollArea className="flex-1 p-4 pt-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' ? 'bg-bjj-gold/20' : 'bg-primary/10'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="h-4 w-4 text-bjj-gold" />
                          ) : (
                            <Bot className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <Card className={`p-4 ${
                            message.role === 'user' ? 'bg-bjj-gold text-primary-foreground' : 'bg-card'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </Card>
                          <p className="text-[10px] text-muted-foreground mt-1 px-1">
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Indicador de digitação */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <Card className="p-4 bg-card">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>              {/* Área de entrada de texto */}
              <div className="p-4 border-t border-border">
                <div className="max-w-3xl mx-auto relative">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Digite sua dúvida sobre Jiu-Jitsu..."
                        className="pr-10 py-6 resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                        disabled={!inputValue.trim() || isLoading}
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    I.A Sensei pode cometer erros. Consulte seu professor para técnicas avançadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

    </SidebarProvider>
  );
};

export default IASensei;
