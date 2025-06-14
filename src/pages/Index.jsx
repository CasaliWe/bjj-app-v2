import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { MetricCard } from "@/components/MetricCard";
import { QuickActions } from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Book, Award, TrendingUp, Clock, Target, Repeat, Dumbbell, User, LogOut } from "lucide-react";

const Index = () => {  const metrics = [    {
      title: "Técnicas Aprendidas",
      value: "47",
      description: "Meta: 60 técnicas",
      icon: Book,
      trend: { type: 'neutral', text: '78% da meta anual' }
    },
    {
      title: "Treinos no Mês",
      value: "12",
      description: "Meta: 16 treinos",
      icon: Calendar,
      trend: { type: 'neutral', text: '75% da meta mensal' }
    },
    {
      title: "Competições",
      value: "3",
      description: "Este ano",
      icon: Award,
      trend: { type: 'up', text: '2 medalhas conquistadas' }
    },    {
      title: "Observações Gerais",
      value: "20",
      description: "Registradas",
      icon: Target,
      trend: { type: 'up', text: '3 destacadas' }
    }
  ];
  // Importação adicional para o ícone padrão
  
  const recentActivities = [
    {
      type: "treino",
      title: "Treino de Gi",
      description: "Trabalhei guard pass e finalizações",
      time: "2 horas atrás",
      icon: Target
    },
    {
      type: "tecnica",
      title: "Triângulo da Guarda Fechada",
      description: "Adicionei variação com lapela",
      time: "1 dia atrás",
      icon: Target
    },
    {
      type: "competicao",
      title: "Copa Regional de Jiu-Jitsu",
      description: "2º lugar na categoria azul adulto",
      time: "3 dias atrás",
      icon: Target
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">          {/* Header */}
          <header className="bg-card border-b border-border p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden text-bjj-gold hover:text-bjj-gold/80 h-10 w-10 flex items-center justify-center" />
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold text-foreground">Olá, Atleta! 👋</h1>
                  <p className="text-muted-foreground">Bem-vindo de volta à sua jornada no Jiu-Jitsu</p>
                </div>
                <div className="md:hidden">
                  <h1 className="text-xl font-bold text-foreground">Olá, Atleta! 👋</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => console.log('Perfil de usuário')}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  title="Perfil de Usuário"
                >
                  <User className="h-5 w-5 text-bjj-gold" />
                </button>
                <button 
                  onClick={() => console.log('Logout')}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5 text-bjj-gold" />
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6 space-y-6 animate-fade-in">
            {/* Métricas principais */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-bjj-gold" />
                Seu Progresso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ações rápidas */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>

              {/* Atividades recentes */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-bjj-gold" />
                      Atividades Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                        <div className="p-2 bg-bjj-gold/10 rounded-lg">
                          <activity.icon className="w-4 h-4 text-bjj-gold" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                          <p className="text-muted-foreground text-xs">{activity.description}</p>
                          <p className="text-bjj-gold text-xs font-medium">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Próximos objetivos */}
            <section>
              <Card className="bg-gradient-to-r from-bjj-gold/5 to-bjj-gold/10 border-bjj-gold/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-bjj-gold" />
                    Próximos Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                    <div className="p-4 bg-card/50 rounded-lg border border-bjj-gold/20">
                      <h4 className="font-medium text-foreground mb-2">Próxima Faixa</h4>
                      <p className="text-sm text-muted-foreground mb-2">Azul → Roxa</p>
                      <p className="text-xs text-bjj-gold">Em 5 meses (Novembro 2025)</p>
                    </div>
                    
                    <div className="p-4 bg-card/50 rounded-lg border border-bjj-gold/20">                      <h4 className="font-medium text-foreground mb-2">Meta Mensal</h4>
                      <p className="text-sm text-muted-foreground mb-2">16 treinos em junho</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-bjj-gold h-2 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-xs text-bjj-gold mt-1">12/16 treinos (75%)</p>
                    </div>
                    
                    <div className="p-4 bg-card/50 rounded-lg border border-bjj-gold/20">                      <h4 className="font-medium text-foreground mb-2">Próxima Competição</h4>
                      <p className="text-sm text-muted-foreground mb-2">Copa Estadual</p>
                      <p className="text-xs text-bjj-gold">29 de julho de 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
        
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};

export default Index;
