import { useState, useEffect, useCallback } from "react";
import { useExp } from "@/components/exp/Exp";
import * as tecnicasService from "@/services/tecnicas/tecnicasService";

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
        const [tecnicasData, posicoesData] = await Promise.all([
          tecnicasService.getTecnicas(),
          tecnicasService.getPosicoes()
        ]);
        
        setTecnicas(tecnicasData);
        setPosicoesCadastradas(posicoesData);
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

      const tecnicaFinal = {
        ...novaTecnica,
        passos: passosLimpos,
        observacoes: observacoesLimpas
      };

      delete tecnicaFinal.novaPosicao;

      const tecnicaSalva = await tecnicasService.saveTecnica(tecnicaFinal);
      
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

      delete tecnicaFinal.novaPosicao;

      const tecnicaSalva = await tecnicasService.saveTecnica(tecnicaFinal);
      
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
      
      // Se estiver destacando (não removendo o destaque), mostrar modal de experiência
      if (novoDestaque) {
        mostrarExp(15, `Você ganhou 15 exp por destacar a técnica "${tecnica.nome}"!`);
      }
      
      return { id, destacado: novoDestaque };
    } catch (error) {
      console.error("Erro ao atualizar destaque:", error);
      throw error;
    }
  }, [tecnicas, mostrarExp]);

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
      
      // Ganhar experiência por tornar pública
      if (novaVisibilidade) {
        mostrarExp(25, `Você ganhou 25 exp por tornar a técnica "${tecnica.nome}" pública!`);
      }
      
      return { id, publica: novaVisibilidade };
    } catch (error) {
      console.error("Erro ao atualizar visibilidade pública:", error);
      throw error;
    }
  }, [tecnicas, mostrarExp]);

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
