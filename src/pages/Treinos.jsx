import { Plus, Share2, Users } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { useTreinos } from "@/hooks/use-treinos";
import FiltrosTreinos from "@/components/treinos/FiltrosTreinos";
import FormularioTreino from "@/components/treinos/FormularioTreino";
import ListaTreinos from "@/components/treinos/ListaTreinos";
import ModalComunidade from "@/components/treinos/ModalComunidade";
import React, { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

// hooks
import { useGetUser } from "@/hooks/use-getUser";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Tutorial
import Tutorial from "@/components/ui/Tutorial";

/**
 * Página de treinos
 * @returns {JSX.Element} Componente React
 */
const Treinos = () => {
  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Usar o hook personalizado para gerenciar os treinos
  const {
    // Estados
    treinosFiltrados,
    treinosComunidade,
    carregando,
    erro,
    filtroTipo,
    filtroDiaSemana,
    editandoTreino,
    modalAberto,
    imageUrls,
    novoTreino,
    proximoNumeroAula,
    paginacao,
    paginacaoTreinos,
    modalComunidadeAberto,
    
    // Métodos
    setNovoTreino,
    setModalAberto,
    setImageUrls,
    setModalComunidadeAberto,
    aplicarFiltros,
    limparFiltros,
    salvarTreino,
    editarTreino,
    removerTreino,
    alterarVisibilidade,
    uploadImagens,
    removerImagem,
    resetFormulario,
    abrirModalNovoTreino,
    abrirModalComunidade,
    mudarPaginaTreinosComunidade,
    mudarPaginaTreinos,
    setFiltroTipo,
    setFiltroDiaSemana,
    carregarTreinos
  } = useTreinos();

  // Estados para o diálogo de confirmação de exclusão
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
      removerTreino(idParaExcluir);
      fecharConfirmacaoExcluir();
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Treinos</h1>
            </div>
            <div className="flex gap-2">
              <Tutorial />
              <Button
                onClick={abrirModalComunidade}
                size="sm"
                variant="outline"
                className="px-2 md:px-3"
              >
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Comunidade</span>
              </Button>
              <Button
                onClick={abrirModalNovoTreino}
                size="sm"
                className="px-2 md:px-3"
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Novo Treino</span>
              </Button>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                <h2 className="text-2xl font-bold hidden md:block">Histórico de Treinos</h2>
              </div>

              {/* Filtros */}
              <FiltrosTreinos
                filtroTipo={filtroTipo}
                filtroDiaSemana={filtroDiaSemana}
                setFiltroTipo={setFiltroTipo}
                setFiltroDiaSemana={setFiltroDiaSemana}
                limparFiltros={limparFiltros}
                totalResultados={treinosFiltrados.length}
              />

              {/* Mensagem de erro */}
              {erro && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  <p>{erro}</p>
                </div>
              )}

              {/* Lista de Treinos */}
              <ListaTreinos
                treinos={treinosFiltrados}
                loading={carregando}
                onEditar={editarTreino}
                onExcluir={abrirConfirmacaoExcluir}
                onAlterarVisibilidade={alterarVisibilidade}
                onNovo={abrirModalNovoTreino}
                paginacao={paginacaoTreinos}
                onMudarPagina={mudarPaginaTreinos}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modal de adição/edição de treino */}
      <FormularioTreino
        aberto={modalAberto}
        setAberto={setModalAberto}
        treino={editandoTreino}
        novoTreino={novoTreino}
        setNovoTreino={setNovoTreino}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        proximoNumeroAula={proximoNumeroAula}
        onSalvar={salvarTreino}
        editando={!!editandoTreino}
        onUploadImagens={uploadImagens}
        onRemoverImagem={removerImagem}
      />

      {/* Modal da comunidade */}
      <ModalComunidade
        aberto={modalComunidadeAberto}
        setAberto={setModalComunidadeAberto}
        treinos={treinosComunidade}
        paginacao={paginacao}
        carregando={carregando}
        onMudarPagina={mudarPaginaTreinosComunidade}
      />

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.
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

export default Treinos;
