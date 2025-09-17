import React, { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNav } from '@/components/MobileNav';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { FileText, Plus } from 'lucide-react';
import { setPageTitle } from '@/services/title';

// Componentes personalizados
import ObservacoesFilters from '@/components/observacoes/ObservacoesFilters';
import ObservacoesList from '@/components/observacoes/ObservacoesList';
import ObservacaoForm from '@/components/observacoes/ObservacaoForm';
import ObservacoesPagination from '@/components/observacoes/ObservacoesPagination';

// Hook personalizado
import { useObservacoes } from '@/hooks/use-observacoes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetUser } from "@/hooks/use-getUser";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

/**
 * Página de Observações
 * Permite ao usuário gerenciar suas observações, dicas e insights
 */
const Observacoes = () => {
  const isMobile = useIsMobile();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Definir o título da página
  useEffect(() => {
    setPageTitle('Observações');

    // Buscar dados do usuário
    fetchUserData();
  }, []);
  
  // Estado do hook de observações
  const {
    observacoes,
    observacaoAtual,
    loading,
    filtros,
    paginacao,
    modalAberto,
    modoEdicao,
    adicionarObservacao,
    atualizarObservacao,
    excluirObservacao,
    aplicarFiltros,
    mudarPagina,
    abrirModal,
    fecharModal
  } = useObservacoes();

  // Estados locais para o diálogo de confirmação de exclusão
  const [idParaExcluir, setIdParaExcluir] = React.useState(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = React.useState(false);
  
  // Abrir confirmação de exclusão
  const abrirConfirmacaoExcluir = (id) => {
    setIdParaExcluir(id);
    setConfirmacaoAberta(true);
  };
  
  // Fechar confirmação de exclusão
  const fecharConfirmacaoExcluir = () => {
    setConfirmacaoAberta(false);
    setIdParaExcluir(null);
  };
  
  // Confirmar exclusão
  const confirmarExclusao = () => {
    if (idParaExcluir) {
      excluirObservacao(idParaExcluir);
      fecharConfirmacaoExcluir();
    }
  };
  
  // Salvar observação (nova ou editada)
  const salvarObservacao = (observacao) => {
    if (observacao.id) {
      atualizarObservacao(observacao);
    } else {
      adicionarObservacao(observacao);
    }
    fecharModal();
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
              <h1 className="text-xl font-semibold">Observações</h1>
            </div>

            <Button onClick={() => abrirModal()} className="gap-2">
              {isMobile ? (
                <Plus className="h-5 w-5" />
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-1" /> Nova Observação
                </>
              )}
            </Button>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
            
            {/* Filtros */}
            <ObservacoesFilters 
              filtros={filtros} 
              onFiltroChange={aplicarFiltros} 
            />
            
            {/* Lista de observações */}
            <ObservacoesList
              observacoes={observacoes}
              loading={loading}
              onEdit={abrirModal}
              onDelete={abrirConfirmacaoExcluir}
            />
            
            {/* Paginação */}
            <ObservacoesPagination
              paginacao={paginacao}
              onPageChange={mudarPagina}
            />
          </main>
        </div>
      </div>

      {/* Formulário de criação/edição */}
      <ObservacaoForm
        isOpen={modalAberto}
        onClose={fecharModal}
        onSave={salvarObservacao}
        observacaoAtual={observacaoAtual}
      />

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta observação? Esta ação não pode ser desfeita.
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

export default Observacoes;
