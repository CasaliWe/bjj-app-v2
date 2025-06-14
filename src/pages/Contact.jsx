import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, MapPin, Send, CheckCircle2, ExternalLink, Instagram, Facebook, Youtube } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Constante com o conteúdo da página de Contato
// Esta constante pode ser facilmente atualizada no futuro
const CONTACT_CONTENT = {
  title: "Contato",
  subtitle: "Entre em contato conosco",
  description: "Estamos à disposição para esclarecer suas dúvidas, receber feedback ou ajudá-lo com qualquer assunto relacionado à BJJ Academy.",
    contactInfo: {
    email: "contato@bjjacademy.com",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, CEP 01310-000",
    socialMedia: [
      { name: "Instagram", handle: "@bjjacademy", url: "https://instagram.com/bjjacademy", icon: Instagram },
      { name: "Facebook", handle: "BJJ Academy Oficial", url: "https://facebook.com/bjjacademy", icon: Facebook },
      { name: "YouTube", handle: "BJJ Academy Channel", url: "https://youtube.com/bjjacademy", icon: Youtube }
    ]
  },
  
  contactForm: {
    title: "Envie sua Mensagem",
    description: "Preencha o formulário abaixo e responderemos o mais rápido possível.",
    fields: {
      name: "Nome completo",
      email: "E-mail",
      subject: "Assunto",
      message: "Mensagem",
      submit: "Enviar Mensagem"
    },
    subjects: [
      { id: "support", label: "Suporte e Ajuda" },
      { id: "feedback", label: "Feedback e Sugestões" },
      { id: "partnership", label: "Parcerias e Oportunidades" },
      { id: "other", label: "Outros Assuntos" }
    ],
    successMessage: {
      title: "Mensagem enviada com sucesso!",
      description: "Recebemos sua mensagem e entraremos em contato em breve. Obrigado pelo seu contato."
    }
  },
  
  quickLinks: {
    title: "Links Rápidos",
    links: [
      { name: "FAQ", href: "/suporte", description: "Perguntas frequentes" },
      { name: "Sobre Nós", href: "/sobre-nos", description: "Conheça nossa história" },
      { name: "Termos de Uso", href: "/termos-de-uso", description: "Regras e condições" },
      { name: "Política de Privacidade", href: "/politica-de-privacidade", description: "Como tratamos seus dados" }
    ]
  }
};

const Contact = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Estados para o formulário de contato
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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
      
      // Esconder mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 1500);
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
              {/* Header da página de contato */}
              <div className="bg-gradient-to-r from-bjj-gold/20 to-bjj-gold/5 p-6 sm:p-10 rounded-t-lg">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-foreground mb-2">{CONTACT_CONTENT.title}</h2>
                  <p className="text-xl font-medium text-bjj-gold mb-2">{CONTACT_CONTENT.subtitle}</p>
                  <p className="text-muted-foreground">{CONTACT_CONTENT.description}</p>
                </div>
              </div>
              
              {/* Conteúdo principal */}
              <div className="p-6 sm:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Coluna da esquerda - Informações de contato */}
                  <div>
                    <div className="space-y-8">
                      {/* Email */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bjj-gold/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-bjj-gold" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Email</h3>
                          <p className="text-bjj-gold text-sm mb-1">{CONTACT_CONTENT.contactInfo.email}</p>
                          <p className="text-xs text-muted-foreground">Respondemos em até 24h</p>
                        </div>
                      </div>
                        {/* Seção de telefone removida */}
                      
                      {/* Endereço */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bjj-gold/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-bjj-gold" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Endereço</h3>
                          <p className="text-sm text-muted-foreground">{CONTACT_CONTENT.contactInfo.address}</p>
                        </div>
                      </div>
                      
                      {/* Redes Sociais */}
                      <div>
                        <h3 className="font-medium mb-3">Redes Sociais</h3>
                        <div className="space-y-3">
                          {CONTACT_CONTENT.contactInfo.socialMedia.map((social, index) => (
                            <a 
                              key={index}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 group text-muted-foreground hover:text-bjj-gold transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-bjj-gold/10 group-hover:bg-bjj-gold/20 flex items-center justify-center transition-colors">
                                <social.icon className="w-4 h-4 text-bjj-gold" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{social.name}</span>
                                <span className="text-xs">{social.handle}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      </div>
                      
                      {/* Links Rápidos */}
                      <div className="mt-6 pt-6 border-t border-border/30">
                        <h3 className="font-medium mb-3">{CONTACT_CONTENT.quickLinks.title}</h3>
                        <div className="space-y-2">
                          {CONTACT_CONTENT.quickLinks.links.map((link, index) => (
                            <a
                              key={index}
                              onClick={() => navigate(link.href)}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-card/50 cursor-pointer transition-colors group"
                            >
                              <div>
                                <p className="text-sm">{link.name}</p>
                                <p className="text-xs text-muted-foreground">{link.description}</p>
                              </div>
                              <ArrowLeft className="w-4 h-4 rotate-[180deg] opacity-0 group-hover:opacity-100 transition-opacity text-bjj-gold" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coluna da direita - Formulário de Contato (ocupa 2 colunas) */}
                  <div className="md:col-span-2">
                    <div className="bg-card/30 border border-border/30 rounded-xl p-6">
                      <h3 className="text-xl font-semibold mb-2">{CONTACT_CONTENT.contactForm.title}</h3>
                      <p className="text-muted-foreground mb-6">{CONTACT_CONTENT.contactForm.description}</p>
                      
                      {showSuccessMessage && (
                        <Alert className="mb-6 bg-green-900/20 border-green-800 text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>{CONTACT_CONTENT.contactForm.successMessage.title}</AlertTitle>
                          <AlertDescription>
                            {CONTACT_CONTENT.contactForm.successMessage.description}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <form onSubmit={handleContactFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">{CONTACT_CONTENT.contactForm.fields.name}</Label>
                            <Input 
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{CONTACT_CONTENT.contactForm.fields.email}</Label>
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
                          <Label>{CONTACT_CONTENT.contactForm.fields.subject}</Label>
                          <RadioGroup 
                            value={subject} 
                            onValueChange={setSubject}
                            className="grid grid-cols-1 md:grid-cols-2 gap-2"
                          >
                            {CONTACT_CONTENT.contactForm.subjects.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={item.id} id={item.id} />
                                <Label htmlFor={item.id}>{item.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">{CONTACT_CONTENT.contactForm.fields.message}</Label>
                          <Textarea 
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={6}
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
                                {CONTACT_CONTENT.contactForm.fields.submit}
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                      {/* Seção de chat em tempo real removida */}
                  </div>
                </div>
              </div>
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

export default Contact;
