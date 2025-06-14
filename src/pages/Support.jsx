import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessagesSquare, Mail, Headphones, FileText, HelpCircle, Phone, Send, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Constante com o conteúdo da página de Suporte
// Esta constante pode ser facilmente atualizada no futuro
const SUPPORT_CONTENT = {
  title: "Suporte",
  subtitle: "Como podemos ajudar?",
  description: "Nossa equipe está pronta para ajudar você com qualquer questão relacionada à BJJ Academy.",
  contactChannels: [
    {
      title: "Chat ao Vivo",
      description: "Converse diretamente com um atendente em tempo real",
      icon: MessagesSquare,
      availability: "Seg-Sex: 8h às 20h",
      action: "Iniciar Chat"
    },
    {
      title: "E-mail",
      description: "Envie-nos uma mensagem detalhada e responderemos em até 24h",
      icon: Mail,
      availability: "Respondemos em até 24h",
      action: "Enviar E-mail"
    },
    {
      title: "Central de Atendimento",
      description: "Entre em contato por telefone para suporte imediato",
      icon: Headphones,
      availability: "Seg-Sex: 9h às 18h",
      action: "Ver Número",
      phoneNumber: "(11) 4002-8922"
    }
  ],
  helpCategories: [
    {
      id: "account",
      label: "Conta e Acesso",
      description: "Problemas com login, cadastro ou configurações de conta"
    },
    {
      id: "payment",
      label: "Pagamentos e Assinatura",
      description: "Dúvidas sobre cobranças, planos ou cancelamentos"
    },
    {
      id: "app",
      label: "Funcionalidades do App",
      description: "Ajuda com recursos, funções ou bugs do aplicativo"
    },
    {
      id: "other",
      label: "Outros Assuntos",
      description: "Parcerias, sugestões ou outras questões"
    }
  ],
  faq: [
    {
      question: "Como altero minha senha?",
      answer: "Para alterar sua senha, acesse seu perfil no app, vá em Configurações > Segurança > Alterar Senha. Você receberá um e-mail com instruções para criar uma nova senha."
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Para cancelar sua assinatura, acesse seu perfil no app, vá em Configurações > Assinatura > Cancelar Plano. Seu acesso continuará ativo até o final do período já pago."
    },
    {
      question: "Perdi meus dados de treino, como recuperá-los?",
      answer: "Se você estiver utilizando uma conta conectada, todos os seus dados são sincronizados na nuvem. Verifique se está logado com a mesma conta em que registrou seus treinos. Se o problema persistir, entre em contato com nosso suporte."
    },
    {
      question: "Como compartilhar técnicas com outros usuários?",
      answer: "Abra a técnica desejada em sua biblioteca, toque no botão de compartilhar e escolha se deseja compartilhar via código QR, link ou diretamente com outro usuário do app pelo username."
    }
  ],
  contactForm: {
    title: "Entre em Contato",
    description: "Preencha o formulário abaixo e entraremos em contato o mais rápido possível.",
    fields: {
      name: "Nome completo",
      email: "E-mail",
      subject: "Assunto",
      message: "Mensagem",
      category: "Categoria",
      submit: "Enviar Mensagem"
    }
  },  footer: {
    links: [
      { name: "Termos de Uso", href: "/termos-de-uso" },
      { name: "Política de Privacidade", href: "/politica-de-privacidade" }
    ]
  }
};

const Support = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Estados para o formulário de contato
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Estado removido: selectedChannel
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulando envio
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Limpar formulário
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCategory("");
      
      // Esconder mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 1500);
  };
  // Nenhuma função de seleção de canal é necessária

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col justify-between p-4">
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
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
              {/* Header da página de suporte */}
              <div className="bg-gradient-to-r from-bjj-gold/20 to-bjj-gold/5 p-6 sm:p-10 rounded-t-lg">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-foreground mb-2">{SUPPORT_CONTENT.title}</h2>
                  <p className="text-xl font-medium text-bjj-gold mb-2">{SUPPORT_CONTENT.subtitle}</p>
                  <p className="text-muted-foreground">{SUPPORT_CONTENT.description}</p>
                </div>
              </div>
              
              {/* Conteúdo principal */}              <div className="p-6 sm:p-10">
                {/* Formulário de contato */}
                <div className="mb-16">
                  <h3 className="text-xl font-semibold mb-2 text-center">{SUPPORT_CONTENT.contactForm.title}</h3>
                  <p className="text-center text-muted-foreground mb-6">{SUPPORT_CONTENT.contactForm.description}</p>
                  
                  {showSuccessMessage && (
                    <Alert className="mb-6 bg-green-900/20 border-green-800 text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Mensagem enviada com sucesso!</AlertTitle>
                      <AlertDescription>
                        Nossa equipe de suporte entrará em contato em breve. Obrigado pelo seu contato.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleContactFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{SUPPORT_CONTENT.contactForm.fields.name}</Label>
                        <Input 
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{SUPPORT_CONTENT.contactForm.fields.email}</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{SUPPORT_CONTENT.contactForm.fields.category}</Label>
                      <RadioGroup 
                        value={category} 
                        onValueChange={setCategory}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {SUPPORT_CONTENT.helpCategories.map((cat) => (
                          <div key={cat.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={cat.id} id={cat.id} className="mt-1" />
                            <Label 
                              htmlFor={cat.id}
                              className="flex-1 cursor-pointer"
                            >
                              <span className="font-medium">{cat.label}</span>
                              <p className="text-xs text-muted-foreground">{cat.description}</p>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">{SUPPORT_CONTENT.contactForm.fields.subject}</Label>
                      <Input 
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="bg-card/50 border-border/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{SUPPORT_CONTENT.contactForm.fields.message}</Label>
                      <Textarea 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="bg-card/50 border-border/40 resize-none"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-pulse mr-2">●</span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {SUPPORT_CONTENT.contactForm.fields.submit}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* FAQ - Perguntas frequentes */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center">Perguntas Frequentes</h3>
                  
                  <div className="space-y-4 mb-8">
                    {SUPPORT_CONTENT.faq.map((item, index) => (
                      <details 
                        key={index} 
                        className="group bg-card/50 border border-border/50 rounded-lg overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-bjj-gold/10 flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="w-4 h-4 text-bjj-gold" />
                            </div>
                            <h4 className="text-base font-medium">{item.question}</h4>
                          </div>
                          <div className="flex-shrink-0 ml-2 text-muted-foreground transition-transform group-open:rotate-180">
                            <ArrowLeft className="rotate-[-90deg]" />
                          </div>
                        </summary>
                        <div className="px-4 pb-4 pt-2 pl-[60px] text-muted-foreground">
                          <p>{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Rodapé do card */}
              <div className="bg-card/30 border-t border-border/30 p-4 rounded-b-lg">
                <div className="flex flex-wrap justify-center gap-4">
                  {SUPPORT_CONTENT.footer.links.map((link, index) => (
                    <Button 
                      key={index}
                      variant="link" 
                      className="text-muted-foreground hover:text-bjj-gold"
                      onClick={() => navigate(link.href)}
                    >
                      {link.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        {/* Seção de modais removida */}
      
      {/* Copyright footer */}
      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">© 2025 BJJ Academy. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Support;
