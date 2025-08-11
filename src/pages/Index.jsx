import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { useNavigate } from "react-router-dom";
import { Calendar, Book, Award, TrendingUp, Target, User, LogOut } from "lucide-react";
import {sair} from "@/services/auth/logout";

// components
import { MetricCard } from "@/components/inicio/MetricCard";
import { QuickActions } from "@/components/inicio/QuickActions";
import { MeusDados } from "@/components/inicio/MeusDados";
import { AtividadesRecentes } from "@/components/inicio/AtividadesRecentes";



const Index = () => {
  const navigate = useNavigate();

  const logout = () => {
    sair();
  };

  const user = {
    nome: 'Weslei Casali',
    email: 'weslei.casali@example.com',
    idade: 28,
    peso: 75,
    faixa: 'Azul',
    imagem: '',
    telefone: '(11) 98765-4321',
    instagram: '@instagram',
    tiktok: '@tiktok',
    youtube: '@youtube',
    perfilPublico: true,
    academia: 'Gracie Barra',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    estilo: 'Guardeiro',
    competidor: 'Sim',
    finalizacao: 'Triângulo',
    bio: 'Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações.',
    plano: 'Plus'
  }

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
    },
    {
      type: "competicao",
      title: "Copa Regional de Jiu-Jitsu",
      description: "2º lugar na categoria azul adulto",
      time: "12 de agosto",
    }
  ];


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
          {/* Header */}

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
            {/* Métricas principais */}

            {/* Meus Dados Gerais */}
            <section className="mb-6">
              <MeusDados user={user} treinosDados={treinosDados} />
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
                <AtividadesRecentes recentActivities={recentActivities} />
              </div>
              {/* Atividades recentes */}

            </div>
            {/* Ações rápidas e Recentes */}

          </div>
          {/* Content */}
        </main>
        
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};

export default Index;
