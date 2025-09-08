// Configurações para autenticação com Google
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; 
const URL = import.meta.env.VITE_API_URL; 


// LOGIN COM EMAIL E SENHA ****************************
export const login = async (email, senha) => {
  try {
      const response = await fetch(`${URL}endpoint/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      return data;
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
};


// LOGIN COM GOOGLE ************************************
export const loginGoogle = () => {
  return new Promise((resolve, reject) => {
    try {
      // Verificar se o script do Google já está carregado
      if (!window.google) {
        loadGoogleScript()
          .then(() => initializeGoogleLogin(resolve, reject))
          .catch(error => reject(error));
      } else {
        initializeGoogleLogin(resolve, reject);
      }
    } catch (error) {
      console.error("Erro ao iniciar login com Google:", error);
      reject(error);
    }
  });
};

const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    // Verificar se o script já existe
    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      resolve();
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Falha ao carregar o script do Google"));
    document.body.appendChild(script);
  });
};

const initializeGoogleLogin = (resolve, reject) => {
  // Configuração do cliente Google
  const client = window.google?.accounts?.oauth2?.initCodeClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: "email profile",
    ux_mode: "popup",
    callback: (response) => {
      if (response.code) {        
        // retornando o código de autorização para o chamador da função *******************
        resolve(response.code);
      } else {
        reject(new Error("Falha ao obter código de autorização do Google"));
      }
    },
  });
  
  // Se o cliente foi inicializado com sucesso, abre o popup
  if (client) {
    client.requestCode();
  } else {
    reject(new Error("Falha ao inicializar o cliente Google OAuth"));
  }
};