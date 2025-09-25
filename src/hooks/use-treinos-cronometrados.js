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
    modo: 'tempo', // 'tempo' ou 'repeticoes'
    tempoExecucao: 60, // em segundos
    tempoDescanso: 30, // em segundos
    numeroRepeticoes: 10
  });

  // Estados de execução
  const [tecnicaAtualIndex, setTecnicaAtualIndex] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [faseAtual, setFaseAtual] = useState('parado'); // 'execucao', 'descanso', 'parado'
  const [repeticoesFeitas, setRepeticoesFeitas] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  // Refs de áudio
  const audioGongoRef = useRef(null);
  const audioRegressivoRef = useRef(null);
  const audioFinalRef = useRef(null);

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
        }
      });
    } catch (e) {
      console.warn('Falha ao inicializar áudios de treino:', e);
    }
  }, []);

  const playAudio = (ref) => {
    const el = ref?.current;
    if (!el) return;
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {}); // Ignorar erros de autoplay bloqueado
      }
    } catch (e) {
      // Silencia erros de reprodução
    }
  };

  const STORAGE_KEY = 'bjj-treinos-cronometrados';

  // Carregar treinos salvos do LocalStorage
  useEffect(() => {
    try {
      const treinosSalvosStorage = localStorage.getItem(STORAGE_KEY);
      if (treinosSalvosStorage) {
        setTreinosSalvos(JSON.parse(treinosSalvosStorage));
      }
    } catch (error) {
      console.error('Erro ao carregar treinos do LocalStorage:', error);
    }
  }, []);

  // Salvar treinos no LocalStorage sempre que houver mudanças
  const salvarNoStorage = (treinos) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(treinos));
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
                  setRepeticoesFeitas(0);
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
                setRepeticoesFeitas(0);
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
      tempoDescanso: 30,
      numeroRepeticoes: 10
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
      modo: formulario.modo,
      ...(formulario.modo === 'tempo' ? {
        tempoExecucao: formulario.tempoExecucao,
        tempoDescanso: formulario.tempoDescanso
      } : {
        numeroRepeticoes: formulario.numeroRepeticoes
      })
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

  // Excluir treino salvo
  const excluirTreino = (id) => {
    const treinosAtualizados = treinosSalvos.filter(t => t.id !== id);
    setTreinosSalvos(treinosAtualizados);
    salvarNoStorage(treinosAtualizados);
  };

  // Carregar treino para execução
  const carregarTreinoParaExecucao = (treino) => {
    setExecutandoTreino(treino);
    setTecnicaAtualIndex(0);
    setFaseAtual('parado');
    setTempoRestante(0);
    setRepeticoesFeitas(0);
    setCronometroAtivo(false);
  };

  // Iniciar execução da técnica atual
  const iniciarTecnicaAtual = () => {
    if (!executandoTreino) return;

    const tecnica = executandoTreino.tecnicas[tecnicaAtualIndex];
    if (!tecnica) return;

    if (tecnica.modo === 'tempo') {
      setFaseAtual('execucao');
      setTempoRestante(tecnica.tempoExecucao);
      setCronometroAtivo(true);
      playAudio(audioGongoRef); // Gongo no início do round de execução
    } else {
      setFaseAtual('execucao');
      setRepeticoesFeitas(0);
    }
  };

  // Concluir repetições
  const concluirRepeticoes = () => {
    setFaseAtual('parado');
  };

  // Próxima técnica
  const proximaTecnica = () => {
    const proximoIndex = tecnicaAtualIndex + 1;
    
    if (proximoIndex < executandoTreino.tecnicas.length) {
      setTecnicaAtualIndex(proximoIndex);
      setFaseAtual('parado');
      setTempoRestante(0);
      setRepeticoesFeitas(0);
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
      setRepeticoesFeitas(0);
      setCronometroAtivo(false);
    }
  };

  // Finalizar treino
  const finalizarTreino = () => {
    setExecutandoTreino(null);
    setTecnicaAtualIndex(0);
    setFaseAtual('parado');
    setTempoRestante(0);
    setRepeticoesFeitas(0);
    setCronometroAtivo(false);
  };

  // Pausar/retomar cronômetro
  const pausarRetomar = () => {
    setCronometroAtivo(!cronometroAtivo);
  };

  // Utilitários
  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const obterDescricaoTecnica = (tecnica) => {
    if (tecnica.modo === 'tempo') {
      return `${formatarTempo(tecnica.tempoExecucao)} ${tecnica.tempoDescanso > 0 ? `x ${formatarTempo(tecnica.tempoDescanso)}` : ''}`;
    } else {
      return `${tecnica.numeroRepeticoes} reps`;
    }
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
    repeticoesFeitas,
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
    concluirRepeticoes,
    proximaTecnica,
    tecnicaAnterior,
    finalizarTreino,
    pausarRetomar,

    // Utilitários
    formatarTempo,
    obterDescricaoTecnica
  };
};