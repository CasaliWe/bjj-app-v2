import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { MetricCard } from "@/components/MetricCard";
import { QuickActions } from "@/components/QuickActions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Book, Award, TrendingUp, Clock, Target, Repeat, Dumbbell, User, LogOut, Medal, Trophy, BookOpen, Shield, Shirt, CircleOff, Users, MapPin, Star, Plus, Pencil } from "lucide-react";
import {sair} from "@/services/auth/logout";

const Index = () => {
  const navigate = useNavigate();

  const logout = () => {
    sair();
  };

  const user = {
    nome: 'Weslei Casali',
    email: 'weslei.casali@example.com',
    idade: 28,
    peso: '75kg',
    faixa: 'Azul',
    treinaDesde: 'Agosto de 2022',
    telefone: '(11) 98765-4321',
    academia: 'Gracie Barra',
    cidade: 'São Paulo',
    estado: 'SP',
    estilo: 'Guardeiro',
    competidor: true,
    finalizacao: 'Triângulo',
    bio: 'Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações.',
  }

  const metrics = {
      tecnicas: "50",
      tecnicasMeta: "55",
      tecnicasFaltando: "5",
      upDownTecnicas: "down",
      treinos: "20",
      treinosMeta: "15",
      treinosFaltando: "0",
      upDownTreinos: "up",
      competicoes: "3",
      competicoesMeta: "5",
      competicoesFaltando: "2",
      upDownCompeticoes: "down",
      observacoesTotal: "12",
      observacoesMes: "8"
  };

  const recentActivities = [
    {
      type: "treino",
      title: "Treino de Gi",
      description: "Trabalhei guard pass e finalizações",
      time: "14 de agosto",
    },
    {
      type: "tecnica",
      title: "Triângulo da Guarda Fechada",
      description: "Adicionei variação com lapela",
      time: "13 de agosto",
    },
    {
      type: "competicao",
      title: "Copa Regional de Jiu-Jitsu",
      description: "2º lugar na categoria azul adulto",
      time: "12 de agosto",
    }
  ];

  const treinosDados = {
    gi: {
      total: 128,
      esteMes: 8,
      ultimaVez: "12 de Agosto"
    },
    noGi: {
      total: 59,
      esteMes: 4,
      ultimaVez: "09 de Agosto"
    },
    competicoesGi: {
      eventos: 5,
      lutas: 1,
      vitorias: 2,
      derrotas: 2,
      finalizacoes: 1,
      primeiroLugar: 2,
      segundoLugar: 1,
      terceiroLugar: 5
    },
    competicoesNoGi: {
      eventos: 5,
      lutas: 1,
      vitorias: 2,
      derrotas: 2,
      finalizacoes: 1,
      primeiroLugar: 2,
      segundoLugar: 1,
      terceiroLugar: 5
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">         
          {/* Header */}
          <header className="bg-card border-b border-border p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden text-bjj-gold hover:text-bjj-gold/80 h-10 w-10 flex items-center justify-center" />
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold text-foreground">Olá, {user.nome.split(" ")[0]}! 👋</h1>
                  <p className="text-muted-foreground">Bem-vindo de volta à sua jornada no Jiu-Jitsu</p>
                </div>
                <div className="md:hidden">
                  <h1 className="text-xl font-bold text-foreground">Olá, {user.nome.split(" ")[0]}! 👋</h1>
                </div>
              </div>
                <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/perfil')}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  title="Perfil de Usuário"
                >
                  <User className="h-5 w-5 text-bjj-gold" />
                </button>
                <button
                  onClick={logout}
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
                <MetricCard title="Técnicas no mês" value={metrics.tecnicas} meta={metrics.tecnicasMeta} icon={Book} faltando={{ type: metrics.upDownTecnicas, text: metrics.tecnicasFaltando }} />
                <MetricCard title="Treinos no Mês" value={metrics.treinos} meta={metrics.treinosMeta} icon={Calendar} faltando={{ type: metrics.upDownTreinos, text: metrics.treinosFaltando }} />
                <MetricCard title="Competições no Mês" value={metrics.competicoes} meta={metrics.competicoesMeta} icon={Award} faltando={{ type: metrics.upDownCompeticoes, text: metrics.competicoesFaltando }} />
                <MetricCard title="Observações Gerais" value={metrics.observacoesMes} icon={Target}  totalObs={metrics.observacoesTotal} />
              </div>            
            </section>

            {/* Meus Dados Gerais (atualizado conforme solicitação) */}
            <section className="mb-6">
              <Card className="bg-card border-border">                
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-bjj-gold" />
                      Meus Dados Gerais
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10"
                      onClick={() => navigate('/perfil')}
                    >
                      <Pencil className="h-3 w-3 mr-1" /> Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Coluna 1: Dados Pessoais e Foto */}
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center text-center mb-4">                        <div className="w-32 h-32 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4 overflow-hidden">
                          <User className="w-16 h-16 text-bjj-gold" />
                        </div>
                        <h3 className="font-semibold text-lg mb-0">{user.nome}</h3>
                        <p className="mb-1 text-sm">{user.idade} Anos</p>
                        <p className="text-sm text-bjj-gold">Faixa {user.faixa}</p>
                        <p className="text-xs text-muted-foreground mt-1">Treina desde {user.treinaDesde}</p>
                      </div>
                      
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="col-span-2">{user.email}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Telefone:</span>
                          <span className="col-span-2">{user.telefone}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Academia:</span>
                          <span className="col-span-2">{user.academia}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Localização:</span>
                          <span className="col-span-2">{user.cidade} - {user.estado}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Estilo:</span>
                          <span className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bjj-gold/10 text-bjj-gold">
                              <Shield className="w-3 h-3 mr-1" /> {user.estilo}
                            </span>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Competidor:</span>
                          <span className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bjj-gold/10 text-bjj-gold">
                              <Trophy className="w-3 h-3 mr-1" /> {user.competidor ? 'Ativo' : 'Inativo'}
                            </span>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="text-muted-foreground">Finalização:</span>
                          <span className="col-span-2">{user.finalizacao}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <h4 className="text-sm font-medium mb-2">Bio:</h4>
                        <p className="text-xs text-muted-foreground">
                          {user.bio}
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
                              <span className="font-medium">{treinosDados.gi.total}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Este Mês:</span>
                              <span className="font-medium">{treinosDados.gi.esteMes}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Última Vez:</span>
                              <span className="font-medium">{treinosDados.gi.ultimaVez}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <CircleOff className="w-4 h-4 text-bjj-gold" /> Sem Kimono (No-Gi)
                          </h4>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Total Treinos:</span>
                              <span className="font-medium">{treinosDados.noGi.total}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Este Mês:</span>
                              <span className="font-medium">{treinosDados.noGi.esteMes}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="text-muted-foreground">Última Vez:</span>
                              <span className="font-medium">{treinosDados.noGi.ultimaVez}</span>
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
                              <p className="font-medium">{treinosDados.competicoesGi.eventos}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Lutas</p>
                              <p className="font-medium">{treinosDados.competicoesGi.lutas}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Vitórias</p>
                              <p className="font-medium text-green-400">{treinosDados.competicoesGi.vitorias}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Derrotas</p>
                              <p className="font-medium text-red-400">{treinosDados.competicoesGi.derrotas}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Finalizações</p>
                              <p className="font-medium">{treinosDados.competicoesGi.finalizacoes}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/30 pt-3">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                              <span className="text-xs">{treinosDados.competicoesGi.primeiroLugar}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                              <span className="text-xs">{treinosDados.competicoesGi.segundoLugar}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-amber-700"></div>
                              <span className="text-xs">{treinosDados.competicoesGi.terceiroLugar}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <CircleOff className="w-4 h-4 text-bjj-gold" /> No-Gi (Sem Kimono)
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Eventos</p>
                              <p className="font-medium">{treinosDados.competicoesNoGi.eventos}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Lutas</p>
                              <p className="font-medium">{treinosDados.competicoesNoGi.lutas}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Vitórias</p>
                              <p className="font-medium text-green-400">{treinosDados.competicoesNoGi.vitorias}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Derrotas</p>
                              <p className="font-medium text-red-400">{treinosDados.competicoesNoGi.derrotas}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Finalizações</p>
                              <p className="font-medium">{treinosDados.competicoesNoGi.finalizacoes}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/30 pt-3">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                              <span className="text-xs">{treinosDados.competicoesNoGi.primeiroLugar}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                              <span className="text-xs">{treinosDados.competicoesNoGi.segundoLugar}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-amber-700"></div>
                              <span className="text-xs">{treinosDados.competicoesNoGi.terceiroLugar}</span>
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
                          <Target className="w-4 h-4 text-bjj-gold" />
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
          </div>
        </main>
        
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};

export default Index;
