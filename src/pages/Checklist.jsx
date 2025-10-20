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
import ChecklistFilters from '@/components/checklist/ChecklistFilters';
import ChecklistList from '@/components/checklist/ChecklistList';
import ChecklistForm from '@/components/checklist/ChecklistForm';
import ChecklistPagination from '@/components/checklist/ChecklistPagination';

// Hook personalizado
import { useChecklist } from '@/hooks/use-checklist';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetUser } from "@/hooks/use-getUser";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Tutorial
import Tutorial from "@/components/ui/Tutorial";

/**
 * Página de Checklists
 * Permite ao usuário gerenciar seus checklists e tarefas
 */
const Checklist = () => {
  const isMobile = useIsMobile();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Definir o título da página
  useEffect(() => {
    setPageTitle('Checklist');

    // Buscar dados do usuário
    fetchUserData();
  }, []);
  
  // Estado do hook de checklists
  const {
    checklists,
    checklistAtual,
    loading,
    erro,
    buscarChecklists,
    filtros,
    paginacao,
    modalAberto,
    modoEdicao,
    adicionarChecklist,
    atualizarChecklist,
    excluirChecklist,
    aplicarFiltros,
    mudarPagina,
    abrirModal,
    fecharModal,
    adicionarItem,
    atualizarItem,
    excluirItem,
    toggleItem,
    marcarTodos
  } = useChecklist();

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
      excluirChecklist(idParaExcluir);
      fecharConfirmacaoExcluir();
    }
  };
  
  // Salvar checklist (novo ou editado)
  const salvarChecklist = (checklist) => {
    if (checklist.id) {
      atualizarChecklist(checklist);
    } else {
      adicionarChecklist(checklist);
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
              <h1 className="text-xl font-semibold">Checklist</h1>
            </div>

            <div className="flex items-center gap-2">
              <Tutorial />
              <Button onClick={() => abrirModal()} className="gap-2">
                {isMobile ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-1" /> Novo Checklist
                  </>
                )}
              </Button>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
            
            {/* Filtros */}
            <ChecklistFilters 
              filtros={filtros} 
              onFiltroChange={aplicarFiltros} 
            />
            
            {/* Exibir erro se houver */}
            {erro && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">😵</div>
                <h3 className="text-lg font-semibold mb-2">Ops!</h3>
                <p className="text-muted-foreground mb-4">{erro}</p>
                <Button onClick={buscarChecklists} variant="outline">
                  Tentar novamente
                </Button>
              </div>
            )}
            
            {/* Lista de checklists - só exibir se não houver erro */}
            {!erro && (
              <>
                <ChecklistList
                  checklists={checklists}
                  loading={loading}
                  onEdit={abrirModal}
                  onDelete={abrirConfirmacaoExcluir}
                  onAddItem={adicionarItem}
                  onEditItem={atualizarItem}
                  onDeleteItem={excluirItem}
                  onToggleItem={toggleItem}
                  onMarcarTodos={marcarTodos}
                />
                
                {/* Paginação */}
                <ChecklistPagination
                  paginacao={paginacao}
                  onPageChange={mudarPagina}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Formulário de criação/edição */}
      <ChecklistForm
        isOpen={modalAberto}
        onClose={fecharModal}
        onSave={salvarChecklist}
        checklistAtual={checklistAtual}
      />

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este checklist? Todos os itens serão perdidos e esta ação não pode ser desfeita.
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

export default Checklist;
