const URL = import.meta.env.VITE_API_URL; 

// CADASTRO DO USUÁRIO ****************************
export const cadastrar = async (dados) => {
  try {
    const response = await fetch(`${URL}endpoint/auth/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // lidar com erros de rede ou outros erros
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
};    