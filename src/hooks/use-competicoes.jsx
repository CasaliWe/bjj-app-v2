import { useState, useEffect, useCallback } from 'react';
import { 
  getCompeticoes, 
  getCompeticoesComunidade,
  addCompeticao, 
  updateCompeticao, 
  deleteCompeticao,
  alterarVisibilidadeCompeticao,
  removerImagemCompeticao
} from '../services/competicoes/competicoesService';
import { useExp } from '@/components/exp/Exp';
import { format } from 'date-fns';

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
  const [erro, setErro] = useState(null);
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();

  // Buscar competições do usuário
  const buscarCompeticoes = useCallback(async () => {
    setLoading(true);
    setErro(null);
    
    try {
      const result = await getCompeticoes(
        filtros, 
        paginacao.currentPage, 
        limitePorPagina
      );
      
      setCompeticoes(result.competicoes);
      setPaginacao(result.paginacao);
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
      setErro('Não foi possível carregar as competições. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [filtros, paginacao.currentPage, limitePorPagina]);

  // Buscar competições da comunidade
  const buscarCompeticoesComunidade = useCallback(async () => {
    if (aba !== 'comunidade') return;
    
    setLoadingComunidade(true);
    setErro(null);
    
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
      setErro('Não foi possível carregar as competições da comunidade. Tente novamente mais tarde.');
    } finally {
      setLoadingComunidade(false);
    }
  }, [aba, filtrosComunidade, paginacaoComunidade.currentPage, limitePorPagina]);

  // Adicionar uma nova competição
  const adicionarCompeticao = useCallback(async (competicao) => {
    setLoading(true);
    setErro(null);
    
    try {
      // Criar um FormData para enviar dados e imagens
      const formData = new FormData();
      
      // Adicionar campos de texto
      formData.append('nomeEvento', competicao.nomeEvento);
      formData.append('cidade', competicao.cidade || '');
      formData.append('data', competicao.data || format(new Date(), 'yyyy-MM-dd'));
      formData.append('modalidade', competicao.modalidade || 'gi');
      formData.append('colocacao', competicao.colocacao || '');
      formData.append('numeroLutas', competicao.numeroLutas || 0);
      formData.append('numeroVitorias', competicao.numeroVitorias || 0);
      formData.append('numeroDerrotas', competicao.numeroDerrotas || 0);
      formData.append('numeroFinalizacoes', competicao.numeroFinalizacoes || 0);
      formData.append('observacoes', competicao.observacoes || '');
      formData.append('isPublico', competicao.isPublico ? '1' : '0');
      
      // Adicionar arquivos de imagem
      if (competicao.arquivosImagem && competicao.arquivosImagem.length > 0) {
        competicao.arquivosImagem.forEach((arquivo, index) => {
          formData.append(`imagens[${index}]`, arquivo);
        });
      }
      
      const novaCompeticao = await addCompeticao(formData);
      
      // Ganhar experiência por adicionar nova competição
      mostrarExp(200, "Você ganhou 200 exp por registrar uma nova competição!");
      
      // Atualizar a lista de competições
      await buscarCompeticoes();
      
      // Se a competição for pública, atualizar também a lista da comunidade
      if (competicao.isPublico && aba === 'comunidade') {
        await buscarCompeticoesComunidade();
      }
      
      return novaCompeticao;
    } catch (error) {
      console.error('Erro ao adicionar competição:', error);
      setErro('Não foi possível adicionar a competição. Tente novamente mais tarde.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade, mostrarExp]);

  // Atualizar uma competição existente
  const atualizarCompeticao = useCallback(async (competicao) => {
    setLoading(true);
    setErro(null);
    
    try {
      // Criar um FormData para enviar dados e imagens
      const formData = new FormData();
      
      // Adicionar ID da competição
      formData.append('id', competicao.id);
      
      // Adicionar campos de texto
      formData.append('nomeEvento', competicao.nomeEvento);
      formData.append('cidade', competicao.cidade || '');
      formData.append('data', competicao.data || format(new Date(), 'yyyy-MM-dd'));
      formData.append('modalidade', competicao.modalidade || 'gi');
      formData.append('colocacao', competicao.colocacao || '');
      formData.append('numeroLutas', competicao.numeroLutas || 0);
      formData.append('numeroVitorias', competicao.numeroVitorias || 0);
      formData.append('numeroDerrotas', competicao.numeroDerrotas || 0);
      formData.append('numeroFinalizacoes', competicao.numeroFinalizacoes || 0);
      formData.append('observacoes', competicao.observacoes || '');
      formData.append('isPublico', competicao.isPublico ? '1' : '0');
      
      // Adicionar arquivos de imagem
      if (competicao.arquivosImagem && competicao.arquivosImagem.length > 0) {
        competicao.arquivosImagem.forEach((arquivo, index) => {
          formData.append(`imagens[${index}]`, arquivo);
        });
      }
      
      // Adicionar IDs de imagens existentes para manter
      if (competicao.imagensExistentes && competicao.imagensExistentes.length > 0) {
        competicao.imagensExistentes.forEach((imagemId, index) => {
          formData.append(`imagensExistentes[${index}]`, imagemId);
        });
      }
      
      const competicaoAtualizada = await updateCompeticao(formData);
      
      // Atualizar a lista de competições
      await buscarCompeticoes();
      
      // Se estiver na aba da comunidade, atualizar também a lista da comunidade
      if (aba === 'comunidade') {
        await buscarCompeticoesComunidade();
      }
      
      return competicaoAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar competição:', error);
      setErro('Não foi possível atualizar a competição. Tente novamente mais tarde.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade]);

  // Excluir uma competição
  const excluirCompeticao = useCallback(async (id) => {
    setLoading(true);
    setErro(null);
    
    try {
      await deleteCompeticao(id);
      
      // Atualizar a lista de competições
      await buscarCompeticoes();
      
      // Se estiver na aba da comunidade, atualizar também a lista da comunidade
      if (aba === 'comunidade') {
        await buscarCompeticoesComunidade();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir competição:', error);
      setErro('Não foi possível excluir a competição. Tente novamente mais tarde.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade]);

  // Compartilhar/descompartilhar uma competição
  const alterarVisibilidade = useCallback(async (id, isPublico) => {
    setLoading(true);
    setErro(null);
    
    try {
      await alterarVisibilidadeCompeticao(id, isPublico);
      
      // Atualizar a lista de competições
      await buscarCompeticoes();
      
      // Se estiver na aba da comunidade, atualizar também a lista da comunidade
      if (aba === 'comunidade') {
        await buscarCompeticoesComunidade();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao alterar visibilidade da competição:', error);
      setErro('Não foi possível alterar a visibilidade da competição. Tente novamente mais tarde.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [aba, buscarCompeticoes, buscarCompeticoesComunidade]);

  // Remover uma imagem específica de uma competição
  const removerImagem = useCallback(async (competicaoId, imagemId) => {
    setLoading(true);
    setErro(null);
    
    try {
      await removerImagemCompeticao(competicaoId, imagemId);
      
      // Atualizar a lista de competições
      await buscarCompeticoes();
      
      // Se estiver na aba da comunidade, atualizar também a lista da comunidade
      if (aba === 'comunidade') {
        await buscarCompeticoesComunidade();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao remover imagem da competição:', error);
      setErro('Não foi possível remover a imagem da competição. Tente novamente mais tarde.');
      return false;
    } finally {
      setLoading(false);
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
    erro,
    
    // Métodos
    adicionarCompeticao,
    atualizarCompeticao,
    excluirCompeticao,
    alterarVisibilidade,
    removerImagem,
    mudarPagina,
    aplicarFiltros,
    mudarAba,
    buscarCompeticoes,
    buscarCompeticoesComunidade
  };
};
