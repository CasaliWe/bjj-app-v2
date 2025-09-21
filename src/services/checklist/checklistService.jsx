/**
 * Serviço para gerenciar checklists
 * Este serviço implementa a integração com localStorage temporariamente
 * e está preparado para integração futura com a API
 */

// URL base da API (para futura implementação)
const URL = import.meta.env.VITE_API_URL;

// Importando utilitários de cookies para autenticação (para futura implementação)
import { getAuthToken } from '@/services/cookies/cookies';

// Definindo as categorias disponíveis para checklists
export const CATEGORIAS_CHECKLIST = [
  { value: "treino", label: "Treino", cor: "bg-blue-500 hover:bg-blue-600" },
  { value: "competicao", label: "Competição", cor: "bg-red-500 hover:bg-red-600" },
  { value: "estudo", label: "Estudo", cor: "bg-green-500 hover:bg-green-600" },
  { value: "fisico", label: "Físico", cor: "bg-purple-500 hover:bg-purple-600" },
  { value: "mental", label: "Mental", cor: "bg-yellow-500 hover:bg-yellow-600" },
  { value: "alimentacao", label: "Alimentação", cor: "bg-orange-500 hover:bg-orange-600" },
  { value: "pessoal", label: "Pessoal", cor: "bg-pink-500 hover:bg-pink-600" },
];

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'bjj_checklists';

// Função para gerar timestamp no formato brasileiro
const formatarTimestamp = (data = new Date()) => {
  const meses = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];
  
  const dia = data.getDate();
  const mes = meses[data.getMonth()];
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  
  return `${dia} de ${mes} às ${horas}:${minutos}hrs`;
};

// Função para gerar ID único
const gerarId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Função para obter dados do localStorage
const obterDadosLocalStorage = () => {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao ler localStorage:', error);
    return [];
  }
};

// Função para salvar dados no localStorage
const salvarDadosLocalStorage = (dados) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

/**
 * Busca a lista de checklists com base nos filtros e paginação
 * @param {Object} filtros - Filtros para busca (categoria, termo)
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Promise<Object>} Checklists filtrados e informações de paginação
 */
export const getChecklists = async (filtros = {}, pagina = 1, limite = 12) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let checklists = obterDadosLocalStorage();
    
    // Aplicar filtros
    if (filtros.categoria && filtros.categoria !== 'todas') {
      checklists = checklists.filter(checklist => checklist.categoria === filtros.categoria);
    }
    
    if (filtros.termo && filtros.termo.trim()) {
      const termo = filtros.termo.toLowerCase();
      checklists = checklists.filter(checklist => 
        checklist.titulo.toLowerCase().includes(termo)
      );
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    checklists.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
    
    // Calcular paginação
    const totalItems = checklists.length;
    const totalPages = Math.ceil(totalItems / limite);
    const startIndex = (pagina - 1) * limite;
    const endIndex = startIndex + limite;
    const checklistsPaginados = checklists.slice(startIndex, endIndex);
    
    return {
      checklists: checklistsPaginados,
      paginacao: {
        currentPage: pagina,
        totalPages,
        totalItems
      }
    };
  } catch (error) {
    console.error('Erro ao buscar checklists:', error);
    return {
      checklists: [],
      paginacao: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      }
    };
  }
};

/**
 * Adiciona um novo checklist
 * @param {Object} checklist - Dados do checklist
 * @returns {Promise<Object>} Checklist criado
 */
export const addChecklist = async (checklist) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const checklists = obterDadosLocalStorage();
    const agora = new Date();
    
    const novoChecklist = {
      id: gerarId(),
      titulo: checklist.titulo,
      categoria: checklist.categoria,
      dataCriacao: agora.toISOString(),
      dataFinalizacao: null,
      timestampCriacao: formatarTimestamp(agora),
      timestampFinalizacao: null,
      itens: [],
      concluido: false
    };
    
    checklists.push(novoChecklist);
    salvarDadosLocalStorage(checklists);
    
    return novoChecklist;
  } catch (error) {
    console.error('Erro ao adicionar checklist:', error);
    throw error;
  }
};

