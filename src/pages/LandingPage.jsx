import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Award, 
  TrendingUp, 
  Shield, 
  Users, 
  Calendar, 
  Star, 
  ChevronRight,
  Menu, 
  X,
  BookOpen,
  Clock,
  BarChart2,
  Video,
  Tag,
  MessageSquare,
  Plus,
  User,
  PenTool,
  Medal,
  Clock4,
  Trophy,
  CheckCircle2,
  PlayCircle,
  FileCheck,
  Inbox,
  BarChart,
  Zap,
  Settings,
  GraduationCap,
  Mail,
  Gamepad2,
  Bot,
  LineChart,
  ShoppingBag,
  Dumbbell,
  Layers,
  Newspaper
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Ícones para redes sociais
const Instagram = (props) => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2c-2.714 0-3.055.012-4.121.06-1.066.05-1.792.217-2.428.465a4.88 4.88 0 0 0-1.771 1.153A4.897 4.897 0 0 0 2.525 5.45c-.248.635-.416 1.362-.465 2.428C2.012 8.945 2 9.286 2 12c0 2.714.012 3.055.06 4.121.05 1.066.217 1.792.465 2.428a4.88 4.88 0 0 0 1.153 1.771 4.897 4.897 0 0 0 1.772 1.153c.636.248 1.362.416 2.428.465 1.066.048 1.407.06 4.121.06 2.714 0 3.055-.012 4.121-.06 1.066-.05 1.792-.217 2.428-.465a4.88 4.88 0 0 0 1.771-1.153 4.897 4.897 0 0 0 1.153-1.772c.248-.636.416-1.362.465-2.428.048-1.066.06-1.407.06-4.121 0-2.714-.012-3.055-.06-4.121-.05-1.066-.217-1.792-.465-2.428a4.88 4.88 0 0 0-1.153-1.771A4.897 4.897 0 0 0 18.55 2.525c-.636-.248-1.362-.416-2.428-.465C15.055 2.012 14.714 2 12 2Zm0 1.802c2.67 0 2.986.01 4.04.058.976.044 1.505.207 1.858.344.466.182.8.399 1.15.748.35.35.566.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.044.976-.207 1.505-.344 1.858-.182.466-.399.8-.748 1.15-.35.35-.684.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.044-1.505-.207-1.858-.344-.466-.182-.8-.399-1.15-.748-.35-.35-.566-.684-.748-1.15-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.044-.976.207-1.505.344-1.858.182-.466.399-.8.748-1.15.35-.35.684-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058Zm0 3.064a5.139 5.139 0 0 0-5.134 5.134 5.139 5.139 0 0 0 5.134 5.134 5.139 5.139 0 0 0 5.134-5.134A5.139 5.139 0 0 0 12 6.866Zm0 8.466a3.332 3.332 0 1 1 0-6.664 3.332 3.332 0 0 1 0 6.664Zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
  </svg>
);

const Facebook = (props) => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10Z" />
  </svg>
);

const Youtube = (props) => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M23.498 6.186a2.989 2.989 0 0 0-2.098-2.098C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.4.543A2.989 2.989 0 0 0 .502 6.186C0 8.082 0 12 0 12s0 3.918.502 5.814a2.989 2.989 0 0 0 2.098 2.098C4.495 20.455 12 20.455 12 20.455s7.505 0 9.4-.543a2.989 2.989 0 0 0 2.098-2.098C24 15.918 24 12 24 12s0-3.918-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
  </svg>
);

// Conteúdo da Hero Section
const HERO_CONTENT = {
  title: "BJJ Academy",
  subtitle: "Evolua seu Jiu-Jitsu",
  description: "A plataforma completa para organizar técnicas, acompanhar treinos, registrar competições, definir objetivos, criar planos de jogo, acessar vídeos educativos, analisar métricas de desempenho e muito mais. Seu dojo digital com assistência de I.A para maximizar seu potencial no Jiu-Jitsu.",
  ctaButton: "Começar agora",
  secondaryButton: "Saber mais"
};

