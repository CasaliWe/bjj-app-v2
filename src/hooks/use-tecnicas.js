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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();

  // Carregar técnicas e posições ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Carregar posições primeiro para garantir que elas estejam disponíveis
        const posicoesData = await tecnicasService.getPosicoes();
        
        // Garantir que posições é sempre um array válido
        const posicoesArray = Array.isArray(posicoesData) ? posicoesData : [];
        setPosicoesCadastradas(posicoesArray);
        
        // Depois carregar as técnicas
        const tecnicasData = await tecnicasService.getTecnicas();
        
        // Garantir que técnicas é sempre um array
        const tecnicasArray = tecnicasData?.tecnicas || [];
        setTecnicas(Array.isArray(tecnicasArray) ? tecnicasArray : []);
        
        setErro(null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Carregar técnicas da comunidade
  const carregarTecnicasComunidade = useCallback(async (termo = "") => {
    try {
      const data = await tecnicasService.getTecnicasComunidade(termo);
      setTecnicasComunidade(data);
      return data;
    } catch (error) {
      console.error("Erro ao carregar técnicas da comunidade:", error);
      return [];
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
      
      // Adicionar à lista local
      setTecnicas(prev => [...prev, tecnicaSalva]);
      
      // Ganhar experiência por adicionar nova técnica
      mostrarExp(150, "Você ganhou 150 exp por adicionar uma nova técnica!");
      
      return tecnicaSalva;
    } catch (error) {
      console.error("Erro ao adicionar técnica:", error);
      throw error;
    }
  }, [posicoesCadastradas, mostrarExp]);

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
      
      // Verificar se o vídeo é válido
      if (tecnicaFinal.videoFile && !(tecnicaFinal.videoFile instanceof File)) {
        if (window._ultimoArquivoVideo instanceof File) {
          tecnicaFinal.videoFile = window._ultimoArquivoVideo;
        } else {
          throw new Error("Arquivo de vídeo inválido. Por favor, selecione o arquivo novamente.");
        }
      }
      
      const tecnicaSalva = await tecnicasService.saveTecnica(tecnicaFinal);
      
      // Atualizar na lista local
      setTecnicas(prev => prev.map(t => t.id === tecnicaSalva.id ? tecnicaSalva : t));
      
      // Ganhar experiência por editar
      mostrarExp(20, "Você ganhou 20 exp por editar uma técnica!");
      
      return tecnicaSalva;
    } catch (error) {
      console.error("Erro ao editar técnica:", error);
      throw error;
    }
  }, [posicoesCadastradas, mostrarExp]);

  // Excluir técnica
  const excluirTecnica = useCallback(async (id) => {
    try {
      await tecnicasService.deleteTecnica(id);
      setTecnicas(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir técnica:", error);
      throw error;
    }
  }, []);

  // Alternar destaque da técnica
  const toggleDestaque = useCallback(async (id) => {
    try {
      const tecnica = tecnicas.find(t => t.id === id);
      if (!tecnica) return;
      
      const novoDestaque = !tecnica.destacado;
      
      await tecnicasService.updateDestaque(id, novoDestaque);
      
      setTecnicas(prev => 
        prev.map(t => t.id === id ? { ...t, destacado: novoDestaque } : t)
      );
      
      // Removido o ganho de exp ao destacar técnica
      
      return { id, destacado: novoDestaque };
    } catch (error) {
      console.error("Erro ao atualizar destaque:", error);
      throw error;
    }
  }, [tecnicas]);

  // Alternar visibilidade pública da técnica
  const togglePublica = useCallback(async (id) => {
    try {
      const tecnica = tecnicas.find(t => t.id === id);
      if (!tecnica) return;
      
      const novaVisibilidade = !tecnica.publica;
      
      await tecnicasService.updatePublica(id, novaVisibilidade);
      
      setTecnicas(prev => 
        prev.map(t => t.id === id ? { ...t, publica: novaVisibilidade } : t)
      );
      
      // Removido o ganho de exp ao tornar pública
      
      return { id, publica: novaVisibilidade };
    } catch (error) {
      console.error("Erro ao atualizar visibilidade pública:", error);
      throw error;
    }
  }, [tecnicas]);

  // Filtrar técnicas
  const filtrarTecnicas = useCallback((categoria = "todas", posicao = "todas") => {
    return tecnicas.filter(tecnica => {
      const matchCategoria = !categoria || categoria === "todas" || tecnica.categoria === categoria;
      const matchPosicao = !posicao || posicao === "todas" || tecnica.posicao === posicao;
      return matchCategoria && matchPosicao;
    });
  }, [tecnicas]);

  // Obter técnicas destacadas
  const getTecnicasDestacadas = useCallback(() => {
    return tecnicas.filter(t => t.destacado);
  }, [tecnicas]);

  return {
    tecnicas,
    posicoesCadastradas,
    tecnicasComunidade,
    carregando,
    erro,
    carregarTecnicasComunidade,
    adicionarTecnica,
    editarTecnica,
    excluirTecnica,
    toggleDestaque,
    togglePublica,
    filtrarTecnicas,
    getTecnicasDestacadas
  };
};

export default useTecnicas;
