import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import UserTrainings from './UserTrainings';
import UserCompetitions from './UserCompetitions';
import UserTechniques from './UserTechniques';

/**
 * Componente que exibe as tabs de conteúdo público do usuário
 * @param {Object} props - Propriedades do componente
 * @param {string} props.activeTab - Tab ativa atualmente
 * @param {Function} props.onTabChange - Função chamada ao mudar de tab
 * @param {Array} props.trainings - Lista de treinos do usuário
 * @param {Object} props.trainingsPagination - Informações de paginação dos treinos
 * @param {boolean} props.isLoadingTrainings - Indica se está carregando treinos
 * @param {string} props.trainingsError - Mensagem de erro para treinos
 * @param {Function} props.onTrainingsPageChange - Função chamada ao mudar página de treinos
 * @param {Array} props.competitions - Lista de competições do usuário
 * @param {Object} props.competitionsPagination - Informações de paginação das competições
 * @param {boolean} props.isLoadingCompetitions - Indica se está carregando competições
 * @param {string} props.competitionsError - Mensagem de erro para competições
 * @param {Function} props.onCompetitionsPageChange - Função chamada ao mudar página de competições
 * @param {Array} props.techniques - Lista de técnicas do usuário
 * @param {Object} props.techniquesPagination - Informações de paginação das técnicas
 * @param {boolean} props.isLoadingTechniques - Indica se está carregando técnicas
 * @param {string} props.techniquesError - Mensagem de erro para técnicas
 * @param {Function} props.onTechniquesPageChange - Função chamada ao mudar página de técnicas
 * @returns {JSX.Element} Componente React
 */
const UserTabs = ({
  activeTab,
  onTabChange,
  trainings,
  trainingsPagination,
  isLoadingTrainings,
  trainingsError,
  onTrainingsPageChange,
  competitions,
  competitionsPagination,
  isLoadingCompetitions,
  competitionsError,
  onCompetitionsPageChange,
  techniques,
  techniquesPagination,
  isLoadingTechniques,
  techniquesError,
  onTechniquesPageChange
}) => {
  // Função para lidar com a mudança de tab
  const handleTabChange = (value) => {
    onTabChange(value);
  };

  return (
    <div className="mt-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="treinos">Treinos</TabsTrigger>
          <TabsTrigger value="competicoes">Competições</TabsTrigger>
          <TabsTrigger value="tecnicas">Técnicas</TabsTrigger>
        </TabsList>
        
        {/* Tab de Treinos */}
        <TabsContent value="treinos">
          <UserTrainings 
            trainings={trainings}
            pagination={trainingsPagination}
            isLoading={isLoadingTrainings}
            error={trainingsError}
            onPageChange={onTrainingsPageChange}
          />
        </TabsContent>
        
        {/* Tab de Competições */}
        <TabsContent value="competicoes">
          <UserCompetitions 
            competitions={competitions}
            pagination={competitionsPagination}
            isLoading={isLoadingCompetitions}
            error={competitionsError}
            onPageChange={onCompetitionsPageChange}
          />
        </TabsContent>
        
        {/* Tab de Técnicas */}
        <TabsContent value="tecnicas">
          <UserTechniques 
            techniques={techniques}
            pagination={techniquesPagination}
            isLoading={isLoadingTechniques}
            error={techniquesError}
            onPageChange={onTechniquesPageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserTabs;