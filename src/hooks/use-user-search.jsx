import { useState, useCallback, useEffect } from 'react';
import { searchUsers } from '@/services/user/userSearchService';

/**
 * Hook personalizado para gerenciar a pesquisa de usuários
 * @returns {Object} Estados e métodos para manipular a pesquisa de usuários
 */
export const useUserSearch = () => {
  // Estados para a pesquisa de usuários
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('nome');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Realiza a pesquisa de usuários
   * @param {string} query - Termo de pesquisa
   * @param {string} type - Tipo de pesquisa ('nome' ou 'bjj_id')
   */
  const performSearch = useCallback(async (query, type = searchBy) => {
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const { usuarios } = await searchUsers(query, type);
      setSearchResults(usuarios);
    } catch (error) {
      console.error('Erro ao pesquisar usuários:', error);
      setSearchError('Não foi possível realizar a pesquisa. Tente novamente mais tarde.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchBy]);

  // Busca inicial: lista todos os usuários ao entrar na página
  useEffect(() => {
    performSearch('', searchBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Manipula a mudança do termo de pesquisa
   * @param {Event} e - Evento de mudança do input
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Manipula a mudança do tipo de pesquisa
   * @param {Event} e - Evento de mudança do select
   */
  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  /**
   * Manipula o envio do formulário de pesquisa
   * @param {Event} e - Evento de envio do formulário
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery, searchBy);
  };

  /**
   * Limpa os resultados da pesquisa
   */
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setHasSearched(false);
  };

  return {
    // Estados
    searchQuery,
    searchBy,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    
    // Métodos
    setSearchQuery,
    setSearchBy,
    performSearch,
    handleSearchChange,
    handleSearchByChange,
    handleSearchSubmit,
    clearSearch
  };
};