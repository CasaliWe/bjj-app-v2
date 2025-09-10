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

/**
 * Página de treinos
 * @returns {JSX.Element} Componente React
 */
const Treinos = () => {
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
    resetFormulario,
    abrirModalNovoTreino,
    abrirModalComunidade,
    mudarPaginaTreinosComunidade,
    mudarPaginaTreinos,
    setFiltroTipo,
    setFiltroDiaSemana,
    carregarTreinos
  } = useTreinos();

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

              {/* Mensagem de carregamento */}
              {carregando && (
                <div className="py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-muted-foreground">Carregando treinos...</p>
                </div>
              )}

              {/* Mensagem de erro */}
              {erro && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  <p>{erro}</p>
                </div>
              )}

              {/* Lista de Treinos */}
              {!carregando && !erro && (
                <ListaTreinos
                  treinos={treinosFiltrados}
                  onEditar={editarTreino}
                  onExcluir={removerTreino}
                  onAlterarVisibilidade={alterarVisibilidade}
                  onNovo={abrirModalNovoTreino}
                  paginacao={paginacaoTreinos}
                  onMudarPagina={mudarPaginaTreinos}
                />
              )}
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
    </SidebarProvider>
  );
};

export default Treinos;
