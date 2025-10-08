import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { useNavigate } from "react-router-dom";
import { Calendar, Book, Award, TrendingUp, Target, User, LogOut } from "lucide-react";
import {sair} from "@/services/auth/logout";
import { useState, useEffect } from "react";

import { getAuthToken } from '@/services/cookies/cookies';

// contexts
import { useUser } from "@/contexts/UserContext";

// UI components
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// components
import { MetricCard } from "@/components/inicio/MetricCard";
import { MeusDados } from "@/components/inicio/MeusDados";
import ObjetivosModal from "@/components/inicio/ObjetivosModal";

// welcome component
import WelcomeModal from "@/components/welcome/WelcomeModal";

// hooks
import { useGetUser } from "@/hooks/use-getUser";



const Index = () => {
  const navigate = useNavigate();

  // Estados para armazenar dados
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [treinosDados, setTreinosDados] = useState(null);

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Função para abrir o modal de objetivos
  const abrirModal = () => setIsModalOpen(true);
  
  // Função para fechar o modal de objetivos
  const fecharModal = () => setIsModalOpen(false);
  
  // Função para atualizar progresso (objetivos) *********************************
  const atualizarMetricas = async (novasMetricas) => {
    setMetrics(novasMetricas);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/atualizar-objetivos.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(novasMetricas)
        });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
    
  
  };

  // Função para logout
  const logout = () => {
    sair();
  };

  // Carregar dados iniciais *********************************
  useEffect(() => {

    // Função para buscar dados do usuário na API
    const buscarDadosTreinoCompeticao = async () => {
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/buscar-dados-treino-competicao.php`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            }
          });
          const data = await response.json();
          setTreinosDados(data.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }
    };
    buscarDadosTreinoCompeticao();


    // Função para buscar os objetivos do usuário na API
    const buscarObjetivosUsuario = async () => {
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/buscar-objetivos-dashboard.php`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            }
          });
          const data = await response.json();
          setMetrics(data.data);
      } catch (error) {
        console.error('Erro ao buscar objetivos do usuário:', error);
        return null;
      }
    };
    buscarObjetivosUsuario();
    
    // Buscar dados do usuário
    fetchUserData();
  }, []);


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
                <LoadingSpinner message="Carregando métricas..." />
              )}          
            </section>
            {/* Métricas principais */}

            {/* Meus Dados Gerais */}
            <section className="mb-6">
              {user && treinosDados ? (
                <MeusDados user={user} treinosDados={treinosDados} />
              ) : (
                <LoadingSpinner message="Carregando dados do usuário..." />
              )}
            </section>
            {/* Meus Dados Gerais */}

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
