import { useState, useEffect, useCallback } from 'react';
import { 
  getChecklists, 
  addChecklist, 
  updateChecklist, 
  deleteChecklist,
  getChecklistPorId,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem
} from '../services/checklist/checklistService.jsx';
import { marcarTodosItens } from '../services/checklist/checklistService.jsx';
import { useExp } from '@/components/exp/Exp';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook personalizado para gerenciar checklists
 * @returns {Object} Métodos e estados para gerenciar checklists
 */
export const useChecklist = () => {
  // Estados
  const [checklists, setChecklists] = useState([]);
  const [checklistAtual, setChecklistAtual] = useState(null);
  const [filtros, setFiltros] = useState({ categoria: 'todas', termo: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [paginacao, setPaginacao] = useState({ currentPage: 1, totalPages: 1 });
  const [limitePorPagina] = useState(12);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();
  
  // Hook para toast
  const { toast } = useToast();

  // Helper local para timestamp no padrão "10 de jun às 14:30hrs"
  const formatarTimestampLocal = (data = new Date()) => {
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const d = data.getDate();
    const m = meses[data.getMonth()];
    const h = data.getHours().toString().padStart(2, '0');
    const min = data.getMinutes().toString().padStart(2, '0');
    return `${d} de ${m} às ${h}:${min}hrs`;
  };

  // Buscar checklists com base nos filtros e paginação
  const buscarChecklists = useCallback(async () => {
    setLoading(true);
    
    try {
      const result = await getChecklists(
        filtros, 
        paginacao.currentPage, 
        limitePorPagina
      );
      
      setChecklists(result.checklists);
      setPaginacao(result.paginacao);
      setErro(null);
    } catch (error) {
      console.error('Erro ao buscar checklists:', error);
      setErro("Não foi possível carregar os checklists. Tente novamente mais tarde.");
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  }, [filtros, paginacao.currentPage, limitePorPagina]);

  // Adicionar um novo checklist
  const adicionarChecklist = useCallback(async (checklist) => {
    try {
      const novoChecklist = await addChecklist(checklist);
      
      // Ganhar experiência por adicionar novo checklist
      mostrarExp(50, "Você ganhou 50 exp por criar um novo checklist!");
      
      // Toast de sucesso
      toast({
        title: "Sucesso",
        description: "Checklist criado com sucesso",
      });
      
      // Atualizar a lista de checklists
      await buscarChecklists();
      
      return novoChecklist;
    } catch (error) {
      console.error('Erro ao adicionar checklist:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível criar o checklist",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [buscarChecklists, mostrarExp, toast]);

  // Atualizar um checklist existente
  const atualizarChecklist = useCallback(async (checklist) => {
    try {
      const checklistAtualizado = await updateChecklist(checklist);
      
      // Toast de sucesso
      toast({
        title: "Sucesso",
        description: "Checklist atualizado com sucesso",
      });
      
      // Atualizar a lista de checklists
      await buscarChecklists();
      
      return checklistAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o checklist",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [buscarChecklists, toast]);

  // Excluir um checklist
  const excluirChecklist = useCallback(async (id) => {
    try {
      const sucesso = await deleteChecklist(id);
      
      if (sucesso) {
        // Toast de sucesso
        toast({
          title: "Sucesso",
          description: "Checklist deletado com sucesso",
        });
        
        // Atualizar a lista de checklists
        await buscarChecklists();
      } else {
        toast({
          title: "Erro",
          description: "Checklist não encontrado",
          variant: "destructive"
        });
      }
      
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir checklist:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível deletar o checklist",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [buscarChecklists, toast]);

  // Buscar um checklist pelo ID
  const buscarChecklistPorId = useCallback(async (id) => {
    try {
      const checklist = await getChecklistPorId(id);
      setChecklistAtual(checklist);
      return checklist;
    } catch (error) {
      console.error('Erro ao buscar checklist:', error);
      throw error;
    }
  }, []);

  // === MÉTODOS PARA ITENS DO CHECKLIST ===

  // Adicionar item ao checklist
  const adicionarItem = useCallback(async (checklistId, texto) => {
    try {
      const novoItem = await addChecklistItem(checklistId, texto);
      
      // Update otimista: adicionar o item localmente
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              itens: [...checklist.itens, novoItem]
            };
          }
          return checklist;
        })
      );
      
      // Toast de sucesso
      toast({
        title: "Sucesso",
        description: "Item adicionado com sucesso",
      });
      
      return novoItem;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [toast]);

  // Atualizar item do checklist
  const atualizarItem = useCallback(async (checklistId, itemId, texto) => {
    try {
      // Update otimista: atualizar o texto localmente primeiro
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              itens: checklist.itens.map(item => {
                if (item.id === itemId) {
                  return { ...item, texto };
                }
                return item;
              })
            };
          }
          return checklist;
        })
      );
      
      const itemAtualizado = await updateChecklistItem(checklistId, itemId, texto);
      
      // Toast de sucesso
      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso",
      });
      
      return itemAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      
      // Reverter o estado otimista em caso de erro
      await buscarChecklists();
      
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [toast, buscarChecklists]);

  // Excluir item do checklist
  const excluirItem = useCallback(async (checklistId, itemId) => {
    try {
      // Update otimista: remover o item localmente primeiro
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              itens: checklist.itens.filter(item => item.id !== itemId)
            };
          }
          return checklist;
        })
      );
      
      const sucesso = await deleteChecklistItem(checklistId, itemId);
      
      if (sucesso) {
        // Toast de sucesso
        toast({
          title: "Sucesso",
          description: "Item deletado com sucesso",
        });
      } else {
        // Reverter o estado otimista em caso de falha
        await buscarChecklists();
        
        toast({
          title: "Erro",
          description: "Item não encontrado",
          variant: "destructive"
        });
      }
      
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      
      // Reverter o estado otimista em caso de erro
      await buscarChecklists();
      
      toast({
        title: "Erro",
        description: "Não foi possível deletar o item",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [toast, buscarChecklists]);

  // Marcar/desmarcar item como concluído
  const toggleItem = useCallback(async (checklistId, itemId) => {
    try {
      // Update otimista: atualizar o estado local primeiro
      setChecklists(prevChecklists => prevChecklists.map(checklist => {
        if (checklist.id !== checklistId) return checklist;
        const agora = new Date();
        const itensAtualizados = checklist.itens.map(item => {
          if (item.id !== itemId) return item;
          const novoStatus = !item.concluido;
          return {
            ...item,
            concluido: novoStatus,
            dataFinalizacao: novoStatus ? (item.dataFinalizacao || agora.toISOString()) : null,
            timestampFinalizacao: novoStatus ? (item.timestampFinalizacao || formatarTimestampLocal(agora)) : null,
          };
        });
        const todosConcluidos = itensAtualizados.length > 0 && itensAtualizados.every(i => i.concluido);
        return {
          ...checklist,
          itens: itensAtualizados,
          concluido: todosConcluidos,
          dataFinalizacao: todosConcluidos ? (checklist.dataFinalizacao || agora.toISOString()) : null,
          timestampFinalizacao: todosConcluidos ? (checklist.timestampFinalizacao || formatarTimestampLocal(agora)) : null,
        };
      }));
      
      // Fazer a atualização no backend
      const itemAtualizado = await toggleChecklistItem(checklistId, itemId);
      
      return itemAtualizado;
    } catch (error) {
      console.error('Erro ao toggle item:', error);
      
      // Em caso de erro, reverter o estado otimista fazendo reload
      await buscarChecklists();
      
      throw error;
    }
  }, [buscarChecklists]);

  // Marcar ou desmarcar todos os itens de um checklist
  const marcarTodos = useCallback(async (checklistId, concluido = true) => {
    try {
      // Update otimista: atualizar itens localmente
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => {
          if (checklist.id === checklistId) {
            const itens = (checklist.itens || []).map(item => ({
              ...item,
              concluido: !!concluido,
            }));
            const todosConcluidos = itens.length > 0 && itens.every(i => i.concluido);
            return {
              ...checklist,
              itens,
              concluido: todosConcluidos,
            };
          }
          return checklist;
        })
      );

      await marcarTodosItens(checklistId, concluido);
      // Toast de sucesso
      toast({
        title: concluido ? 'Todos concluídos' : 'Itens reabertos',
        description: concluido ? 'Todos os itens foram marcados como concluídos.' : 'Todos os itens foram desmarcados.',
      });
      // Recarrega para sincronizar timestamps corretos
      await buscarChecklists();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar todos os itens.',
        variant: 'destructive',
      });
      // Reverter estado em caso de erro
      await buscarChecklists();
      throw error;
    }
  }, [buscarChecklists]);

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

  // Abrir o modal para adicionar/editar checklist
  const abrirModal = useCallback((checklist = null) => {
    if (checklist) {
      setChecklistAtual(checklist);
      setModoEdicao(true);
    } else {
      setChecklistAtual(null);
      setModoEdicao(false);
    }
    setModalAberto(true);
  }, []);

  // Fechar o modal
  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setChecklistAtual(null);
    setModoEdicao(false);
  }, []);

  // Buscar checklists quando os filtros ou a página mudar
  useEffect(() => {
    const fetchData = async () => {
      await buscarChecklists();
    };
    
    fetchData();
  }, [buscarChecklists]);

  return {
    // Estados
    checklists,
    checklistAtual,
    loading,
    erro,
    paginacao,
    filtros,
    modalAberto,
    modoEdicao,
    
    // Métodos para checklists
    buscarChecklists,
    adicionarChecklist,
    atualizarChecklist,
    excluirChecklist,
    buscarChecklistPorId,
    mudarPagina,
    aplicarFiltros,
    abrirModal,
    fecharModal,
    
    // Métodos para itens
    adicionarItem,
    atualizarItem,
    excluirItem,
    toggleItem,
    marcarTodos
  };
};

export default useChecklist;