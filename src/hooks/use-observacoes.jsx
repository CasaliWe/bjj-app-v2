import { useState, useEffect, useCallback } from 'react';
import { 
  getObservacoes, 
  addObservacao, 
  updateObservacao, 
  deleteObservacao,
  getObservacaoPorId
} from '../services/observacoes/observacoesService.jsx';
import { useExp } from '@/components/exp/Exp';

/**
 * Hook personalizado para gerenciar observações
 * @returns {Object} Métodos e estados para gerenciar observações
 */
export const useObservacoes = () => {
  // Estados
  const [observacoes, setObservacoes] = useState([]);
  const [observacaoAtual, setObservacaoAtual] = useState(null);
  const [filtros, setFiltros] = useState({ tag: 'todas', termo: '' });
  const [loading, setLoading] = useState(false);
  const [paginacao, setPaginacao] = useState({ currentPage: 1, totalPages: 1 });
  const [limitePorPagina] = useState(12);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();

  // Buscar observações com base nos filtros e paginação
  const buscarObservacoes = useCallback(async () => {
    setLoading(true);
    
    try {
      const result = await getObservacoes(
        filtros, 
        paginacao.currentPage, 
        limitePorPagina
      );
      
      setObservacoes(result.observacoes);
      setPaginacao(result.paginacao);
    } catch (error) {
      console.error('Erro ao buscar observações:', error);
    } finally {
      setLoading(false);
    }
  }, [filtros, paginacao.currentPage, limitePorPagina]);

  // Adicionar uma nova observação
  const adicionarObservacao = useCallback(async (observacao) => {
    try {
      const novaObservacao = await addObservacao(observacao);
      
      // Ganhar experiência por adicionar nova observação
      mostrarExp(50, "Você ganhou 50 exp por registrar uma nova observação!");
      
      // Atualizar a lista de observações
      await buscarObservacoes();
      
      return novaObservacao;
    } catch (error) {
      console.error('Erro ao adicionar observação:', error);
      throw error;
    }
  }, [buscarObservacoes, mostrarExp]);

  // Atualizar uma observação existente
  const atualizarObservacao = useCallback(async (observacao) => {
    try {
      const observacaoAtualizada = await updateObservacao(observacao);
      
      // Atualizar a lista de observações
      await buscarObservacoes();
      
      return observacaoAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar observação:', error);
      throw error;
    }
  }, [buscarObservacoes]);

  // Excluir uma observação
  const excluirObservacao = useCallback(async (id) => {
    try {
      const sucesso = await deleteObservacao(id);
      
      if (sucesso) {
        // Atualizar a lista de observações
        await buscarObservacoes();
      }
      
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir observação:', error);
      throw error;
    }
  }, [buscarObservacoes]);

  // Buscar uma observação pelo ID
  const buscarObservacaoPorId = useCallback(async (id) => {
    try {
      const observacao = await getObservacaoPorId(id);
      setObservacaoAtual(observacao);
      return observacao;
    } catch (error) {
      console.error('Erro ao buscar observação:', error);
      throw error;
    }
  }, []);

  // Alterar a página atual (paginação)
  const mudarPagina = useCallback((novaPagina) => {
    setPaginacao(prev => ({ ...prev, currentPage: novaPagina }));
  }, []);

  // Alterar os filtros
  const aplicarFiltros = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
    // Resetar para a primeira página ao aplicar filtros
    setPaginacao(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Abrir o modal para adicionar/editar observação
  const abrirModal = useCallback((observacao = null) => {
    if (observacao) {
      setObservacaoAtual(observacao);
      setModoEdicao(true);
    } else {
      setObservacaoAtual(null);
      setModoEdicao(false);
    }
    setModalAberto(true);
  }, []);

  // Fechar o modal
  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setObservacaoAtual(null);
    setModoEdicao(false);
  }, []);

  // Buscar observações quando os filtros ou a página mudar
  useEffect(() => {
    // Como não podemos usar async diretamente no useEffect,
    // criamos uma função interna assíncrona
    const fetchData = async () => {
      await buscarObservacoes();
    };
    
    fetchData();
  }, [buscarObservacoes]);

  return {
    // Estados
    observacoes,
    observacaoAtual,
    loading,
    paginacao,
    filtros,
    modalAberto,
    modoEdicao,
    
    // Métodos
    buscarObservacoes,
    adicionarObservacao,
    atualizarObservacao,
    excluirObservacao,
    buscarObservacaoPorId,
    mudarPagina,
    aplicarFiltros,
    abrirModal,
    fecharModal
  };
};

export default useObservacoes;
