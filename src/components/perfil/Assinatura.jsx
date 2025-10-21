import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { QrCode, CheckCircle, LockKeyhole, Calendar, ArrowRight, RotateCcw, User, Gift, AlertCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

import { getAuthToken } from '@/services/cookies/cookies';



const Assinatura = () => {
  // Obter dados do usuário do contexto global
  const { user } = useUser();
  
  // Estados do componente
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [step, setStep] = useState('cpf-input'); // 'cpf-input', 'select-plan', 'show-pix', 'success'
  const [selectedPlan, setSelectedPlan] = useState('1');
  const [pixDadosApi, setPixDadosApi] = useState(null);
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [plans, setPlans] = useState({});
  const [pixError, setPixError] = useState('');

  // Estados para o modal de código promocional
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // useEffect para buscar os dados dos planos da API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/sistema/buscar-planos.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
          }
        });
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          // Converte o array de planos da API em um objeto indexado pelo ID
          const plansObj = {};
          result.data.forEach(plan => {
            plansObj[plan.id] = {
              months: plan.months,
              basePrice: parseFloat(plan.basePrice),
              discount: plan.discount,
              totalPrice: parseFloat(plan.totalPrice),
              label: plan.label
            };
          });
          setPlans(plansObj);
          // Define o plano padrão como o primeiro da lista
          if (result.data.length > 0) {
            setSelectedPlan(result.data[0].id.toString());
          }
        } else {
          console.error("Erro ao buscar planos ou nenhum plano disponível");
          // Define planos padrão caso a API falhe
          setPlans({
            '1': {
              months: 1,
              basePrice: 32.90,
              discount: 0,
              totalPrice: 32.90,
              label: '1 mês'
            }
          });
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        // Define planos padrão caso a API falhe
        setPlans({
          '1': {
            months: 1,
            basePrice: 32.90,
            discount: 0,
            totalPrice: 32.90,
            label: '1 mês'
          }
        });
      }
    };
    
    fetchPlans();
  }, []);

  // buscando qrcode **********************************************
  const generatePixQrCode = async () => {
    if (!plans[selectedPlan]) return;
    
    setLoading(true);

    // monta os dados para enviar para a API
    const apiData = {
      cpf: cpf.replace(/\D/g, ''),
      valor: plans[selectedPlan].totalPrice,
      meses: plans[selectedPlan].months,
      plano_id: selectedPlan // Adicionando o ID do plano selecionado
    };

    // fazendo a chamada para a API
    try {
      setPixError(''); // Limpa erros anteriores
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/asaas/gerar-pix.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(apiData)
      });
      const data = await response.json();
      if(data.success){
          // salva oq a api retornou
          setPixDadosApi({
            key: data.pixCode,
            qrcode: data.qrcode,
            id_processo: data.pix_id
         });
          setStep('show-pix');
          setLoading(false);
      }else{
        console.error("Erro na resposta da API:", data.message);
        setPixError(data.message || "Erro ao gerar PIX. Tente novamente.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro na requisição da API:", error);
      setPixError("Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.");
      setLoading(false);
    }
  };


  // verificando pagamento *****************************************
  const checkPaymentStatus = async () => {
    setLoading(true);

    // fazendo a chamada para a API
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/asaas/verificar-pagamento.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ id: pixDadosApi.id_processo })
      });
      const data = await response.json();
      if(data.success){
          if(data.pagamento){
            setLoading(false);
            setSuccess(true);
          }else{
            alert("Pagamento ainda não confirmado. Por favor, aguarde alguns instantes e tente novamente.");
            setLoading(false);
          }
      }else{
        console.error("Erro na resposta da API:", data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro na requisição da API:", error);
      setLoading(false);
    }
  };
  

  // Função para aplicar a máscara do CPF
  const handleCpfChange = (e) => {
    let value = e.target.value;
    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');
    
    // Aplica a máscara xxx.xxx.xxx-xx
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d)/g, '$1.$2');
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/g, '.$1-$2');
    }
    
    setCpf(value);
    // Limpa o erro quando o usuário digita
    if (cpfError) setCpfError('');
  };
  
  // Função para verificar se o CPF tem o formato correto
  const validateCpf = () => {
    // Verifica se há 11 dígitos numéricos
    const cpfNumeros = cpf.replace(/\D/g, '');
    
    if (cpfNumeros.length !== 11) {
      setCpfError('CPF deve conter 11 dígitos');
      return false;
    }
    
    // Validação básica apenas para garantir que o formato está correto
    return true;
  };
  
  // Função para prosseguir para a seleção de plano após validar o CPF
  const handleCpfSubmit = () => {
    const isValid = validateCpf();
    if (isValid) {
      setStep('select-plan');
    }
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
      setStep('cpf-input');
      setSuccess(false);
      setSelectedPlan('1');
      setCpf('');
      setCpfError('');
    }, 300);
  };

  // Função para resgatar código promocional
  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) {
      setPromoError('Por favor, insira um código promocional');
      return;
    }

    setPromoLoading(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/asaas/codigo-promocional.php?codigo=${encodeURIComponent(promoCode.trim())}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPromoSuccess(data.message || 'Código promocional ativado com sucesso!');
        // Aguarda um pouco para mostrar a mensagem de sucesso antes de fechar
        setTimeout(() => {
          setPromoModalOpen(false);
          setPromoCode('');
          setPromoError('');
          setPromoSuccess('');
          // Redireciona para atualizar as informações do usuário
          window.location.href = "/app";
        }, 2000);
      } else {
        setPromoError(data.message || 'Código promocional não existe ou já foi utilizado');
      }
    } catch (error) {
      console.error("Erro ao resgatar código promocional:", error);
      setPromoError('Erro ao processar código promocional. Tente novamente.');
    } finally {
      setPromoLoading(false);
    }
  };

  // Reset do modal de código promocional
  const resetPromoModal = () => {
    setPromoCode('');
    setPromoError('');
    setPromoSuccess('');
    setPromoLoading(false);
  };

  return (
    <>
      {/* Botão principal que abre o modal */}
      <div className="w-full flex flex-col gap-3">
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
                  setStep('cpf-input');
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
                setStep('cpf-input');
              }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <QrCode className="w-4 h-4" />
              Assinar via PIX
            </Button>
          )}
        </div>
        
        {/* Botão de código promocional */}
        <div className="w-full flex justify-center">
          <Button 
            onClick={() => {
              resetPromoModal();
              setPromoModalOpen(true);
            }}
            variant="outline"
            className="flex items-center gap-2 border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10 hover:border-bjj-gold/50"
          >
            <Gift className="w-4 h-4" />
            Resgatar código promocional
          </Button>
        </div>
      </div>
      {/* Botão principal que abre o modal */}
      
      {/* Modal de código promocional */}
      <Dialog open={promoModalOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setPromoModalOpen(false);
          resetPromoModal();
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-bjj-gold" />
              Código Promocional
            </DialogTitle>
          </DialogHeader>
          
          {promoSuccess ? (
            // Tela de sucesso
            <div className="py-4 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-center mb-2 font-medium text-green-600">
                {promoSuccess}
              </p>
              <p className="text-xs text-center text-muted-foreground">
                Redirecionando...
              </p>
            </div>
          ) : (
            // Formulário de código promocional
            <div className="py-2">
              <div className="mb-4">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Insira abaixo seu código promocional para receber tempo adicional de acesso ao app gratuitamente.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="promoCode" className="text-sm font-medium">
                    Código promocional
                  </Label>
                  <Input
                    id="promoCode"
                    type="text"
                    placeholder="Insira aqui..."
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (promoError) setPromoError('');
                    }}
                    className={`w-full ${promoError ? 'border-red-500' : ''}`}
                    disabled={promoLoading}
                  />
                  {promoError && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {promoError}
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handlePromoCodeSubmit}
                className="w-full bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                disabled={promoLoading || !promoCode.trim()}
              >
                {promoLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Ativando...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Ativar
                  </>
                )}
              </Button>
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPromoModalOpen(false)}
                  className="w-full"
                  disabled={promoLoading}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Modal de código promocional */}
      
      {/* Modal de pagamento PIX */}
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(false);
          setTimeout(() => {
            setStep('cpf-input');
            setSuccess(false);
            setCpf('');
            setCpfError('');
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
              ) : step === 'cpf-input' ? (
                <>
                  <User className="w-5 h-5 text-purple-500" />
                  Identificação do Cliente
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
                  <span className="font-medium">Plano contratado:</span> {plans[selectedPlan]?.label}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Valor total: R$ {plans[selectedPlan]?.totalPrice.toFixed(2).replace('.', ',')}
                </p>
              </div>
              
              <Button 
                className="w-full max-w-xs mt-2" 
                onClick={handleFinish}
              >
                Continuar para o Dashboard
              </Button>
            </div>
          ) : step === 'cpf-input' ? (
            // Tela de entrada de CPF
            <div className="flex flex-col items-center py-2">
              <p className="text-sm text-center mb-4">
                Informe seu CPF para prosseguir com a assinatura:
              </p>
              
              <div className="w-full mb-4">
                <Label htmlFor="cpf" className="text-sm mb-1 block">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                  className={`w-full ${cpfError ? 'border-red-500' : ''}`}
                />
                {cpfError && (
                  <p className="text-xs text-red-500 mt-1">{cpfError}</p>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCpfSubmit}
                disabled={cpf.replace(/\D/g, '').length !== 11}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
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
                {Object.keys(plans).length > 0 && Object.entries(plans).map(([key, plan]) => (
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
                          <p className="font-medium">R$ {plan.totalPrice.toFixed(2).replace('.', ',')}</p>
                        ) : (
                          <>
                            <p className="font-medium">R$ {plan.totalPrice.toFixed(2).replace('.', ',')}</p>
                            {Number(plan.discount) > 0 && (
                              <p className="text-xs text-green-600">
                                {(() => {
                                  const n = Number(plan.discount);
                                  if (Number.isNaN(n) || n <= 0) return '0';
                                  // Se vier como fração (0.1), multiplica por 100; se vier inteiro (10), mantém
                                  return (n <= 1 ? n * 100 : n).toFixed(0);
                                })()}% de desconto
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {/* Mensagem de erro */}
              {pixError && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 px-3 py-2 rounded-md text-sm mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {pixError}
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={() => {
                  setPixError(''); // Limpa erro ao tentar novamente
                  generatePixQrCode();
                }}
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
                  {plans[selectedPlan]?.label} - Total: R$ {plans[selectedPlan]?.totalPrice.toFixed(2).replace('.', ',')}
                </p>
                {Number(plans[selectedPlan]?.discount) > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    {(() => {
                      const d = Number(plans[selectedPlan]?.discount);
                      if (Number.isNaN(d) || d <= 0) return null;
                      const percent = (d <= 1 ? d * 100 : d).toFixed(0);
                      return `Economia de ${percent}% aplicada`;
                    })()}
                  </p>
                )}
              </div>
              
              {loading ? (
                // Estado de carregamento
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                // QR Code
                <div className="w-48 h-48 bg-white flex items-center justify-center mb-4 rounded-lg border border-gray-200 overflow-hidden">
                  {pixDadosApi && pixDadosApi.qrcode ? (
                    <img 
                      src={`data:image/png;base64,${pixDadosApi.qrcode}`}
                      alt="QR Code PIX" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-20 h-20 text-gray-400" />
                  )}
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
          
          {!success && step === 'cpf-input' && (
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
          
          {!success && step === 'select-plan' && (
            <DialogFooter className="pt-2">
              <div className="w-full flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('cpf-input')}
                  className="flex-1"
                  size="sm"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Voltar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      {/* Modal de pagamento PIX */}
    </>
  );
};

export default Assinatura;
