import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Check, 
  Timer, 
  RotateCcw,
  Clock
} from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNav } from '@/components/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
// Este componente agora recebe todos os estados e ações via props para evitar
// recriar estado independente do hook principal.
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

/**
 * Componente para execução do treino cronometrado
 * Gerencia cronômetros, repetições e navegação entre técnicas
 */
const ExecucaoTreino = ({
  executandoTreino,
  tecnicaAtualIndex,
  tempoRestante,
  faseAtual,
  repeticoesFeitas,
  cronometroAtivo,
  iniciarTecnicaAtual,
  concluirRepeticoes,
  proximaTecnica,
  tecnicaAnterior,
  finalizarTreino,
  pausarRetomar,
  formatarTempo,
  obterDescricaoTecnica
}) => {
  const isMobile = useIsMobile();
  const [modalSair, setModalSair] = useState(false);

  if (!executandoTreino) return null;

  const tecnicaAtual = executandoTreino.tecnicas[tecnicaAtualIndex];
  const isUltimaTecnica = tecnicaAtualIndex === executandoTreino.tecnicas.length - 1;
  const isPrimeiraTecnica = tecnicaAtualIndex === 0;

  const confirmarSair = () => {
    finalizarTreino();
  };

  const renderBotoesPrincipais = () => {
    if (!tecnicaAtual) return null;

    if (tecnicaAtual.modo === 'tempo') {
      if (faseAtual === 'parado') {
        return (
          <Button 
            onClick={iniciarTecnicaAtual} 
            size="lg" 
            className="w-full text-lg py-6"
          >
            <Play className="h-6 w-6 mr-3" />
            Iniciar Técnica
          </Button>
        );
      }

      return (
        <div className="space-y-3">
          <Button 
            onClick={pausarRetomar} 
            variant={cronometroAtivo ? "secondary" : "default"}
            size="lg" 
            className="w-full text-lg py-6"
          >
            {cronometroAtivo ? (
              <>
                <Pause className="h-6 w-6 mr-3" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-6 w-6 mr-3" />
                Retomar
              </>
            )}
          </Button>

          {faseAtual === 'execucao' && tempoRestante <= 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Tempo esgotado! {tecnicaAtual.tempoDescanso > 0 ? 'Iniciando descanso...' : 'Prossiga para próxima técnica'}
            </p>
          )}

          {faseAtual === 'descanso' && tempoRestante <= 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Descanso terminado! Prossiga para próxima técnica
            </p>
          )}
        </div>
      );
    } else {
      // Modo repetições
      if (faseAtual === 'parado') {
        return (
          <Button 
            onClick={iniciarTecnicaAtual} 
            size="lg" 
            className="w-full text-lg py-6"
          >
            <Play className="h-6 w-6 mr-3" />
            Iniciar Técnica
          </Button>
        );
      }

      return (
        <Button 
          onClick={concluirRepeticoes} 
          size="lg" 
          className="w-full text-lg py-6"
          variant="secondary"
        >
          <Check className="h-6 w-6 mr-3" />
          Concluir Repetições
        </Button>
      );
    }
  };

  const renderStatusAtual = () => {
    if (!tecnicaAtual) return null;

    if (tecnicaAtual.modo === 'tempo') {
      const getFaseTexto = () => {
        switch (faseAtual) {
          case 'execucao':
            return 'Executando';
          case 'descanso':
            return 'Descansando';
          default:
            return 'Pronto para iniciar';
        }
      };

      const getFaseCor = () => {
        switch (faseAtual) {
          case 'execucao':
            return 'text-green-600 bg-green-50';
          case 'descanso':
            return 'text-blue-600 bg-blue-50';
          default:
            return 'text-muted-foreground bg-muted';
        }
      };

      return (
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFaseCor()}`}>
            {getFaseTexto()}
          </div>
          
          {(faseAtual === 'execucao' || faseAtual === 'descanso') && (
            <div className="space-y-2">
              <div className="text-6xl font-mono font-bold text-center">
                {formatarTempo(tempoRestante)}
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {faseAtual === 'execucao' ? 'Tempo restante' : 'Tempo de descanso'}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-center space-y-4">
          <div className="text-6xl font-mono font-bold">
            {repeticoesFeitas}
          </div>
          <div className="text-lg text-muted-foreground">
            de {tecnicaAtual.numeroRepeticoes} repetições
          </div>
          {faseAtual === 'execucao' && (
            <p className="text-sm text-muted-foreground">
              Execute as repetições e clique em "Concluir" quando terminar
            </p>
          )}
        </div>
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b px-4 py-3 flex items-center justify-between bg-background">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">Executando Treino</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setModalSair(true)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Sair
                </Button>
                {isMobile && <MobileNav />}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-auto p-4 ${isMobile ? 'pb-32' : ''}`}> 
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Informações do treino */}
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{executandoTreino.nome}</CardTitle>
                    <CardDescription>
                      Técnica {tecnicaAtualIndex + 1} de {executandoTreino.tecnicas.length}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Técnica atual */}
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-primary mb-2">
                      {tecnicaAtual?.nome}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {tecnicaAtual && obterDescricaoTecnica(tecnicaAtual)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-8">
                    {renderStatusAtual()}
                  </CardContent>
                </Card>

                {/* Controles principais */}
                <Card className={isMobile ? 'md:hidden' : ''}>
                  <CardContent className="py-6">
                    {renderBotoesPrincipais()}
                  </CardContent>
                </Card>

                {/* Navegação */}
                <Card>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button
                          variant="outline"
                          onClick={tecnicaAnterior}
                          disabled={isPrimeiraTecnica}
                          className="flex-1 md:flex-none flex items-center gap-2"
                        >
                          <SkipBack className="h-4 w-4" />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          onClick={proximaTecnica}
                          className="flex-1 md:flex-none flex items-center gap-2"
                        >
                          {isUltimaTecnica ? 'Finalizar' : 'Próxima'}
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-center flex-1 md:flex-none">
                        <div className="text-sm text-muted-foreground">Progresso</div>
                        <div className="text-lg font-medium">
                          {tecnicaAtualIndex + 1} / {executandoTreino.tecnicas.length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de técnicas (progresso) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sequência do Treino</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {executandoTreino.tecnicas.map((tecnica, index) => (
                        <div 
                          key={tecnica.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            index === tecnicaAtualIndex 
                              ? 'bg-primary text-primary-foreground' 
                              : index < tecnicaAtualIndex 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-muted'
                          }`}
                        >
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            index === tecnicaAtualIndex 
                              ? 'bg-primary-foreground text-primary' 
                              : index < tecnicaAtualIndex 
                                ? 'bg-green-600 text-white' 
                                : 'bg-muted-foreground text-white'
                          }`}>
                            {index < tecnicaAtualIndex ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{tecnica.nome}</p>
                            <p className={`text-sm ${
                              index === tecnicaAtualIndex 
                                ? 'text-primary-foreground/80' 
                                : 'text-muted-foreground'
                            }`}>
                              {obterDescricaoTecnica(tecnica)}
                            </p>
                          </div>
                          {index === tecnicaAtualIndex && (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Barra fixa inferior removida conforme solicitação */}

      {/* Modal para sair do treino */}
      <AlertDialog open={modalSair} onOpenChange={setModalSair}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair do Treino</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair da execução do treino? O progresso atual será perdido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar Treino</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarSair} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sair do Treino
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default ExecucaoTreino;