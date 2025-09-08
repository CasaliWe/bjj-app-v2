import { createContext, useState, useContext } from 'react';

// Criando o contexto
const UserContext = createContext();

// Hook personalizado para usar o contexto
export const useUser = () => useContext(UserContext);

// Provedor do contexto
export const UserProvider = ({ children }) => {
  // Estado do usuário
  const [user, setUser] = useState(null);

  // Valores e funções que serão disponibilizados pelo contexto
  const value = {
    user,
    setUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
