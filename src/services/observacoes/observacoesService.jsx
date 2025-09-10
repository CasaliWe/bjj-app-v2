/**
 * Serviço para gerenciar observações
 * Este serviço implementa a integração com a API para operações CRUD de observações
 */

// URL base da API (importando da variável de ambiente)
const URL = import.meta.env.VITE_API_URL;

// Importando utilitários de cookies para autenticação
import { getAuthToken } from '@/services/cookies/cookies';

// Definindo as categorias de tags disponíveis
export const CATEGORIAS_TAGS = [
  { value: "treino", label: "Treino", cor: "bg-blue-500 hover:bg-blue-600" },
  { value: "competicao", label: "Competição", cor: "bg-red-500 hover:bg-red-600" },
  { value: "posicao", label: "Posição", cor: "bg-green-500 hover:bg-green-600" },
  { value: "finalizacao", label: "Finalização", cor: "bg-purple-500 hover:bg-purple-600" },
  { value: "mentalidade", label: "Mentalidade", cor: "bg-yellow-500 hover:bg-yellow-600" },
  { value: "alimentacao", label: "Alimentação", cor: "bg-orange-500 hover:bg-orange-600" },
];

/**
 * === ENDPOINT: endpoint/observacoes/listar.php ===
 * 
 * Requisição recebida pelo backend:
 * {
 *   "filtros": {
 *     "tag": "treino", // ou "todas" ou outra categoria
 *     "termo": "texto para busca" // ou string vazia
 *   },
 *   "pagina": 1, // número da página atual
 *   "limite": 12 // quantidade de itens por página
 * }
 * 
 * Resposta esperada do backend:
 * {
 *   "success": true,
 *   "message": "Observações obtidas com sucesso",
 *   "data": {
 *     "observacoes": [
 *       {
 *         "id": 1,
 *         "titulo": "Título da observação",
 *         "conteudo": "Conteúdo da observação",
 *         "tag": "treino", // Uma das categorias válidas
 *         "data": "2025-09-10T14:30:00", // Data ISO 8601
 *         "usuarioId": 1
 *       },
 *       // ... outras observações
 *     ],
 *     "paginacao": {
 *       "currentPage": 1,
 *       "totalPages": 5,
 *       "totalItems": 50
 *     }
 *   }
 * }
 * 
 * Busca a lista de observações com base nos filtros e paginação
 * @param {Object} filtros - Filtros para busca (tag, termo)
 * @param {number} pagina - Número da página atual
 * @param {number} limite - Número de itens por página
 * @returns {Promise<Object>} Observações filtradas e informações de paginação
 */
export const getObservacoes = async (filtros = {}, pagina = 1, limite = 12) => {
  try {
    const response = await fetch(`${URL}endpoint/observacoes/listar.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        filtros,
        pagina,
        limite
      })
    });

    const data = await response.json();

    // Verificar se a resposta foi bem-sucedida
    if (!data.success) {
      console.error('Erro ao buscar observações:', data.message);
      return {
        observacoes: [],
        paginacao: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
        }
      };
    }

    // Formatação esperada da resposta
    return {
      observacoes: data.data.observacoes,
      paginacao: data.data.paginacao
    };
  } catch (error) {
    console.error('Erro ao buscar observações:', error);
    // Retornar objeto vazio em caso de erro
    return {
      observacoes: [],
      paginacao: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
      }
    };
  }
};

/**
 * === ENDPOINT: endpoint/observacoes/adicionar.php ===
 * 
 * Requisição recebida pelo backend:
 * {
 *   "titulo": "Título da observação",
 *   "conteudo": "Conteúdo da observação",
 *   "tag": "treino" // Uma das categorias válidas
 *   // Não é necessário enviar a data ou usuarioId, esses dados devem ser gerados no backend
 * }
 * 
 * Resposta esperada do backend:
 * {
 *   "success": true,
 *   "message": "Observação adicionada com sucesso",
 *   "data": {
 *     "id": 10, // ID gerado pelo banco de dados
 *     "titulo": "Título da observação",
 *     "conteudo": "Conteúdo da observação",
 *     "tag": "treino",
 *     "data": "2025-09-10T14:30:00", // Data atual gerada no backend
 *     "usuarioId": 1 // ID do usuário autenticado (obtido do token)
 *   }
 * }
 * 
 * Adiciona uma nova observação
 * @param {Object} observacao - Dados da observação a ser adicionada
 * @returns {Promise<Object>} Observação adicionada com ID gerado
 */
export const addObservacao = async (observacao) => {
  try {
    const response = await fetch(`${URL}endpoint/observacoes/adicionar.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(observacao)
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Erro ao adicionar observação:', data.message);
      throw new Error(data.message || 'Erro ao adicionar observação');
    }

    return data.data; // Retorna a observação criada
  } catch (error) {
    console.error('Erro ao adicionar observação:', error);
    throw error;
  }
};

