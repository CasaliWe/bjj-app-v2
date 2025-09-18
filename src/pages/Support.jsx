import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessagesSquare, Mail, Headphones, FileText, HelpCircle, Phone, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Constante com o conteúdo da página de Suporte
// Esta constante pode ser facilmente atualizada no futuro
const SUPPORT_CONTENT = {
  title: "Suporte",
  subtitle: "Como podemos ajudar?",
  description: "Nossa equipe está pronta para ajudar você com qualquer questão relacionada à BJJ Academy.",
  helpCategories: [
    {
      id: "account",
      label: "Conta e Acesso",
      description: "Problemas com login, cadastro ou configurações de conta"
    },
    {
      id: "payment",
      label: "Pagamentos e Assinatura",
      description: "Dúvidas sobre cobranças, planos ou cancelamentos"
    },
    {
      id: "app",
      label: "Funcionalidades do App",
      description: "Ajuda com recursos, funções ou bugs do aplicativo"
    },
    {
      id: "other",
      label: "Outros Assuntos",
      description: "Parcerias, sugestões ou outras questões"
    }
  ],
  faq: [
    {
      question: "Como altero minha senha?",
      answer: "Para alterar sua senha, acesse seu perfil no app, vá em Perfil > Alterar Senha. Digite a senha atual e a nova senha (caso o login tenha sido feito com google, deixe o campo senha atual em branco)."
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Atualmente nosso modo de assinatura é em formato pré pago, portanto não é possível cancelar antes do término do período já pago, ao final do período você poderá optar por não renovar e não será cobrado novamente."
    },
    {
      question: "Perdi meus dados de treino, como recuperá-los?",
      answer: "Se você estiver utilizando uma conta conectada, todos os seus dados são sincronizados na nuvem. Verifique se está logado com a mesma conta em que registrou seus treinos. Se o problema persistir, entre em contato com nosso suporte."
    },
    {
      question: "Como compartilhar técnicas com outros usuários?",
      answer: "Abra a técnica desejada em sua biblioteca, toque nos três pontos e escolha a opção de Tornar Pública."
    }
  ],
  contactForm: {
    title: "Entre em Contato",
    description: "Preencha o formulário abaixo e entraremos em contato o mais rápido possível.",
    fields: {
      name: "Nome completo",
      email: "E-mail",
      subject: "Assunto",
      message: "Mensagem",
      category: "Categoria",
      submit: "Enviar Mensagem"
    }
  },  footer: {
    links: [
      { name: "Termos de Uso", href: "/termos-de-uso" },
      { name: "Política de Privacidade", href: "/politica-de-privacidade" }
    ]
  }
};

