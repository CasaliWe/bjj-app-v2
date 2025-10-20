import { 
  Home, Book, Calendar, Award, Target, FileText, Bot, 
  Gamepad2, Video, Newspaper, LineChart, Clock, CheckSquare,
  ShoppingBag, Dumbbell, Layers, LogOut, Search, Users, Timer,
  GraduationCap, Trophy, ChevronDown, ChevronRight, Activity
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
import { useState, useEffect } from "react";

// logout 
import {sair} from "@/services/auth/logout";

// context user
import { useUser } from "@/contexts/UserContext";



const menuSections = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Início",
        url: "/app",
        icon: Home,
        description: "Dashboard principal"
      }
    ]
  },
  {
    title: "Aprendizado",
    icon: GraduationCap,
    items: [
      {
        title: "Minhas Técnicas",
        url: "/tecnicas",
        icon: Book,
        description: "Biblioteca de técnicas"
      },
      {
        title: "Aprender Jiu Jitsu",
        url: "/aprender",
        icon: GraduationCap,
        description: "Módulos de aprendizado"
      },
      {
        title: "Vídeos Youtube",
        url: "/videos",
        icon: Video,
        description: "Biblioteca de vídeos do YouTube"
      }
    ]
  },
  {
    title: "Treinos & Competições",
    icon: Activity,
    items: [
      {
        title: "Meus Treinos",
        url: "/treinos",
        icon: Calendar,
        description: "Histórico de treinos"
      },
      {
        title: "Tempo de luta",
        url: "/treinos-cronometrados",
        icon: Timer,
        description: "Cronômetro para rolas"
      },
      {
        title: "Competições",
        url: "/competicoes",
        icon: Award,
        description: "Competições que participei"
      },
      {
        title: "Eventos",
        url: "/eventos",
        icon: Trophy,
        description: "Próximos eventos de grappling"
      }
    ]
  },
  {
    title: "Planejamento",
    icon: Target,
    items: [
      {
        title: "Plano de Jogo",
        url: "/plano-de-jogo",
        icon: Gamepad2,
        description: "Estratégia para a luta"
      },
      {
        title: "Checklist",
        url: "/checklist",
        icon: CheckSquare,
        description: "Organize seus objetivos"
      },
      {
        title: "Observações",
        url: "/observacoes",
        icon: FileText,
        description: "Detalhes importantes"
      }
    ]
  },
  {
    title: "Comunidade & IA",
    icon: Users,
    items: [
      {
        title: "Pesquisar Usuários",
        url: "/pesquisar-usuarios",
        icon: Users,
        description: "Encontre outros praticantes"
      },
      {
        title: "Ranking",
        url: "/ranking",
        icon: Trophy,
        description: "Ranking de atletas por EXP"
      },
      {
        title: "I.A Sensei",
        url: "/ia-sensei",
        icon: Bot,
        description: "Chat com Inteligência Artificial"
      }
    ]
  }
];

export function AppSidebar() {
  // Acessando o contexto do usuário
  const { user } = useUser();
  
  // Verificar se o usuário tem plano Plus
  const isPlus = user?.plano === 'Plus';
  
  // Função para encontrar qual seção contém a página ativa
  const getActiveSectionTitle = () => {
    const currentPath = window.location.pathname;
    
    for (const section of menuSections) {
      const hasActiveItem = section.items.some(item => item.url === currentPath);
      if (hasActiveItem) {
        return section.title;
      }
    }
    return "Dashboard"; // fallback
  };
  
  // Estado para controlar quais seções estão expandidas
  const [expandedSections, setExpandedSections] = useState(() => {
    const activeSectionTitle = getActiveSectionTitle();
    return menuSections.reduce((acc, section) => {
      // Dashboard sempre aberto, e a seção ativa também
      acc[section.title] = section.title === "Dashboard" || section.title === activeSectionTitle;
      return acc;
    }, {});
  });

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Efeito para atualizar seções expandidas quando a rota mudar
  useEffect(() => {
    const activeSectionTitle = getActiveSectionTitle();
    setExpandedSections(prev => ({
      ...prev,
      [activeSectionTitle]: true // Sempre manter a seção ativa aberta
    }));
  }, [window.location.pathname]);

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
            <SidebarMenu className="space-y-3">              
              {menuSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  {/* Header da seção - só se não for Dashboard */}
                  {section.title !== "Dashboard" ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => toggleSection(section.title)}
                        className="h-12 px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-sidebar-accent/30 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <section.icon className="w-4 h-4 flex-shrink-0 text-sidebar-foreground/60 group-hover:text-bjj-gold transition-colors duration-200" />
                          <span className="text-sidebar-foreground/80 font-medium text-sm flex-1 leading-tight">
                            {section.title}
                          </span>
                          {expandedSections[section.title] ? (
                            <ChevronDown className="w-4 h-4 flex-shrink-0 text-sidebar-foreground/60" />
                          ) : (
                            <ChevronRight className="w-4 h-4 flex-shrink-0 text-sidebar-foreground/60" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null}
                  
                  {/* Items da seção */}
                  {(expandedSections[section.title] || section.title === "Dashboard") && (
                    <div className={section.title !== "Dashboard" ? "ml-2 space-y-2 py-2" : "space-y-2 py-1"}>
                      {section.items.map((item) => {
                        const isActive = window.location.pathname === item.url;
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                              asChild
                              className={`min-h-14 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                isActive 
                                  ? "bg-sidebar-accent/50 border-l-2 border-bjj-gold" 
                                  : "hover:bg-sidebar-accent"
                              }`}
                            >
                              <a href={item.url} className="flex items-center gap-3 w-full">
                                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                                  isActive 
                                    ? "text-bjj-gold" 
                                    : "text-sidebar-foreground/70 group-hover:text-bjj-gold"
                                }`} />
                                <div className="flex flex-col min-w-0 flex-1 py-1">
                                  <span className="text-sidebar-foreground font-medium text-sm leading-tight mb-1">
                                    {item.title}
                                  </span>
                                  <span className="text-sidebar-foreground/50 text-xs leading-tight">
                                    {item.description}
                                  </span>
                                </div>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
            
            {/* Botão de logout */}
            <div className="mt-8 mb-6 px-4">
              <SidebarMenuButton 
                onClick={logout}
                className="h-11 w-full px-4 py-2 rounded-lg transition-all duration-200 group hover:bg-red-500/10 cursor-pointer"
              >
                <div className="flex items-center gap-3 text-red-500">
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Sair</span>
                </div>
              </SidebarMenuButton>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
