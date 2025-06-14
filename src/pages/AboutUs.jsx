import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Award, Target, Users, Star, Calendar, BookOpen, Code, Lightbulb, Heart, Medal, Rocket, GraduationCap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Constante com o conteúdo da página Sobre Nós
// Esta constante pode ser facilmente atualizada no futuro
const ABOUT_US_CONTENT = {
  title: "Sobre Nós",
  subtitle: "A história da BJJ Academy",
  mission: {
    title: "Nossa Missão",
    description: "Potencializar a evolução de praticantes de Jiu-Jitsu através de tecnologia inovadora, fornecendo ferramentas que transformam a maneira como as técnicas são aprendidas, memorizadas e aplicadas."
  },
  vision: {
    title: "Nossa Visão",
    description: "Ser a plataforma de referência global para o desenvolvimento técnico e estratégico no Jiu-Jitsu, conectando praticantes e academias em uma comunidade colaborativa que eleva o nível técnico do esporte."
  },
  values: {
    title: "Nossos Valores",
    items: [
      {
        icon: Target,
        title: "Excelência Técnica",
        description: "Buscamos a precisão e qualidade em cada funcionalidade e recurso da plataforma."
      },
      {
        icon: Users,
        title: "Comunidade",
        description: "Valorizamos a conexão entre praticantes e o compartilhamento de conhecimento."
      },
      {
        icon: Heart,
        title: "Paixão pelo Jiu-Jitsu",
        description: "Nossa equipe é composta por praticantes e entusiastas do esporte."
      },
      {
        icon: Rocket,
        title: "Inovação Constante",
        description: "Evoluímos continuamente nossa plataforma com base no feedback da comunidade."
      }
    ]
  },
  history: {
    title: "Nossa História",
    paragraphs: [
      "A BJJ Academy nasceu em 2023 da frustração de um grupo de praticantes de Jiu-Jitsu que sentiam dificuldade em organizar e revisar as técnicas aprendidas nos treinos. O que começou como um simples aplicativo de anotações evoluiu para uma plataforma completa de gerenciamento técnico e desenvolvimento no Jiu-Jitsu.",
      "Nos primeiros meses, convidamos um grupo seleto de faixas-pretas e professores para testar e refinar nossas funcionalidades. O feedback foi tão positivo que rapidamente expandimos nossa base de usuários, chegando a praticantes de todos os níveis em academias de todo o Brasil.",
      "Em 2024, lançamos recursos avançados de análise de desempenho e planejamento para competições, atraindo a atenção de atletas competitivos. Parcerias com academias renomadas foram estabelecidas, permitindo que professores utilizassem nossa plataforma para monitorar o progresso de seus alunos.",
      "Hoje, em 2025, continuamos expandindo globalmente, com versões em múltiplos idiomas e uma comunidade ativa de praticantes que contribuem diariamente com novas técnicas e estratégias. Nossa missão permanece a mesma: transformar a maneira como o Jiu-Jitsu é aprendido e praticado através da tecnologia."
    ]
  },
  team: {
    title: "Nossa Equipe",
    description: "Somos um time multidisciplinar unido pela paixão pelo Jiu-Jitsu e tecnologia.",
    members: [
      {
        name: "Carlos Fernandes",
        role: "Fundador & CEO",
        belt: "Faixa-Preta 3º Grau",
        bio: "Competidor experiente e desenvolvedor, Carlos combina sua paixão pelo Jiu-Jitsu com conhecimento técnico para liderar a visão da BJJ Academy."
      },
      {
        name: "Juliana Silva",
        role: "CTO & Desenvolvedora",
        belt: "Faixa-Roxa",
        bio: "Especialista em experiência do usuário, Juliana garante que a plataforma seja intuitiva e eficiente para praticantes de todos os níveis."
      },
      {
        name: "Roberto Mendes",
        role: "Diretor Técnico",
        belt: "Faixa-Preta 4º Grau",
        bio: "Professor renomado com mais de 20 anos de experiência, Roberto supervisiona todo o conteúdo técnico e a catalogação de técnicas."
      },
      {
        name: "Mariana Costa",
        role: "Gestora de Comunidade",
        belt: "Faixa-Marrom",
        bio: "Competidora ativa e comunicadora, Mariana mantém nossa comunidade engajada e coleta feedback valioso para melhorias contínuas."
      }
    ]
  },
  achievements: {
    title: "Conquistas",
    items: [
      {
        icon: Users,
        value: "5,000+",
        label: "Usuários Ativos"
      },
      {
        icon: BookOpen,
        value: "15,000+",
        label: "Técnicas Catalogadas"
      },
      {
        icon: Calendar,
        value: "30,000+",
        label: "Treinos Registrados"
      },
      {
        icon: Medal,
        value: "100+",
        label: "Academias Parceiras"
      }
    ]
  },
  future: {
    title: "O Futuro",
    description: "Estamos constantemente inovando e expandindo nossa plataforma com novos recursos e funcionalidades.",
    roadmap: [
      {
        title: "Análise de Vídeo com IA",
        description: "Ferramentas de análise técnica baseada em inteligência artificial para aperfeiçoamento de movimentos."
      },
      {
        title: "Treinamento Personalizado",
        description: "Programas de treino adaptados ao nível técnico e objetivos individuais de cada praticante."
      },
      {
        title: "Expansão Global",
        description: "Adaptação da plataforma para mais idiomas e culturas de treinamento ao redor do mundo."
      }
    ]
  },
  contact: {
    title: "Entre em Contato",
    email: "contato@bjjacademy.com",
    social: {
      instagram: "@bjjacademy",
      facebook: "BJJ Academy Oficial",
      youtube: "BJJ Academy Channel"
    }
  }
};

