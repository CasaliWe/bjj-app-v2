import { 
  Home, Book, Calendar, Award, Target, FileText, Bot, 
  Gamepad2, Video, Newspaper, LineChart, 
  ShoppingBag, Dumbbell, Layers
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
    title: "Objetivos",
    url: "/objetivos",
    icon: Target,
    description: "Metas e progresso"
  },
  {
    title: "Observações Gerais",
    url: "/observacoes",
    icon: FileText,
    description: "Notas e observações"
  },
  {
    title: "Plano de Jogo",
    url: "/plano-jogo",
    icon: Gamepad2,
    description: "Estratégia para a luta"
  },
  {
    title: "Testar Técnica",
    url: "/testar-tecnica",
    icon: Book,
    description: "Experimentar técnicas no treino"
  },
  {
    title: "Vídeos",
    url: "/videos",
    icon: Video,
    description: "Vídeos sobre Jiu-Jitsu"
  },
  {
    title: "Notícias",
    url: "/noticias",
    icon: Newspaper,
    description: "Notícias de esportes de combate"
  },
  {
    title: "Métricas",
    url: "/metricas",
    icon: LineChart,
    description: "Estatísticas do usuário"
  },
  {
    title: "Dojo Market",
    url: "/marketplace",
    icon: ShoppingBag,
    description: "Compra e venda de equipamentos"
  },
  {
    title: "Drills",
    url: "/drills",
    icon: Dumbbell,
    description: "Vídeos ensinando drills"
  },
  {
    title: "Alongamentos",
    url: "/alongamentos",
    icon: Layers,
    description: "Vídeos de alongamentos"
  },
  {
    title: "I.A Sensei",
    url: "/ia-sensei",
    icon: Bot,
    description: "Chat com Inteligência Artificial"
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-bjj-gold rounded-lg flex items-center justify-center">
            <span className="text-bjj-dark font-bold text-sm">BJJ</span>
          </div>
          <div>
            <h2 className="text-sidebar-foreground font-semibold text-lg">Academy</h2>
            <p className="text-sidebar-foreground/60 text-xs">Plataforma de Jiu-Jitsu</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 h-[calc(100vh-98px)] overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border/80 scrollbar-track-transparent hover:scrollbar-thumb-sidebar-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium mb-4 px-2 sticky top-0 bg-sidebar-background/95 backdrop-blur-sm pb-2 pt-1">
            NAVEGAÇÃO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="h-12 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 group"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-bjj-gold transition-colors duration-200" />
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
