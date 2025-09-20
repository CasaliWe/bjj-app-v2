/**
 * Serviço para gerenciar os planos de jogo do usuário via API
 * Este serviço segue os padrões dos services de Técnicas e Treinos (GET/POST + token)
 */

// URL base da API
const BASE_URL = import.meta.env.VITE_API_URL || '';

// Evento para notificar os componentes quando houver mudanças
export const PLANO_JOGO_UPDATE_EVENT = 'plano_jogo_update';
export const notifyUpdate = () => window.dispatchEvent(new CustomEvent(PLANO_JOGO_UPDATE_EVENT));

// Header de autenticação (Bearer token via cookies service)
import { getAuthToken } from '@/services/cookies/cookies';
const getAuthHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` });

// Helpers
const parseJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Resposta inválida da API: ${text.substring(0, 200)}...`);
  }
};

/**
 * Lista todos os planos do usuário
 * @returns {Promise<Array>} Array de planos
 */
export const getPlanos = async () => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/listar.php`;
    const response = await fetch(url, { method: 'GET', headers: { ...getAuthHeader() } });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao listar planos de jogo');
    }
    const data = await parseJson(response);
    return data.data?.planos || [];
  } catch (error) {
    console.error('Erro ao buscar planos de jogo da API:', error);
    return [];
  }
};

/**
 * Obtém um plano por ID
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
export const getPlanoById = async (id) => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/obter.php?id=${encodeURIComponent(id)}`;
    const response = await fetch(url, { method: 'GET', headers: { ...getAuthHeader() } });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao obter plano de jogo');
    }
    const data = await parseJson(response);
    return data.data?.plano || null;
  } catch (error) {
    console.error('Erro ao obter plano de jogo:', error);
    return null;
  }
};

/**
 * Cria um novo plano de jogo
 * @param {Object} plano - { nome, descricao?, categoria? }
 * @returns {Promise<Object>} plano criado
 */
export const criarPlano = async (plano) => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/criar.php`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(plano)
    });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao criar plano de jogo');
    }
    const data = await parseJson(response);
    notifyUpdate();
    return data.data?.plano || data.data || data;
  } catch (error) {
    console.error('Erro ao criar plano de jogo:', error);
    throw error;
  }
};

/**
 * Atualiza dados do plano
 * @param {string|number} id
 * @param {Object} dadosAtualizados
 * @returns {Promise<Object|null>}
 */
export const atualizarPlano = async (id, dadosAtualizados) => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/atualizar.php`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, ...dadosAtualizados })
    });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao atualizar plano de jogo');
    }
    const data = await parseJson(response);
    notifyUpdate();
    return data.data?.plano || data.data || null;
  } catch (error) {
    console.error('Erro ao atualizar plano de jogo:', error);
    return null;
  }
};

/**
 * Adiciona um nó à árvore de um plano
 * @param {string|number} planoId
 * @param {Object} node - { nome, tipo, descricao?, tecnicaId?, categoria?, posicao?, passos?, observacoes?, video_url?, video_poster?, video? }
 * @param {string|null} parentId
 * @returns {Promise<Object|null>} plano atualizado
 */
export const adicionarNode = async (planoId, node, parentId = null) => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/adicionar-node.php`;
    const payload = { planoId, parentId, node };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao adicionar nó ao plano');
    }
    const data = await parseJson(response);
    notifyUpdate();
    return data.data?.plano || data.data || null;
  } catch (error) {
    console.error('Erro ao adicionar nó ao plano:', error);
    return null;
  }
};

/**
 * Remove um nó do plano
 * @param {string|number} planoId
 * @param {string|number} nodeId
 * @returns {Promise<Object|null>} plano atualizado
 */
export const removerNode = async (planoId, nodeId) => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/remover-node.php`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ planoId, nodeId })
    });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao remover nó do plano');
    }
    const data = await parseJson(response);
    notifyUpdate();
    return data.data?.plano || data.data || null;
  } catch (error) {
    console.error('Erro ao remover nó do plano:', error);
    return null;
  }
};

/**
 * Exclui um plano
 * @param {string|number} id
 * @returns {Promise<boolean>}
 */
export const excluirPlano = async (id) => {
  try {
    const url = `${BASE_URL}endpoint/plano-jogo/excluir.php`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      const err = await parseJson(response);
      throw new Error(err.message || 'Erro ao excluir plano de jogo');
    }
    await parseJson(response);
    notifyUpdate();
    return true;
  } catch (error) {
    console.error('Erro ao excluir plano de jogo:', error);
    return false;
  }
};

/**
 * Limpeza local (sem efeito na API) – utilitária
 */
export const limparPlanos = async () => {
  notifyUpdate();
  return true;
};