/**
 * Atualiza um checklist existente
 * @param {Object} checklist - Dados atualizados do checklist
 * @returns {Promise<Object>} Checklist atualizado
 */
export const updateChecklist = async (checklist) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const checklists = obterDadosLocalStorage();
    const index = checklists.findIndex(c => c.id === checklist.id);
    
    if (index === -1) {
      throw new Error('Checklist não encontrado');
    }
    
    // Manter dados existentes e atualizar apenas os campos editáveis
    checklists[index] = {
      ...checklists[index],
      titulo: checklist.titulo,
      categoria: checklist.categoria
    };
    
    salvarDadosLocalStorage(checklists);
    
    return checklists[index];
  } catch (error) {
    console.error('Erro ao atualizar checklist:', error);
    throw error;
  }
};

/**
 * Remove um checklist
 * @param {string} id - ID do checklist
 * @returns {Promise<boolean>} Sucesso da operação
 */
export const deleteChecklist = async (id) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklists = obterDadosLocalStorage();
    const novoArray = checklists.filter(checklist => checklist.id !== id);
    
    salvarDadosLocalStorage(novoArray);
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar checklist:', error);
    throw error;
  }
};

/**
 * Busca um checklist por ID
 * @param {string} id - ID do checklist
 * @returns {Promise<Object>} Checklist encontrado
 */
export const getChecklistPorId = async (id) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const checklists = obterDadosLocalStorage();
    const checklist = checklists.find(c => c.id === id);
    
    if (!checklist) {
      throw new Error('Checklist não encontrado');
    }
    
    return checklist;
  } catch (error) {
    console.error('Erro ao buscar checklist:', error);
    throw error;
  }
};

/**
 * Adiciona um item ao checklist
 * @param {string} checklistId - ID do checklist
 * @param {string} texto - Texto do item
 * @returns {Promise<Object>} Item criado
 */
export const addChecklistItem = async (checklistId, texto) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklists = obterDadosLocalStorage();
    const checklistIndex = checklists.findIndex(c => c.id === checklistId);
    
    if (checklistIndex === -1) {
      throw new Error('Checklist não encontrado');
    }
    
    const agora = new Date();
    const novoItem = {
      id: gerarId(),
      texto,
      concluido: false,
      dataCriacao: agora.toISOString(),
      dataFinalizacao: null,
      timestampCriacao: formatarTimestamp(agora),
      timestampFinalizacao: null
    };
    
    checklists[checklistIndex].itens.push(novoItem);
    salvarDadosLocalStorage(checklists);
    
    return novoItem;
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
};

/**
 * Atualiza um item do checklist
 * @param {string} checklistId - ID do checklist
 * @param {string} itemId - ID do item
 * @param {string} texto - Novo texto do item
 * @returns {Promise<Object>} Item atualizado
 */
export const updateChecklistItem = async (checklistId, itemId, texto) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklists = obterDadosLocalStorage();
    const checklistIndex = checklists.findIndex(c => c.id === checklistId);
    
    if (checklistIndex === -1) {
      throw new Error('Checklist não encontrado');
    }
    
    const itemIndex = checklists[checklistIndex].itens.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item não encontrado');
    }
    
    checklists[checklistIndex].itens[itemIndex].texto = texto;
    salvarDadosLocalStorage(checklists);
    
    return checklists[checklistIndex].itens[itemIndex];
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    throw error;
  }
};

/**
 * Remove um item do checklist
 * @param {string} checklistId - ID do checklist
 * @param {string} itemId - ID do item
 * @returns {Promise<boolean>} Sucesso da operação
 */
export const deleteChecklistItem = async (checklistId, itemId) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklists = obterDadosLocalStorage();
    const checklistIndex = checklists.findIndex(c => c.id === checklistId);
    
    if (checklistIndex === -1) {
      throw new Error('Checklist não encontrado');
    }
    
    checklists[checklistIndex].itens = checklists[checklistIndex].itens.filter(i => i.id !== itemId);
    
    // Verificar se todos os itens restantes estão concluídos
    verificarChecklistCompleto(checklists[checklistIndex]);
    
    salvarDadosLocalStorage(checklists);
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    throw error;
  }
};

