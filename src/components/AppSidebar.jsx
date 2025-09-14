import { 
  Home, Book, Calendar, Award, Target, FileText, Bot, 
  Gamepad2, Video, Newspaper, LineChart, Clock,
  ShoppingBag, Dumbbell, Layers, LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

// logout 
import {sair} from "@/services/auth/logout";

// context user
import { useUser } from "@/contexts/UserContext";



const menuItems = [  {
    title: "Início",
    url: "/app",
    icon: Home,
    description: "Dashboard principal"
  },
  {
    title: "Técnicas",
    url: "/tecnicas",
    icon: Book,
    description: "Biblioteca de técnicas"
  },
  {
    title: "Treinos",
    url: "/treinos",
    icon: Calendar,
    description: "Histórico de treinos"
  },
  {
    title: "Competições",
    url: "/competicoes",
    icon: Award,
    description: "Competições participadas"
  },
  {
    title: "Observações Gerais",
    url: "/observacoes",
    icon: FileText,
    description: "Notas e observações"
  },
  {
    title: "Timers",
    url: "/timers",
    icon: Clock,
    description: "Temporizadores para treino"
  }, 
  // {
  //   title: "Objetivos",
  //   url: "/objetivos",
  //   icon: Target,
  //   description: "Metas e progresso"
  // }, 
  // {
  //   title: "Plano de Jogo",
  //   url: "/plano-de-jogo",
  //   icon: Gamepad2,
  //   description: "Estratégia para a luta"
  // },
  // {
  //   title: "Vídeos",
  //   url: "/videos",
  //   icon: Video,
  //   description: "Vídeos sobre Jiu-Jitsu"
  // },
  // {
  //   title: "Notícias",
  //   url: "/noticias",
  //   icon: Newspaper,
  //   description: "Notícias de esportes de combate"
  // },
  // {
  //   title: "Métricas",
  //   url: "/metricas",
  //   icon: LineChart,
  //   description: "Estatísticas do usuário"
  // },  {
  //   title: "Dojo Market",
  //   url: "/dojo-market",
  //   icon: ShoppingBag,
  //   description: "Compra e venda de equipamentos"
  // },
  // {
  //   title: "Drills",
  //   url: "/drills",
  //   icon: Dumbbell,
  //   description: "Vídeos ensinando drills"
  // },
  // {
  //   title: "Alongamentos",
  //   url: "/alongamentos",
  //   icon: Layers,
  //   description: "Vídeos de alongamentos"
  // },
  // {
  //   title: "I.A Sensei",
  //   url: "/ia-sensei",
  //   icon: Bot,
  //   description: "Chat com Inteligência Artificial"
  // },
];

export function AppSidebar() {
  // Acessando o contexto do usuário
  const { user } = useUser();
  
  // Verificar se o usuário tem plano Plus
  const isPlus = user?.plano === 'Plus';

  const logout = () => {
    sair();
  };

  return (
    <Sidebar className="border-r border-sidebar-border">      

      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-bjj-gold rounded-lg flex items-center justify-center">
            <span className="text-bjj-dark font-bold text-sm">BJJ</span>
          </div>
          <div>
            <h2 className="text-sidebar-foreground font-semibold text-lg flex items-center gap-1.5">
              Academy
              {isPlus && (
                <span className="px-1.5 py-0.5 text-xs font-bold rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-black relative overflow-hidden animate-pulse-subtle border border-amber-600/30">
                  PLUS
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-100/30 to-transparent animate-shimmer"></span>
                </span>
              )}
            </h2>
            <p className="text-sidebar-foreground/60 text-xs">Plataforma de Jiu-Jitsu</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 h-[calc(100vh-98px)] overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border/80 scrollbar-track-transparent hover:scrollbar-thumb-sidebar-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium mb-4 px-2 bg-sidebar-background/95 backdrop-blur-sm pb-2 pt-1">
            NAVEGAÇÃO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">              
              {menuItems.map((item) => {
                const isActive = window.location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`h-12 px-3 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? "bg-sidebar-accent/50 border-l-2 border-bjj-gold" 
                          : "hover:bg-sidebar-accent"
                      }`}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                          isActive 
                            ? "text-bjj-gold" 
                            : "text-sidebar-foreground/70 group-hover:text-bjj-gold"
                        }`} />
                        <div className="flex flex-col">
                          <span className="text-sidebar-foreground font-medium text-sm">
                            {item.title}
                          </span>
                          <span className="text-sidebar-foreground/50 text-xs">
                            {item.description}
                          </span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            <div className="mt-8 mb-6 text-red-500 flex justify-center"><button onClick={logout}>Sair</button> <LogOut className="ms-2 h-4 w-4 text-red-500"/></div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
