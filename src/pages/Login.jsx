import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Target, TrendingUp } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Por enquanto, apenas navega para o dashboard
    navigate("/");
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-bjj-gold/5 via-transparent to-bjj-gold/10" />
      
      {/* Círculos decorativos */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-bjj-gold/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl" />
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Lado esquerdo - Informações da plataforma */}
        <div className="space-y-8 animate-fade-in">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          {/* Estatísticas */}
          <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-bjj-gold">500+</div>
              <div className="text-xs text-muted-foreground">Técnicas</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-bjj-gold">1K+</div>
              <div className="text-xs text-muted-foreground">Atletas</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-bjj-gold">98%</div>
              <div className="text-xs text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>

        {/* Lado direito - Card de login */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Bem-vindo de volta
                </h3>
                <p className="text-muted-foreground">
                  Faça login para continuar sua jornada no Jiu-Jitsu
                </p>
              </div>

              <div className="space-y-6">
                <GoogleLoginButton onClick={handleGoogleLogin} />
                
                <div className="text-center space-y-4">
                  <div className="text-xs text-muted-foreground">
                    Ao continuar, você concorda com nossos{" "}
                    <button className="text-bjj-gold hover:underline">
                      Termos de Uso
                    </button>{" "}
                    e{" "}
                    <button className="text-bjj-gold hover:underline">
                      Política de Privacidade
                    </button>
                  </div>
                </div>
              </div>

              {/* Indicadores de segurança */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-bjj-gold" />
                    <span>Seguro</span>
                  </div>
                  <div className="w-px h-3 bg-border" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Privado</span>
                  </div>
                  <div className="w-px h-3 bg-border" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-bjj-gold rounded-full" />
                    <span>Confiável</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
