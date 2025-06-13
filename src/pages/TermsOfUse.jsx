import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

// Constante com o conteúdo dos Termos de Uso
// Esta constante pode ser facilmente atualizada no futuro
const TERMS_OF_USE_CONTENT = {
  lastUpdated: "10 de junho de 2025",
  sections: [
    {
      title: "1. Aceitação dos Termos",
      content: `Ao acessar ou usar a plataforma BJJ Academy, você concorda em ficar vinculado a estes Termos de Uso. Se você não concordar com algum destes termos, está proibido de usar a plataforma. O uso contínuo da plataforma constitui aceitação expressa destes termos.`
    },
    {
      title: "2. Descrição do Serviço",
      content: `A BJJ Academy é uma plataforma projetada para praticantes de Jiu-Jitsu Brasileiro (BJJ) organizarem suas técnicas, acompanharem treinos, registrarem competições e desenvolverem planos de jogo personalizados. Nossos serviços incluem, mas não se limitam a:
      
      • Catálogo e organização de técnicas de BJJ
      • Acompanhamento de progresso e estatísticas de treino
      • Registro e análise de competições
      • Criação de planos de jogo estratégicos
      • Comunidade para interação entre praticantes`
    },
    {
      title: "3. Conta de Usuário",
      content: `Para utilizar todas as funcionalidades da plataforma, você precisará criar uma conta. Você é responsável por:
      
      • Manter a confidencialidade de sua senha
      • Restringir o acesso ao seu computador ou dispositivo móvel
      • Assumir responsabilidade por todas as atividades realizadas em sua conta
      
      Você concorda em fornecer informações precisas, atuais e completas durante o processo de registro e em manter estas informações atualizadas. A BJJ Academy reserva-se o direito de suspender ou encerrar sua conta se qualquer informação fornecida for falsa, imprecisa ou incompleta.`
    },
    {
      title: "4. Propriedade Intelectual",
      content: `A plataforma BJJ Academy e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da BJJ Academy e seus licenciadores. A plataforma é protegida por direitos autorais, marcas registradas e outras leis de propriedade intelectual do Brasil e de outros países.

      O uso da plataforma não concede a propriedade de qualquer conteúdo, código, dados ou materiais que você acessar na plataforma. O conteúdo criado pelos usuários permanece propriedade do usuário que o criou, mas ao publicar tal conteúdo na plataforma, você concede à BJJ Academy uma licença mundial, não exclusiva, livre de royalties para usar, modificar, executar publicamente, exibir publicamente e distribuir seu conteúdo em conexão com o serviço.`
    },
    {
      title: "5. Conduta do Usuário",
      content: `Ao usar nossa plataforma, você concorda em não:
      
      • Usar a plataforma de qualquer maneira que viole leis ou regulamentos aplicáveis
      • Enviar ou transmitir qualquer material que seja difamatório, obsceno, pornográfico ou ofensivo
      • Promover qualquer forma de discriminação, assédio ou violência
      • Tentar acessar áreas restritas da plataforma sem autorização
      • Tentar interferir no funcionamento adequado da plataforma
      • Coletar ou rastrear informações pessoais de outros usuários
      • Enviar spam, phishing ou outros conteúdos maliciosos`
    },
    {
      title: "6. Conteúdo do Usuário",
      content: `Ao enviar conteúdo para a plataforma, como técnicas, comentários, planos de treino ou outros materiais, você permanece proprietário do seu conteúdo, mas concede à BJJ Academy uma licença não exclusiva para usar, reproduzir, adaptar, publicar e distribuir tal conteúdo em nossa plataforma.

      Você é responsável por todo conteúdo que publicar e garante que:
      
      • Possui todos os direitos necessários para conceder a licença acima
      • O conteúdo não infringe direitos de terceiros
      • O conteúdo não é ilegal ou prejudicial de qualquer forma`
    },
    {
      title: "7. Isenção de Garantias",
      content: `A plataforma é fornecida "como está" e "conforme disponível" sem quaisquer garantias, expressas ou implícitas. Não garantimos que a plataforma será ininterrupta, segura ou livre de erros, nem que quaisquer erros serão corrigidos.

      Você entende e concorda que usa a plataforma por sua própria conta e risco. A BJJ Academy não será responsável por quaisquer danos diretos, indiretos, incidentais, consequentes ou punitivos resultantes do seu uso ou incapacidade de usar a plataforma.`
    },
    {
      title: "8. Limitação de Responsabilidade",
      content: `Em nenhuma circunstância a BJJ Academy, seus diretores, funcionários, parceiros ou fornecedores serão responsáveis por qualquer dano indireto, incidental, especial ou consequente (incluindo perda de dados, lucros cessantes ou danos à reputação) decorrentes do uso ou da incapacidade de usar a plataforma.

      Nossa responsabilidade agregada decorrente ou relacionada ao uso da plataforma será limitada ao valor total que você pagou à BJJ Academy pelos serviços durante os seis meses anteriores ao evento que deu origem à responsabilidade, ou, se você não pagou nada, a R$100.`
    },
    {
      title: "9. Alterações nos Termos",
      content: `Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação na plataforma. O uso contínuo da plataforma após tais alterações constitui sua aceitação dos novos termos.

      É sua responsabilidade verificar periodicamente se houve alterações nos termos. Se você não concordar com os novos termos, deverá parar de usar a plataforma.`
    },
    {
      title: "10. Lei Aplicável",
      content: `Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar as disposições sobre conflitos de leis. Qualquer disputa decorrente ou relacionada a estes termos ou ao uso da plataforma será submetida à jurisdição exclusiva dos tribunais localizados no Brasil.`
    }
  ]
};

const TermsOfUse = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col justify-between p-4">
      {/* Círculos decorativos sutis - Visíveis apenas no desktop */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-4xl mx-auto relative z-10">
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
          
          {/* Card de conteúdo */}
          <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground">Termos de Uso</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Última atualização: {TERMS_OF_USE_CONTENT.lastUpdated}
                </p>
              </div>
              
              <ScrollArea className={`pr-6 ${isMobile ? 'h-[60vh]' : 'h-[65vh]'}`}>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Bem-vindo aos Termos de Uso da BJJ Academy. Estes termos regem seu uso da plataforma
                    BJJ Academy, incluindo todos os serviços relacionados. Ao usar nossa plataforma, 
                    você concorda com estes termos. Por favor, leia-os atentamente.
                  </p>
                  
                  {TERMS_OF_USE_CONTENT.sections.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-6 pb-4">
                    <p className="text-sm text-muted-foreground">
                      Ao continuar usando a plataforma BJJ Academy, você confirma que leu, entendeu e 
                      concordou com estes Termos de Uso. Se tiver dúvidas sobre estes termos, entre em 
                      contato conosco através de contato@bjjacademy.com.
                    </p>
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

export default TermsOfUse;
