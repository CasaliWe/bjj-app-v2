import { createContext, useState, useContext, useEffect } from 'react';

// Criando o contexto
const UserContext = createContext();

// Hook personalizado para usar o contexto
export const useUser = () => useContext(UserContext);

// Provedor do contexto
export const UserProvider = ({ children }) => {
  // Estado do usuário
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Dados mockados para desenvolvimento
    setUser({
      nome: 'Weslei Pinto',
      email: 'weslei.casali@example.com',
      idade: 28,
      peso: 75,
      faixa: 'Azul',
      imagem: 'user.jpeg',
      telefone: '(11) 98765-4321',
      instagram: '@instagram',
      tiktok: '@tiktok',
      youtube: '@youtube',
      perfilPublico: 'Fechado',
      academia: 'Gracie Barra',
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil',
      estilo: 'Guardeiro',
      competidor: 'Sim',
      finalizacao: 'Triângulo',
      bio: 'Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações.',
      plano: 'Grátis'
    });

    // AQUI: Faça a chamada para a API para receber os dados do usuário
    // Exemplo:
    // const fetchUserData = async () => {
    //   try {
    //     const response = await api.get('/user');
    //     setUser(response.data);
    //   } catch (error) {
    //     console.error('Erro ao buscar dados do usuário:', error);
    //   }
    // };
    // fetchUserData();
  }, []);

  // Valores e funções que serão disponibilizados pelo contexto
  const value = {
    user,
    setUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
