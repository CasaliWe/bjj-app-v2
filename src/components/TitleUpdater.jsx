import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setTitleByRoute } from '@/services/title';

/**
 * Componente que atualiza o título da página com base na rota atual
 * Este componente não renderiza nada, apenas observa mudanças na rota
 */
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    setTitleByRoute(location.pathname);
  }, [location]);

  return null; // Este componente não renderiza nada
};

export default TitleUpdater;