// Conteúdo da seção de Funcionalidades Principais
const MAIN_FEATURES_CONTENT = {
  title: "Funcionalidades Principais",
  description: "A BJJ Academy oferece todas as ferramentas que você precisa para evoluir no Jiu-Jitsu, desde o acompanhamento detalhado de treinos até a organização estratégica de competições e muito mais.",
  features: [
    {
      icon: BookOpen,
      title: "Técnicas Organizadas",
      description: "Catalogue e organize todas as técnicas que você aprende nos treinos. Adicione vídeos, notas e agrupe por categorias."
    },
    {
      icon: Calendar,
      title: "Gestão de Treinos",
      description: "Registre cada sessão de treino, técnicas praticadas, parceiros e observações para acompanhamento contínuo."
    },
    {
      icon: Trophy,
      title: "Competições",
      description: "Registre suas participações em campeonatos, guarde informações sobre adversários e analise seu desempenho."
    },
    {
      icon: Gamepad2,
      title: "Plano de Jogo",
      description: "Monte estratégias e táticas personalizadas para treinos e competições, baseadas nos seus pontos fortes."
    },
    {
      icon: Target,
      title: "Objetivos e Metas",
      description: "Defina metas claras para sua evolução no Jiu-Jitsu e acompanhe seu progresso de forma visual."
    },
    {
      icon: Video,
      title: "Conteúdo em Vídeo",
      description: "Acesse uma biblioteca de vídeos com técnicas, drills de treinamento e alongamentos específicos."
    },
    {
      icon: Bot,
      title: "I.A Sensei",
      description: "Tire dúvidas e obtenha recomendações personalizadas com um assistente de inteligência artificial."
    },
    {
      icon: LineChart,
      title: "Métricas Avançadas",
      description: "Analise seu desempenho com estatísticas detalhadas e visualize tendências ao longo do tempo."
    }
  ]
};

// Conteúdo da seção de Acompanhamento de Treinos
const TRAINING_TRACKING_CONTENT = {
  title: "Acompanhamento de Treinos",
  description: "Registre e analise cada sessão de treino para maximizar seu desenvolvimento técnico.",
  features: [
    {
      icon: Calendar,
      title: "Registro Detalhado",
      description: "Documente duração, intensidade, técnicas praticadas e parceiros de treino."
    },
    {
      icon: BarChart,
      title: "Análise de Desempenho",
      description: "Identifique pontos fortes e áreas para melhorar com base nos dados coletados."
    },
    {
      icon: Clock,
      title: "Lembretes e Alertas",
      description: "Receba notificações para não perder treinos agendados ou revisões de técnicas."
    }
  ],
  image: "/training-tracking.png", // Substitua pelo caminho da sua imagem
  ctaButton: "Experimente Grátis"
};

// Conteúdo da seção de Biblioteca de Técnicas
const TECHNIQUES_LIBRARY_CONTENT = {
  title: "Biblioteca de Técnicas",
  description: "Mantenha um catálogo personalizado de todas as técnicas que você aprende, com detalhes e dicas para revisão.",
  features: [
    {
      icon: Tag,
      title: "Categorização Intuitiva",
      description: "Organize técnicas por posição, tipo, nível de dificuldade e favoritas."
    },
    {
      icon: Video,
      title: "Vídeos e Imagens",
      description: "Adicione conteúdo visual para facilitar a revisão das técnicas."
    },
    {
      icon: PenTool,
      title: "Notas Detalhadas",
      description: "Registre dicas do professor, variações e detalhes importantes de cada técnica."
    }
  ],
  image: "/techniques-library.png", // Substitua pelo caminho da sua imagem
  ctaButton: "Conheça a Biblioteca"
};

// Conteúdo da seção de Gestão de Competições
const COMPETITIONS_MANAGEMENT_CONTENT = {
  title: "Gestão de Competições",
  description: "Prepare-se melhor para competições com ferramentas de planejamento e análise pós-evento.",
  features: [
    {
      icon: Calendar,
      title: "Calendário de Eventos",
      description: "Acompanhe datas importantes, inscrições e programação de competições."
    },
    {
      icon: User,
      title: "Perfil de Adversários",
      description: "Crie perfis com características, técnicas e estratégias dos seus adversários."
    },
    {
      icon: FileCheck,
      title: "Análise Pós-Competição",
      description: "Registre resultados, aprenda com erros e planeje melhorias para as próximas competições."
    }
  ],
  image: "/competitions-management.png", // Substitua pelo caminho da sua imagem
  ctaButton: "Organize suas Competições"
};

