/**
 * Serviço para gerenciar checklists
 * Integração com API (Bearer) somente via API (sem localStorage)
 */

// URL base da API
const URL = import.meta.env.VITE_API_URL;

// Importando utilitários de cookies para autenticação
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

// (IDs e storage local não são mais usados; apenas API)

/**
 * Busca a lista de checklists com base nos filtros e paginação
 * @param {Object} filtros - Filtros para busca (categoria, termo)
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Promise<Object>} Checklists filtrados e informações de paginação
 */
export const getChecklists = async (filtros = {}, pagina = 1, limite = 12) => {
  try {
    const response = await fetch(`${URL}endpoint/checklists/listar.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ filtros, pagina, limite })
    });
    const data = await response.json();
    if (!data?.success || !data?.data) {
      console.error('Erro ao buscar checklists:', data?.message);
      return { checklists: [], paginacao: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
    const mapped = (data.data.checklists || []).map(mapChecklistFromApi);
    return { checklists: mapped, paginacao: data.data.paginacao };
  } catch (error) {
    console.error('Erro ao buscar checklists:', error);
    return { checklists: [], paginacao: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }
};

/**
 * Adiciona um novo checklist
 * @param {Object} checklist - Dados do checklist
 * @returns {Promise<Object>} Checklist criado
 */
export const addChecklist = async (checklist) => {
  try {
    const response = await fetch(`${URL}endpoint/checklists/adicionar.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(checklist)
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.message || 'Erro ao adicionar checklist');
    return mapChecklistFromApi(data.data);
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
    const response = await fetch(`${URL}endpoint/checklists/atualizar.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(checklist)
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.message || 'Erro ao atualizar checklist');
    return mapChecklistFromApi(data.data);
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
    const response = await fetch(`${URL}endpoint/checklists/excluir.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (!data?.success) return false;
    return true;
  } catch (error) {
    console.error('Erro ao excluir checklist:', error);
    return false;
  }
};

/**
 * Busca um checklist por ID
 * @param {string} id - ID do checklist
 * @returns {Promise<Object>} Checklist encontrado
 */
export const getChecklistPorId = async (id) => {
  try {
    const response = await fetch(`${URL}endpoint/checklists/obter.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (!data?.success) {
      console.error('Erro ao buscar checklist:', data?.message);
      return null;
    }
    return mapChecklistFromApi(data.data);
  } catch (error) {
    console.error('Erro ao buscar checklist:', error);
    return null;
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
    const response = await fetch(`${URL}endpoint/checklists/item/adicionar.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ checklistId, texto })
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.message || 'Erro ao adicionar item');
    return mapItemFromApi(data.data);
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
    const response = await fetch(`${URL}endpoint/checklists/item/atualizar.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ checklistId, itemId, texto })
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.message || 'Erro ao atualizar item');
    return mapItemFromApi(data.data);
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
    const response = await fetch(`${URL}endpoint/checklists/item/excluir.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ checklistId, itemId })
    });
    const data = await response.json();
    if (!data?.success) return false;
    return true;
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    return false;
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
    const response = await fetch(`${URL}endpoint/checklists/item/toggle.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ checklistId, itemId })
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.message || 'Erro ao alternar item');
    return mapItemFromApi(data.data);
  } catch (error) {
    console.error('Erro ao alternar item:', error);
    throw error;
  }
};

// (Lógica de completar checklist no cliente removida; backend define estados)

/**
 * Marca ou desmarca todos os itens de um checklist
 * @param {string} checklistId
 * @param {boolean} concluido - true para marcar todos como concluídos, false para desmarcar
 * @returns {Promise<Object|null>} checklist atualizado
 */
export const marcarTodosItens = async (checklistId, concluido = true) => {
  try {
    const response = await fetch(`${URL}endpoint/checklists/item/marcar-todos.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ checklistId, concluido })
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.message || 'Erro ao marcar todos os itens');
    return mapChecklistFromApi(data.data);
  } catch (error) {
    console.error('Erro ao marcar todos os itens:', error);
    throw error;
  }
};

// Helpers para mapear resposta da API
const mapItemFromApi = (item) => {
  const dataCriacao = item.dataCriacao || item.data || item.createdAt || null;
  const dataFinalizacao = item.dataFinalizacao || item.finalizadoEm || item.finishedAt || null;
  return {
    id: item.id,
    texto: item.texto,
    concluido: !!item.concluido,
    dataCriacao,
    dataFinalizacao,
    timestampCriacao: dataCriacao ? formatarTimestamp(new Date(dataCriacao)) : null,
    timestampFinalizacao: dataFinalizacao ? formatarTimestamp(new Date(dataFinalizacao)) : null,
  };
};

const mapChecklistFromApi = (c) => {
  const dataCriacao = c.dataCriacao || c.data || c.createdAt || null;
  const dataFinalizacao = c.dataFinalizacao || c.finalizadoEm || c.finishedAt || null;
  const itens = Array.isArray(c.itens) ? c.itens.map(mapItemFromApi) : [];
  const concluido = typeof c.concluido === 'boolean' ? c.concluido : (itens.length > 0 && itens.every(i => i.concluido));
  return {
    id: c.id,
    titulo: c.titulo,
    categoria: c.categoria,
    dataCriacao,
    dataFinalizacao,
    timestampCriacao: dataCriacao ? formatarTimestamp(new Date(dataCriacao)) : null,
    timestampFinalizacao: dataFinalizacao ? formatarTimestamp(new Date(dataFinalizacao)) : null,
    itens,
    concluido,
  };
};