/**
 * Marca/desmarca um item como concluído
 * @param {string} checklistId - ID do checklist
 * @param {string} itemId - ID do item
 * @returns {Promise<Object>} Item atualizado
 */
export const toggleChecklistItem = async (checklistId, itemId) => {
  try {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklists = obterDadosLocalStorage();
    const checklistIndex = checklists.findIndex(c => c.id === checklistId);
    
    if (checklistIndex === -1) {
      throw new Error('Checklist não encontrado');
    }
    
    const itemIndex = checklists[checklistIndex].itens.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item não encontrado');
    }
    
    const item = checklists[checklistIndex].itens[itemIndex];
    const agora = new Date();
    
    // Toggle do status
    item.concluido = !item.concluido;
    
    if (item.concluido) {
      // Marcar como concluído
      item.dataFinalizacao = agora.toISOString();
      item.timestampFinalizacao = formatarTimestamp(agora);
    } else {
      // Desmarcar
      item.dataFinalizacao = null;
      item.timestampFinalizacao = null;
    }
    
    // Verificar se todos os itens estão concluídos para finalizar o checklist
    verificarChecklistCompleto(checklists[checklistIndex]);
    
    salvarDadosLocalStorage(checklists);
    
    return item;
  } catch (error) {
    console.error('Erro ao toggle item:', error);
    throw error;
  }
};

/**
 * Verifica se todos os itens do checklist estão concluídos e atualiza o status
 * @param {Object} checklist - Checklist a ser verificado
 */
const verificarChecklistCompleto = (checklist) => {
  const agora = new Date();
  const todosItensCompletos = checklist.itens.length > 0 && checklist.itens.every(item => item.concluido);
  
  if (todosItensCompletos && !checklist.concluido) {
    // Marcar checklist como concluído
    checklist.concluido = true;
    checklist.dataFinalizacao = agora.toISOString();
    checklist.timestampFinalizacao = formatarTimestamp(agora);
  } else if (!todosItensCompletos && checklist.concluido) {
    // Desmarcar checklist como concluído
    checklist.concluido = false;
    checklist.dataFinalizacao = null;
    checklist.timestampFinalizacao = null;
  }
};

/**
 * Marca ou desmarca todos os itens de um checklist
 * @param {string} checklistId
 * @param {boolean} concluido - true para marcar todos como concluídos, false para desmarcar
 * @returns {Promise<Object|null>} checklist atualizado
 */
export const marcarTodosItens = async (checklistId, concluido = true) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const checklists = obterDadosLocalStorage();
    const checklistIndex = checklists.findIndex(c => c.id === checklistId);
    if (checklistIndex === -1) {
      throw new Error('Checklist não encontrado');
    }

    const agora = new Date();
    const checklist = checklists[checklistIndex];

    checklist.itens = (checklist.itens || []).map((item) => {
      if (concluido) {
        return {
          ...item,
          concluido: true,
          dataFinalizacao: item.dataFinalizacao || agora.toISOString(),
          timestampFinalizacao: item.timestampFinalizacao || formatarTimestamp(agora),
        };
      }
      return {
        ...item,
        concluido: false,
        dataFinalizacao: null,
        timestampFinalizacao: null,
      };
    });

    // Atualiza status do checklist conforme itens
    verificarChecklistCompleto(checklist);

    // Se todos marcados como concluído e havia itens, garante timestamp de finalização
    if (concluido && checklist.itens.length > 0) {
      checklist.concluido = true;
      checklist.dataFinalizacao = checklist.dataFinalizacao || agora.toISOString();
      checklist.timestampFinalizacao = checklist.timestampFinalizacao || formatarTimestamp(agora);
    }

    // Se desmarcado, limpa finalização do checklist
    if (!concluido) {
      checklist.concluido = false;
      checklist.dataFinalizacao = null;
      checklist.timestampFinalizacao = null;
    }

    checklists[checklistIndex] = checklist;
    salvarDadosLocalStorage(checklists);
    return checklist;
  } catch (error) {
    console.error('Erro ao marcar todos os itens:', error);
    throw error;
  }
};