// Conteúdo da seção de Comunidade
const COMMUNITY_CONTENT = {
  title: "Comunidade BJJ",
  description: "Conecte-se com outros praticantes, compartilhe experiências e aprenda em conjunto.",
  features: [
    {
      icon: MessageSquare,
      title: "Dúvidas e Discussões",
      description: "Compartilhe dúvidas sobre técnicas específicas e receba feedback da comunidade."
    },
    {
      icon: Users,
      title: "Grupos de Estudo",
      description: "Crie ou participe de grupos focados em estilos específicos de Jiu-Jitsu."
    },
    {
      icon: Medal,
      title: "Conquistas e Faixas",
      description: "Registre suas graduações e celebre cada passo na sua jornada no Jiu-Jitsu."
    }
  ],
  statistics: [
    { value: "5,000+", label: "Usuários Ativos", icon: Users },
    { value: "15,000+", label: "Técnicas Catalogadas", icon: BookOpen },
    { value: "30,000+", label: "Treinos Registrados", icon: Calendar },
    { value: "1,200+", label: "Faixas-Pretas", icon: GraduationCap }
  ],
  ctaButton: "Junte-se à Comunidade"
};

// Conteúdo da seção de Depoimentos
const TESTIMONIALS_CONTENT = {
  title: "O que Dizem Nossos Usuários",
  testimonials: [
    {
      name: "Carlos Silva",
      role: "Faixa Preta 2º Grau",
      image: "/testimonial-1.jpg", // Substitua pelo caminho da sua imagem
      content: "A BJJ Academy transformou a forma como organizo minhas técnicas. Consigo revisar tudo com facilidade e meu progresso acelerou significativamente."
    },
    {
      name: "Paula Martins",
      role: "Faixa Roxa",
      image: "/testimonial-2.jpg", // Substitua pelo caminho da sua imagem
      content: "O recurso de análise de competições me ajudou a identificar padrões nos meus erros e melhorar minha estratégia. Recomendo para todos os competidores."
    },
    {
      name: "Ricardo Almeida",
      role: "Professor - Faixa Preta 3º Grau",
      image: "/testimonial-3.jpg", // Substitua pelo caminho da sua imagem
      content: "Como professor, uso o BJJ Academy para acompanhar o desenvolvimento dos meus alunos. É uma ferramenta incrível para gestão de academia."
    }
  ]
};

// Conteúdo da seção de Preços
const PRICING_CONTENT = {
  title: "Planos e Preços",
  subtitle: "Comece com 7 dias grátis",
  description: "Acesso completo a todas as funcionalidades durante o período de teste.",
  plans: [
    {
      name: "Teste Grátis",
      price: "7 dias grátis",
      description: "Acesso completo a todas as funcionalidades",
      features: [
        "Biblioteca de técnicas completa",
        "Acompanhamento de treinos",
        "Gestão de competições",
        "Planos de jogo personalizados",
        "Recursos da comunidade"
      ],
      ctaButton: "Começar Agora",
      icon: Zap
    },
    {
      name: "Premium",
      price: "R$ 19,90/mês",
      priceHighlight: "Primeiro mês 50% OFF: R$ 9,95",
      description: "Acesso total a todas as funcionalidades",
      features: [
        "Todas as funcionalidades do teste grátis",
        "Armazenamento ilimitado",
        "Análises avançadas de desempenho",
        "Exportação de dados",
        "Suporte prioritário"
      ],
      ctaButton: "Assinar Agora",
      popular: true,
      icon: Star
    },
    {
      name: "Acesso Limitado",
      price: "Gratuito",
      description: "Após o período de teste sem assinatura",
      features: [
        "Até 10 técnicas cadastradas",
        "5 registros de treino por mês",
        "Histórico limitado a 30 dias",
        "Sem recursos da comunidade",
        "Sem análises avançadas"
      ],
      ctaButton: "Conhecer Limitações",
      icon: Settings
    }
  ],
  note: "Cancele a qualquer momento sem taxas adicionais. Disponível para Android e iOS."
};

