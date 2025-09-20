import { useState, useEffect, useCallback } from "react";
import * as planoJogoService from "@/services/planoJogo/planoJogoService.jsx";
import { useTecnicas } from "@/hooks/use-tecnicas.js";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook personalizado para gerenciar planos de jogo
 * Centraliza toda a lógica de manipulação dos planos de jogo
 * 
 * @returns {Object} Funções e estado para manipular planos de jogo
 */
export const usePlanoJogo = () => {
  const [planos, setPlanos] = useState([]);
  const [planoAtual, setPlanoAtual] = useState(null);
  const [planoAtualId, setPlanoAtualId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Hook para obter técnicas para serem usadas no plano
  const { tecnicas, carregarTecnicas } = useTecnicas();
  
  // Hook para mostrar mensagens toast
  const { toast } = useToast();

  // Carregar todos os planos
  const carregarPlanos = useCallback(async () => {
    setCarregando(true);
    try {
      const planosData = planoJogoService.getPlanos();
      setPlanos([...planosData]); // Criando um novo array para forçar re-renderização
      setErro(null);
    } catch (error) {
      console.error("Erro ao carregar planos de jogo:", error);
      setErro("Não foi possível carregar os planos de jogo. Tente novamente mais tarde.");
      setPlanos([]);
    } finally {
      setCarregando(false);
    }
  }, []);
  
  // Registra um listener para o evento de atualização do plano de jogo
  useEffect(() => {
    const handlePlanoUpdate = () => {
      const planosData = planoJogoService.getPlanos();
      setPlanos([...planosData]);
      if (planoAtualId) {
        const planoAtualizado = planoJogoService.getPlanoById(planoAtualId);
        if (planoAtualizado) setPlanoAtual({ ...planoAtualizado });
      }
      setUpdateCounter(prev => prev + 1);
    };
    
    window.addEventListener(planoJogoService.PLANO_JOGO_UPDATE_EVENT, handlePlanoUpdate);
    
    return () => {
      window.removeEventListener(planoJogoService.PLANO_JOGO_UPDATE_EVENT, handlePlanoUpdate);
    };
  }, [carregarPlanos, planoAtualId]);

  // Carregar planos ao montar o componente
  useEffect(() => {
    carregarPlanos();
  }, [carregarPlanos]);

  // Selecionar um plano específico pelo ID
  const selecionarPlano = useCallback((id) => {
    try {
      const plano = planoJogoService.getPlanoById(id);
      if (plano) {
        setPlanoAtual({...plano});
        setPlanoAtualId(id);
        return plano;
      } else {
        setErro("Plano não encontrado");
        return null;
      }
    } catch (error) {
      console.error("Erro ao selecionar plano:", error);
      setErro("Erro ao selecionar plano");
      return null;
    }
  }, []);

  // Criar um novo plano de jogo
  const criarPlano = useCallback((dados) => {
    try {
      // Validar dados mínimos
      if (!dados.nome) {
        setErro("O nome do plano é obrigatório");
        toast({
          title: "Erro",
          description: "O nome do plano é obrigatório",
          variant: "destructive"
        });
        return null;
      }

  const novoPlano = planoJogoService.criarPlano(dados);
  const novosPlanos = planoJogoService.getPlanos();
  setPlanos([...novosPlanos]);
      
      toast({
        title: "Sucesso",
        description: "Plano de jogo criado com sucesso",
      });
      
      return novoPlano;
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      setErro("Erro ao criar plano de jogo");
      
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano de jogo",
        variant: "destructive"
      });
      
      return null;
    }
  }, [toast]);

  // Atualizar um plano existente
  const atualizarPlano = useCallback((id, dados) => {
    try {
      const planoAtualizado = planoJogoService.atualizarPlano(id, dados);
      
      if (planoAtualizado) {
        // Forçar a atualização do estado local
  const novosPlanos = planoJogoService.getPlanos();
  setPlanos([...novosPlanos]);
        
        // Se o plano sendo atualizado é o atual, atualizar também o estado do plano atual
        if (planoAtual && planoAtual.id === id) {
          setPlanoAtual({...planoAtualizado}); // Cria um novo objeto para forçar a re-renderização
        }
        
        toast({
          title: "Sucesso",
          description: "Plano de jogo atualizado com sucesso",
        });
        
        return planoAtualizado;
      } else {
        setErro("Plano não encontrado");
        
        toast({
          title: "Erro",
          description: "Plano não encontrado",
          variant: "destructive"
        });
        
        return null;
      }
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      setErro("Erro ao atualizar plano de jogo");
      
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano de jogo",
        variant: "destructive"
      });
      
      return null;
    }
  }, [planoAtual, toast]);

  // Excluir um plano
  const excluirPlano = useCallback((id) => {
    try {
      const sucesso = planoJogoService.excluirPlano(id);
      
      if (sucesso) {
        const novosPlanos = planoJogoService.getPlanos();
        setPlanos([...novosPlanos]);
        
        // Se o plano sendo excluído é o atual, resetar o plano atual
        if (planoAtual && planoAtual.id === id) {
          setPlanoAtual(null);
        }
        
        toast({
          title: "Sucesso",
          description: "Plano de jogo excluído com sucesso",
        });
        
        return true;
      } else {
        setErro("Plano não encontrado");
        
        toast({
          title: "Erro",
          description: "Plano não encontrado",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
      setErro("Erro ao excluir plano de jogo");
      
      toast({
        title: "Erro",
        description: "Não foi possível excluir o plano de jogo",
        variant: "destructive"
      });
      
      return false;
    }
  }, [planoAtual, toast]);

  // Adicionar um nó (técnica) ao plano de jogo
  const adicionarNode = useCallback((planoId, node, parentId = null) => {
    try {
      // Validar dados mínimos
      if (!node.nome) {
        setErro("O nome do nó é obrigatório");
        
        toast({
          title: "Erro",
          description: "O nome do nó é obrigatório",
          variant: "destructive"
        });
        
        return null;
      }

      const planoAtualizado = planoJogoService.adicionarNode(planoId, node, parentId);
      
      if (planoAtualizado) {
        const novosPlanos = planoJogoService.getPlanos();
        setPlanos([...novosPlanos]);
        if (planoAtual && planoAtual.id === planoId) setPlanoAtual({ ...planoAtualizado });
        
        toast({
          title: "Sucesso",
          description: "Técnica adicionada com sucesso ao plano",
        });
        
        return planoAtualizado;
      } else {
        setErro("Plano não encontrado");
        
        toast({
          title: "Erro",
          description: "Plano não encontrado",
          variant: "destructive"
        });
        
        return null;
      }
    } catch (error) {
      console.error("Erro ao adicionar técnica ao plano:", error);
      setErro("Erro ao adicionar técnica ao plano de jogo");
      
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a técnica ao plano",
        variant: "destructive"
      });
      
      return null;
    }
  }, [planoAtual, toast]);

  // Remover um nó (técnica) do plano de jogo
  const removerNode = useCallback((planoId, nodeId) => {
    try {
      const planoAtualizado = planoJogoService.removerNode(planoId, nodeId);
      
      if (planoAtualizado) {
        const novosPlanos = planoJogoService.getPlanos();
        setPlanos([...novosPlanos]);
        if (planoAtual && planoAtual.id === planoId) setPlanoAtual({ ...planoAtualizado });
        
        toast({
          title: "Sucesso",
          description: "Técnica removida com sucesso do plano",
        });
        
        return planoAtualizado;
      } else {
        setErro("Plano ou técnica não encontrada");
        
        toast({
          title: "Erro",
          description: "Plano ou técnica não encontrada",
          variant: "destructive"
        });
        
        return null;
      }
    } catch (error) {
      console.error("Erro ao remover técnica do plano:", error);
      setErro("Erro ao remover técnica do plano de jogo");
      
      toast({
        title: "Erro",
        description: "Não foi possível remover a técnica do plano",
        variant: "destructive"
      });
      
      return null;
    }
  }, [planoAtual, toast]);

  // Adicionar uma resposta "deu certo" a um nó
  const adicionarRespostaCerto = useCallback((planoId, nodeId, resposta) => {
    try {
      // Criar um novo nó para a resposta positiva
      const novoNode = {
        ...resposta,
        nome: resposta.nome || "Deu certo",
        tipo: "certo"
      };
      
      return adicionarNode(planoId, novoNode, nodeId);
    } catch (error) {
      console.error("Erro ao adicionar resposta positiva:", error);
      setErro("Erro ao adicionar resposta positiva");
      return null;
    }
  }, [adicionarNode]);

  // Adicionar uma resposta "deu errado" a um nó
  const adicionarRespostaErrado = useCallback((planoId, nodeId, resposta) => {
    try {
      // Criar um novo nó para a resposta negativa
      const novoNode = {
        ...resposta,
        nome: resposta.nome || "Deu errado",
        tipo: "errado"
      };
      
      return adicionarNode(planoId, novoNode, nodeId);
    } catch (error) {
      console.error("Erro ao adicionar resposta negativa:", error);
      setErro("Erro ao adicionar resposta negativa");
      return null;
    }
  }, [adicionarNode]);

  return {
    planos,
    planoAtual,
    carregando,
    erro,
    tecnicas,
    carregarPlanos,
    selecionarPlano,
    criarPlano,
    atualizarPlano,
    excluirPlano,
    adicionarNode,
    removerNode,
    adicionarRespostaCerto,
    adicionarRespostaErrado,
    updateCounter // Contador para forçar atualizações
  };
};