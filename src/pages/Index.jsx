import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { useNavigate } from "react-router-dom";
import { Calendar, Book, Award, TrendingUp, Target, User, LogOut } from "lucide-react";
import {sair} from "@/services/auth/logout";
import { useState, useEffect } from "react";

// contexts
import { useUser } from "@/contexts/UserContext";

// UI components
import { Button } from "@/components/ui/button";

// components
import { MetricCard } from "@/components/inicio/MetricCard";
import { QuickActions } from "@/components/inicio/QuickActions";
import { MeusDados } from "@/components/inicio/MeusDados";
import { AtividadesRecentes } from "@/components/inicio/AtividadesRecentes";
import ObjetivosModal from "@/components/inicio/ObjetivosModal";

// welcome component
import WelcomeModal from "@/components/welcome/WelcomeModal";

// Sistema components
import AvisoModal from "@/components/sistema/AvisoModal";

// hooks
import { useGetUser } from "@/hooks/use-getUser";



const Index = () => {
  const navigate = useNavigate();

  // Estados para armazenar dados
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [treinosDados, setTreinosDados] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Função para abrir o modal de objetivos
  const abrirModal = () => setIsModalOpen(true);
  
  // Função para fechar o modal de objetivos
  const fecharModal = () => setIsModalOpen(false);
  
  // Função para atualizar progresso (objetivos) *********************************
  const atualizarMetricas = (novasMetricas) => {
    setMetrics(novasMetricas);

    console.log("Métricas atualizadas:", novasMetricas);
    
    // AQUI: Após atualizar o estado local, você pode enviar os novos valores para a API
    // const atualizarMetricasAPI = async (metricasAtualizadas) => {
    //   try {
    //     await api.put('/metrics', {
    //       tecnicasMeta: metricasAtualizadas.tecnicasMeta,
    //       treinosMeta: metricasAtualizadas.treinosMeta,
    //       competicoesMeta: metricasAtualizadas.competicoesMeta
    //     });
    //   } catch (error) {
    //     console.error('Erro ao atualizar métricas na API:', error);
    //   }
    // };
    // atualizarMetricasAPI(novasMetricas);
  };

  // Função para logout
  const logout = () => {
    sair();
  };

  // Carregar dados iniciais *********************************
  useEffect(() => {
    
    // Dados de treinos
    setTreinosDados({
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
    });
    
    // Dados de atividades recentes
    setRecentActivities([
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
      },
      {
        type: "competicao",
        title: "Copa Regional de Jiu-Jitsu",
        description: "2º lugar na categoria azul adulto",
        time: "12 de agosto",
      }
    ]);
    
    // Dados de métricas
    setMetrics({
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
    });
    
    // Buscar dados do usuário
    fetchUserData();
  }, []);


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        {/* Componente de Avisos do Sistema */}
        <AvisoModal />

        <main className="flex-1 flex flex-col pb-16 md:pb-0">         
          {/* Header */}
          <header className="bg-card border-b border-border p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden text-bjj-gold hover:text-bjj-gold/80 h-10 w-10 flex items-center justify-center" />
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user ? `Olá, ${user.nome.split(" ")[0]}! 👋` : 'Carregando...'}
                  </h1>
                  <p className="text-muted-foreground">Bem-vindo de volta à sua jornada no Jiu-Jitsu</p>
                </div>
                <div className="md:hidden">
                  <h1 className="text-xl font-bold text-foreground">
                    {user ? `Olá, ${user.nome.split(" ")[0]}! 👋` : 'Carregando...'}
                  </h1>
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
          {/* Header */}

          {/* Content */}
          <div className="flex-1 p-4 md:p-6 space-y-6 animate-fade-in">

            {/* Métricas principais */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-bjj-gold" />
                  Seu Progresso
                </h2>
                
                <Button 
                  onClick={abrirModal} 
                  variant="outline"
                  className="text-bjj-gold border-bjj-gold hover:bg-bjj-gold/10 hover:text-bjj-gold"
                  disabled={!metrics}
                >
                  Atualizar objetivos
                </Button>
              </div>
              
              {metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard title="Técnicas no mês" value={metrics.tecnicas} meta={metrics.tecnicasMeta} icon={Book} faltando={{ type: metrics.upDownTecnicas, text: metrics.tecnicasFaltando }} />
                  <MetricCard title="Treinos no Mês" value={metrics.treinos} meta={metrics.treinosMeta} icon={Calendar} faltando={{ type: metrics.upDownTreinos, text: metrics.treinosFaltando }} />
                  <MetricCard title="Competições no Mês" value={metrics.competicoes} meta={metrics.competicoesMeta} icon={Award} faltando={{ type: metrics.upDownCompeticoes, text: metrics.competicoesFaltando }} />
                  <MetricCard title="Observações Gerais" value={metrics.observacoesMes} icon={Target}  totalObs={metrics.observacoesTotal} />
                </div>
              ) : (
                <div className="text-center py-6">Carregando métricas...</div>
              )}          
            </section>
            {/* Métricas principais */}

            {/* Meus Dados Gerais */}
            <section className="mb-6">
              {user && treinosDados ? (
                <MeusDados user={user} treinosDados={treinosDados} />
              ) : (
                <div className="text-center py-6">Carregando dados...</div>
              )}
            </section>
            {/* Meus Dados Gerais */}

            {/* Ações rápidas e Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Ações rápidas */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
              {/* Ações rápidas */}

              {/* Atividades recentes */}
              <div className="lg:col-span-2">
                {recentActivities.length > 0 ? (
                  <AtividadesRecentes recentActivities={recentActivities} />
                ) : (
                  <div className="text-center py-6">Carregando atividades recentes...</div>
                )}
              </div>
              {/* Atividades recentes */}

            </div>
            {/* Ações rápidas e Recentes */}

          </div>
          {/* Content */}
        </main>
        
        <MobileNav />

        {/* Modal para atualizar objetivos */}
        {metrics && (
          <ObjetivosModal 
            isOpen={isModalOpen}
            onClose={fecharModal}
            metrics={metrics}
            onUpdateMetrics={atualizarMetricas}
          />
        )}
        {/* Modal para atualizar objetivos */}

        {/* Modal de boas-vindas para novos usuários */}
        <WelcomeModal />
        {/* Modal de boas-vindas para novos usuários */}

      </div>
    </SidebarProvider>
  );
};

export default Index;