/**
 * === ENDPOINT: endpoint/observacoes/atualizar.php ===
 * 
 * Requisição recebida pelo backend:
 * {
 *   "id": 10, // ID da observação a ser atualizada
 *   "titulo": "Título atualizado",
 *   "conteudo": "Conteúdo atualizado",
 *   "tag": "posicao" // Tag atualizada
 *   // Não é necessário enviar data ou usuarioId
 * }
 * 
 * Resposta esperada do backend:
 * {
 *   "success": true,
 *   "message": "Observação atualizada com sucesso",
 *   "data": {
 *     "id": 10,
 *     "titulo": "Título atualizado",
 *     "conteudo": "Conteúdo atualizado",
 *     "tag": "posicao",
 *     "data": "2025-09-10T14:30:00", // Manter a data original
 *     "usuarioId": 1
 *   }
 * }
 * 
 * Importante: O backend deve verificar se a observação pertence ao usuário autenticado
 * antes de permitir a atualização.
 * 
 * Atualiza uma observação existente
 * @param {Object} observacao - Dados atualizados da observação
 * @returns {Promise<Object>} Observação atualizada
 */
export const updateObservacao = async (observacao) => {
  try {
    const response = await fetch(`${URL}endpoint/observacoes/atualizar.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(observacao)
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Erro ao atualizar observação:', data.message);
      throw new Error(data.message || 'Erro ao atualizar observação');
    }

    return data.data; // Retorna a observação atualizada
  } catch (error) {
    console.error('Erro ao atualizar observação:', error);
    throw error;
  }
};

/**
 * === ENDPOINT: endpoint/observacoes/excluir.php ===
 * 
 * Requisição recebida pelo backend:
 * {
 *   "id": 10 // ID da observação a ser excluída
 * }
 * 
 * Resposta esperada do backend:
 * {
 *   "success": true,
 *   "message": "Observação excluída com sucesso",
 *   "data": null // Ou pode retornar o ID da observação excluída se preferir
 * }
 * 
 * Em caso de erro ou observação não encontrada:
 * {
 *   "success": false,
 *   "message": "Observação não encontrada ou você não tem permissão para excluí-la",
 *   "data": null
 * }
 * 
 * Importante: O backend deve verificar se a observação pertence ao usuário autenticado
 * antes de permitir a exclusão.
 * 
 * Exclui uma observação
 * @param {number} id - ID da observação a ser excluída
 * @returns {Promise<boolean>} Indica se a exclusão foi bem-sucedida
 */
export const deleteObservacao = async (id) => {
  try {
    const response = await fetch(`${URL}endpoint/observacoes/excluir.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ id })
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Erro ao excluir observação:', data.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir observação:', error);
    return false;
  }
};

/**
 * === ENDPOINT: endpoint/observacoes/obter.php ===
 * 
 * Requisição recebida pelo backend:
 * {
 *   "id": 10 // ID da observação a ser obtida
 * }
 * 
 * Resposta esperada do backend:
 * {
 *   "success": true,
 *   "message": "Observação obtida com sucesso",
 *   "data": {
 *     "id": 10,
 *     "titulo": "Título da observação",
 *     "conteudo": "Conteúdo da observação",
 *     "tag": "treino",
 *     "data": "2025-09-10T14:30:00",
 *     "usuarioId": 1
 *   }
 * }
 * 
 * Em caso de observação não encontrada:
 * {
 *   "success": false,
 *   "message": "Observação não encontrada ou você não tem permissão para visualizá-la",
 *   "data": null
 * }
 * 
 * Importante: O backend deve verificar se a observação pertence ao usuário autenticado
 * antes de retorná-la.
 * 
 * Obtém uma observação pelo ID
 * @param {number} id - ID da observação
 * @returns {Promise<Object|null>} Observação encontrada ou null se não existir
 */
export const getObservacaoPorId = async (id) => {
  try {
    const response = await fetch(`${URL}endpoint/observacoes/obter.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ id })
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Erro ao buscar observação:', data.message);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Erro ao buscar observação por ID:', error);
    return null;
  }
};

/**
 * === ESTRUTURA DA TABELA NO BANCO DE DADOS ===
 * 
 * Tabela: observacoes
 * 
 * Campos:
 * - id: INT(11) AUTO_INCREMENT PRIMARY KEY
 *   Identificador único da observação
 * 
 * - titulo: VARCHAR(255) NOT NULL
 *   Título da observação
 * 
 * - conteudo: TEXT NOT NULL
 *   Conteúdo/texto completo da observação
 * 
 * - tag: VARCHAR(50) NOT NULL
 *   Categoria da observação (treino, competicao, posicao, finalizacao, mentalidade, alimentacao)
 * 
 * - data: DATETIME NOT NULL
 *   Data e hora de criação da observação (usar NOW() ou CURRENT_TIMESTAMP ao criar)
 * 
 * - usuario_id: INT(11) NOT NULL
 *   ID do usuário que criou a observação (chave estrangeira para a tabela de usuários)
 * 
 * - data_atualizacao: DATETIME NULL
 *   Data e hora da última atualização (opcional, atualizar sempre que a observação for editada)
 * 
 * Índices recomendados:
 * - INDEX(usuario_id) - Para buscar rapidamente todas as observações de um usuário
 * - INDEX(tag) - Para filtrar por categoria
 * - INDEX(data) - Para ordenar por data mais recente
 * 
 * Exemplo de SQL para criar a tabela:
 * 
 * CREATE TABLE observacoes (
 *   id INT(11) NOT NULL AUTO_INCREMENT,
 *   titulo VARCHAR(255) NOT NULL,
 *   conteudo TEXT NOT NULL,
 *   tag VARCHAR(50) NOT NULL,
 *   data DATETIME NOT NULL,
 *   usuario_id INT(11) NOT NULL,
 *   data_atualizacao DATETIME NULL,
 *   PRIMARY KEY (id),
 *   INDEX(usuario_id),
 *   INDEX(tag),
 *   INDEX(data)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */
