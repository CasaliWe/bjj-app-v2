import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNav } from '@/components/MobileNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Timer, Play, Plus, Trash2, Save, Clock, RotateCcw } from 'lucide-react';
import { setPageTitle } from '@/services/title';

// Hook personalizado
import { useTreinosCronometrados } from '@/hooks/use-treinos-cronometrados';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetUser } from "@/hooks/use-getUser";

// Wake Lock para manter tela ativa durante cronômetros
import wakeLockManager from '@/lib/wake-lock';

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Componente de execução do treino
import ExecucaoTreino from '@/components/treinosCronometrados/ExecucaoTreino';

/**
 * Página de Treinos Cronometrados
 * Permite criar treinos por tempo ou repetições com cronômetro
 */
const TreinosCronometrados = () => {
  const isMobile = useIsMobile();
  const { fetchUserData } = useGetUser();
  
  // Hook principal
  const {
    treinoAtual,
    treinosSalvos,
    executandoTreino,
    formulario,
    atualizarFormulario,
    adicionarTecnica,
    removerTecnica,
    salvarTreino,
    excluirTreino,
    carregarTreinoParaExecucao,
    obterDescricaoTecnica,
    formatarTempo,
    // novos (já existiam no hook, mas agora precisamos aqui para passar como props)
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
    pausarRetomar
  } = useTreinosCronometrados();

  // Estados locais
  const [modalSalvar, setModalSalvar] = useState(false);
  const [nomeTreino, setNomeTreino] = useState('');
  const [modalExcluir, setModalExcluir] = useState(null);

  // Definir título da página
  useEffect(() => {
    setPageTitle('Treinos Cronometrados');
    fetchUserData();
  }, []);

  // Controlar Wake Lock baseado no estado do cronômetro
  useEffect(() => {
    const gerenciarWakeLock = async () => {
      // Ativar wake lock quando cronômetro estiver ativo durante execução ou descanso
      if (cronometroAtivo && (faseAtual === 'execucao' || faseAtual === 'descanso')) {
        await wakeLockManager.ativar();
      } else {
        // Desativar wake lock quando cronômetro parar ou não estiver em fase ativa
        await wakeLockManager.desativar();
      }
    };

    gerenciarWakeLock();
  }, [cronometroAtivo, faseAtual]);

  // Limpar wake lock quando componente for desmontado
  useEffect(() => {
    return () => {
      wakeLockManager.desativar();
    };
  }, []);

  // Manipuladores de eventos
  const handleAdicionarTecnica = () => {
    const resultado = adicionarTecnica();
    if (!resultado.sucesso) {
      alert(resultado.erro);
    }
  };

  const handleSalvarTreino = () => {
    if (treinoAtual.tecnicas.length === 0) {
      alert('Adicione pelo menos uma técnica antes de salvar');
      return;
    }
    setModalSalvar(true);
  };

  const confirmarSalvarTreino = () => {
    const resultado = salvarTreino(nomeTreino);
    if (resultado.sucesso) {
      setModalSalvar(false);
      setNomeTreino('');
    } else {
      alert(resultado.erro);
    }
  };

  const confirmarExcluirTreino = () => {
    if (modalExcluir) {
      excluirTreino(modalExcluir.id);
      setModalExcluir(null);
    }
  };

  // Se está executando um treino, mostra a tela de execução
  if (executandoTreino) {
    return (
      <ExecucaoTreino
        executandoTreino={executandoTreino}
        tecnicaAtualIndex={tecnicaAtualIndex}
        tempoRestante={tempoRestante}
        faseAtual={faseAtual}
        repeticoesFeitas={repeticoesFeitas}
        cronometroAtivo={cronometroAtivo}
        iniciarTecnicaAtual={iniciarTecnicaAtual}
        concluirRepeticoes={concluirRepeticoes}
        proximaTecnica={proximaTecnica}
        tecnicaAnterior={tecnicaAnterior}
        finalizarTreino={finalizarTreino}
        pausarRetomar={pausarRetomar}
        formatarTempo={formatarTempo}
        obterDescricaoTecnica={obterDescricaoTecnica}
      />
    );
  }

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
                  <h1 className="text-xl font-semibold">Treinos Cronometrados</h1>
                </div>
              </div>
              {isMobile && <MobileNav />}
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-auto p-4 ${isMobile ? 'pb-24' : ''}`}>
              <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Formulário para adicionar técnica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Adicionar Técnica
                    </CardTitle>
                    <CardDescription>
                      Configure uma técnica para seu treino cronometrado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Nome da técnica */}
                    <div>
                      <Label htmlFor="nomeTecnica">Nome da Técnica</Label>
                      <Input
                        id="nomeTecnica"
                        value={formulario.nomeTecnica}
                        onChange={(e) => atualizarFormulario('nomeTecnica', e.target.value)}
                        placeholder="Ex: Passagem de guarda"
                        className="mt-1"
                      />
                    </div>

                    {/* Modo fixo apenas por tempo */}
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Modo:</strong> Por Tempo
                    </div>

                    {/* Configurações de tempo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tempoExecucao">Tempo de Execução (segundos)</Label>
                        <Input
                          id="tempoExecucao"
                          type="number"
                          min="1"
                          value={formulario.tempoExecucao}
                          onChange={(e) => atualizarFormulario('tempoExecucao', parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tempoDescanso">Tempo de Descanso (segundos)</Label>
                        <Input
                          id="tempoDescanso"
                          type="number"
                          min="0"
                          value={formulario.tempoDescanso}
                          onChange={(e) => atualizarFormulario('tempoDescanso', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button onClick={handleAdicionarTecnica} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Técnica
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de técnicas do treino atual */}
                {treinoAtual.tecnicas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Treino Atual ({treinoAtual.tecnicas.length} técnicas)
                        </span>
                        <div className="hidden md:flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleSalvarTreino}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button 
                            onClick={() => carregarTreinoParaExecucao(treinoAtual)}
                            size="sm"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {treinoAtual.tecnicas.map((tecnica, index) => (
                          <div 
                            key={tecnica.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium">{tecnica.nome}</p>
                                <p className="text-sm text-muted-foreground">
                                  {obterDescricaoTecnica(tecnica)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerTecnica(tecnica.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {/* Botões (mobile) ao final do card */}
                      <div className="mt-4 flex md:hidden gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleSalvarTreino}
                        >
                          <Save className="h-4 w-4 mr-2" /> Salvar
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => carregarTreinoParaExecucao(treinoAtual)}
                        >
                          <Play className="h-4 w-4 mr-2" /> Iniciar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Treinos salvos */}
                {treinosSalvos.length > 0 && (
                  <Card className={isMobile ? 'mb-8' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Treinos Salvos ({treinosSalvos.length})
                      </CardTitle>
                      <CardDescription>
                        Seus treinos cronometrados salvos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {treinosSalvos.map((treino) => {
                          // removido cálculo de tempo total (não exibido por enquanto)
                          const totalTempo = 0;
                          const totalReps = treino.tecnicas
                            .filter(t => t.modo === 'repeticoes')
                            .reduce((acc, t) => acc + (t.numeroRepeticoes || 0), 0);
                          return (
                            <div
                              key={treino.id}
                              className="group rounded-xl border bg-muted/40 hover:bg-muted/60 transition-colors p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                            >
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-medium text-base">{treino.nome}</h4>
                                  <span className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                    {treino.tecnicas.length} técnica{treino.tecnicas.length !== 1 && 's'}
                                  </span>
                                  {/* tempo total oculto */}
                                  {totalReps > 0 && (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-medium">
                                      {totalReps} reps
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  Criado em {new Date(treino.dataCriacao).toLocaleDateString('pt-BR')}
                                </p>
                                <div className="flex gap-2 flex-wrap text-[11px] text-muted-foreground/80">
                                  {treino.tecnicas.slice(0,4).map(t => (
                                    <span key={t.id} className="px-2 py-0.5 rounded bg-background border text-[11px]">
                                      {t.nome.length > 18 ? t.nome.slice(0,18)+'…' : t.nome}
                                    </span>
                                  ))}
                                  {treino.tecnicas.length > 4 && (
                                    <span className="px-2 py-0.5 rounded bg-background border text-[11px]">+{treino.tecnicas.length - 4}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-start md:self-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3"
                                  onClick={() => carregarTreinoParaExecucao(treino)}
                                >
                                  <Play className="h-3.5 w-3.5 mr-1" />
                                  Executar
                                </Button>
                                {/* Só mostrar botão deletar para treinos customizados */}
                                {!treino.padrao && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => setModalExcluir(treino)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mensagem quando não há treinos salvos */}
                {treinosSalvos.length === 0 && treinoAtual.tecnicas.length === 0 && (
                  <Card className={isMobile ? 'mb-8' : ''}>
                    <CardContent className="py-8 text-center">
                      <Timer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        Nenhum treino criado ainda
                      </h3>
                      <p className="text-muted-foreground">
                        Comece adicionando técnicas ao seu primeiro treino cronometrado
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para salvar treino */}
      <AlertDialog open={modalSalvar} onOpenChange={setModalSalvar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Salvar Treino</AlertDialogTitle>
            <AlertDialogDescription>
              Digite um nome para salvar este treino:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={nomeTreino}
              onChange={(e) => setNomeTreino(e.target.value)}
              placeholder="Nome do treino"
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarSalvarTreino}>
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal para excluir treino */}
      <AlertDialog open={!!modalExcluir} onOpenChange={() => setModalExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Treino</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o treino "{modalExcluir?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExcluirTreino} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Removida barra fixa mobile; ações movidas para dentro do card */}

      <UpgradeModal />
    </SidebarProvider>
  );
};

export default TreinosCronometrados;