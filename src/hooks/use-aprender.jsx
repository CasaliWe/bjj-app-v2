import { useState, useEffect, useCallback } from "react";
import * as aprenderService from "@/services/aprender/aprenderService.jsx";

/**
 * Hook personalizado para gerenciar o estado dos módulos de aprendizado
 * Centraliza toda a lógica de manipulação dos módulos e técnicas
 * 
 * @returns {Object} Funções e estado para manipular módulos de aprendizado
 */
export const useAprender = () => {
  const [modulos, setModulos] = useState([]);
  const [moduloAtivo, setModuloAtivo] = useState(null);
  const [tecnicaAtiva, setTecnicaAtiva] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [totalModulos, setTotalModulos] = useState(0);

  // Carregar todos os módulos
  const carregarModulos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    
    try {
      const data = await aprenderService.getModulos();
      
      setModulos(data.modulos || []);
      setTotalModulos(data.total_modulos || 0);
      
      return data;
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      setErro("Não foi possível carregar os módulos de aprendizado. Tente novamente mais tarde.");
      setModulos([]);
      setTotalModulos(0);
      return { modulos: [], total_modulos: 0 };
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carregar um módulo específico
  const carregarModulo = useCallback(async (moduloId) => {
    try {
      const modulo = await aprenderService.getModulo(moduloId);
      setModuloAtivo(modulo);
      return modulo;
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
      throw error;
    }
  }, []);

  // Carregar uma técnica específica
  const carregarTecnica = useCallback(async (moduloId, tecnicaId) => {
    try {
      const tecnica = await aprenderService.getTecnica(moduloId, tecnicaId);
      setTecnicaAtiva(tecnica);
      return tecnica;
    } catch (error) {
      console.error("Erro ao carregar técnica:", error);
      throw error;
    }
  }, []);

  // Selecionar um módulo (para expandir/contrair)
  const selecionarModulo = useCallback((modulo) => {
    setModuloAtivo(modulo);
    setTecnicaAtiva(null); // Limpar técnica ativa ao selecionar módulo
  }, []);

  // Selecionar uma técnica
  const selecionarTecnica = useCallback((tecnica, modulo = null) => {
    setTecnicaAtiva({
      ...tecnica,
      modulo: modulo || moduloAtivo
    });
  }, [moduloAtivo]);

  // Limpar seleções
  const limparSelecoes = useCallback(() => {
    setModuloAtivo(null);
    setTecnicaAtiva(null);
  }, []);

  // Obter técnicas de um módulo específico
  const getTecnicasDoModulo = useCallback((moduloId) => {
    const modulo = modulos.find(m => m.id === parseInt(moduloId));
    return modulo?.tecnicas || [];
  }, [modulos]);

  // Obter estatísticas dos módulos
  const getEstatisticas = useCallback(() => {
    const totalTecnicas = modulos.reduce((total, modulo) => {
      return total + (modulo.total_tecnicas || modulo.tecnicas?.length || 0);
    }, 0);

    return {
      totalModulos: modulos.length,
      totalTecnicas
    };
  }, [modulos]);

  // Verificar se um módulo tem técnicas
  const moduloTemTecnicas = useCallback((modulo) => {
    return modulo && modulo.tecnicas && modulo.tecnicas.length > 0;
  }, []);

  // Verificar se uma técnica tem vídeo
  const tecnicaTemVideo = useCallback((tecnica) => {
    return tecnica && tecnica.video && tecnica.video.trim() !== '';
  }, []);

  // Carregar módulos ao montar o componente
  useEffect(() => {
    carregarModulos();
  }, [carregarModulos]);

  return {
    // Estados
    modulos,
    moduloAtivo,
    tecnicaAtiva,
    carregando,
    erro,
    totalModulos,
    
    // Funções de carregamento
    carregarModulos,
    carregarModulo,
    carregarTecnica,
    
    // Funções de seleção
    selecionarModulo,
    selecionarTecnica,
    limparSelecoes,
    
    // Funções utilitárias
    getTecnicasDoModulo,
    getEstatisticas,
    moduloTemTecnicas,
    tecnicaTemVideo
  };
};