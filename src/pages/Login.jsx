import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Target, TrendingUp, Mail, KeyRound, User, EyeOff, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  
  // fazer login ***************************************************
  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui seria a lógica de autenticação
    console.log("Login com:", { email, password });
    // Por enquanto, apenas navega para o dashboard
    navigate("/app");
  };
  
  const handleCreateAccount = () => {
    // Navegar para a página de criação de conta
    navigate("/register");
  };
  
  const handlePasswordRecovery = () => {
    // Navegar para a página de recuperação de senha
    navigate("/recuperar-senha");
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
      
      {/* content login */}
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
                Evolua seu
                <span className="text-bjj-gold block">Jiu-Jitsu</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                A plataforma completa para organizar técnicas, acompanhar treinos, 
                registrar competições e criar seu plano de jogo personalizado.
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
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
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
              Acesse sua conta
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Faça login para continuar sua jornada no Jiu-Jitsu
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
          
          {/* Lado direito - Card de login */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
              <CardContent className="p-6 sm:p-8">
                <div className={`text-center mb-6 ${isMobile ? "hidden" : "block"}`}>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Acesse sua conta
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Faça login para continuar sua jornada no Jiu-Jitsu
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Campo de senha */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Senha
                      </Label>
                      <button 
                        type="button" 
                        onClick={handlePasswordRecovery}
                        className="text-xs text-bjj-gold hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Botão de login */}
                  <Button 
                    type="submit"
                    className="w-full h-11 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground font-medium transition-all"
                  >
                    Entrar
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

                  {/* Botão de criar conta */}
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleCreateAccount}
                    className="w-full h-11 border-border hover:border-bjj-gold/50 text-foreground font-medium transition-all"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Criar nova conta
                  </Button>                  <div className="text-center space-y-4 mt-4">
                    <div className="text-xs text-muted-foreground">
                      Ao continuar, você concorda com nossos{" "}
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
          {/* Lado direito - Card de login */}
        </div>
      </div>
      {/* content login */}
      
      {/* Copyright para mobile - movido para fora do grid e para o final da página */}
      <div className="md:hidden text-center mt-8 pt-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
      </div>
      {/* Copyright para mobile - movido para fora do grid e para o final da página */}

    </div>
  );
};

export default Login;