// Conteúdo da seção FAQ
const FAQ_CONTENT = {
  title: "Perguntas Frequentes",
  faqs: [
    {
      question: "Preciso ter experiência em Jiu-Jitsu para usar o app?",
      answer: "Não, o BJJ Academy é adequado para praticantes de todos os níveis, desde iniciantes até faixas pretas avançados. A interface é intuitiva e fácil de usar."
    },
    {
      question: "O app funciona offline?",
      answer: "Sim, muitas funcionalidades estão disponíveis offline. Você pode registrar treinos e técnicas sem conexão à internet, e os dados serão sincronizados quando você estiver online novamente."
    },
    {
      question: "Posso compartilhar minha biblioteca de técnicas com amigos?",
      answer: "Sim! Você pode compartilhar técnicas específicas ou categorias inteiras com outros usuários do app, ideal para estudo em grupo ou para professores compartilharem com seus alunos."
    },
    {
      question: "Como faço para cancelar minha assinatura?",
      answer: "Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta. Após o cancelamento, você ainda terá acesso até o final do período pago, depois disso seu acesso será limitado."
    },
    {
      question: "O que acontece após os 7 dias de teste grátis?",
      answer: "Após o período de teste de 7 dias, você pode optar por assinar o plano Premium (com 50% de desconto no primeiro mês) ou continuar com acesso limitado às funcionalidades básicas do app."
    }
  ]
};

// Conteúdo do CTA final
const FINAL_CTA_CONTENT = {
  title: "Pronto para Evoluir seu Jiu-Jitsu?",
  description: "Comece agora com 7 dias de teste grátis e transforme sua maneira de treinar e evoluir no Jiu-Jitsu.",
  primaryButton: "Criar Conta Grátis",
  secondaryButton: "Ver Demonstração"
};

// Conteúdo do Footer
const FOOTER_CONTENT = {
  logo: "BJJ Academy",
  tagline: "Evolua seu Jiu-Jitsu",
  copyright: "© 2025 BJJ Academy. Todos os direitos reservados.",
  sections: [
    {      title: "Produto",
      links: [
        { name: "Funcionalidades", href: "#features", icon: CheckCircle2 },
        { name: "Preços", href: "#pricing", icon: Tag },
        { name: "FAQ", href: "#faq", icon: MessageSquare },
        { name: "Suporte", href: "/suporte", icon: Inbox }
      ]
    },
    {      title: "Empresa",
      links: [
        { name: "Sobre nós", href: "/sobre-nos", icon: Users },
        { name: "Contato", href: "/contato", icon: Mail }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Termos de Uso", href: "/termos-de-uso", icon: FileCheck },
        { name: "Política de Privacidade", href: "/politica-de-privacidade", icon: Shield }
      ]
    },
    {
      title: "Redes Sociais",
      links: [
        { name: "Instagram", href: "#instagram", icon: Instagram },
        { name: "Facebook", href: "#facebook", icon: Facebook },
        { name: "YouTube", href: "#youtube", icon: Youtube }
      ]
    }
  ]
};

// Conteúdo da seção de Objetivos e Metas
const GOALS_CONTENT = {
  title: "Objetivos e Metas",
  description: "Estabeleça objetivos claros, acompanhe seu progresso e celebre suas conquistas no Jiu-Jitsu.",
  features: [
    {
      icon: Target,
      title: "Metas Personalizadas",
      description: "Defina objetivos específicos como aprender novas técnicas, conquistar faixas ou medalhas."
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento Visual",
      description: "Visualize seu progresso com gráficos e indicadores claros para manter a motivação."
    },
    {
      icon: CheckCircle2,
      title: "Conquistas e Recompensas",
      description: "Ganhe conquistas virtuais ao atingir marcos importantes na sua jornada."
    }
  ],
  image: "/goals-tracking.png",
  ctaButton: "Defina Seus Objetivos"
};

