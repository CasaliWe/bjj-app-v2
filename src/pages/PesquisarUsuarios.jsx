import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { setPageTitle } from "@/services/title";
import { Search } from "lucide-react";

import { useGetUser } from "@/hooks/use-getUser";

// Componentes específicos da página
import SearchForm from "@/components/userSearch/SearchForm";
import UserResults from "@/components/userSearch/UserResults";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Hook personalizado
import { useUserSearch } from "@/hooks/use-user-search";

/**
 * Página de pesquisa de usuários
 * @returns {JSX.Element} Componente React
 */
const PesquisarUsuarios = () => {
  // Usar o hook personalizado para gerenciar a pesquisa
  const {
    searchQuery,
    searchBy,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    handleSearchChange,
    handleSearchByChange,
    handleSearchSubmit
  } = useUserSearch();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Definir o título da página
  useEffect(() => {
    setPageTitle("Pesquisar Usuários");
    fetchUserData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Cabeçalho da página */}
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Pesquisar Usuários</h1>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
            <div className="space-y-6">
              <SearchForm
                searchQuery={searchQuery}
                searchBy={searchBy}
                onSearchChange={handleSearchChange}
                onSearchByChange={handleSearchByChange}
                onSubmit={handleSearchSubmit}
                isSearching={isSearching}
              />

              {searchError && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
                  <CardContent className="p-4 text-red-600 dark:text-red-400">
                    {searchError}
                  </CardContent>
                </Card>
              )}

              {!hasSearched && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Pesquise por usuários</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Digite um nome ou um BJJ ID no campo acima para encontrar outros praticantes de Jiu-Jitsu na plataforma.
                  </p>
                </div>
              )}

              {hasSearched && (
                <UserResults 
                  usuarios={searchResults} 
                  isLoading={isSearching} 
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />
      
    </SidebarProvider>
  );
};

export default PesquisarUsuarios;