import { useState, useEffect, useCallback } from "react";
import * as eventosService from "@/services/eventos/eventosService.jsx";

/**
 * Hook personalizado para gerenciar o estado dos eventos de grappling
 * Centraliza toda a lógica de manipulação dos eventos e filtros
 * 
 * @returns {Object} Funções e estado para manipular eventos
 */
export const useEventos = () => {
  const [eventosPorEstado, setEventosPorEstado] = useState({});
  const [estadoSelecionado, setEstadoSelecionado] = useState('todos');
  const [tipoEvento, setTipoEvento] = useState('sou-competidor');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [totalEstados, setTotalEstados] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [estadosDisponiveis, setEstadosDisponiveis] = useState([]);

  // Carregar todos os eventos baseado no tipo
  const carregarEventos = useCallback(async (tipo = tipoEvento) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const data = await eventosService.getEventos(tipo);
      
      setEventosPorEstado(data.eventos_por_estado || {});
      setTotalEstados(data.total_estados || 0);
      setTotalEventos(data.total_eventos || 0);
      setEstadosDisponiveis(data.estados_disponiveis || []);
      
      return data;
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setErro("Não foi possível carregar os eventos. Tente novamente mais tarde.");
      setEventosPorEstado({});
      setTotalEstados(0);
      setTotalEventos(0);
      setEstadosDisponiveis([]);
      return { eventos_por_estado: {}, total_estados: 0, total_eventos: 0 };
    } finally {
      setCarregando(false);
    }
  }, [tipoEvento]);

  // Filtrar eventos por estado
  const eventosFiltrados = useCallback(() => {
    return eventosService.filtrarEventosPorEstado(eventosPorEstado, estadoSelecionado);
  }, [eventosPorEstado, estadoSelecionado]);

  // Obter estatísticas dos eventos filtrados
  const getEstatisticas = useCallback(() => {
    const eventosFilt = eventosFiltrados();
    const stats = eventosService.getEstatisticasEventos(eventosFilt);
    
    return {
      total_estados: estadoSelecionado === 'todos' ? totalEstados : (Object.keys(eventosFilt).length),
      total_eventos: estadoSelecionado === 'todos' ? totalEventos : 
        Object.values(eventosFilt).reduce((acc, estado) => acc + (estado.total_eventos || 0), 0),
      estados_disponiveis: estadosDisponiveis,
      estado_selecionado: estadoSelecionado
    };
  }, [eventosFiltrados, estadoSelecionado, totalEstados, totalEventos, estadosDisponiveis]);

  // Alterar estado selecionado
  const alterarEstadoSelecionado = useCallback((novoEstado) => {
    setEstadoSelecionado(novoEstado);
  }, []);

  // Obter lista de todos os eventos (para busca)
  const obterTodosEventos = useCallback(() => {
    const todosEventos = [];
    
    Object.values(eventosPorEstado).forEach(estadoData => {
      if (estadoData.eventos && Array.isArray(estadoData.eventos)) {
        todosEventos.push(...estadoData.eventos);
      }
    });
    
    return todosEventos;
  }, [eventosPorEstado]);

  // Buscar eventos por termo
  const buscarEventos = useCallback((termo) => {
    if (!termo || !termo.trim()) {
      return eventosFiltrados();
    }
    
    const termoLower = termo.toLowerCase().trim();
    const eventosFilt = eventosFiltrados();
    const resultados = {};
    
    Object.keys(eventosFilt).forEach(estado => {
      const estadoData = eventosFilt[estado];
      const eventosEncontrados = estadoData.eventos.filter(evento => 
        evento.nome.toLowerCase().includes(termoLower) ||
        evento.local.toLowerCase().includes(termoLower) ||
        evento.data.toLowerCase().includes(termoLower)
      );
      
      if (eventosEncontrados.length > 0) {
        resultados[estado] = {
          ...estadoData,
          eventos: eventosEncontrados,
          total_eventos: eventosEncontrados.length
        };
      }
    });
    
    return resultados;
  }, [eventosFiltrados]);

  // Alterar tipo de evento
  const alterarTipoEvento = useCallback(async (novoTipo) => {
    if (novoTipo !== tipoEvento) {
      setTipoEvento(novoTipo);
      setEstadoSelecionado('todos'); // Reset do filtro de estado
      await carregarEventos(novoTipo);
    }
  }, [tipoEvento, carregarEventos]);

  // Verificar se há eventos
  const temEventos = useCallback(() => {
    return totalEventos > 0;
  }, [totalEventos]);

  // Carregar dados na inicialização
  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  return {
    // Estados
    eventosPorEstado: eventosFiltrados(),
    estadoSelecionado,
    tipoEvento,
    carregando,
    erro,
    totalEstados,
    totalEventos,
    estadosDisponiveis,
    
    // Funções
    carregarEventos,
    alterarEstadoSelecionado,
    alterarTipoEvento,
    getEstatisticas,
    obterTodosEventos,
    buscarEventos,
    temEventos
  };
};