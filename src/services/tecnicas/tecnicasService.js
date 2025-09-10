import { MOCK_TECNICAS, MOCK_TECNICAS_COMUNIDADE, MOCK_POSICOES } from "@/components/tecnicas/mockData";

/**
 * Serviço para gerenciar as técnicas do usuário
 * Este arquivo deve ser substituído por chamadas reais à API no futuro
 */

/**
 * Busca todas as técnicas do usuário
 * @returns {Promise<Array>} Promessa que resolve para um array de técnicas
 */
export const getTecnicas = async () => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TECNICAS);
    }, 300);
  });
};

/**
 * Busca técnicas da comunidade
 * @param {string} termo - Termo de pesquisa opcional
 * @returns {Promise<Array>} Promessa que resolve para um array de técnicas da comunidade
 */
export const getTecnicasComunidade = async (termo = "") => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!termo) {
        resolve(MOCK_TECNICAS_COMUNIDADE);
        return;
      }
      
      const termoLowerCase = termo.toLowerCase();
      const filtradas = MOCK_TECNICAS_COMUNIDADE.filter(tecnica => {
        return (
          tecnica.nome.toLowerCase().includes(termoLowerCase) ||
          tecnica.categoria.toLowerCase().includes(termoLowerCase) ||
          tecnica.posicao.toLowerCase().includes(termoLowerCase) ||
          (tecnica.autor && tecnica.autor.nome.toLowerCase().includes(termoLowerCase))
        );
      });
      
      resolve(filtradas);
    }, 300);
  });
};

/**
 * Busca as posições cadastradas pelo usuário e padrão
 * @returns {Promise<Array>} Promessa que resolve para um array de posições
 */
export const getPosicoes = async () => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_POSICOES);
    }, 300);
  });
};

/**
 * Salva uma nova técnica ou atualiza uma existente
 * @param {Object} tecnica - Dados da técnica a ser salva
 * @returns {Promise<Object>} Promessa que resolve para a técnica salva
 */
export const saveTecnica = async (tecnica) => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Gerar um ID para novas técnicas
      if (!tecnica.id) {
        tecnica.id = Date.now();
      }
      resolve(tecnica);
    }, 300);
  });
};

/**
 * Exclui uma técnica
 * @param {number} id - ID da técnica a ser excluída
 * @returns {Promise<boolean>} Promessa que resolve para true se a exclusão for bem-sucedida
 */
export const deleteTecnica = async (id) => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Atualiza o destaque de uma técnica
 * @param {number} id - ID da técnica
 * @param {boolean} destacado - Se a técnica deve ser destacada ou não
 * @returns {Promise<Object>} Promessa que resolve para a técnica atualizada
 */
export const updateDestaque = async (id, destacado) => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, destacado });
    }, 300);
  });
};

/**
 * Atualiza a visibilidade pública de uma técnica
 * @param {number} id - ID da técnica
 * @param {boolean} publica - Se a técnica deve ser pública ou não
 * @returns {Promise<Object>} Promessa que resolve para a técnica atualizada
 */
export const updatePublica = async (id, publica) => {
  // Simulando um delay para representar uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, publica });
    }, 300);
  });
};

/**
 * API Notes:
 * 
 * Endpoints necessários para a implementação real:
 * 
 * 1. GET /api/tecnicas
 *    - Retorna todas as técnicas do usuário autenticado
 * 
 * 2. GET /api/tecnicas/posicoes
 *    - Retorna todas as posições disponíveis (padrão + cadastradas pelo usuário)
 * 
 * 3. GET /api/tecnicas/comunidade?termo={termo}
 *    - Retorna técnicas públicas da comunidade, opcionalmente filtradas por termo
 * 
 * 4. POST /api/tecnicas
 *    - Cria uma nova técnica
 *    - Corpo: todos os dados da técnica
 * 
 * 5. PUT /api/tecnicas/{id}
 *    - Atualiza uma técnica existente
 *    - Corpo: todos os dados da técnica
 * 
 * 6. DELETE /api/tecnicas/{id}
 *    - Exclui uma técnica
 * 
 * 7. PATCH /api/tecnicas/{id}/destaque
 *    - Atualiza apenas o destaque de uma técnica
 *    - Corpo: { destacado: boolean }
 * 
 * 8. PATCH /api/tecnicas/{id}/publica
 *    - Atualiza apenas a visibilidade pública de uma técnica
 *    - Corpo: { publica: boolean }
 * 
 * Estrutura de dados para cada técnica no banco:
 * - id: number
 * - nome: string
 * - categoria: string (guardeiro/passador)
 * - posicao: string
 * - passos: array de strings
 * - observacoes: array de strings
 * - nota: number (1-5)
 * - video: string (URL opcional)
 * - destacado: boolean
 * - publica: boolean
 * - userId: number (referência ao usuário que criou)
 * - createdAt: timestamp
 * - updatedAt: timestamp
 */