const AboutUs = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col justify-between p-4">
      {/* Círculos decorativos sutis */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bjj-gold rounded-xl flex items-center justify-center">
                <span className="text-bjj-dark font-bold text-lg">BJJ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Academy</h1>
                <p className="text-muted-foreground text-xs">Plataforma de Jiu-Jitsu</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="h-9 px-3 border-border hover:border-bjj-gold/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          {/* Card principal */}
          <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
            <CardContent className="p-0">
              {/* Header da página sobre nós */}
              <div className="bg-gradient-to-r from-bjj-gold/20 to-bjj-gold/5 p-6 sm:p-10 rounded-t-lg">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-foreground mb-2">{ABOUT_US_CONTENT.title}</h2>
                  <p className="text-xl font-medium text-bjj-gold mb-2">{ABOUT_US_CONTENT.subtitle}</p>
                </div>
              </div>
              
              {/* Conteúdo principal */}
              <ScrollArea className={`p-6 sm:p-10 ${isMobile ? 'h-[60vh]' : 'h-[65vh]'}`}>
                {/* Missão e Visão */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <div className="bg-card/30 border border-border/30 rounded-xl p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4">
                      <Target className="w-7 h-7 text-bjj-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{ABOUT_US_CONTENT.mission.title}</h3>
                    <p className="text-muted-foreground">{ABOUT_US_CONTENT.mission.description}</p>
                  </div>
                  
                  <div className="bg-card/30 border border-border/30 rounded-xl p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4">
                      <Lightbulb className="w-7 h-7 text-bjj-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{ABOUT_US_CONTENT.vision.title}</h3>
                    <p className="text-muted-foreground">{ABOUT_US_CONTENT.vision.description}</p>
                  </div>
                </div>
                
                {/* Valores */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center mb-8">{ABOUT_US_CONTENT.values.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {ABOUT_US_CONTENT.values.items.map((value, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4">
                          <value.icon className="w-7 h-7 text-bjj-gold" />
                        </div>
                        <h4 className="font-semibold mb-2">{value.title}</h4>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* História */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center mb-6">{ABOUT_US_CONTENT.history.title}</h3>
                  <div className="space-y-4 bg-card/30 border border-border/30 rounded-xl p-6">
                    {ABOUT_US_CONTENT.history.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {/* Conquistas */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center mb-8">{ABOUT_US_CONTENT.achievements.title}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {ABOUT_US_CONTENT.achievements.items.map((achievement, index) => (
                      <div key={index} className="bg-card/30 border border-border/30 rounded-xl p-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-2">
                          <achievement.icon className="w-6 h-6 text-bjj-gold" />
                        </div>
                        <span className="text-3xl font-bold text-bjj-gold">{achievement.value}</span>
                        <span className="text-sm text-muted-foreground">{achievement.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Nossa Equipe */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center mb-3">{ABOUT_US_CONTENT.team.title}</h3>
                  <p className="text-muted-foreground text-center mb-8">{ABOUT_US_CONTENT.team.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {ABOUT_US_CONTENT.team.members.map((member, index) => (
                      <div key={index} className="bg-card/30 border border-border/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-bjj-gold/10 flex-shrink-0 flex items-center justify-center">
                            <Users className="w-8 h-8 text-bjj-gold" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{member.name}</h4>
                            <p className="text-sm text-bjj-gold mb-1">{member.role}</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              <span className="inline-flex items-center">
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {member.belt}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">{member.bio}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* O Futuro */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center mb-3">{ABOUT_US_CONTENT.future.title}</h3>
                  <p className="text-muted-foreground text-center mb-8">{ABOUT_US_CONTENT.future.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ABOUT_US_CONTENT.future.roadmap.map((item, index) => (
                      <div key={index} className="bg-card/30 border border-border/30 rounded-xl p-5 flex flex-col">
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Entre em Contato */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">{ABOUT_US_CONTENT.contact.title}</h3>
                  <p className="text-bjj-gold mb-2">{ABOUT_US_CONTENT.contact.email}</p>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10"
                    >
                      Instagram
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10"
                    >
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10"
                    >
                      YouTube
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Copyright footer */}
      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">© 2025 BJJ Academy. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default AboutUs;
