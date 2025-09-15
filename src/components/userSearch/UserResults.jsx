import React from 'react';
import UserCard from './UserCard';

/**
 * Componente que exibe uma lista de usuários encontrados
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.usuarios - Lista de usuários
 * @param {boolean} props.isLoading - Indica se está carregando
 * @returns {JSX.Element} Componente React
 */
const UserResults = ({ usuarios = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
      </div>
    );
  }

  if (!usuarios.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum usuário encontrado com os critérios informados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {usuarios.map((usuario, index) => (
        <UserCard key={usuario.bjj_id || index} usuario={usuario} />
      ))}
    </div>
  );
};

export default UserResults;