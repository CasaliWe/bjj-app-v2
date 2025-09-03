import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Target, TrendingUp, Mail, KeyRound, User, EyeOff, Eye, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {loginGoogle} from "@/services/auth/login";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const isMobile = useIsMobile();

  // CloudFlare Turnstile (CAPTCHA) setup **********************************************************
  const TURNSTILE_SITE_KEY = "0x4AAAAAABycgUBdscrBJu1h"; // Sua chave real do CloudFlare Turnstile
  
  // Hook para monitorar continuamente o token do Turnstile
  useEffect(() => {
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
    
    // Carregar o script do Turnstile
    const loadTurnstile = () => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Após carregar o script, observe mudanças no DOM
      script.onload = () => {
        // Observar mudanças em todo o corpo do documento
        observer.observe(document.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['value']
        });
        
        // Verificação inicial após o carregamento
        setTimeout(checkTurnstileToken, 1000);
      };
      
      return script;
    };
    
    const script = loadTurnstile();
    
    // Limpeza
    return () => {
      clearInterval(tokenInterval);
      observer.disconnect();
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [turnstileToken]);

  // Reset de token do Turnstile quando necessário
  const resetTurnstile = () => {
    if (window.turnstile && turnstileRef.current) {
      window.turnstile.reset(turnstileRef.current);
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: ""
    };
    
    let isValid = true;
    
    // Validação de email (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "E-mail inválido";
      isValid = false;
    }
    
    // Validação de senha (mínimo 8 caracteres)
    if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
      isValid = false;
    }
    
    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
      isValid = false;
    }
    
    // Validação do Turnstile (CAPTCHA)
    if (!turnstileToken) {
      // Tenta obter o token diretamente do DOM - para casos onde a validação é invisível
      const autoToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
      if (autoToken) {
        // Se encontrar o token no DOM, use-o
        setTurnstileToken(autoToken);
      } else {
        newErrors.general = "Por favor, confirme que você não é um robô";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Função de registro preparada para API **************************************************
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validação do formulário
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulação de verificação de email já cadastrado (remover quando integrar com API real)
      if (email === "erro@teste.com") {
        setErrors(prev => ({ ...prev, email: "Este e-mail já está cadastrado" }));
        resetTurnstile();
        return;
      }
      
      // Dados para enviar à API
      const userData = {
        username,
        email,
        password,
        turnstileToken
      };
      
      console.log("Dados de registro:", userData);
      
      // Aqui você implementará a requisição para sua API PHP
      // Exemplo:
      // const response = await fetch('sua-api-php/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });
      // 
      // const data = await response.json();
      // 
      // if (!response.ok) {
      //   throw new Error(data.message || 'Erro ao registrar');
      // }
      
      // Após registro bem-sucedido
      navigate("/app");
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || "Erro ao criar conta. Tente novamente mais tarde." 
      }));
      resetTurnstile();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login com Google *********************************************************************
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));
    
    try {
      await loginGoogle();

      // Após autenticação bem-sucedida
      navigate("/app");
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || "Erro ao fazer login com Google. Tente novamente mais tarde." 
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: Target,
      title: "Técnicas Organizadas",
      description: "Catalogue e organize todas as técnicas que você aprende"
    },
    {
      icon: TrendingUp,
      title: "Progresso Detalhado",
      description: "Acompanhe sua evolução com métricas e estatísticas"
    },
    {
      icon: Award,
      title: "Competições",
      description: "Registre suas participações e conquistas"
    },
    {
      icon: Shield,
      title: "Plano de Jogo",
      description: "Monte estratégias e táticas personalizadas"
    }
  ];

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col justify-between p-4">
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
      
      {/* content register */}
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
                Junte-se à 
                <span className="text-bjj-gold block">Comunidade</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                Crie sua conta e comece a organizar suas técnicas, acompanhar treinos, 
                registrar competições e evoluir seu Jiu-Jitsu.
              </p>
            </div>
            
            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-4 rounded-lg bg-card/50 border border-border/50 hover:border-bjj-gold/30 transition-all duration-300 hover:bg-card/80"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-bjj-gold/10 rounded-lg group-hover:bg-bjj-gold/20 transition-colors duration-300">
                      <feature.icon className="w-5 h-5 text-bjj-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              Crie sua conta
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Comece sua jornada de evolução no Jiu-Jitsu
            </p>
            
            {/* Mini features no mobile */}
            <div className="flex justify-center gap-4 flex-wrap mt-3">
              {features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <feature.icon className="w-3 h-3 text-bjj-gold" />
                  <span>{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Seção mobile - Logo e título para telas pequenas */}

          
          {/* Lado direito - Card de cadastro */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
              <CardContent className="p-6 sm:p-8">
                <div className={`text-center mb-6 ${isMobile ? "hidden" : "block"}`}>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Crie sua conta
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Preencha seus dados para começar
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Mensagem de erro geral */}
                  {errors.general && (
                    <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 py-2">
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  {/* Campo de nome de usuário */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-foreground">
                      Nome completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="username"
                        type="text" 
                        placeholder="Mica Galvão" 
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errors.username) setErrors(prev => ({ ...prev, username: "" }));
                        }}
                        required
                        className={`pl-10 ${errors.username ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.username}
                      </p>
                    )}
                  </div>
                
                  {/* Campo de email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      E-mail
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
                          if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                        }}
                        required
                        className={`pl-10 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Campo de senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Senha
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                        }}
                        required
                        className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                    {password.length > 0 && (
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-red-500"}`} />
                        <span className={password.length >= 8 ? "text-green-500" : "text-muted-foreground"}>
                          Mínimo 8 caracteres
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Campo de confirmação de senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirme sua senha
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "" }));
                        }}
                        required
                        className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                    {confirmPassword.length > 0 && password === confirmPassword && (
                      <p className="text-green-500 text-xs mt-1 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Senhas conferem
                      </p>
                    )}
                  </div>

                  {/* CloudFlare Turnstile (CAPTCHA) */}
                  <div className="mt-2">
                    <div 
                      ref={turnstileRef}
                      className="cf-turnstile" 
                      data-sitekey={TURNSTILE_SITE_KEY}
                      data-callback={(token) => setTurnstileToken(token)}
                      data-theme="dark"
                      data-action="register"
                    ></div>
                    {turnstileToken && (
                      <p className="text-green-500 text-xs mt-1 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Verificação concluída
                      </p>
                    )}
                  </div>

                  {/* Botão de cadastro */}
                  <Button 
                    type="submit"
                    className="w-full h-11 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground font-medium transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
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

                  {/* Botão de login com Google */}
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleGoogleLogin}
                    className="w-full h-11 border-border hover:border-bjj-gold/50 text-foreground font-medium transition-all mb-4"
                    disabled={isLoading}
                  >
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Registrar com Google
                  </Button>

                  {/* Botão voltar para login */}
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleBackToLogin}
                    className="w-full h-11 border-border hover:border-bjj-gold/50 text-foreground font-medium transition-all"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o login
                  </Button>                  <div className="text-center space-y-4 mt-4">
                    <div className="text-xs text-muted-foreground">
                      Ao criar uma conta, você concorda com nossos{" "}
                      <button 
                        type="button" 
                        className="text-bjj-gold hover:underline"
                        onClick={() => navigate("/termos-de-uso")}
                      >
                        Termos de Uso
                      </button>{" "}
                      e{" "}
                      <button 
                        type="button" 
                        className="text-bjj-gold hover:underline"
                        onClick={() => navigate("/politica-de-privacidade")}
                      >
                        Política de Privacidade
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
          {/* Lado direito - Card de cadastro */}
        </div>
      </div>
      {/* content register */}
      
      {/* Copyright para mobile - movido para fora do grid e para o final da página */}
      <div className="md:hidden text-center mt-8 pt-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
      </div>
      {/* Copyright para mobile - movido para fora do grid e para o final da página */}
    </div>
  );
};

export default Register;
