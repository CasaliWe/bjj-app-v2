import { useUser } from '../contexts/UserContext';
import { getAuthToken } from '../services/cookies/cookies';

const URL = import.meta.env.VITE_API_URL;

/**
 * Hook personalizado para buscar dados do usuário atual
 * @returns {Object} - Funções e dados relacionados ao usuário
 */
export const useGetUser = () => {
    // Obtendo o contexto do usuário
    const { user, setUser } = useUser();

    // Função para buscar dados do usuário na API
    const fetchUserData = async () => {
      try {
          const response = await fetch(`${URL}endpoint/user/getData.php`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            }
          });
          const data = await response.json();
          setUser(data.data);
          return data.data;
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }
    };

    return {
        user,
        fetchUserData
    };
};