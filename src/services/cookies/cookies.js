/**
 * cookies.js
 * Utilitários para gerenciamento de cookies no navegador
 * Este módulo fornece funções para configurar, obter e remover cookies
 */



/**
 * Define um cookie no navegador
 * @param {string} name - Nome do cookie
 * @param {string} value - Valor do cookie
 * @param {Object} options - Opções adicionais do cookie
 * @param {number} options.days - Dias até a expiração do cookie
 * @param {string} options.path - Caminho onde o cookie é válido (padrão: '/')
 * @param {boolean} options.secure - Se o cookie deve ser enviado apenas por HTTPS
 * @param {boolean} options.sameSite - Política SameSite do cookie ('strict', 'lax', 'none')
 */

export function setCookie(name, value, options = {}) {
  // Configurações padrão
  const defaultOptions = {
    days: 30,
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  // Mescla as opções padrão com as opções fornecidas
  const cookieOptions = { ...defaultOptions, ...options };

  // Calcula a data de expiração (se fornecida)
  let expires = '';
  if (cookieOptions.days) {
    const date = new Date();
    date.setTime(date.getTime() + (cookieOptions.days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }

  // Configura o atributo Secure
  const secure = cookieOptions.secure ? '; secure' : '';
  
  // Configura o atributo SameSite
  const sameSite = cookieOptions.sameSite ? `; samesite=${cookieOptions.sameSite}` : '';

  // Define o cookie
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${cookieOptions.path}${secure}${sameSite}`;
}

/**
 * Obtém o valor de um cookie pelo seu nome
 * @param {string} name - Nome do cookie a ser obtido
 * @returns {string|null} - Valor do cookie ou null se não existir
 */
export function getCookie(name) {
  // Procura pelo nome do cookie e extrai seu valor
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  
  return null;
}

/**
 * Remove um cookie pelo seu nome
 * @param {string} name - Nome do cookie a ser removido
 * @param {string} path - Caminho do cookie (deve ser o mesmo usado ao criar)
 */
export function removeCookie(name, path = '/') {
  // Para remover um cookie, configuramos sua data de expiração para o passado
  setCookie(name, '', { days: -1, path });
}

/**
 * Verifica se um cookie existe
 * @param {string} name - Nome do cookie a verificar
 * @returns {boolean} - true se o cookie existir, false caso contrário
 */
export function hasCookie(name) {
  return getCookie(name) !== null;
}

/**
 * Função específica para trabalhar com tokens JWT
 * @param {string} token - Token JWT a ser armazenado
 * @param {Object} options - Opções para o cookie do token
 */
export function setAuthToken(token, options = {}) {
  // Configurações padrão para cookies de autenticação
  const authOptions = {
    days: 30, // Cookies de autenticação também durarão 30 dias
    secure: true,
    sameSite: 'strict', // Maior segurança para cookies de autenticação
    ...options
  };
  
  setCookie('auth_token', token, authOptions);
}

/**
 * Obtém o token de autenticação armazenado
 * @returns {string|null} - Token JWT ou null se não existir
 */
export function getAuthToken() {
  return getCookie('auth_token');
}

/**
 * Remove o token de autenticação
 */
export function removeAuthToken() {
  removeCookie('auth_token');
}

/**
 * Verifica se o usuário está autenticado (tem um token)
 * @returns {boolean} - true se o usuário estiver autenticado, false caso contrário
 */
export function isAuthenticated() {
  return hasCookie('auth_token');
}

/**
 * Limpa todos os cookies da aplicação (útil para logout completo)
 * @param {Array} excludeList - Lista de nomes de cookies que não devem ser removidos
 */
export function clearAllCookies(excludeList = []) {
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    
    if (!excludeList.includes(name)) {
      removeCookie(name);
    }
  }
}
