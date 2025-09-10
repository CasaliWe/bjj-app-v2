import { useState, useEffect, useCallback } from 'react';
import { 
  getCompeticoes, 
  getCompeticoesComunidade,
  addCompeticao, 
  updateCompeticao, 
  deleteCompeticao,
  alterarVisibilidadeCompeticao
} from '../services/competicoes/competicoesService';
import { useExp } from '@/components/exp/Exp';

/**
 * Hook personalizado para gerenciar competições
 * @returns {Object} Métodos e estados para gerenciar competições
 */
export const useCompeticoes = () => {
  // Estados
  const [competicoes, setCompeticoes] = useState([]);
  const [competicoesComunidade, setCompeticoesComunidade] = useState([]);
  const [filtros, setFiltros] = useState({ modalidade: 'todos' });
  const [filtrosComunidade, setFiltrosComunidade] = useState({ modalidade: 'todos' });
  const [loading, setLoading] = useState(false);
  const [loadingComunidade, setLoadingComunidade] = useState(false);
  const [paginacao, setPaginacao] = useState({ currentPage: 1, totalPages: 1 });
  const [paginacaoComunidade, setPaginacaoComunidade] = useState({ currentPage: 1, totalPages: 1 });
  const [aba, setAba] = useState('minhas'); // 'minhas' ou 'comunidade'
  const [limitePorPagina] = useState(10);
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();

  // Buscar competições do usuário
  const buscarCompeticoes = useCallback(() => {
    setLoading(true);
    
    try {
      const result = getCompeticoes(
        filtros, 
        paginacao.currentPage, 
        limitePorPagina
      );
      
      setCompeticoes(result.competicoes);
      setPaginacao(result.paginacao);
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
    } finally {
      setLoading(false);
    }
  }, [filtros, paginacao.currentPage, limitePorPagina]);

  // Buscar competições da comunidade
  const buscarCompeticoesComunidade = useCallback(async () => {
    if (aba !== 'comunidade') return;
    
    setLoadingComunidade(true);
    
    try {
      const result = await getCompeticoesComunidade(
        filtrosComunidade,
        paginacaoComunidade.currentPage, 
        limitePorPagina
      );
      
      setCompeticoesComunidade(result.competicoes);
      setPaginacaoComunidade(result.paginacao);
    } catch (error) {
      console.error('Erro ao buscar competições da comunidade:', error);
    } finally {
      setLoadingComunidade(false);
    }
  }, [aba, filtrosComunidade, paginacaoComunidade.currentPage, limitePorPagina]);

  // Adicionar uma nova competição
  const adicionarCompeticao = useCallback((competicao) => {
    try {
      const novaCompeticao = addCompeticao(competicao);
      
      // Ganhar experiência por adicionar nova competição
      mostrarExp(200, "Você ganhou 200 exp por registrar uma nova competição!");
      
      // Atualizar a lista de competições
      buscarCompeticoes();
      
      // Se a competição for pública, atualizar também a lista da comunidade
      if (competicao.isPublico && aba === 'comunidade') {
        buscarCompeticoesComunidade();
      }
      
      return novaCompeticao;
    } catch (error) {
      console.error('Erro ao adicionar competição:', error);
      throw error;
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade, mostrarExp]);

  // Atualizar uma competição existente
  const atualizarCompeticao = useCallback((competicao) => {
    try {
      const competicaoAtualizada = updateCompeticao(competicao);
      
      // Atualizar a lista de competições
      buscarCompeticoes();
      
      // Se estiver na aba da comunidade, atualizar também a lista da comunidade
      if (aba === 'comunidade') {
        buscarCompeticoesComunidade();
      }
      
      return competicaoAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar competição:', error);
      throw error;
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade]);

  // Excluir uma competição
  const excluirCompeticao = useCallback((id) => {
    try {
      const sucesso = deleteCompeticao(id);
      
      if (sucesso) {
        // Atualizar a lista de competições
        buscarCompeticoes();
        
        // Se estiver na aba da comunidade, atualizar também a lista da comunidade
        if (aba === 'comunidade') {
          buscarCompeticoesComunidade();
        }
      }
      
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir competição:', error);
      throw error;
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade]);

  // Compartilhar/descompartilhar uma competição
  const alterarVisibilidade = useCallback((id, isPublico) => {
    try {
      const competicaoAtualizada = alterarVisibilidadeCompeticao(id, isPublico);
      
      // Atualizar a lista de competições
      buscarCompeticoes();
      
      // Se estiver na aba da comunidade, atualizar também a lista da comunidade
      if (aba === 'comunidade') {
        buscarCompeticoesComunidade();
      }
      
      return competicaoAtualizada;
    } catch (error) {
      console.error('Erro ao alterar visibilidade da competição:', error);
      throw error;
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade]);

  // Alterar a página atual (paginação)
  const mudarPagina = useCallback((novaPagina) => {
    if (aba === 'minhas') {
      setPaginacao(prev => ({ ...prev, currentPage: novaPagina }));
    } else {
      setPaginacaoComunidade(prev => ({ ...prev, currentPage: novaPagina }));
    }
  }, [aba]);

  // Alterar os filtros
  const aplicarFiltros = useCallback((novosFiltros) => {
    if (aba === 'minhas') {
      setFiltros(novosFiltros);
      // Resetar para a primeira página ao aplicar filtros
      setPaginacao(prev => ({ ...prev, currentPage: 1 }));
    } else {
      setFiltrosComunidade(novosFiltros);
      // Resetar para a primeira página ao aplicar filtros
      setPaginacaoComunidade(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [aba]);

  // Mudar entre abas (minhas competições/comunidade)
  const mudarAba = useCallback((novaAba) => {
    setAba(novaAba);
  }, []);

  // Buscar competições quando os filtros ou a página mudar
  useEffect(() => {
    if (aba === 'minhas') {
      buscarCompeticoes();
    }
  }, [aba, filtros, paginacao.currentPage, buscarCompeticoes]);

  // Buscar competições da comunidade quando a página mudar
  useEffect(() => {
    if (aba === 'comunidade') {
      buscarCompeticoesComunidade();
    }
  }, [aba, filtrosComunidade, paginacaoComunidade.currentPage, buscarCompeticoesComunidade]);

  return {
    // Estados
    competicoes,
    competicoesComunidade,
    loading,
    loadingComunidade,
    paginacao,
    paginacaoComunidade,
    filtros: aba === 'minhas' ? filtros : filtrosComunidade,
    aba,
    
    // Métodos
    adicionarCompeticao,
    atualizarCompeticao,
    excluirCompeticao,
    alterarVisibilidade,
    mudarPagina,
    aplicarFiltros,
    mudarAba,
    buscarCompeticoes,
    buscarCompeticoesComunidade
  };
};