// Conteúdo da seção de Observações e Notas
const NOTES_CONTENT = {
  title: "Observações e Anotações",
  description: "Registre ideias importantes, insights técnicos e observações detalhadas sobre seu desenvolvimento.",
  features: [
    {
      icon: FileCheck,
      title: "Notas Detalhadas",
      description: "Mantenha um registro organizado de todas as dicas e observações sobre seu treino."
    },
    {
      icon: PenTool,
      title: "Editor Intuitivo",
      description: "Interface simples para anotar rapidamente durante ou após os treinos."
    },
    {
      icon: Inbox,
      title: "Categorização",
      description: "Organize suas anotações por temas, técnicas ou eventos para fácil consulta."
    }
  ],
  image: "/notes-feature.png",
  ctaButton: "Organize Suas Observações"
};

// Conteúdo da seção de Plano de Jogo
const GAME_PLAN_CONTENT = {
  title: "Plano de Jogo",
  description: "Desenvolva estratégias personalizadas para competições e treinos específicos.",
  features: [
    {
      icon: Gamepad2,
      title: "Estratégias Personalizadas",
      description: "Crie planos táticos específicos para diferentes adversários e situações."
    },
    {
      icon: Shield,
      title: "Defesas e Contra-ataques",
      description: "Planeje respostas para as técnicas mais comuns dos seus adversários."
    },
    {
      icon: Award,
      title: "Simulações de Luta",
      description: "Prepare-se mentalmente através de simulações e cenários de competição."
    }
  ],
  image: "/game-plan.png",
  ctaButton: "Monte Sua Estratégia"
};

// Conteúdo da seção de Videos e Mídia
const VIDEOS_CONTENT = {
  title: "Conteúdo em Vídeo",
  description: "Acesse uma extensa biblioteca de vídeos educativos para complementar seu aprendizado.",
  features: [
    {
      icon: Video,
      title: "Vídeos de Técnicas",
      description: "Assista demonstrações detalhadas de técnicas em alta qualidade."
    },
    {
      icon: Dumbbell,
      title: "Drills de Treinamento",
      description: "Acesse exercícios específicos para melhorar movimentação, timing e condicionamento."
    },
    {
      icon: Layers,
      title: "Alongamentos",
      description: "Rotinas de alongamento específicas para praticantes de Jiu-Jitsu."
    },
    {
      icon: Newspaper,
      title: "Notícias e Entrevistas",
      description: "Mantenha-se atualizado com as últimas notícias do mundo do Jiu-Jitsu e esportes de combate."
    }
  ],
  image: "/video-content.png",
  ctaButton: "Ver Biblioteca de Vídeos"
};

// Conteúdo da seção de Métricas e Análises
const METRICS_CONTENT = {
  title: "Métricas e Estatísticas",
  description: "Análise avançada de dados para extrair informações valiosas sobre seu desempenho.",
  features: [
    {
      icon: BarChart,
      title: "Estatísticas Detalhadas",
      description: "Acompanhe tempo de treino, técnicas mais utilizadas e taxa de sucesso."
    },
    {
      icon: BarChart2,
      title: "Análises Personalizadas",
      description: "Painéis personalizados com as métricas que são mais importantes para você."
    },
    {
      icon: TrendingUp,
      title: "Tendências e Evolução",
      description: "Visualize sua progressão ao longo do tempo com gráficos interativos."
    }
  ],
  image: "/metrics-dashboard.png",
  ctaButton: "Analise Seu Desempenho"
};

// Conteúdo da seção de Dojo Market
const MARKETPLACE_CONTENT = {
  title: "Dojo Market",
  description: "Marketplace especializado para compra e venda de equipamentos de Jiu-Jitsu.",
  features: [
    {
      icon: ShoppingBag,
      title: "Compra e Venda",
      description: "Negocie kimonos, faixas, equipamentos e acessórios com outros praticantes."
    },
    {
      icon: Tag,
      title: "Preços Justos",
      description: "Economia na aquisição de itens seminovos ou troca de equipamentos."
    },
    {
      icon: Shield,
      title: "Transações Seguras",
      description: "Sistema de avaliação de vendedores e compradores para maior segurança."
    }
  ],
  image: "/marketplace.png",
  ctaButton: "Explorar o Marketplace"
};

