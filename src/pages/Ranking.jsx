import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Medal, 
  Award,
  ChevronLeft,
  ChevronRight,
  Trophy
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { setPageTitle } from "@/services/title";
import { searchUsers } from "@/services/user/userSearchService";

import { useGetUser } from "@/hooks/use-getUser";

// Component do card de usuário com ranking
import RankingUserCard from "@/components/ranking/RankingUserCard";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

/**
 * Página de ranking de usuários por EXP
 * @returns {JSX.Element} Componente React
 */
const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosOrdenados, setUsuariosOrdenados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const usuariosPorPagina = 25;
  
  // Calcular dados da paginação (FRONTEND)
  const totalUsuarios = usuariosOrdenados.length;
  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);
  const indexInicial = (paginaAtual - 1) * usuariosPorPagina;
  const indexFinal = indexInicial + usuariosPorPagina;
  const usuariosPaginaAtual = usuariosOrdenados.slice(indexInicial, indexFinal);

  // Definir título da página
  useEffect(() => {
    setPageTitle("Ranking - BJJ Academy");
    fetchUserData();
  }, []);

  // Carregar todos os usuários - USANDO EXATAMENTE A MESMA LÓGICA DA PESQUISA
  useEffect(() => {
    const carregarUsuarios = async () => {
      setCarregando(true);
      setErro(null);

      try {
        // EXATAMENTE como no hook useUserSearch
        const { usuarios } = await searchUsers('', 'nome');
        
        setUsuarios(usuarios);
        
        // PRIMEIRO: ordenar TODOS os usuários por EXP (sem filtrar)
        const todosOrdenados = usuarios
          .map(usuario => ({
            ...usuario,
            expNumerico: Number(usuario.exp) || 0
          }))
          .sort((a, b) => b.expNumerico - a.expNumerico);
        
        // DEPOIS: filtrar apenas com EXP > 0
        const ordenados = todosOrdenados.filter(usuario => usuario.expNumerico > 0);
        
        setUsuariosOrdenados(ordenados);
      } catch (error) {
        console.error('Erro ao pesquisar usuários:', error);
        setErro('Não foi possível realizar a pesquisa. Tente novamente mais tarde.');
        setUsuarios([]);
        setUsuariosOrdenados([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarUsuarios();
  }, []);

  // Função para obter ícone de medalha baseado na posição
  const getMedalIcon = (posicao) => {
    switch (posicao) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  // Funções de navegação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const irParaPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaAtual(numeroPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Função para gerar números das páginas a serem exibidas (máximo 2)
  const gerarNumerosPaginas = () => {
    const numeros = [];
    const maxNumeros = 2; // Máximo de 2 botões de página visíveis
    
    if (totalPaginas <= 2) {
      // Se tem 2 ou menos páginas, mostra todas
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      // Lógica para mostrar apenas 2 números centrados na página atual
      let inicio, fim;
      
      if (paginaAtual === 1) {
        // Se está na primeira página, mostra 1 e 2
        inicio = 1;
        fim = 2;
      } else if (paginaAtual === totalPaginas) {
        // Se está na última página, mostra as 2 últimas
        inicio = totalPaginas - 1;
        fim = totalPaginas;
      } else {
        // Caso geral: mostra a atual e a próxima
        inicio = paginaAtual;
        fim = Math.min(paginaAtual + 1, totalPaginas);
      }
      
      for (let i = inicio; i <= fim; i++) {
        numeros.push(i);
      }
    }
    
    return numeros;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Ranking de Atletas</h1>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            {/* Círculos decorativos sutis */}
            <div className="fixed top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
            <div className="fixed bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />

            {/* Estado de carregamento */}
            {carregando && (
              <div className="flex-grow flex items-center justify-center min-h-[400px]">
                <LoadingSpinner message="Carregando ranking de atletas..." />
              </div>
            )}

            {/* Estado de erro */}
            {!carregando && erro && (
              <div className="flex-grow flex items-center justify-center min-h-[400px]">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 max-w-md w-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Erro ao Carregar Ranking</h3>
                    <p className="text-center text-muted-foreground mb-4">{erro}</p>
                    <Button onClick={() => window.location.reload()}>
                      Tentar Novamente
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Conteúdo principal */}
            {!carregando && !erro && usuariosOrdenados.length > 0 && (
              <div className="space-y-6">
                {/* Informações do ranking */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold mb-2">🏆 Ranking por EXP</h2>
                      <p className="text-muted-foreground">
                        Atletas classificados por experiência acumulada • Total: {usuariosOrdenados.length} atletas
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de usuários */}
                <div className="space-y-4">
                  {usuariosPaginaAtual.map((usuario, index) => {
                    const posicaoGlobal = indexInicial + index + 1;
                    const isPodium = posicaoGlobal <= 3;
                    
                    return (
                      <RankingUserCard
                        key={usuario.bjj_id}
                        usuario={usuario}
                        posicao={posicaoGlobal}
                        isPodium={isPodium}
                        medalIcon={getMedalIcon(posicaoGlobal)}
                      />
                    );
                  })}
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4">
                      {/* Informações da paginação */}
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">
                          Mostrando {indexInicial + 1} a {Math.min(indexFinal, totalUsuarios)} de {totalUsuarios} atletas
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Página {paginaAtual} de {totalPaginas}
                        </p>
                      </div>
                      
                      {/* Controles de paginação */}
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={irParaPaginaAnterior}
                          disabled={paginaAtual === 1}
                          className="px-2 sm:px-3"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">Anterior</span>
                        </Button>
                        
                        {gerarNumerosPaginas().map((numero) => (
                          <Button
                            key={numero}
                            variant={numero === paginaAtual ? "default" : "outline"}
                            size="sm"
                            onClick={() => irParaPagina(numero)}
                            className="min-w-[2.5rem] w-10 h-10"
                          >
                            {numero}
                          </Button>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={irParaProximaPagina}
                          disabled={paginaAtual === totalPaginas}
                          className="px-2 sm:px-3"
                        >
                          <span className="hidden sm:inline mr-1">Próxima</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Estado sem resultados */}
            {!carregando && !erro && usuariosOrdenados.length === 0 && (
              <div className="flex-grow flex items-center justify-center min-h-[400px]">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 max-w-md w-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum Atleta Encontrado</h3>
                    <p className="text-center text-muted-foreground mb-4">
                      Não há atletas com EXP suficiente para aparecer no ranking ainda.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>Total de usuários carregados: {usuarios.length}</p>
                      <p>Debug: Verifique o console para mais detalhes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>

          <MobileNav />
        </div>
      </div>

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

    </SidebarProvider>
  );
};

export default Ranking;