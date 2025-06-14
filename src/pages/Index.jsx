import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { MetricCard } from "@/components/MetricCard";
import { QuickActions } from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Book, Award, TrendingUp, Clock, Target, Repeat, Dumbbell, User, LogOut, Medal, Trophy, BarChart2, ArrowUp, BookOpen, Shield, Shirt, CircleOff } from "lucide-react";

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
              </div>            </section>

            {/* Meus Dados Gerais (atualizado conforme solicitação) */}
            <section className="mb-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-bjj-gold" />
                    Meus Dados Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Coluna 1: Dados Pessoais e Foto */}
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center text-center mb-4">                        <div className="w-32 h-32 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4 overflow-hidden">
                          <User className="w-16 h-16 text-bjj-gold" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Carlos Silva</h3>
                        <p className="text-sm text-bjj-gold">Faixa Azul • 2 graus</p>
                        <p className="text-xs text-muted-foreground mt-1">Treina desde Agosto 2022</p>
                      </div>
                      
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="col-span-2">carlos.silva@email.com</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Telefone:</span>
                          <span className="col-span-2">(11) 98765-4321</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Academia:</span>
                          <span className="col-span-2">Alliance Jiu-Jitsu</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Localização:</span>
                          <span className="col-span-2">São Paulo, SP</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Estilo:</span>
                          <span className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bjj-gold/10 text-bjj-gold">
                              <Shield className="w-3 h-3 mr-1" /> Guardeiro
                            </span>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Competidor:</span>
                          <span className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bjj-gold/10 text-bjj-gold">
                              <Trophy className="w-3 h-3 mr-1" /> Ativo
                            </span>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Finalização:</span>
                          <span className="col-span-2">Triângulo</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <h4 className="text-sm font-medium mb-2">Bio:</h4>
                        <p className="text-xs text-muted-foreground">
                          Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. 
                          Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações.
                        </p>
                      </div>
                    </div>
                    
                    {/* Coluna 2: Histórico de Treinos */}
                    <div className="md:col-span-1">
                      <h3 className="font-medium text-base mb-4">Histórico de Treinos</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <Shirt className="w-4 h-4 text-bjj-gold" /> Com Kimono (Gi)
                          </h4>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Total Treinos:</span>
                              <span className="font-medium">128</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Este Mês:</span>
                              <span className="font-medium">8</span>
                            </div>                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Última Vez:</span>
                              <span className="font-medium">Ontem</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <CircleOff className="w-4 h-4 text-bjj-gold" /> Sem Kimono (No-Gi)
                          </h4>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Total Treinos:</span>
                              <span className="font-medium">59</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Este Mês:</span>
                              <span className="font-medium">4</span>
                            </div>                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Última Vez:</span>
                              <span className="font-medium">Há 3 dias</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Coluna 3: Histórico de Competições */}
                    <div className="md:col-span-1">
                      <h3 className="font-medium text-base mb-4">Histórico de Competições</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <Shirt className="w-4 h-4 text-bjj-gold" /> Gi (Kimono)
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Eventos</p>
                              <p className="font-medium">5</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Lutas</p>
                              <p className="font-medium">14</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Vitórias</p>
                              <p className="font-medium text-green-400">9</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Derrotas</p>
                              <p className="font-medium text-red-400">5</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Finalizações</p>
                              <p className="font-medium">6</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/30 pt-3">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                              <span className="text-xs">3</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                              <span className="text-xs">1</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-amber-700"></div>
                              <span className="text-xs">2</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <CircleOff className="w-4 h-4 text-bjj-gold" /> No-Gi (Sem Kimono)
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Eventos</p>
                              <p className="font-medium">3</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Lutas</p>
                              <p className="font-medium">8</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Vitórias</p>
                              <p className="font-medium text-green-400">5</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Derrotas</p>
                              <p className="font-medium text-red-400">3</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Finalizações</p>
                              <p className="font-medium">4</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/30 pt-3">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                              <span className="text-xs">2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                              <span className="text-xs">2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-amber-700"></div>
                              <span className="text-xs">0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                </CardContent>              </Card>
            </section>            {/* Esta seção foi movida para cima e substituída pelo novo "Meus Dados Gerais" */}

            {/* Análise Técnica */}
            <section className="mb-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-bjj-gold" />
                    Análise Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Posições Mais Trabalhadas */}
                    <div className="bg-card/50 border border-border/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-medium">Top 5 Posições</h3>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Guarda Fechada</span>
                          <span className="text-bjj-gold">89%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div className="bg-bjj-gold h-1.5 rounded-full" style={{width: '89%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>De La Riva</span>
                          <span className="text-bjj-gold">76%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div className="bg-bjj-gold h-1.5 rounded-full" style={{width: '76%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Half Guard</span>
                          <span className="text-bjj-gold">68%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div className="bg-bjj-gold h-1.5 rounded-full" style={{width: '68%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Back Control</span>
                          <span className="text-bjj-gold">54%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div className="bg-bjj-gold h-1.5 rounded-full" style={{width: '54%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Montada</span>
                          <span className="text-bjj-gold">43%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div className="bg-bjj-gold h-1.5 rounded-full" style={{width: '43%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Finalizações Mais Usadas */}
                    <div className="bg-card/50 border border-border/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-medium">Top 5 Finalizações</h3>
                      
                      <div className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-bjj-gold">1</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Triângulo</p>
                          <p className="text-xs text-muted-foreground">Posição: Guarda Fechada</p>
                        </div>
                        <span className="text-sm text-bjj-gold">12x</span>
                      </div>
                      
                      <div className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-bjj-gold">2</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Mata-Leão</p>
                          <p className="text-xs text-muted-foreground">Posição: Back Control</p>
                        </div>
                        <span className="text-sm text-bjj-gold">9x</span>
                      </div>
                      
                      <div className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-bjj-gold">3</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Armlock</p>
                          <p className="text-xs text-muted-foreground">Posição: Montada</p>
                        </div>
                        <span className="text-sm text-bjj-gold">7x</span>
                      </div>
                      
                      <div className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-bjj-gold">4</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Kimura</p>
                          <p className="text-xs text-muted-foreground">Posição: Half Guard</p>
                        </div>
                        <span className="text-sm text-bjj-gold">5x</span>
                      </div>
                      
                      <div className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-bjj-gold">5</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Omoplata</p>
                          <p className="text-xs text-muted-foreground">Posição: De La Riva</p>
                        </div>
                        <span className="text-sm text-bjj-gold">3x</span>
                      </div>
                    </div>
                    
                    {/* Áreas de Melhoria */}
                    <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Áreas para Desenvolvimento</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-bjj-gold/10 rounded-md mt-0.5">
                            <ArrowUp className="w-3 h-3 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Defesa de Double Leg</p>
                            <p className="text-xs text-muted-foreground">Trabalhar em 3 variações de defesa</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-bjj-gold/10 rounded-md mt-0.5">
                            <ArrowUp className="w-3 h-3 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Berimbolo</p>
                            <p className="text-xs text-muted-foreground">Aprimorar técnica para competição</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-bjj-gold/10 rounded-md mt-0.5">
                            <ArrowUp className="w-3 h-3 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Passagem de Guarda</p>
                            <p className="text-xs text-muted-foreground">Focar em pressão e timing</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border/30">
                          <p className="text-xs text-muted-foreground">Baseado nos últimos 30 dias de treino</p>
                        </div>
                      </div>
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
