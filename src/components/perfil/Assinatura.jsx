import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { QrCode, CheckCircle, LockKeyhole, Calendar, ArrowRight, RotateCcw } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

/**
 * Componente de Assinatura para gerenciar pagamentos via Asaas (apenas PIX)
 * 
 * Este componente renderiza um botão que abre um modal para pagamento de mensalidade
 * usando PIX via integração com a API do Asaas.
 * 
 */
const Assinatura = () => {
  // Obter dados do usuário do contexto global
  const { user } = useUser();
  
  // Estados do componente
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [step, setStep] = useState('select-plan'); // 'select-plan', 'show-pix', 'success'
  const [selectedPlan, setSelectedPlan] = useState('1');
  const [pixDadosApi, setPixDadosApi] = useState(null);

  // Dados dos planos
  const plans = {
    '1': {
      months: 1,
      basePrice: 32.90,
      discount: 0,
      totalPrice: 32.90,
      label: '1 mês'
    },
    '2': {
      months: 2,
      basePrice: 32.90,
      discount: 0.05,
      totalPrice: Math.round((2 * 32.90 * 0.95) * 100) / 100,
      label: '2 meses'
    },
    '3': {
      months: 3,
      basePrice: 32.90,
      discount: 0.10,
      totalPrice: Math.round((3 * 32.90 * 0.90) * 100) / 100,
      label: '3 meses'
    },
    '6': {
      months: 6,
      basePrice: 32.90,
      discount: 0.15,
      totalPrice: Math.round((6 * 32.90 * 0.85) * 100) / 100,
      label: '6 meses'
    }
  };

  // buscando qrcode **********************************************
  const generatePixQrCode = () => {
    setLoading(true);
    
    // Simulação de chamada à API - substituir com chamada real
    setTimeout(() => {
      console.log('Plano selecionado:', plans[selectedPlan].months);
      console.log(' Valor:', plans[selectedPlan].totalPrice);

      // faz o fecth aqui....

      // salva oq a api retornou
      setPixDadosApi({
        key: 'sdoifdoiwfsdifhiosdifhsdf',
        qrcode: 'qrcode123456',
        id_processo: 'processo123456'
      });

      setLoading(false);
      setStep('show-pix');
    }, 1500);
  };
  
  
  // verificando pagamento *****************************************
  const checkPaymentStatus = () => {
    setLoading(true);
    
    // faz a chama a api....
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };


  // Função para copiar a chave PIX para a área de transferência
  const handleCopyPix = () => {    
    // Usando a API de clipboard para copiar para a área de transferência
    navigator.clipboard.writeText(pixDadosApi.key)
      .then(() => {
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar: ', err);
      });
  };
  

  // redirecionando para a dashboard
  const handleFinish = () => {
    setOpen(false);
    // Redireciona para a dashboard
    window.location.href = "/app";
    
    // Reset do estado após fechar o modal
    setTimeout(() => {
      setStep('select-plan');
      setSuccess(false);
      setSelectedPlan('1');
    }, 300);
  };

  return (
    <>
      {/* Botão principal que abre o modal */}
      <div className="w-full flex justify-center">
        {user && user.plano === 'Plus' ? (
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-md p-3 mb-3 text-center">
              <p className="text-sm font-medium text-green-600">Plano Plus Ativo</p>
              <p className="text-xs text-gray-500">Válido até {new Date(user.vencimento).toLocaleDateString("pt-BR")}</p>
            </div>
            <Button 
              onClick={() => {
                setOpen(true);
                setStep('select-plan');
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full"
            >
              <QrCode className="w-4 h-4" />
              Renovar Assinatura
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => {
              setOpen(true);
              setStep('select-plan');
            }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <QrCode className="w-4 h-4" />
            Assinar via PIX
          </Button>
        )}
      </div>
      {/* Botão principal que abre o modal */}
      
      {/* Modal de pagamento PIX */}
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(false);
          setTimeout(() => {
            setStep('select-plan');
            setSuccess(false);
          }, 300);
        }
      }}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              {success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Pagamento Confirmado!
                </>
              ) : step === 'select-plan' ? (
                <>
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Escolha seu Plano
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5 text-purple-500" />
                  Pagamento via PIX
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {success ? (
            // Tela de sucesso
            <div className="py-4 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-center mb-2 font-medium">
                Seu pagamento foi processado com sucesso!
              </p>
              <div className="bg-gray-700 p-3 rounded-md mb-3 text-center">
                <p className="text-sm">
                  <span className="font-medium">Plano contratado:</span> {plans[selectedPlan].label}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Valor total: R$ {plans[selectedPlan].totalPrice.toFixed(2)}
                </p>
              </div>
              
              <Button 
                className="w-full max-w-xs mt-2" 
                onClick={handleFinish}
              >
                Continuar para o Dashboard
              </Button>
            </div>
          ) : step === 'select-plan' ? (
            // Seleção de plano
            <div className="flex flex-col items-center py-2">
              <p className="text-sm text-center mb-4">
                Escolha a duração da sua assinatura:
              </p>
              
              <RadioGroup 
                className="w-full mb-4" 
                defaultValue={selectedPlan}
                onValueChange={setSelectedPlan}
              >
                {Object.entries(plans).map(([key, plan]) => (
                  <div key={key} className="flex items-center space-x-2 border p-3 rounded-md mb-2 hover:bg-gray-700 cursor-pointer">
                    <RadioGroupItem value={key} id={`plan-${key}`} />
                    <Label 
                      htmlFor={`plan-${key}`}
                      className="flex-1 flex justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        {plan.label}
                      </div>
                      <div className="text-right">
                        {plan.months === 1 ? (
                          <p className="font-medium">R$ {plan.totalPrice.toFixed(2)}</p>
                        ) : (
                          <>
                            <p className="font-medium">R$ {plan.totalPrice.toFixed(2)}</p>
                            <p className="text-xs text-green-600">
                              {plan.discount * 100}% de desconto
                            </p>
                          </>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                className="w-full" 
                onClick={generatePixQrCode}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Gerando PIX...
                  </>
                ) : (
                  <>
                    Gerar QR Code PIX
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            // Tela de pagamento PIX
            <div className="flex flex-col items-center py-2">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-md mb-4 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-800">
                  {plans[selectedPlan].label} - Total: R$ {plans[selectedPlan].totalPrice.toFixed(2)}
                </p>
                {plans[selectedPlan].months > 1 && (
                  <p className="text-xs text-green-600 font-medium">
                    Economia de {plans[selectedPlan].discount * 100}% aplicada
                  </p>
                )}
              </div>
              
              {loading ? (
                // Estado de carregamento
                <div className="w-36 h-36 bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                // QR Code
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
                  <QrCode className="w-20 h-20 text-gray-400" />
                </div>
              )}
              
              <p className="text-sm text-center mb-3">
                Escaneie o QR Code acima com o aplicativo do seu banco ou copie a chave PIX abaixo:
              </p>
              
              <Button 
                variant="outline" 
                className="w-full max-w-xs mb-1 flex justify-center items-center gap-2"
                onClick={handleCopyPix}
                disabled={loading}
              >
                {pixCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    Copiar Chave PIX
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-1 mb-4">
                O pagamento será confirmado automaticamente em instantes
              </p>
              
              <div className="w-full flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1 flex justify-center items-center gap-1" 
                  onClick={() => setStep('select-plan')}
                >
                  <RotateCcw className="w-3 h-3" />
                  Voltar
                </Button>
                
                <Button 
                  className="flex-1" 
                  onClick={checkPaymentStatus}
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Verificar Pagamento"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Informações do plano e segurança - mostradas apenas nas telas de seleção e PIX */}
          {!success && (
            <div className="mb-2 mt-3">
              <div className="rounded-md bg-gray-50 p-2 flex gap-2 items-center mb-3">
                <LockKeyhole className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Pagamento 100% seguro.</span> Processado via Asaas.
                </p>
              </div>
              
              {step === 'select-plan' && (
                <div className="text-center">
                  <h4 className="text-xs font-medium mb-1">Plano Premium Inclui:</h4>
                  <ul className="text-xs text-gray-500 space-y-0.5">
                    <li className="flex items-center justify-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                      Acesso ilimitado às técnicas e vídeos
                    </li>
                    <li className="flex items-center justify-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                      Plano de treino personalizado
                    </li>
                    <li className="flex items-center justify-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                      Assistente IA para dúvidas
                    </li>
                    <li className="flex items-center justify-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                      Métricas avançadas de progresso
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {!success && step === 'select-plan' && (
            <DialogFooter className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full mt-0"
                size="sm"
              >
                Cancelar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      {/* Modal de pagamento PIX */}
    </>
  );
};

export default Assinatura;
