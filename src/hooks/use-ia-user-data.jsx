import { useCallback, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { usePlanoJogo } from './use-plano-jogo.jsx';
import { useObservacoes } from './use-observacoes.jsx';
import { useTecnicas } from './use-tecnicas.js';
import { useTreinos } from './use-treinos.js';
import { useCompeticoes } from './use-competicoes.jsx';
import { useChecklist } from './use-checklist.jsx';

// Helpers locais
const toDate = (d) => {
  if (!d) return null;
  try {
    return new Date(d);
  } catch (_) {
    return null;
  }
};

const sortByDateDesc = (arr, getter) => {
  return [...(arr || [])].sort((a, b) => {
    const da = toDate(getter(a))?.getTime() || 0;
    const db = toDate(getter(b))?.getTime() || 0;
    return db - da;
  });
};

const DIA_LABEL = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo'
};

/**
 * Hook para coletar e organizar dados do usuário para a IA
 * Busca dados de diferentes seções e organiza em formato JSON padronizado
 * 
 * @returns {Object} Função para coletar dados organizados do usuário
 */
export const useIAUserData = () => {
  const { user } = useUser();
  const { planos, carregarPlanos } = usePlanoJogo();
  const { observacoes, buscarObservacoes } = useObservacoes();
  const { tecnicas, carregarTecnicas } = useTecnicas();
  const { treinos, carregarTreinos } = useTreinos();
  const { competicoes, buscarCompeticoes } = useCompeticoes();
  const { checklists, buscarChecklists } = useChecklist();

  // Inicializar dados quando o hook for carregado
  useEffect(() => {
    const inicializarDados = async () => {
      try {
        // Carregar dados se ainda não existirem e as funções estiverem disponíveis
        if ((!planos || planos.length === 0) && carregarPlanos) {
          await carregarPlanos();
        }
        if ((!observacoes || observacoes.length === 0) && buscarObservacoes) {
          await buscarObservacoes();
        }
        if ((!tecnicas || tecnicas.length === 0) && carregarTecnicas) {
          await carregarTecnicas();
        }
        if ((!treinos || treinos.length === 0) && carregarTreinos) {
          await carregarTreinos();
        }
        if ((!competicoes || competicoes.length === 0) && buscarCompeticoes) {
          await buscarCompeticoes();
        }
        if ((!checklists || checklists.length === 0) && buscarChecklists) {
          await buscarChecklists();
        }
      } catch (error) {
        console.warn('Alguns dados não puderam ser carregados:', error);
      }
    };

    inicializarDados();
  }, [carregarPlanos, buscarObservacoes, carregarTecnicas, carregarTreinos, buscarCompeticoes, buscarChecklists]);

  /**
   * Coleta e organiza dados do usuário para envio à IA
   * @returns {Object} Dados organizados em formato JSON
   */
  const coletarDadosUsuario = useCallback(async () => {
    try {
      // Organiza os dados conforme especificado, com ordenação por data desc e campos detalhados:
      // - 2 últimos planos de jogo (garante nodes; busca por ID se faltarem)
      // - 10 últimas técnicas (com passos e observações)
      // - 5 últimos treinos (tipo, diaSemana, horario, numeroAula, etc.)
      // - 5 últimas competições (campos completos)
      // - 10 últimas observações (data normalizada)
      // - 2 últimas checklists (com itens completos)

      const dadosOrganizados = {
        // Dados básicos do usuário
        nome: user?.nome || null,
        academia: user?.academia || null,
        faixa: user?.faixa || null,
        peso: user?.peso || null,

        // Técnicas - 10 últimas por data
        tecnicas: sortByDateDesc(tecnicas || [], t => t.dataCriacao || t.data || t.data_criacao || t.createdAt)
          .slice(0, 10)
          .map(tecnica => ({
            id: tecnica.id,
            nome: tecnica.nome,
            categoria: tecnica.categoria,
            posicao: tecnica.posicao,
            nota: tecnica.nota,
            publica: !!tecnica.publica,
            destacado: !!tecnica.destacado,
            passos: Array.isArray(tecnica.passos) ? tecnica.passos : [],
            observacoes: Array.isArray(tecnica.observacoes) ? tecnica.observacoes : [],
          })),

        // Treinos - 5 últimos por data
        treinos: sortByDateDesc(treinos || [], t => t.data || t.dataTreino || t.data_treino || t.createdAt)
          .slice(0, 5)
          .map(treino => ({
            id: treino.id,
            data: treino.data || treino.dataTreino || treino.data_treino || null,
            tipo: treino.tipo, // gi | nogi
            diaSemana: treino.diaSemana,
            diaSemanaLabel: DIA_LABEL[treino.diaSemana] || treino.diaSemana,
            horario: treino.horario,
            numeroAula: treino.numeroAula,
            duracao: treino.duracao,
            intensidade: treino.intensidade,
            observacoes: treino.observacoes || ''
          })),

        // Competições - 5 últimas por data
        competicoes: sortByDateDesc(competicoes || [], c => c.data || c.data_competicao || c.createdAt)
          .slice(0, 5)
          .map(competicao => ({
            id: competicao.id,
            nomeEvento: competicao.nomeEvento || competicao.nome,
            cidade: competicao.cidade || null,
            data: competicao.data || competicao.data_competicao || null,
            modalidade: competicao.modalidade, // gi | nogi
            categoria: competicao.categoria || null,
            colocacao: competicao.colocacao || competicao.resultado || null,
            numeroLutas: competicao.numeroLutas || 0,
            numeroVitorias: competicao.numeroVitorias || 0,
            numeroDerrotas: competicao.numeroDerrotas || 0,
            numeroFinalizacoes: competicao.numeroFinalizacoes || 0,
            observacoes: competicao.observacoes || '',
          })),

        // Observações - 10 últimas por data
        observacoes: sortByDateDesc(observacoes || [], o => o.data || o.dataCriacao || o.createdAt)
          .slice(0, 10)
          .map(obs => ({
            id: obs.id,
            titulo: obs.titulo,
            conteudo: obs.conteudo,
            tag: obs.tag,
            data: obs.data || obs.dataCriacao || obs.createdAt || null
          })),

        // Checklists - 2 últimas por data
        checklists: sortByDateDesc(checklists || [], c => c.dataCriacao || c.data || c.createdAt)
          .slice(0, 2)
          .map(checklist => ({
            id: checklist.id,
            titulo: checklist.titulo,
            categoria: checklist.categoria,
            dataCriacao: checklist.dataCriacao || checklist.data || checklist.createdAt || null,
            concluido: !!checklist.concluido,
            itens: Array.isArray(checklist.itens) ? checklist.itens.map(item => ({
              id: item.id,
              texto: item.texto,
              concluido: !!item.concluido,
              dataCriacao: item.dataCriacao || item.data || item.createdAt || null,
              dataFinalizacao: item.dataFinalizacao || item.finalizadoEm || item.finishedAt || null,
              timestampCriacao: item.timestampCriacao || null,
              timestampFinalizacao: item.timestampFinalizacao || null,
            })) : [],
            total_itens: Array.isArray(checklist.itens) ? checklist.itens.length : 0,
            itens_concluidos: Array.isArray(checklist.itens) ? checklist.itens.filter(i => i.concluido).length : 0,
          })),

      };

      return dadosOrganizados;
    } catch (error) {
      console.error('Erro ao coletar dados do usuário:', error);
      return {
        nome: user?.nome || null,
        academia: user?.academia || null,
        faixa: user?.faixa || null,
        peso: user?.peso || null,
        tecnicas: [],
        treinos: [],
        competicoes: [],
        observacoes: [],
        checklists: []
      };
    }
  }, [user, planos, observacoes, tecnicas, treinos, competicoes, checklists]);

  return {
    coletarDadosUsuario
  };
};