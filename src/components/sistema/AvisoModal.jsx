import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Card } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { ScrollArea } from '../ui/scroll-area';

/**
 * Componente AvisoModal
 * 
 * Este componente exibe avisos importantes para os usuários.
 * O aviso só pode ser fechado clicando no botão de confirmação.
 * 
 * Fluxo de funcionamento:
 * 1. Ao carregar, verifica se há avisos ativos para o usuário atual
 * 2. Se houver, exibe o modal com o conteúdo do aviso
 * 3. Quando o usuário confirmar, marca o aviso como lido
 */
const AvisoModal = () => {
  // Estados do componente
  const [open, setOpen] = useState(false);
  const [aviso, setAviso] = useState({});
  const [carregando, setCarregando] = useState(true);

  // Contexto do usuário para obter o ID
  const { user } = useUser();

  // Função para buscar avisos da API **********************************************
  const buscarAviso = async () => {
    setCarregando(true);
    try {
      // TODO: Implementar chamada real para API
      // const response = await fetch(`/api/avisos/usuario/${user?.id}`);
      // const data = await response.json();
      
      // MOCK: Dados simulados para desenvolvimento
      const mockData = {
        id: 1,
        titulo: 'Atualização do Sistema',
        descricao: 'Informamos que haverá uma atualização programada no sistema no dia 10/09/2025. Durante este período, algumas funcionalidades podem ficar indisponíveis. Agradecemos sua compreensão.',
        imagens: [
          'user.jpeg',
          'logo-x.png',
          'logo-y.png',
        ],
        ativo: false // Altere para true para exibir o modal
      };
      
      setAviso(mockData);
      setOpen(mockData.ativo);
    } catch (error) {
      console.error('Erro ao buscar avisos:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Função para marcar aviso como lido ****************************************
  const marcarComoLido = async () => {
    try {
      // TODO: Implementar chamada real para API
      // await fetch(`/api/avisos/confirmar/${aviso.id}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     usuarioId: user?.id 
      //   }),
      // });
      
      console.log('Aviso marcado como lido:', aviso.id);
      setOpen(false);
    } catch (error) {
      console.error('Erro ao confirmar leitura do aviso:', error);
    }
  };

  // Efeito para carregar avisos ao montar o componente
  useEffect(() => {
    if (user) {
      buscarAviso();
    }
  }, [user]);

  // Não renderiza nada se não houver aviso ativo
  if (!aviso.ativo && !carregando) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {/* Previne fechamento pelo X ou Escape */}}
      className="relative"
    >
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 gap-0 overflow-hidden w-[calc(100%-24px)] sm:w-auto mx-auto">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{aviso.titulo}</DialogTitle>
              <DialogDescription className="mt-2 text-base">{aviso.descricao}</DialogDescription>
            </DialogHeader>
            
            {/* Suporta tanto o formato antigo (imagem) quanto o novo (imagens) */}
            {(aviso.imagens && aviso.imagens.length > 0) || aviso.imagem ? (
              <div className="my-4">
                <Carousel className="w-full px-1" opts={{ loop: true }}>
                  <CarouselContent>
                    {aviso.imagens && aviso.imagens.length > 0 ? (
                      aviso.imagens.map((imagem, index) => (
                        <CarouselItem key={index}>
                          <Card className="overflow-hidden">
                            <img 
                              src={imagem} 
                              alt={`Ilustração ${index + 1} do aviso`} 
                              className="w-full h-auto object-cover"
                            />
                          </Card>
                        </CarouselItem>
                      ))
                    ) : (
                      <CarouselItem>
                        <Card className="overflow-hidden">
                          <img 
                            src={aviso.imagem} 
                            alt="Ilustração do aviso" 
                            className="w-full h-auto object-cover"
                          />
                        </Card>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  
                  {(aviso.imagens && aviso.imagens.length > 1) && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              </div>
            ) : null}
            
            <DialogFooter className="mt-6 px-1">
              <Button 
                onClick={marcarComoLido} 
                className="w-full"
              >
                Entendi e Confirmo
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AvisoModal;