// Conteúdo da seção IA Sensei
const AI_SENSEI_CONTENT = {
  title: "I.A Sensei",
  description: "Assistente de inteligência artificial especializado em Jiu-Jitsu para responder suas dúvidas.",
  features: [
    {
      icon: Bot,
      title: "Consulta Inteligente",
      description: "Tire dúvidas sobre técnicas, regras e estratégias com um assistente virtual especializado."
    },
    {
      icon: MessageSquare,
      title: "Sugestões Personalizadas",
      description: "Receba recomendações de técnicas baseadas em seu nível e preferências de luta."
    },
    {
      icon: BookOpen,
      title: "Biblioteca de Conhecimento",
      description: "Acesse uma vasta base de dados sobre Jiu-Jitsu, atualizada constantemente."
    }
  ],
  image: "/ai-sensei.png",
  ctaButton: "Converse com o I.A Sensei"
};

// Componente da landing page
const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Alterna para o próximo depoimento a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((current) => {
        return (current + 1) % TESTIMONIALS_CONTENT.testimonials.length;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Função para navegar para a página de cadastro
  const handleSignUp = () => {
    navigate("/register");
  };

  // Função para navegar para a página de login
  const handleLogin = () => {
    navigate("/login");
  };

  // Função para navegar para a página do app
  const handleGoToApp = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-[#121315] text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121315]/80 backdrop-blur-lg border-b border-border/50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bjj-gold rounded-lg flex items-center justify-center">
              <span className="text-bjj-dark font-bold text-sm">BJJ</span>
            </div>
            <span className="font-bold text-xl">Academy</span>
          </div>
            {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#training" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Treinos</a>
            <a href="#techniques" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Técnicas</a>
            <a href="#competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Competições</a>
            <a href="#goals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Objetivos</a>
            <a href="#ai-sensei" className="text-sm text-muted-foreground hover:text-foreground transition-colors">I.A Sensei</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</a>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 px-4 border-border hover:border-bjj-gold/50"
              onClick={handleLogin}
            >
              Entrar
            </Button>
            <Button 
              size="sm"
              className="h-9 px-4 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
              onClick={handleSignUp}
            >
              Criar Conta
            </Button>
          </div>
          
          {/* Menu Mobile Toggle */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#121315]/95 backdrop-blur-lg border-b border-border/50 p-4">            <nav className="flex flex-col gap-4 mb-6">
              <a 
                href="#features" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#training" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Treinos
              </a>
              <a 
                href="#techniques" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Técnicas
              </a>
              <a 
                href="#competitions" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Competições
              </a>
              <a 
                href="#goals" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Objetivos
              </a>
              <a 
                href="#gameplan" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Plano de Jogo
              </a>
              <a 
                href="#videos" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Vídeos
              </a>
              <a 
                href="#metrics" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Métricas
              </a>
              <a 
                href="#ai-sensei" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                I.A Sensei
              </a>
              <a 
                href="#pricing" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </a>
            </nav>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full border-border hover:border-bjj-gold/50"
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
              >
                Entrar
              </Button>
              <Button 
                className="w-full bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                onClick={() => {
                  handleSignUp();
                  setIsMenuOpen(false);
                }}
              >
                Criar Conta
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6">
          {/* Background Elements */}
          <div className="absolute top-40 right-0 w-64 h-64 bg-bjj-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-bjj-gold/10 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {HERO_CONTENT.title} <span className="text-bjj-gold block mt-2">{HERO_CONTENT.subtitle}</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10">
                {HERO_CONTENT.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground text-lg"
                  onClick={handleSignUp}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  {HERO_CONTENT.ctaButton}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-border hover:border-bjj-gold/50 text-lg"
                  onClick={() => document.getElementById("features").scrollIntoView({ behavior: 'smooth' })}
                >
                  <ChevronRight className="mr-2 h-5 w-5" />
                  {HERO_CONTENT.secondaryButton}
                </Button>
              </div>
              
              {/* App Preview Image */}
              <div className="mt-16 relative">
                <div className="w-full h-[500px] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem do App aqui</p>
                </div>
                {/* Mock UI elementos */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-card/80 rounded-lg border border-border/40 backdrop-blur-sm"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-card/80 rounded-lg border border-border/40 backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{MAIN_FEATURES_CONTENT.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {MAIN_FEATURES_CONTENT.description}
              </p>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {MAIN_FEATURES_CONTENT.features.slice(0, 4).map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-bjj-gold/30 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="p-3 w-14 h-14 rounded-lg bg-bjj-gold/10 group-hover:bg-bjj-gold/20 transition-colors mb-4 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-bjj-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-8">
              {MAIN_FEATURES_CONTENT.features.slice(4).map((feature, index) => (
                <Card 
                  key={index + 4}
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-bjj-gold/30 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="p-3 w-14 h-14 rounded-lg bg-bjj-gold/10 group-hover:bg-bjj-gold/20 transition-colors mb-4 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-bjj-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Training Tracking Section */}
        <section id="training" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{TRAINING_TRACKING_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {TRAINING_TRACKING_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {TRAINING_TRACKING_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {TRAINING_TRACKING_CONTENT.ctaButton}
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem de Acompanhamento de Treinos</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Techniques Library Section */}
        <section id="techniques" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem da Biblioteca de Técnicas</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{TECHNIQUES_LIBRARY_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {TECHNIQUES_LIBRARY_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {TECHNIQUES_LIBRARY_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  {TECHNIQUES_LIBRARY_CONTENT.ctaButton}
                </Button>
              </div>
            </div>
          </div>
        </section>
          {/* Competitions Management Section */}
        <section id="competitions" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{COMPETITIONS_MANAGEMENT_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {COMPETITIONS_MANAGEMENT_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {COMPETITIONS_MANAGEMENT_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  {COMPETITIONS_MANAGEMENT_CONTENT.ctaButton}
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem de Gestão de Competições</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Goals and Objectives Section */}
        <section id="goals" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem de Objetivos e Metas</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{GOALS_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {GOALS_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {GOALS_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <Target className="mr-2 h-5 w-5" />
                  {GOALS_CONTENT.ctaButton}
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Notes Section */}
        <section id="notes" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{NOTES_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {NOTES_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {NOTES_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <FileCheck className="mr-2 h-5 w-5" />
                  {NOTES_CONTENT.ctaButton}
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem de Observações e Notas</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Game Plan Section */}
        <section id="gameplan" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem do Plano de Jogo</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{GAME_PLAN_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {GAME_PLAN_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {GAME_PLAN_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  {GAME_PLAN_CONTENT.ctaButton}
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Videos and Media Section */}
        <section id="videos" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{VIDEOS_CONTENT.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {VIDEOS_CONTENT.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {VIDEOS_CONTENT.features.map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-bjj-gold/30 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="p-3 w-14 h-14 rounded-lg bg-bjj-gold/10 group-hover:bg-bjj-gold/20 transition-colors mb-4 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-bjj-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                className="bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                onClick={handleSignUp}
              >
                <Video className="mr-2 h-5 w-5" />
                {VIDEOS_CONTENT.ctaButton}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Metrics and Analysis Section */}
        <section id="metrics" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{METRICS_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {METRICS_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {METRICS_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  {METRICS_CONTENT.ctaButton}
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem do Dashboard de Métricas</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Marketplace Section */}
        <section id="marketplace" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem do Dojo Market</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{MARKETPLACE_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {MARKETPLACE_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {MARKETPLACE_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {MARKETPLACE_CONTENT.ctaButton}
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Sensei Section */}
        <section id="ai-sensei" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{AI_SENSEI_CONTENT.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {AI_SENSEI_CONTENT.description}
                </p>
                
                <div className="space-y-6">
                  {AI_SENSEI_CONTENT.features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bjj-gold/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-bjj-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-10 bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                  onClick={handleSignUp}
                >
                  <Bot className="mr-2 h-5 w-5" />
                  {AI_SENSEI_CONTENT.ctaButton}
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-xl bg-card/30 border border-border/40 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-muted-foreground">Imagem do I.A Sensei</p>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-bjj-gold/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Community Section */}
        <section id="community" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{COMMUNITY_CONTENT.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {COMMUNITY_CONTENT.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {COMMUNITY_CONTENT.features.map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 border-border/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-bjj-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {COMMUNITY_CONTENT.statistics.map((stat, index) => (
                <div key={index} className="bg-card/30 border border-border/40 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-bjj-gold/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-bjj-gold" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-bjj-gold mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                className="bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                onClick={handleSignUp}
              >
                <Users className="mr-2 h-5 w-5" />
                {COMMUNITY_CONTENT.ctaButton}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{TESTIMONIALS_CONTENT.title}</h2>
            </div>
            
            <div className="relative max-w-3xl mx-auto">
              <div className="overflow-hidden relative min-h-[280px]">
                {TESTIMONIALS_CONTENT.testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className={`absolute top-0 left-0 w-full transition-all duration-700 ${
                      index === activeTestimonial 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 translate-x-24"
                    }`}
                  >
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-bjj-gold/20 mb-4 flex items-center justify-center">
                          <span className="text-bjj-gold">Foto</span>
                        </div>
                        <p className="text-lg mb-6 italic text-muted-foreground">"{testimonial.content}"</p>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {TESTIMONIALS_CONTENT.testimonials.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === activeTestimonial ? "bg-bjj-gold" : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Ver depoimento ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{PRICING_CONTENT.title}</h2>
              <p className="text-xl text-bjj-gold mb-2">{PRICING_CONTENT.subtitle}</p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {PRICING_CONTENT.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {PRICING_CONTENT.plans.map((plan, index) => (
                <div key={index} className="relative">                  <Card 
                    className={`h-full bg-card/50 backdrop-blur-sm relative ${
                      plan.popular 
                        ? "border-bjj-gold/50 mt-6" 
                        : "border-border/50"
                    }`}
                  >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-bjj-gold text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                        Recomendado
                      </span>
                    </div>
                  )}
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4">
                        <plan.icon className="w-6 h-6 text-bjj-gold" />
                      </div>
                    
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                      
                      <div className="mb-2">
                        <span className="text-3xl font-bold">{plan.price}</span>
                      </div>
                      
                      {plan.priceHighlight && (
                        <div className="bg-bjj-gold/10 text-bjj-gold text-sm p-2 rounded mb-4">
                          {plan.priceHighlight}
                        </div>
                      )}
                      
                      <div className="flex-grow mb-8">
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-1 text-bjj-gold">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button                        className={plan.popular 
                          ? "bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground" 
                          : "bg-card hover:bg-card/70 border border-border text-white"
                        }
                        onClick={handleSignUp}
                      >
                        {plan.ctaButton}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-8">
              {PRICING_CONTENT.note}
            </p>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#13141A]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">{FAQ_CONTENT.title}</h2>
            </div>
            
            <div className="space-y-6">
              {FAQ_CONTENT.faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="group bg-card/50 border border-border/50 rounded-lg overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <div className="flex-shrink-0 ml-2 text-muted-foreground transition-transform group-open:rotate-180">
                      <ChevronRight className="rotate-90" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{FINAL_CTA_CONTENT.title}</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              {FINAL_CTA_CONTENT.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                onClick={handleSignUp}
              >
                <Zap className="mr-2 h-5 w-5" />
                {FINAL_CTA_CONTENT.primaryButton}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border hover:border-bjj-gold/50"
                onClick={handleLogin}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {FINAL_CTA_CONTENT.secondaryButton}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0D0E10] border-t border-border/30 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-bjj-gold rounded-lg flex items-center justify-center">
                  <span className="text-bjj-dark font-bold text-sm">BJJ</span>
                </div>
                <span className="font-bold text-xl">{FOOTER_CONTENT.logo}</span>
              </div>
              <p className="text-muted-foreground mb-6">{FOOTER_CONTENT.tagline}</p>
              <div className="flex gap-4">
                <a href="#instagram" className="w-8 h-8 rounded-full bg-card/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram />
                </a>
                <a href="#facebook" className="w-8 h-8 rounded-full bg-card/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook />
                </a>
                <a href="#youtube" className="w-8 h-8 rounded-full bg-card/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube />
                </a>
              </div>
            </div>
            
            {FOOTER_CONTENT.sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-border/30 text-center sm:text-left text-sm text-muted-foreground">
            <p>{FOOTER_CONTENT.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
