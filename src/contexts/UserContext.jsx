import { createContext, useState, useContext, useEffect } from 'react';

import {getAuthToken} from "@/services/cookies/cookies";

const URL = import.meta.env.VITE_API_URL;

// Criando o contexto
const UserContext = createContext();

// Hook personalizado para usar o contexto
export const useUser = () => useContext(UserContext);

// Provedor do contexto
export const UserProvider = ({ children }) => {
  // Estado do usuário
  const [user, setUser] = useState(null);

  useEffect(() => {
    // buscando dados do user na API
    const fetchUserData = async () => {
      try {
        if(getAuthToken()){
          const response = await fetch(`${URL}/endpoint/auth/user.php`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            }
          });
          const data = await response.json();
          if(data.success){
            setUser(data.data);
          }else{
            setUser(null);
            console.error('Erro ao buscar dados do usuário:', data.message);
            window.location.href = '/login';
          }
        }else{
          setUser(null);
          console.error('Usuário não autenticado');
          window.location.href = '/login'; 
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, []);

  // Valores e funções que serão disponibilizados pelo contexto
  const value = {
    user,
    setUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
