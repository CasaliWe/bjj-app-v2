import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const isMobile = useIsMobile();
  
  // CloudFlare Turnstile (CAPTCHA) setup 
  const TURNSTILE_SITE_KEY = import.meta.env.VITE_CLOUDFLARE_TURNSTILE;
  
  // Hook para monitorar continuamente o token do Turnstile
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
        console.log("Token Turnstile detectado pelo observer");
      }
      
      isCheckingToken = false;
    };
    
    // Iniciar verificação periódica (a cada 500ms)
    const tokenInterval = setInterval(checkTurnstileToken, 500);
    
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
              console.log("Token Turnstile gerado via callback");
            },
            theme: 'dark',
            action: 'password_recovery'
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
          console.log("Token Turnstile gerado após reset");
        },
        theme: 'dark',
        action: 'password_recovery'
      });
    }
  };
  
  // chamada para api *****************************************************
  const handleRecovery = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailError("");
    
    // Verificar se o token do Turnstile está presente
    const tokenInput = document.querySelector('input[name="cf-turnstile-response"]');
    const autoToken = tokenInput?.value;
    
    if (!turnstileToken && !autoToken) {
      setEmailError("Por favor, confirme que você não é um robô");
      setIsSubmitting(false);
      return;
    }
    
    // Se encontramos o token no DOM mas não no estado, atualizamos o estado
    if (!turnstileToken && autoToken) {
      setTurnstileToken(autoToken);
    }
    
    // Preparar dados para enviar à API
    const recoveryData = {
      email,
      token: turnstileToken || autoToken
    };

    // enviando para api
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/recuperar-senha.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(recoveryData)
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitting(false);
        resetTurnstile();
        setShowDialog(true);
      }else{
        setIsSubmitting(false);
        resetTurnstile();
        setEmailError(data.message || "Ocorreu um erro ao enviar a solicitação.");
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação de recuperação:", error);
      setIsSubmitting(false);
      setEmailError("Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.");
    }
  };
  
  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col justify-between p-4">
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
      
      {/* content recuperar */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
          {/* Lado esquerdo - Informações da plataforma */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in hidden md:block">
            {/* Logo e título */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-12 h-12 bg-bjj-gold rounded-xl flex items-center justify-center">
                  <span className="text-bjj-dark font-bold text-xl">BJJ</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Academy</h1>
                  <p className="text-muted-foreground text-sm">Plataforma de Jiu-Jitsu</p>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                Recupere seu
                <span className="text-bjj-gold block">Acesso</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                Não se preocupe. Insira seu e-mail cadastrado e enviaremos instruções 
                para restaurar seu acesso à plataforma.
              </p>
            </div>
            
            {/* Lista de passos */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bjj-gold/10 rounded-full flex items-center justify-center text-bjj-gold font-bold">1</div>
                <div>
                  <h3 className="text-foreground font-medium mb-1">Digite seu e-mail</h3>
                  <p className="text-sm text-muted-foreground">Informe o e-mail que você usou para se cadastrar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bjj-gold/10 rounded-full flex items-center justify-center text-bjj-gold font-bold">2</div>
                <div>
                  <h3 className="text-foreground font-medium mb-1">Verifique sua caixa de entrada</h3>
                  <p className="text-sm text-muted-foreground">Enviaremos um e-mail com uma senha temporária</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bjj-gold/10 rounded-full flex items-center justify-center text-bjj-gold font-bold">3</div>
                <div>
                  <h3 className="text-foreground font-medium mb-1">Acesse a plataforma</h3>
                  <p className="text-sm text-muted-foreground">Use a senha temporária para fazer login e crie uma nova senha</p>
                </div>
              </div>
            </div>
            
            {/* Copyright - versão desktop */}
            <div className="text-center lg:text-left pt-4">
              <p className="text-sm text-muted-foreground">© 2025 BJJ Academy. Todos os direitos reservados.</p>
            </div>
          </div>
          {/* Lado esquerdo - Informações da plataforma */}
          
          {/* Seção mobile - Logo e título para telas pequenas */}
          <div className="md:hidden text-center mb-8">
            {/* Logo mobile */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-bjj-gold rounded-xl flex items-center justify-center">
                <span className="text-bjj-dark font-bold text-lg">BJJ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Academy</h1>
                <p className="text-muted-foreground text-xs">Plataforma de Jiu-Jitsu</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Recuperar senha
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Recupere o acesso à sua conta
            </p>
          </div>
          {/* Seção mobile - Logo e título para telas pequenas */}
          
          {/* Lado direito - Card de recuperação de senha */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
              <CardContent className="p-6 sm:p-8">
                <div className={`text-center mb-6 ${isMobile ? "hidden" : "block"}`}>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Recuperar senha
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Enviaremos uma senha temporária para seu e-mail
                  </p>
                </div>

                {/* Breves instruções no mobile - visíveis apenas em dispositivos móveis */}
                <div className="md:hidden space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-bjj-gold/10 flex items-center justify-center text-bjj-gold text-xs">1</div>
                    <span>Digite seu e-mail cadastrado</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-bjj-gold/10 flex items-center justify-center text-bjj-gold text-xs">2</div>
                    <span>Verifique sua caixa de entrada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-bjj-gold/10 flex items-center justify-center text-bjj-gold text-xs">3</div>
                    <span>Use a senha temporária para acessar</span>
                  </div>
                </div>

                <form onSubmit={handleRecovery} className="space-y-4">
                  {/* Mensagem de erro */}
                  {emailError && (
                    <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{emailError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Campo de email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      E-mail cadastrado
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        required
                        className={`pl-10 ${emailError ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                    </div>
                  </div>

                  {/* CloudFlare Turnstile (CAPTCHA) */}
                  <div className="mt-4">
                    <div 
                      ref={turnstileRef}
                      className="cf-turnstile"
                    ></div>
                    {turnstileToken && (
                      <p className="text-green-500 text-xs mt-1 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Verificação concluída
                      </p>
                    )}
                  </div>

                  {/* Botão de envio */}
                  <Button 
                    type="submit"
                    className="w-full h-11 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground font-medium transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar instruções"}
                  </Button>
                  
                  {/* Separador */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs text-muted-foreground">
                      <span className="bg-card px-2">ou</span>
                    </div>
                  </div>

                  {/* Botão voltar para login */}
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleBackToLogin}
                    className="w-full h-11 border-border hover:border-bjj-gold/50 text-foreground font-medium transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o login
                  </Button>

                  <div className="text-center space-y-4 mt-4">
                    <div className="text-xs text-muted-foreground">
                      Se você não possui uma conta,{" "}
                      <button 
                        type="button" 
                        className="text-bjj-gold hover:underline"
                        onClick={() => navigate("/register")}
                      >
                        criar agora
                      </button>
                    </div>
                  </div>
                </form>

                {/* Indicadores de segurança */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-bjj-gold" />
                      <span>Seguro</span>
                    </div>
                    <div className="hidden sm:block w-px h-3 bg-border" />
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Privado</span>
                    </div>
                    <div className="hidden sm:block w-px h-3 bg-border" />
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-bjj-gold rounded-full" />
                      <span>Confiável</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Lado direito - Card de recuperação de senha */}

        </div>
      </div>
      {/* content recuperar */}
      
      {/* Copyright para mobile - movido para fora do grid e para o final da página */}
      <div className="md:hidden text-center mt-8 pt-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
      </div>
      {/* Copyright para mobile - movido para fora do grid e para o final da página */}


      {/* Modal de confirmação */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">E-mail enviado com sucesso!</DialogTitle>
            <DialogDescription className="mt-2">
              Enviamos um nova senha para seu e-mail <span className="font-medium text-foreground">{email}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-bjj-gold/20 flex items-center justify-center text-bjj-gold text-xs">✓</div>
                  <span className="text-sm">Verifique sua caixa de entrada e spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-bjj-gold/20 flex items-center justify-center text-bjj-gold text-xs">✓</div>
                  <span className="text-sm">Use a senha temporária para fazer login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-bjj-gold/20 flex items-center justify-center text-bjj-gold text-xs">✓</div>
                  <span className="text-sm">Atualize sua senha nas configurações</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCloseDialog} 
              className="w-full sm:w-auto bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
            >
              Voltar para o login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordRecovery;
