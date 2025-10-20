import React, { useState, useEffect } from 'react';
import { Plus, Users, Trophy, ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { setPageTitle } from '@/services/title';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Componentes de competições
import CompeticoesFilters from '../components/competicoes/CompeticoesFilters';
import CompeticoesList from '../components/competicoes/CompeticoesList';
import CompeticaoForm from '../components/competicoes/CompeticaoForm';
import CompeticaoDetalhes from '../components/competicoes/CompeticaoDetalhes';

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Tutorial
import Tutorial from "@/components/ui/Tutorial";

// Hook personalizado
import { useCompeticoes } from '../hooks/use-competicoes';
import { useIsMobile } from '../hooks/use-mobile';

// hooks
import { useGetUser } from "@/hooks/use-getUser";

/**
 * Página de Competições
 * Permite ao usuário gerenciar suas competições e ver competições da comunidade
 */
const Competicoes = () => {
  const isMobile = useIsMobile();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Definir o título da página ao carregar o componente
  useEffect(() => {
    setPageTitle('Competições');
    fetchUserData();
  }, []);
  
  // Estado do hook de competições
  const {
    competicoes,
    competicoesComunidade,
    loading,
    loadingComunidade,
    paginacao,
    paginacaoComunidade,
    filtros,
    aba,
    adicionarCompeticao,
    atualizarCompeticao,
    excluirCompeticao,
    alterarVisibilidade,
    mudarPagina,
    aplicarFiltros,
    mudarAba
  } = useCompeticoes();

  // Estados locais
  const [formAberto, setFormAberto] = useState(false);
  const [competicaoParaEditar, setCompeticaoParaEditar] = useState(null);
  const [competicaoParaVisualizar, setCompeticaoParaVisualizar] = useState(null);
  const [competicaoParaExcluir, setCompeticaoParaExcluir] = useState(null);
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [confirmacaoExcluirAberta, setConfirmacaoExcluirAberta] = useState(false);
  
  // Abrir formulário para nova competição
  const abrirNovaCompeticao = () => {
    setCompeticaoParaEditar(null);
    setFormAberto(true);
  };
  
  // Abrir formulário para editar competição
  const abrirEditarCompeticao = (competicao) => {
    setCompeticaoParaEditar(competicao);
    setFormAberto(true);
  };
  
  // Fechar formulário
  const fecharFormulario = () => {
    setFormAberto(false);
    setCompeticaoParaEditar(null);
  };
  
  // Abrir modal de detalhes
  const abrirDetalhes = (competicao) => {
    setCompeticaoParaVisualizar(competicao);
    setDetalhesAberto(true);
  };
  
  // Fechar modal de detalhes
  const fecharDetalhes = () => {
    setDetalhesAberto(false);
    setCompeticaoParaVisualizar(null);
  };
  
  // Abrir confirmação de exclusão
  const abrirConfirmacaoExcluir = (id) => {
    setCompeticaoParaExcluir(id);
    setConfirmacaoExcluirAberta(true);
  };
  
  // Fechar confirmação de exclusão
  const fecharConfirmacaoExcluir = () => {
    setConfirmacaoExcluirAberta(false);
    setCompeticaoParaExcluir(null);
  };
  
  // Confirmar exclusão
  const confirmarExclusao = () => {
    if (competicaoParaExcluir) {
      excluirCompeticao(competicaoParaExcluir);
      fecharConfirmacaoExcluir();
    }
  };
  
  // Salvar competição (nova ou editada)
  const salvarCompeticao = (competicao) => {
    if (competicao.id) {
      atualizarCompeticao(competicao);
    } else {
      adicionarCompeticao(competicao);
    }
    fecharFormulario();
  };
  
  // Mudar página atual
  const handleMudarPagina = (novaPagina) => {
    mudarPagina(novaPagina);
  };
  
  // Alternar entre abas (minhas competições/comunidade)
  const handleMudarAba = (novaAba) => {
    mudarAba(novaAba);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Cabeçalho da página */}
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Competições</h1>
            </div>

            <div className="flex items-center gap-2">
              <Tutorial />
              <Button onClick={abrirNovaCompeticao}>
                {isMobile ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" /> Nova Competição
                  </>
                )}
              </Button>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            {/* Abas: Minhas Competições e Comunidade */}
            <Tabs
              defaultValue="minhas"
              value={aba}
              onValueChange={handleMudarAba}
              className="w-full"
            >
              <TabsList className="mb-4 w-full grid grid-cols-2">
                <TabsTrigger value="minhas" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {!isMobile && "Minhas Competições"}
                </TabsTrigger>
                <TabsTrigger value="comunidade" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {!isMobile && "Comunidade"}
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo: Minhas Competições */}
              <TabsContent value="minhas" className="space-y-4">
                {/* Filtros */}
                <CompeticoesFilters 
                  filtros={filtros} 
                  onFiltroChange={aplicarFiltros} 
                />
                
                {/* Lista de competições */}
                <CompeticoesList
                  competicoes={competicoes}
                  loading={loading}
                  paginacao={paginacao}
                  onPageChange={handleMudarPagina}
                  onView={abrirDetalhes}
                  onEdit={abrirEditarCompeticao}
                  onDelete={abrirConfirmacaoExcluir}
                  onShare={alterarVisibilidade}
                />
              </TabsContent>

              {/* Conteúdo: Comunidade */}
              <TabsContent value="comunidade" className="space-y-4">
                {/* Filtros */}
                <CompeticoesFilters 
                  filtros={filtros} 
                  onFiltroChange={aplicarFiltros} 
                />
                
                <CompeticoesList
                  competicoes={competicoesComunidade}
                  loading={loadingComunidade}
                  isComunidade={true}
                  paginacao={paginacaoComunidade}
                  onPageChange={handleMudarPagina}
                  onView={abrirDetalhes}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Modal de formulário (nova/editar competição) */}
      <CompeticaoForm
        isOpen={formAberto}
        onClose={fecharFormulario}
        onSave={salvarCompeticao}
        competicaoAtual={competicaoParaEditar}
      />

      {/* Modal de detalhes */}
      <CompeticaoDetalhes
        isOpen={detalhesAberto}
        onClose={fecharDetalhes}
        competicao={competicaoParaVisualizar}
        isComunidade={aba === 'comunidade'}
      />

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={confirmacaoExcluirAberta} onOpenChange={setConfirmacaoExcluirAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta competição? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={fecharConfirmacaoExcluir}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Competicoes;
