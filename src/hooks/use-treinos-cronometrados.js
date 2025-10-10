import { useState, useEffect } from 'react';
import { useRef } from 'react';

/**
 * Hook personalizado para gerenciar treinos cronometrados
 * Funciona com LocalStorage para persistência local
 */
export const useTreinosCronometrados = () => {
  // Estados principais
  const [treinoAtual, setTreinoAtual] = useState({
    nome: '',
    tecnicas: []
  });
  const [treinosSalvos, setTreinosSalvos] = useState([]);
  const [executandoTreino, setExecutandoTreino] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Estados do formulário
  const [formulario, setFormulario] = useState({
    nomeTecnica: '',
    modo: 'tempo', // Fixo apenas por tempo
    tempoExecucao: 60, // em segundos
    tempoDescanso: 30 // em segundos
  });

  // Estados de execução
  const [tecnicaAtualIndex, setTecnicaAtualIndex] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [faseAtual, setFaseAtual] = useState('parado'); // 'execucao', 'descanso', 'parado'
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  // Refs de áudio
  const audioGongoRef = useRef(null);
  const audioRegressivoRef = useRef(null);
  const audioFinalRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  // Inicializar objetos de áudio uma vez após mount
  useEffect(() => {
    try {
      audioGongoRef.current = new Audio('/gongo.m4a');
      audioRegressivoRef.current = new Audio('/regressivo.m4a');
      audioFinalRef.current = new Audio('/final.m4a');
      [audioGongoRef, audioRegressivoRef, audioFinalRef].forEach(ref => {
        if (ref.current) {
          ref.current.preload = 'auto';
          ref.current.volume = 1;
          // Configurar para PWA/Mobile
          ref.current.muted = false;
          ref.current.setAttribute('playsinline', '');
        }
      });
    } catch (e) {
      console.warn('Falha ao inicializar áudios de treino:', e);
    }
  }, []);

  // Função universal para desbloquear áudio (funciona em todos os dispositivos)
  const unlockAudio = async () => {
    if (audioUnlockedRef.current) return;
    
    try {
      // Criar AudioContext se necessário (iOS/Safari exigem)
      let audioContext;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioContext = new AudioContextClass();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }
        }
      } catch (contextError) {
        console.warn('AudioContext não disponível:', contextError);
      }

      // Desbloquear cada áudio individualmente
      const audios = [audioGongoRef, audioRegressivoRef, audioFinalRef];
      const unlockPromises = audios.map(async (ref) => {
        if (!ref.current) return;
        
        try {
          const audio = ref.current;
          
          // Configurações para máxima compatibilidade
          audio.muted = false;
          audio.volume = 0.01; // Volume mínimo ao invés de 0
          audio.currentTime = 0;
          
          // Reproduzir por tempo mínimo necessário
          const playPromise = audio.play();
          if (playPromise) {
            await playPromise;
            // Aguardar um frame para garantir que o áudio "registrou"
            await new Promise(resolve => setTimeout(resolve, 50));
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1; // Restaurar volume
          }
        } catch (audioError) {
          console.warn('Falha ao desbloquear áudio específico:', audioError);
        }
      });

      await Promise.allSettled(unlockPromises);
      audioUnlockedRef.current = true;
      
      console.log('✅ Sistema de áudio desbloqueado universalmente');
      
      // Cleanup do AudioContext se criado
      if (audioContext && audioContext.close) {
        setTimeout(() => audioContext.close(), 1000);
      }
      
    } catch (e) {
      console.warn('Falha no unlock universal de áudio:', e);
      // Fallback: marcar como desbloqueado mesmo com erro
      audioUnlockedRef.current = true;
    }
  };

  const playAudio = async (ref) => {
    const el = ref?.current;
    if (!el) return;
    
    // Garantir que o áudio foi desbloqueado primeiro
    if (!audioUnlockedRef.current) {
      console.warn('Tentando reproduzir áudio antes do unlock - pode falhar');
    }
    
    const attemptPlay = async (audio, retryCount = 0) => {
      try {
        // Reset e configuração
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = 1;
        
        // Reprodução com Promise handling adequado
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          return true;
        }
        return false;
      } catch (error) {
        if (retryCount < 2) {
          // Retry com delay crescente
          await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
          return attemptPlay(audio, retryCount + 1);
        }
        throw error;
      }
    };
    
    try {
      await attemptPlay(el);
    } catch (finalError) {
      console.warn('Falha definitiva na reprodução de áudio:', finalError);
      
      // Último recurso: tentar reprodução básica sem Promise
      try {
        el.currentTime = 0;
        el.play();
      } catch (lastResortError) {
        console.error('Áudio completamente bloqueado:', lastResortError);
      }
    }
  };

  const STORAGE_KEY = 'bjj-treinos-cronometrados';

  // Treinos padrão por faixa (não podem ser deletados)
  const treinosPorFaixa = [
    {
      id: 'faixa-branca',
      nome: 'Treino Faixa Branca (5 min)',
      tecnicas: [
        {
          id: 'roll-branca',
          nome: 'Tempo de Rola',
          modo: 'tempo',
          tempoExecucao: 300, // 5 minutos
          tempoDescanso: 0
        }
      ],
      padrao: true
    },
    {
      id: 'faixa-azul',
      nome: 'Treino Faixa Azul (6 min)',
      tecnicas: [
        {
          id: 'roll-azul',
          nome: 'Tempo de Rola',
          modo: 'tempo',
          tempoExecucao: 360, // 6 minutos
          tempoDescanso: 0
        }
      ],
      padrao: true
    },
    {
      id: 'faixa-roxa',
      nome: 'Treino Faixa Roxa (7 min)',
      tecnicas: [
        {
          id: 'roll-roxa',
          nome: 'Tempo de Rola',
          modo: 'tempo',
          tempoExecucao: 420, // 7 minutos
          tempoDescanso: 0
        }
      ],
      padrao: true
    },
    {
      id: 'faixa-marrom',
      nome: 'Treino Faixa Marrom (8 min)',
      tecnicas: [
        {
          id: 'roll-marrom',
          nome: 'Tempo de Rola',
          modo: 'tempo',
          tempoExecucao: 480, // 8 minutos
          tempoDescanso: 0
        }
      ],
      padrao: true
    },
    {
      id: 'faixa-preta',
      nome: 'Treino Faixa Preta (10 min)',
      tecnicas: [
        {
          id: 'roll-preta',
          nome: 'Tempo de Rola',
          modo: 'tempo',
          tempoExecucao: 600, // 10 minutos
          tempoDescanso: 0
        }
      ],
      padrao: true
    }
  ];

  // Carregar treinos salvos do LocalStorage
  useEffect(() => {
    try {
      const treinosSalvosStorage = localStorage.getItem(STORAGE_KEY);
      let treinosSalvosDoStorage = [];
      
      if (treinosSalvosStorage) {
        treinosSalvosDoStorage = JSON.parse(treinosSalvosStorage);
      }
      
      // Combinar treinos padrão com treinos salvos
      const todosOsTreinos = [...treinosPorFaixa, ...treinosSalvosDoStorage];
      setTreinosSalvos(todosOsTreinos);
    } catch (error) {
      console.error('Erro ao carregar treinos do LocalStorage:', error);
      // Se houver erro, carregar apenas os padrão
      setTreinosSalvos(treinosPorFaixa);
    }
  }, []);

  // Salvar treinos no LocalStorage sempre que houver mudanças (exceto os padrão)
  const salvarNoStorage = (treinos) => {
    try {
      // Filtrar apenas treinos customizados (não padrão)
      const treinosCustomizados = treinos.filter(treino => !treino.padrao);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(treinosCustomizados));
    } catch (error) {
      console.error('Erro ao salvar treinos no LocalStorage:', error);
    }
  };

  // Gerenciar cronômetro (com sons)
  useEffect(() => {
    let intervalo = null;
    if (cronometroAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(prev => {
          const t = prev - 1;
          // Sons de contagem regressiva (3,2,1) apenas para execucao/descanso
          if ((faseAtual === 'execucao' || faseAtual === 'descanso') && t > 0 && t <= 3) {
            playAudio(audioRegressivoRef);
          }
          if (t <= 0) {
            // Encerrar fase atual
            setCronometroAtivo(false);
            if (faseAtual === 'execucao') {
              playAudio(audioFinalRef); // fim do round de execução
              const tecnicaAtual = executandoTreino?.tecnicas[tecnicaAtualIndex];
              if (tecnicaAtual && tecnicaAtual.modo === 'tempo' && tecnicaAtual.tempoDescanso > 0) {
                // Inicia descanso
                setFaseAtual('descanso');
                setTempoRestante(tecnicaAtual.tempoDescanso);
                setCronometroAtivo(true);
              } else {
                // Avança direto
                const proximoIndex = tecnicaAtualIndex + 1;
                const total = executandoTreino?.tecnicas.length || 0;
                if (proximoIndex < total) {
                  const proxima = executandoTreino.tecnicas[proximoIndex];
                  setTecnicaAtualIndex(proximoIndex);
                  if (proxima.modo === 'tempo') {
                    setFaseAtual('execucao');
                    setTempoRestante(proxima.tempoExecucao);
                    setCronometroAtivo(true);
                    playAudio(audioGongoRef); // início novo round
                  } else {
                    setFaseAtual('parado');
                    setTempoRestante(0);
                  }
                } else {
                  // Fim geral
                  setExecutandoTreino(null);
                  setTecnicaAtualIndex(0);
                  setFaseAtual('parado');
                  setTempoRestante(0);
                }
              }
            } else if (faseAtual === 'descanso') {
              // Fim do descanso -> próxima técnica
              const proximoIndex = tecnicaAtualIndex + 1;
              const total = executandoTreino?.tecnicas.length || 0;
              if (proximoIndex < total) {
                const proxima = executandoTreino.tecnicas[proximoIndex];
                setTecnicaAtualIndex(proximoIndex);
                if (proxima.modo === 'tempo') {
                  setFaseAtual('execucao');
                  setTempoRestante(proxima.tempoExecucao);
                  setCronometroAtivo(true);
                  playAudio(audioGongoRef);
                } else {
                  setFaseAtual('parado');
                  setTempoRestante(0);
                }
              } else {
                // Último descanso terminou e não há próxima técnica -> fim geral com som final
                playAudio(audioFinalRef);
                setExecutandoTreino(null);
                setTecnicaAtualIndex(0);
                setFaseAtual('parado');
                setTempoRestante(0);
              }
            }
            return 0;
          }
          return t;
        });
      }, 1000);
    }
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [cronometroAtivo, tempoRestante, faseAtual, executandoTreino, tecnicaAtualIndex]);

  // Funções para gerenciar formulário
  const atualizarFormulario = (campo, valor) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const resetarFormulario = () => {
    setFormulario({
      nomeTecnica: '',
      modo: 'tempo',
      tempoExecucao: 60,
      tempoDescanso: 30
    });
  };

  // Adicionar técnica ao treino atual
  const adicionarTecnica = () => {
    if (!formulario.nomeTecnica.trim()) {
      return { sucesso: false, erro: 'Nome da técnica é obrigatório' };
    }

    const novaTecnica = {
      id: Date.now(),
      nome: formulario.nomeTecnica.trim(),
      modo: 'tempo',
      tempoExecucao: formulario.tempoExecucao,
      tempoDescanso: formulario.tempoDescanso
    };

    setTreinoAtual(prev => ({
      ...prev,
      tecnicas: [...prev.tecnicas, novaTecnica]
    }));

    resetarFormulario();
    return { sucesso: true };
  };

  // Remover técnica do treino atual
  const removerTecnica = (id) => {
    setTreinoAtual(prev => ({
      ...prev,
      tecnicas: prev.tecnicas.filter(t => t.id !== id)
    }));
  };

  // Salvar treino atual
  const salvarTreino = (nome) => {
    if (!nome.trim()) {
      return { sucesso: false, erro: 'Nome do treino é obrigatório' };
    }

    if (treinoAtual.tecnicas.length === 0) {
      return { sucesso: false, erro: 'Adicione pelo menos uma técnica' };
    }

    const novoTreino = {
      id: Date.now(),
      nome: nome.trim(),
      tecnicas: [...treinoAtual.tecnicas],
      dataCriacao: new Date().toISOString()
    };

    const treinosAtualizados = [...treinosSalvos, novoTreino];
    setTreinosSalvos(treinosAtualizados);
    salvarNoStorage(treinosAtualizados);

    // Limpar treino atual
    setTreinoAtual({ nome: '', tecnicas: [] });

    return { sucesso: true };
  };

  // Excluir treino salvo (apenas treinos customizados)
  const excluirTreino = (id) => {
    // Não permitir excluir treinos padrão
    const treino = treinosSalvos.find(t => t.id === id);
    if (treino?.padrao) {
      return { sucesso: false, erro: 'Treinos padrão não podem ser excluídos' };
    }
    
    const treinosAtualizados = treinosSalvos.filter(t => t.id !== id);
    setTreinosSalvos(treinosAtualizados);
    salvarNoStorage(treinosAtualizados);
    return { sucesso: true };
  };

  // Carregar treino para execução
  const carregarTreinoParaExecucao = (treino) => {
    setExecutandoTreino(treino);
    setTecnicaAtualIndex(0);
    setFaseAtual('parado');
    setTempoRestante(0);
    setCronometroAtivo(false);
  };

  // Iniciar execução da técnica atual
  const iniciarTecnicaAtual = async () => {
    if (!executandoTreino) return;

    // Desbloquear áudios no primeiro toque (PWA fix)
    await unlockAudio();

    const tecnica = executandoTreino.tecnicas[tecnicaAtualIndex];
    if (!tecnica) return;

    setFaseAtual('execucao');
    setTempoRestante(tecnica.tempoExecucao);
    setCronometroAtivo(true);
    playAudio(audioGongoRef); // Gongo no início do round de execução
  };

  // Próxima técnica
  const proximaTecnica = () => {
    const proximoIndex = tecnicaAtualIndex + 1;
    
    if (proximoIndex < executandoTreino.tecnicas.length) {
      setTecnicaAtualIndex(proximoIndex);
      setFaseAtual('parado');
      setTempoRestante(0);
      setCronometroAtivo(false);
    } else {
      // Treino finalizado
      finalizarTreino();
    }
  };

  // Técnica anterior
  const tecnicaAnterior = () => {
    const anteriorIndex = tecnicaAtualIndex - 1;
    
    if (anteriorIndex >= 0) {
      setTecnicaAtualIndex(anteriorIndex);
      setFaseAtual('parado');
      setTempoRestante(0);
      setCronometroAtivo(false);
    }
  };

  // Finalizar treino
  const finalizarTreino = () => {
    setExecutandoTreino(null);
    setTecnicaAtualIndex(0);
    setFaseAtual('parado');
    setTempoRestante(0);
    setCronometroAtivo(false);
  };

  // Pausar/retomar cronômetro
  const pausarRetomar = async () => {
    // Aproveitar qualquer interação para unlock
    if (!audioUnlockedRef.current) {
      await unlockAudio();
    }
    setCronometroAtivo(!cronometroAtivo);
  };

  // Utilitários
  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const obterDescricaoTecnica = (tecnica) => {
    return `${formatarTempo(tecnica.tempoExecucao)} ${tecnica.tempoDescanso > 0 ? `x ${formatarTempo(tecnica.tempoDescanso)}` : ''}`;
  };

  return {
    // Estados
    treinoAtual,
    treinosSalvos,
    executandoTreino,
    carregando,
    formulario,
    tecnicaAtualIndex,
    tempoRestante,
    faseAtual,
    cronometroAtivo,

    // Ações de formulário
    atualizarFormulario,
    resetarFormulario,
    adicionarTecnica,
    removerTecnica,

    // Ações de treino
    salvarTreino,
    excluirTreino,
    carregarTreinoParaExecucao,

    // Ações de execução
    iniciarTecnicaAtual,
    proximaTecnica,
    tecnicaAnterior,
    finalizarTreino,
    pausarRetomar,

    // Utilitários
    formatarTempo,
    obterDescricaoTecnica,
    unlockAudio
  };
};