const Support = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Estados para o formulário de contato
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  
  // Cloudflare Turnstile
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const TURNSTILE_SITE_KEY = import.meta.env.VITE_CLOUDFLARE_TURNSTILE;
  
  // Configuração do Cloudflare Turnstile
  useEffect(() => {
    // Limpar qualquer token existente quando o componente monta
    setTurnstileToken("");
    
    // Flag para evitar verificações desnecessárias
    let isCheckingToken = false;
    
    // Função para verificar o token no DOM
    const checkTurnstileToken = () => {
      if (isCheckingToken || turnstileToken) return;
      
      isCheckingToken = true;
      const tokenInput = document.querySelector('input[name="cf-turnstile-response"]');
      
      if (tokenInput && tokenInput.value) {
        setTurnstileToken(tokenInput.value);
      }
      
      isCheckingToken = false;
    };

    // Iniciar verificação periódica (a cada 1000ms)
    const tokenInterval = setInterval(checkTurnstileToken, 1000);
    
    // Configurar um MutationObserver para detectar mudanças no DOM
    const observer = new MutationObserver((mutations) => {
      checkTurnstileToken();
    });
    
    // Função para remover e recarregar o script do Turnstile
    const reloadTurnstile = () => {
      // Remover qualquer script anterior do Turnstile
      const oldScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (oldScript && oldScript.parentNode) {
        oldScript.parentNode.removeChild(oldScript);
      }
      
      // Remover qualquer iframe do Turnstile para forçar recriação
      const oldIframes = document.querySelectorAll('iframe[src*="challenges.cloudflare.com"]');
      oldIframes.forEach(iframe => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      });
      
      // Limpar o container do Turnstile
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = '';
      }
      
      // Carregar novo script
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Após carregar o script, observe mudanças no DOM e renderize o widget
      script.onload = () => {
        // Observar mudanças em todo o corpo do documento
        observer.observe(document.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['value']
        });
        
        // Renderizar o widget explicitamente
        if (window.turnstile && turnstileRef.current) {
          window.turnstile.render(turnstileRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token) => {
              setTurnstileToken(token);
            },
            theme: 'dark',
            action: 'support'
          });
        }
        
        // Verificação inicial após o carregamento
        setTimeout(checkTurnstileToken, 1000);
      };
      
      return script;
    };
    
    const script = reloadTurnstile();
    
    // Limpeza
    return () => {
      clearInterval(tokenInterval);
      observer.disconnect();
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Reset de token do Turnstile quando necessário
  const resetTurnstile = () => {
    setTurnstileToken("");
    if (window.turnstile && turnstileRef.current) {
      // Limpar o container primeiro
      turnstileRef.current.innerHTML = '';
      
      // Re-renderizar o widget
      window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          setTurnstileToken(token);
        },
        theme: 'dark',
        action: 'support'
      });
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  // Função para validar o formulário
  const validateForm = () => {
    // Validação de email (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("E-mail inválido");
      return false;
    }
    
    // Validação do Turnstile (CAPTCHA)
    if (!turnstileToken) {
      // Tenta obter o token diretamente do DOM - para casos onde a validação é invisível
      const autoToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
      if (autoToken) {
        // Se encontrar o token no DOM, use-o
        setTurnstileToken(autoToken);
      } else {
        setError("Por favor, confirme que você não é um robô");
        return false;
      }
    }
    
    return true;
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validação do formulário
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Dados para enviar à API
      const supportFormData = {
        name,
        email,
        subject,
        message,
        category,
        turnstileToken
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/sistema/enviar-suporte.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(supportFormData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowSuccessMessage(true);
        
        // Limpar formulário
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setCategory("");
        
        // Esconder mensagem de sucesso após 5 segundos
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        setError(result.message || "Erro ao enviar mensagem. Tente novamente mais tarde.");
        resetTurnstile();
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setError("Erro ao enviar mensagem. Tente novamente mais tarde.");
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col justify-between p-4">
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bjj-gold rounded-xl flex items-center justify-center">
                <span className="text-bjj-dark font-bold text-lg">BJJ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Academy</h1>
                <p className="text-muted-foreground text-xs">Plataforma de Jiu-Jitsu</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="h-9 px-3 border-border hover:border-bjj-gold/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          {/* Card principal */}
          <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
            <CardContent className="p-0">
              {/* Header da página de suporte */}
              <div className="bg-gradient-to-r from-bjj-gold/20 to-bjj-gold/5 p-6 sm:p-10 rounded-t-lg">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-foreground mb-2">{SUPPORT_CONTENT.title}</h2>
                  <p className="text-xl font-medium text-bjj-gold mb-2">{SUPPORT_CONTENT.subtitle}</p>
                  <p className="text-muted-foreground">{SUPPORT_CONTENT.description}</p>
                </div>
              </div>
              
              {/* Conteúdo principal */}              <div className="p-6 sm:p-10">
                {/* Formulário de contato */}
                <div className="mb-16">
                  <h3 className="text-xl font-semibold mb-2 text-center">{SUPPORT_CONTENT.contactForm.title}</h3>
                  <p className="text-center text-muted-foreground mb-6">{SUPPORT_CONTENT.contactForm.description}</p>
                  
                  {showSuccessMessage && (
                    <Alert className="mb-6 bg-green-900/20 border-green-800 text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Mensagem enviada com sucesso!</AlertTitle>
                      <AlertDescription>
                        Nossa equipe de suporte entrará em contato em breve. Obrigado pelo seu contato.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert className="mb-6 bg-red-900/20 border-red-800 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleContactFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{SUPPORT_CONTENT.contactForm.fields.name}</Label>
                        <Input 
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{SUPPORT_CONTENT.contactForm.fields.email}</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{SUPPORT_CONTENT.contactForm.fields.category}</Label>
                      <RadioGroup 
                        value={category} 
                        onValueChange={setCategory}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {SUPPORT_CONTENT.helpCategories.map((cat) => (
                          <div key={cat.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={cat.id} id={cat.id} className="mt-1" />
                            <Label 
                              htmlFor={cat.id}
                              className="flex-1 cursor-pointer"
                            >
                              <span className="font-medium">{cat.label}</span>
                              <p className="text-xs text-muted-foreground">{cat.description}</p>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">{SUPPORT_CONTENT.contactForm.fields.subject}</Label>
                      <Input 
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="bg-card/50 border-border/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{SUPPORT_CONTENT.contactForm.fields.message}</Label>
                      <Textarea 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="bg-card/50 border-border/40 resize-none"
                      />
                    </div>
                    
                    {/* CloudFlare Turnstile */}
                    <div className="py-2">
                      <div 
                        ref={turnstileRef} 
                        className="flex justify-center py-2"
                      ></div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-pulse mr-2">●</span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {SUPPORT_CONTENT.contactForm.fields.submit}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* FAQ - Perguntas frequentes */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center">Perguntas Frequentes</h3>
                  
                  <div className="space-y-4 mb-8">
                    {SUPPORT_CONTENT.faq.map((item, index) => (
                      <details 
                        key={index} 
                        className="group bg-card/50 border border-border/50 rounded-lg overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-bjj-gold/10 flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="w-4 h-4 text-bjj-gold" />
                            </div>
                            <h4 className="text-base font-medium">{item.question}</h4>
                          </div>
                          <div className="flex-shrink-0 ml-2 text-muted-foreground transition-transform group-open:rotate-180">
                            <ArrowLeft className="rotate-[-90deg]" />
                          </div>
                        </summary>
                        <div className="px-4 pb-4 pt-2 pl-[60px] text-muted-foreground">
                          <p>{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Rodapé do card */}
              <div className="bg-card/30 border-t border-border/30 p-4 rounded-b-lg">
                <div className="flex flex-wrap justify-center gap-4">
                  {SUPPORT_CONTENT.footer.links.map((link, index) => (
                    <Button 
                      key={index}
                      variant="link" 
                      className="text-muted-foreground hover:text-bjj-gold"
                      onClick={() => navigate(link.href)}
                    >
                      {link.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        {/* Seção de modais removida */}
      
      {/* Copyright footer */}
      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">© 2025 BJJ Academy. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Support;
