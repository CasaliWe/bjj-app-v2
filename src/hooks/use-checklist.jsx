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
  toggleChecklistItem,
  marcarTodosItens,
  finalizarChecklist
} from '../services/checklist/checklistService.jsx';
import { useExp } from '@/components/exp/Exp';

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
  
  // Controle de XP: Set para armazenar IDs dos checklists que já deram XP na sessão
  const [checklistsComXp, setChecklistsComXp] = useState(new Set());
  
  // Hook para mostrar experiência
  const { mostrarExp } = useExp();
  
  // Toasts removidos conforme solicitação; manteremos UX sem toasters

  // Função para verificar e conceder XP por conclusão de checklist
  const verificarEConcederXP = useCallback((checklist) => {
    // Verificar se a lista foi concluída, tem mais de 5 itens e ainda não deu XP
    const listaConcluida = checklist.concluido && checklist.itens.length > 5;
    const jaGanhouXP = checklistsComXp.has(checklist.id);
    
    if (listaConcluida && !jaGanhouXP) {
      // Marcar que este checklist já deu XP
      setChecklistsComXp(prev => new Set([...prev, checklist.id]));
      
      // Dar 25 XP
      mostrarExp(25, `Parabéns! Você completou uma lista com ${checklist.itens.length} itens e ganhou 25 XP!`);
      
      return true;
    }
    
    return false;
  }, [checklistsComXp, mostrarExp]);

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
      
      // Atualizar a lista de checklists
      await buscarChecklists();
      
      return novoChecklist;
    } catch (error) {
      console.error('Erro ao adicionar checklist:', error);
      
      throw error;
    }
  }, [buscarChecklists, mostrarExp]);

  // Atualizar um checklist existente
  const atualizarChecklist = useCallback(async (checklist) => {
    try {
      const checklistAtualizado = await updateChecklist(checklist);
      
      // Atualizar a lista de checklists
      await buscarChecklists();
      
      return checklistAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
      
      throw error;
    }
  }, [buscarChecklists]);

  // Excluir um checklist
  const excluirChecklist = useCallback(async (id) => {
    try {
      const sucesso = await deleteChecklist(id);
      
      if (sucesso) {
        // Atualizar a lista de checklists
        await buscarChecklists();
      } else {
        // Sem toaster; manter silêncio em caso de não encontrado
      }
      
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir checklist:', error);
      throw error;
    }
  }, [buscarChecklists]);

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
      
      return novoItem;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  }, []);

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
      
      return itemAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      
      // Reverter o estado otimista em caso de erro
      await buscarChecklists();
      throw error;
    }
  }, [buscarChecklists]);

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
      
      if (!sucesso) {
        // Reverter o estado otimista em caso de falha
        await buscarChecklists();
      }
      
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      
      // Reverter o estado otimista em caso de erro
      await buscarChecklists();
      throw error;
    }
  }, [buscarChecklists]);

  // Marcar/desmarcar item como concluído
  const toggleItem = useCallback(async (checklistId, itemId) => {
    try {
      let checklistAnterior = null;
      
      // Update otimista: atualizar o estado local primeiro
      setChecklists(prevChecklists => prevChecklists.map(checklist => {
        if (checklist.id !== checklistId) return checklist;
        
        // Guardar estado anterior para comparação
        checklistAnterior = { ...checklist };
        
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
        
        const checklistAtualizado = {
          ...checklist,
          itens: itensAtualizados,
          concluido: todosConcluidos,
          dataFinalizacao: todosConcluidos ? (checklist.dataFinalizacao || agora.toISOString()) : null,
          timestampFinalizacao: todosConcluidos ? (checklist.timestampFinalizacao || formatarTimestampLocal(agora)) : null,
        };
        
        // Verificar se acabou de completar a lista (transição de incompleto para completo)
        const acabouDeCompletar = !checklistAnterior.concluido && checklistAtualizado.concluido;
        if (acabouDeCompletar) {
          // Usar setTimeout para dar XP após o state update
          setTimeout(() => {
            verificarEConcederXP(checklistAtualizado);
          }, 100);
        }
        
        return checklistAtualizado;
      }));
      
      // Fazer a atualização no backend
      const itemAtualizado = await toggleChecklistItem(checklistId, itemId);
      
      // Após toggle, solicitar atualização do status do checklist
      try {
        await finalizarChecklist(checklistId);
        // Recarregar para garantir que o estado esteja sincronizado
        await buscarChecklists();
      } catch (finalizarError) {
        console.warn('Erro ao atualizar status do checklist:', finalizarError);
        // Não falhamos aqui, pois o item foi atualizado com sucesso
        await buscarChecklists();
      }
      
      return itemAtualizado;
    } catch (error) {
      console.error('Erro ao toggle item:', error);
      
      // Em caso de erro, reverter o estado otimista fazendo reload
      await buscarChecklists();
      
      throw error;
    }
  }, [buscarChecklists, verificarEConcederXP]);

  // Marcar ou desmarcar todos os itens de um checklist
  const marcarTodos = useCallback(async (checklistId, concluido = true) => {
    try {
      let checklistAnterior = null;
      
      // Update otimista: atualizar itens localmente
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => {
          if (checklist.id === checklistId) {
            // Guardar estado anterior
            checklistAnterior = { ...checklist };
            
            const itens = (checklist.itens || []).map(item => ({
              ...item,
              concluido: !!concluido,
            }));
            const todosConcluidos = itens.length > 0 && itens.every(i => i.concluido);
            
            const checklistAtualizado = {
              ...checklist,
              itens,
              concluido: todosConcluidos,
            };
            
            // Verificar se acabou de completar a lista (só quando marcando como concluído)
            const acabouDeCompletar = concluido && !checklistAnterior.concluido && checklistAtualizado.concluido;
            if (acabouDeCompletar) {
              // Usar setTimeout para dar XP após o state update
              setTimeout(() => {
                verificarEConcederXP(checklistAtualizado);
              }, 100);
            }
            
            return checklistAtualizado;
          }
          return checklist;
        })
      );

      await marcarTodosItens(checklistId, concluido);
      // Recarrega para sincronizar timestamps corretos
      await buscarChecklists();
    } catch (error) {
      // Reverter estado em caso de erro
      await buscarChecklists();
      throw error;
    }
  }, [buscarChecklists, verificarEConcederXP]);

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