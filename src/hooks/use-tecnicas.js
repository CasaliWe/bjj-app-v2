import { useState, useEffect, useCallback } from "react";
import { useExp } from "@/components/exp/Exp";
import * as tecnicasService from "@/services/tecnicas/tecnicasService.jsx";

/**
 * Hook personalizado para gerenciar o estado das técnicas
 * Centraliza toda a lógica de manipulação das técnicas
 * 
 * @returns {Object} Funções e estado para manipular técnicas
 */
export const useTecnicas = () => {
  const [tecnicas, setTecnicas] = useState([]);
  const [posicoesCadastradas, setPosicoesCadastradas] = useState([]);
  const [tecnicasComunidade, setTecnicasComunidade] = useState([]);
  const [paginacao, setPaginacao] = useState({
    paginaAtual: 1,
    totalPaginas: 1,
    totalItens: 0,
    itensPorPagina: 20
  });
  const [paginacaoComunidade, setPaginacaoComunidade] = useState({
    paginaAtual: 1,
    totalPaginas: 1,
    totalItens: 0,
    itensPorPagina: 20
  });
  const [filtrosAtuais, setFiltrosAtuais] = useState({
    categoria: "todas",
    posicao: "todas"
  });
  const [carregando, setCarregando] = useState(true);
  const [carregandoComunidade, setCarregandoComunidade] = useState(false);
  const [erro, setErro] = useState(null);
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();

  // Carregar técnicas com paginação e filtros
  const carregarTecnicas = useCallback(async (filtros = {}, pagina = 1) => {
    setCarregando(true);
    try {
      const data = await tecnicasService.getTecnicas(filtros, pagina, 20);
      
      setTecnicas(data.tecnicas || []);
      setPaginacao({
        paginaAtual: data.paginaAtual || pagina,
        totalPaginas: data.totalPaginas || 1,
        totalItens: data.totalItens || 0,
        itensPorPagina: data.itensPorPagina || 20
      });
      
      // Atualizar filtros atuais
      setFiltrosAtuais(filtros);
      
      setErro(null);
      return data;
    } catch (error) {
      console.error("Erro ao carregar técnicas:", error);
      setErro("Não foi possível carregar as técnicas. Tente novamente mais tarde.");
      setTecnicas([]);
      setPaginacao({
        paginaAtual: 1,
        totalPaginas: 1,
        totalItens: 0,
        itensPorPagina: 20
      });
      return [];
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carregar técnicas e posições ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar posições primeiro para garantir que elas estejam disponíveis
        const posicoesData = await tecnicasService.getPosicoes();
        
        // Garantir que posições é sempre um array válido
        const posicoesArray = Array.isArray(posicoesData) ? posicoesData : [];
        setPosicoesCadastradas(posicoesArray);
        
        // Carregar técnicas com paginação
        await carregarTecnicas();
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Não foi possível carregar os dados. Tente novamente mais tarde.");
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [carregarTecnicas]);

  // Carregar técnicas da comunidade
  const carregarTecnicasComunidade = useCallback(async (termo = "", pagina = 1) => {
    setCarregandoComunidade(true);
    try {
      const data = await tecnicasService.getTecnicasComunidade(termo, pagina, 20);
      
      // A API agora retorna um objeto estruturado
      setTecnicasComunidade(data.tecnicas || []);
      setPaginacaoComunidade({
        paginaAtual: data.paginaAtual || pagina,
        totalPaginas: data.totalPaginas || 1,
        totalItens: data.totalItens || 0,
        itensPorPagina: data.itensPorPagina || 20
      });
      
      return data;
    } catch (error) {
      console.error("Erro ao carregar técnicas da comunidade:", error);
      setTecnicasComunidade([]);
      setPaginacaoComunidade({
        paginaAtual: 1,
        totalPaginas: 1,
        totalItens: 0,
        itensPorPagina: 20
      });
      return [];
    } finally {
      setCarregandoComunidade(false);
    }
  }, []);

  // Adicionar nova técnica
  const adicionarTecnica = useCallback(async (novaTecnica) => {
    try {
      // Verificar se é uma nova posição
      if (novaTecnica.novaPosicao && !posicoesCadastradas.includes(novaTecnica.novaPosicao)) {
        setPosicoesCadastradas(prev => [...prev, novaTecnica.novaPosicao]);
        novaTecnica.posicao = novaTecnica.novaPosicao;
      }

      // Remover campos vazios
      const passosLimpos = novaTecnica.passos.filter(passo => passo.trim() !== "");
      const observacoesLimpas = novaTecnica.observacoes.filter(obs => obs.trim() !== "");

      // IMPORTANTE: Crie um objeto com spread operator, não use JSON.stringify/parse
      const tecnicaFinal = {...novaTecnica};
      tecnicaFinal.passos = passosLimpos;
      tecnicaFinal.observacoes = observacoesLimpas;

      // Remover campos temporários/extras que não são necessários para a API
      delete tecnicaFinal.novaPosicao;
      delete tecnicaFinal.videoPreview;
      delete tecnicaFinal.videoError;
      delete tecnicaFinal.videoPoster;
      
      // Verificar se o vídeo é válido
      if (tecnicaFinal.videoFile && !(tecnicaFinal.videoFile instanceof File)) {
        if (window._ultimoArquivoVideo instanceof File) {
          tecnicaFinal.videoFile = window._ultimoArquivoVideo;
        } else {
          throw new Error("Arquivo de vídeo inválido. Por favor, selecione o arquivo novamente.");
        }
      }
      
      const tecnicaSalva = await tecnicasService.saveTecnica(tecnicaFinal);
      
      // Recarregar a primeira página com os filtros atuais para mostrar a nova técnica
      await carregarTecnicas(filtrosAtuais, 1);
      
      // Ganhar experiência por adicionar nova técnica
      mostrarExp(150, "Você ganhou 150 exp por adicionar uma nova técnica!");
      
      return tecnicaSalva;
    } catch (error) {
      console.error("Erro ao adicionar técnica:", error);
      throw error;
    }
  }, [posicoesCadastradas, mostrarExp, carregarTecnicas, filtrosAtuais]);

  // Editar técnica existente
  const editarTecnica = useCallback(async (tecnicaEditada) => {
    try {
      // Verificar se é uma nova posição
      if (tecnicaEditada.novaPosicao && !posicoesCadastradas.includes(tecnicaEditada.novaPosicao)) {
        setPosicoesCadastradas(prev => [...prev, tecnicaEditada.novaPosicao]);
        tecnicaEditada.posicao = tecnicaEditada.novaPosicao;
      }

      // Remover campos vazios
      const passosLimpos = tecnicaEditada.passos.filter(passo => passo.trim() !== "");
      const observacoesLimpas = tecnicaEditada.observacoes.filter(obs => obs.trim() !== "");

      const tecnicaFinal = {
        ...tecnicaEditada,
        passos: passosLimpos,
        observacoes: observacoesLimpas
      };

      // Remover campos temporários/extras que não são necessários para a API
      delete tecnicaFinal.novaPosicao;
      delete tecnicaFinal.videoPreview;
      delete tecnicaFinal.videoError;
      delete tecnicaFinal.videoPoster;
      
      // Flag para indicar que estamos mantendo o vídeo existente
      tecnicaFinal.manterVideoExistente = true;
      
      // Verificar se há um novo vídeo para upload
      if (tecnicaFinal.videoFile) {
        // Se temos um novo arquivo, remover a flag de manter o vídeo existente
        tecnicaFinal.manterVideoExistente = false;
        
        // Garantir que o arquivo é válido
        if (!(tecnicaFinal.videoFile instanceof File)) {
          if (window._ultimoArquivoVideo instanceof File) {
            tecnicaFinal.videoFile = window._ultimoArquivoVideo;
          } else {
            // Se não temos um arquivo válido, remova o videoFile para não tentar enviar
            tecnicaFinal.videoFile = null;
          }
        }
      } else {
        // Remova o videoFile se não temos um novo arquivo para enviar
        // Isso mantém o vídeo existente no servidor
        tecnicaFinal.videoFile = null;
      }
      
      const tecnicaSalva = await tecnicasService.saveTecnica(tecnicaFinal);
      
      // Recarregar a página atual para mostrar as mudanças
      await carregarTecnicas(filtrosAtuais, paginacao.paginaAtual);
      
      return tecnicaSalva;
    } catch (error) {
      console.error("Erro ao editar técnica:", error);
      throw error;
    }
  }, [posicoesCadastradas, mostrarExp, carregarTecnicas, filtrosAtuais, paginacao.paginaAtual]);

  // Excluir técnica
  const excluirTecnica = useCallback(async (id) => {
    try {
      await tecnicasService.deleteTecnica(id);
      
      // Recarregar a página atual (ou anterior se a atual ficar vazia)
      const paginaParaCarregar = tecnicas.length === 1 && paginacao.paginaAtual > 1 
        ? paginacao.paginaAtual - 1 
        : paginacao.paginaAtual;
      
      await carregarTecnicas(filtrosAtuais, paginaParaCarregar);
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir técnica:", error);
      throw error;
    }
  }, [carregarTecnicas, filtrosAtuais, paginacao.paginaAtual, tecnicas.length]);

  // Alternar destaque da técnica
  const toggleDestaque = useCallback(async (id) => {
    try {
      const tecnica = tecnicas.find(t => t.id === id);
      if (!tecnica) return;
      
      const novoDestaque = !tecnica.destacado;
      
      await tecnicasService.updateDestaque(id, novoDestaque);
      
      // Recarregar a página atual para mostrar as mudanças
      await carregarTecnicas(filtrosAtuais, paginacao.paginaAtual);
      
      return { id, destacado: novoDestaque };
    } catch (error) {
      console.error("Erro ao atualizar destaque:", error);
      throw error;
    }
  }, [tecnicas, carregarTecnicas, filtrosAtuais, paginacao.paginaAtual]);

  // Alternar visibilidade pública da técnica
  const togglePublica = useCallback(async (id) => {
    try {
      const tecnica = tecnicas.find(t => t.id === id);
      if (!tecnica) return;
      
      const novaVisibilidade = !tecnica.publica;
      
      await tecnicasService.updatePublica(id, novaVisibilidade);
      
      // Recarregar a página atual para mostrar as mudanças
      await carregarTecnicas(filtrosAtuais, paginacao.paginaAtual);
      
      return { id, publica: novaVisibilidade };
    } catch (error) {
      console.error("Erro ao atualizar visibilidade pública:", error);
      throw error;
    }
  }, [tecnicas, carregarTecnicas, filtrosAtuais, paginacao.paginaAtual]);

  // Aplicar filtros (recarrega com novos filtros na primeira página)
  const aplicarFiltros = useCallback(async (categoria = "todas", posicao = "todas") => {
    const novosFiltros = { categoria, posicao };
    await carregarTecnicas(novosFiltros, 1);
  }, [carregarTecnicas]);

  // Mudar página mantendo os filtros atuais
  const mudarPagina = useCallback(async (novaPagina) => {
    await carregarTecnicas(filtrosAtuais, novaPagina);
  }, [carregarTecnicas, filtrosAtuais]);

  // Obter técnicas destacadas
  const getTecnicasDestacadas = useCallback(() => {
    return tecnicas.filter(t => t.destacado);
  }, [tecnicas]);

  return {
    tecnicas,
    posicoesCadastradas,
    tecnicasComunidade,
    paginacao,
    paginacaoComunidade,
    carregando,
    carregandoComunidade,
    erro,
    carregarTecnicas,
    carregarTecnicasComunidade,
    adicionarTecnica,
    editarTecnica,
    excluirTecnica,
    toggleDestaque,
    togglePublica,
    aplicarFiltros,
    mudarPagina,
    getTecnicasDestacadas
  };
};

export default useTecnicas;
