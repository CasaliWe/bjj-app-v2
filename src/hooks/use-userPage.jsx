import { useState, useCallback, useEffect } from 'react';
import { 
  getUserProfile, 
  getUserPublicTrainings, 
  getUserPublicCompetitions, 
  getUserPublicTechniques 
} from '@/services/user/userPageService';

/**
 * Hook personalizado para gerenciar os dados de visualização de perfil de usuário
 * @param {string} bjjId - ID do usuário a ser visualizado
 * @returns {Object} Estados e métodos para manipular os dados do perfil
 */
export const useUserPage = (bjjId) => {
  // Estados para o perfil do usuário
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  
  // Estados para os treinos públicos
  const [userTrainings, setUserTrainings] = useState([]);
  const [trainingsPagination, setTrainingsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [isLoadingTrainings, setIsLoadingTrainings] = useState(false);
  const [trainingsError, setTrainingsError] = useState(null);
  
  // Estados para as competições públicas
  const [userCompetitions, setUserCompetitions] = useState([]);
  const [competitionsPagination, setCompetitionsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [competitionsError, setCompetitionsError] = useState(null);
  
  // Estados para as técnicas públicas
  const [userTechniques, setUserTechniques] = useState([]);
  const [techniquesPagination, setTechniquesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [isLoadingTechniques, setIsLoadingTechniques] = useState(false);
  const [techniquesError, setTechniquesError] = useState(null);
  
  // Estado para controlar a tab ativa
  const [activeTab, setActiveTab] = useState('treinos');
  
  // Função para buscar o perfil do usuário
  const fetchUserProfile = useCallback(async () => {
    if (!bjjId) return;
    
    setIsLoadingProfile(true);
    setProfileError(null);
    
    try {
      const profileData = await getUserProfile(bjjId);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      
      // Trata o erro de perfil privado (403) com uma mensagem específica
      if (error.message && error.message.includes('privado')) {
        setProfileError('Este perfil é privado. Apenas informações básicas estão disponíveis.');
      } else {
        setProfileError('Não foi possível carregar os dados do usuário. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [bjjId]);
  
  // Função para buscar os treinos públicos do usuário
  const fetchUserTrainings = useCallback(async (page = 1) => {
    if (!bjjId) return;
    
    setIsLoadingTrainings(true);
    setTrainingsError(null);
    
    try {
      const { treinos, paginacao } = await getUserPublicTrainings(bjjId, page, 10);
      setUserTrainings(treinos);
      setTrainingsPagination(paginacao);
    } catch (error) {
      console.error('Erro ao buscar treinos do usuário:', error);
      setTrainingsError('Não foi possível carregar os treinos do usuário. Tente novamente mais tarde.');
    } finally {
      setIsLoadingTrainings(false);
    }
  }, [bjjId]);
  
  // Função para buscar as competições públicas do usuário
  const fetchUserCompetitions = useCallback(async (page = 1) => {
    if (!bjjId) return;
    
    setIsLoadingCompetitions(true);
    setCompetitionsError(null);
    
    try {
      const { competicoes, paginacao } = await getUserPublicCompetitions(bjjId, page, 10);
      setUserCompetitions(competicoes);
      setCompetitionsPagination(paginacao);
    } catch (error) {
      console.error('Erro ao buscar competições do usuário:', error);
      setCompetitionsError('Não foi possível carregar as competições do usuário. Tente novamente mais tarde.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [bjjId]);
  
  // Função para buscar as técnicas públicas do usuário
  const fetchUserTechniques = useCallback(async (page = 1) => {
    if (!bjjId) return;
    
    setIsLoadingTechniques(true);
    setTechniquesError(null);
    
    try {
      const { tecnicas, paginacao } = await getUserPublicTechniques(bjjId, page, 10);
      setUserTechniques(tecnicas);
      setTechniquesPagination(paginacao);
    } catch (error) {
      console.error('Erro ao buscar técnicas do usuário:', error);
      setTechniquesError('Não foi possível carregar as técnicas do usuário. Tente novamente mais tarde.');
    } finally {
      setIsLoadingTechniques(false);
    }
  }, [bjjId]);
  
  // Função para mudar a página de treinos
  const changeTrainingsPage = useCallback((page) => {
    fetchUserTrainings(page);
  }, [fetchUserTrainings]);
  
  // Função para mudar a página de competições
  const changeCompetitionsPage = useCallback((page) => {
    fetchUserCompetitions(page);
  }, [fetchUserCompetitions]);
  
  // Função para mudar a página de técnicas
  const changeTechniquesPage = useCallback((page) => {
    fetchUserTechniques(page);
  }, [fetchUserTechniques]);
  
  // Função para carregar dados com base na tab ativa
  const loadTabData = useCallback((tabName) => {
    setActiveTab(tabName);
    
    switch (tabName) {
      case 'treinos':
        if (userTrainings.length === 0) {
          fetchUserTrainings(1);
        }
        break;
      case 'competicoes':
        if (userCompetitions.length === 0) {
          fetchUserCompetitions(1);
        }
        break;
      case 'tecnicas':
        if (userTechniques.length === 0) {
          fetchUserTechniques(1);
        }
        break;
    }
  }, [
    fetchUserTrainings, 
    fetchUserCompetitions, 
    fetchUserTechniques, 
    userTrainings.length, 
    userCompetitions.length, 
    userTechniques.length
  ]);
  
  // Carregar o perfil e dados iniciais ao montar o componente
  useEffect(() => {
    if (bjjId) {
      fetchUserProfile();
      
      // Carregar dados das tabs imediatamente
      fetchUserTrainings(1);
      fetchUserCompetitions(1);
      fetchUserTechniques(1);
    }
  }, [bjjId, fetchUserProfile, fetchUserTrainings, fetchUserCompetitions, fetchUserTechniques]);
  
  return {
    // Dados do perfil
    userProfile,
    isLoadingProfile,
    profileError,
    
    // Treinos
    userTrainings,
    trainingsPagination,
    isLoadingTrainings,
    trainingsError,
    
    // Competições
    userCompetitions,
    competitionsPagination,
    isLoadingCompetitions,
    competitionsError,
    
    // Técnicas
    userTechniques,
    techniquesPagination,
    isLoadingTechniques,
    techniquesError,
    
    // Controle de tabs
    activeTab,
    
    // Métodos
    fetchUserProfile,
    fetchUserTrainings,
    fetchUserCompetitions,
    fetchUserTechniques,
    changeTrainingsPage,
    changeCompetitionsPage,
    changeTechniquesPage,
    loadTabData,
    setActiveTab
  };
};