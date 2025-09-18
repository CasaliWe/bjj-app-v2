import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

// Constante com o conteúdo da Política de Privacidade
// Esta constante pode ser facilmente atualizada no futuro
const PRIVACY_POLICY_CONTENT = {
  lastUpdated: "10 de junho de 2025",
  sections: [
    {
      title: "1. Introdução",
      content: `A BJJ Academy valoriza a privacidade de nossos usuários e está comprometida em proteger suas informações pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossa plataforma.

      Ao utilizar a BJJ Academy, você concorda com a coleta e uso de suas informações de acordo com esta política. Não utilizaremos ou compartilharemos suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.`
    },
    {
      title: "2. Informações que Coletamos",
      content: `Coletamos diversos tipos de informações para fornecer e melhorar nosso serviço, incluindo:

      a) Informações de Registro: Quando você cria uma conta, podemos coletar seu nome, endereço de e-mail, senha e outras informações de perfil.

      b) Informações de Uso: Coletamos dados sobre como você interage com nossa plataforma, incluindo:
         • Técnicas de BJJ que você cadastra e organiza
         • Registros de treinos e competições
         • Planos de jogo que você cria
         • Métricas e estatísticas de desempenho

      c) Informações do Dispositivo: Podemos coletar informações sobre o dispositivo que você usa para acessar nossa plataforma, incluindo modelo de hardware, sistema operacional, identificadores únicos e dados de rede móvel.

      d) Cookies e Tecnologias Semelhantes: Utilizamos cookies e tecnologias similares para coletar informações sobre como você usa nossa plataforma, personalizar sua experiência e melhorar nossos serviços.`
    },
    {
      title: "3. Como Utilizamos Suas Informações",
      content: `Usamos as informações que coletamos para:

      • Fornecer, manter e melhorar nossos serviços
      • Personalizar sua experiência na plataforma
      • Processar e completar transações
      • Enviar confirmações, atualizações e alertas relacionados ao serviço
      • Responder a solicitações, perguntas e comentários
      • Monitorar e analisar tendências, uso e atividades relacionadas aos nossos serviços
      • Detectar, investigar e prevenir atividades fraudulentas e não autorizadas
      • Cumprir obrigações legais`
    },
    {
      title: "4. Compartilhamento de Informações",
      content: `Não vendemos, comercializamos ou alugamos suas informações pessoais a terceiros. No entanto, podemos compartilhar suas informações nas seguintes circunstâncias:

      • Com seu consentimento: Podemos compartilhar suas informações quando você nos autorizar especificamente a fazê-lo.
      
      • Com Prestadores de Serviços: Podemos compartilhar suas informações com empresas terceirizadas que nos ajudam a operar nossa plataforma, como provedores de hospedagem, processadores de pagamento e serviços de análise.
      
      • Para Fins Legais: Podemos divulgar suas informações quando acreditarmos de boa-fé que tal divulgação é necessária para cumprir uma obrigação legal, proteger nossos direitos, proteger sua segurança ou a segurança de outros, investigar fraude ou responder a uma solicitação governamental.

      • Informações Agregadas ou Anonimizadas: Podemos compartilhar informações agregadas ou anonimizadas que não identificam diretamente você para fins de pesquisa, análise ou melhoria de serviço.`
    },
    {
      title: "5. Segurança de Dados",
      content: `A segurança das suas informações é importante para nós. Implementamos medidas técnicas, administrativas e físicas projetadas para proteger suas informações contra acesso não autorizado, perda, uso indevido, alteração ou destruição.

      No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Portanto, embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas informações pessoais, não podemos garantir sua segurança absoluta.`
    },
    {
      title: "6. Seus Direitos e Escolhas",
      content: `Você tem certos direitos e escolhas em relação às suas informações pessoais:

      • Acesso e Atualização: Você pode acessar e atualizar suas informações pessoais através da seção de configurações da sua conta.
      
      • Exclusão de Conta: Você pode solicitar a exclusão da sua conta e das informações associadas. Observe que algumas informações podem ser retidas por períodos específicos para fins legais ou comerciais legítimos.
      
      • Comunicações: Você pode optar por não receber comunicações promocionais seguindo as instruções de cancelamento de inscrição incluídas em cada e-mail.
      
      • Cookies: A maioria dos navegadores permite que você gerencie suas preferências de cookies. Você pode configurar seu navegador para recusar cookies ou alertá-lo quando os cookies estão sendo enviados.`
    },
    {
      title: "7. Privacidade de Crianças",
      content: `Nossa plataforma não é destinada a indivíduos menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças com menos de 13 anos. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança com menos de 13 anos, tomaremos medidas para remover essas informações de nossos servidores o mais rápido possível.`
    },
    {
      title: "8. Alterações nesta Política",
      content: `Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data de "última atualização" no topo desta página.

      Recomendamos que você revise esta Política de Privacidade periodicamente para verificar se há alterações. As alterações entram em vigor quando publicadas nesta página. Seu uso continuado da plataforma após a publicação de alterações constitui sua aceitação dessas alterações.`
    },
    {
      title: "9. Transferências Internacionais de Dados",
      content: `Suas informações pessoais podem ser transferidas e mantidas em computadores localizados fora do seu estado, província, país ou outra jurisdição governamental, onde as leis de proteção de dados podem ser diferentes das da sua jurisdição.

      Se você está localizado fora do Brasil e optar por nos fornecer informações, observe que transferimos as informações, incluindo informações pessoais, para o Brasil e as processamos lá.

      Seu consentimento a esta Política de Privacidade, seguido pelo envio de tais informações, representa seu acordo com essa transferência.`
    },
    {
      title: "10. Entre em Contato Conosco",
      content: `Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco através do e-mail: contato@bjjacademy.com.br`
    }
  ]
};

const PrivacyPolicy = () => {
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
                <h2 className="text-3xl font-bold text-foreground">Política de Privacidade</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Última atualização: {PRIVACY_POLICY_CONTENT.lastUpdated}
                </p>
              </div>
              
              <ScrollArea className={`pr-6 ${isMobile ? 'h-[60vh]' : 'h-[65vh]'}`}>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    A BJJ Academy está comprometida em proteger sua privacidade e garantir que suas 
                    informações pessoais sejam tratadas com cuidado e respeito. Esta Política de 
                    Privacidade descreve como coletamos, usamos e protegemos seus dados.
                  </p>
                  
                  {PRIVACY_POLICY_CONTENT.sections.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-6 pb-4">
                    <p className="text-sm text-muted-foreground">
                      Ao utilizar nossos serviços, você consente com esta Política de Privacidade. Se você não 
                      concorda com esta Política, por favor, não utilize nossa plataforma. Para quaisquer dúvidas 
                      sobre como tratamos seus dados, entre em contato conosco.
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
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
