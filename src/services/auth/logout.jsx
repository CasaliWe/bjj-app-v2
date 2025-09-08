import { removeAuthToken } from '../cookies/cookies';

export const sair = () => {
  removeAuthToken();
  window.location.href = '/login'; // Redireciona para a página de login
};