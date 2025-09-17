import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Book, Plus, Heart, Users } from "lucide-react";
import Exp from "@/components/exp/Exp";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Hooks personalizados
import { useGetUser } from "@/hooks/use-getUser";
import { useTecnicas } from "@/hooks/use-tecnicas";

// Componentes específicos da página de técnicas
import TecnicaCard from "@/components/tecnicas/TecnicaCard";
import TecnicaFiltro from "@/components/tecnicas/TecnicaFiltro";
import TecnicaFormModal from "@/components/tecnicas/TecnicaFormModal";
import TecnicasDestacadasModal from "@/components/tecnicas/TecnicasDestacadasModal";
import TecnicasComunidadeModal from "@/components/tecnicas/TecnicasComunidadeModal";
import TecnicasList from "@/components/tecnicas/TecnicasList";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const Tecnicas = () => {  
  // Estados para os filtros
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroPosicao, setFiltroPosicao] = useState("todas");
  
  // Estados para modais
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalDestaquesAberto, setModalDestaquesAberto] = useState(false);
  const [modalComunidadeAberto, setModalComunidadeAberto] = useState(false);
  const [modalConfirmacaoExcluirAberto, setModalConfirmacaoExcluirAberto] = useState(false);
  const [tecnicaParaExcluir, setTecnicaParaExcluir] = useState(null);
  const [resetarPagina, setResetarPagina] = useState(null);
  
  // Estado para técnica sendo editada
  const [tecnicaEmEdicao, setTecnicaEmEdicao] = useState(null);
  
  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Hook personalizado para gerenciar técnicas
  const { 
    tecnicas, 
    posicoesCadastradas, 
    tecnicasComunidade,
    paginacao,
    paginacaoComunidade,
    carregando, 
    carregandoComunidade,
    erro, 
    adicionarTecnica, 
    editarTecnica, 
    excluirTecnica, 
    toggleDestaque,
    togglePublica,
    aplicarFiltros,
    mudarPagina,
    getTecnicasDestacadas,
    carregarTecnicasComunidade
  } = useTecnicas();

  // Técnicas destacadas
  const tecnicasDestacadas = getTecnicasDestacadas();

  // Iniciar uma nova técnica
  const iniciarNovaTecnica = () => {
    setTecnicaEmEdicao({
      nome: "",
      categoria: "",
      posicao: "",
      novaPosicao: "",
      passos: [""],
      observacoes: [""],
      nota: 3,
      video: "",
      videoFile: null,
      videoWidth: null,
      videoHeight: null,
      videoDuration: null,
      videoError: null,
      video_url: null,
      video_poster: null,
      destacado: false,
      publica: false
    });
    setModalAdicionarAberto(true);
  };

  // Função para editar uma técnica
  const handleEditarTecnica = (tecnica) => {
    // Criar uma cópia completa da técnica incluindo URLs do vídeo existente
    setTecnicaEmEdicao({
      ...tecnica,
      novaPosicao: "",
      videoFile: null,           // Inicialmente não temos um novo arquivo
      videoWidth: null,
      videoHeight: null,
      videoDuration: null,
      videoError: null,
      // Estes campos são usados para mostrar o vídeo existente na interface
      video_url: tecnica.video_url || null,
      video_poster: tecnica.video_poster || null
    });
    setModalAdicionarAberto(true);
  };

  // Função para salvar técnica (nova ou editada)
  const handleSalvarTecnica = async (tecnicaFinal) => {
    try {
      if (tecnicaFinal.id) {
        // Editar técnica existente
        await editarTecnica(tecnicaFinal);
      } else {
        // Adicionar nova técnica
        await adicionarTecnica(tecnicaFinal);
        // Resetar para a primeira página quando adiciona uma nova técnica
        if (resetarPagina) resetarPagina();
      }
      
      // Fechar modal e limpar técnica em edição
      setModalAdicionarAberto(false);
      setTecnicaEmEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar técnica:", error);
      throw error;
    }
  };

  // Função para abrir modal de técnicas da comunidade
  const abrirModalComunidade = async () => {
    await carregarTecnicasComunidade("", 1);
    setModalComunidadeAberto(true);
  };

  // Pesquisar técnicas da comunidade
  const pesquisarTecnicasComunidade = (termo, pagina = 1) => {
    carregarTecnicasComunidade(termo, pagina);
  };

  // Aplicar filtros
  const handleFiltroChange = (categoria, posicao) => {
    setFiltroCategoria(categoria);
    setFiltroPosicao(posicao);
    aplicarFiltros(categoria, posicao);
  };

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroCategoria("todas");
    setFiltroPosicao("todas");
    aplicarFiltros("todas", "todas");
  };

  // Mudar página das técnicas
  const handleMudarPagina = (novaPagina) => {
    mudarPagina(novaPagina);
  };

  // Abrir confirmação de exclusão
  const abrirConfirmacaoExcluir = (id) => {
    setTecnicaParaExcluir(id);
    setModalConfirmacaoExcluirAberto(true);
  };
  
  // Confirmar exclusão
  const confirmarExclusao = async () => {
    if (tecnicaParaExcluir) {
      await excluirTecnica(tecnicaParaExcluir);
      setModalConfirmacaoExcluirAberto(false);
      setTecnicaParaExcluir(null);
    }
  };

  useEffect(() => {
    // Buscar dados do usuário ao montar o componente
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
              <h1 className="text-xl font-semibold">Técnicas</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={abrirModalComunidade}
                variant="outline"
                size="sm"
                className="px-2 md:px-3"
              >
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Comunidade</span>
              </Button>
              <Button
                onClick={() => setModalDestaquesAberto(true)}
                variant="outline"
                size="sm"
                className="px-2 md:px-3"
              >
                <Heart className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Destaques</span>
              </Button>
              <Button
                onClick={iniciarNovaTecnica}
                size="sm"
                className="px-2 md:px-3"
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Nova Técnica</span>
              </Button>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold hidden md:block">Biblioteca de Técnicas</h2>
              </div>

              {/* Filtros */}
              <TecnicaFiltro 
                filtroCategoria={filtroCategoria}
                filtroPosicao={filtroPosicao}
                onCategoriaChange={(categoria) => handleFiltroChange(categoria, filtroPosicao)}
                onPosicaoChange={(posicao) => handleFiltroChange(filtroCategoria, posicao)}
                onLimparFiltros={limparFiltros}
                posicoesCadastradas={posicoesCadastradas}
                totalResultados={paginacao.totalItens}
              />

              {/* Lista de Técnicas */}
              {erro ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-destructive">{erro}</p>
                  <Button className="mt-4" onClick={() => window.location.reload()}>
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <TecnicasList
                  tecnicas={tecnicas}
                  loading={carregando}
                  paginacao={paginacao}
                  onPageChange={handleMudarPagina}
                  onEdit={handleEditarTecnica}
                  onDelete={abrirConfirmacaoExcluir}
                  onToggleDestaque={toggleDestaque}
                  onShare={togglePublica}
                  onAddNew={iniciarNovaTecnica}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de adição/edição de técnica */}
      <TecnicaFormModal 
        isOpen={modalAdicionarAberto}
        onClose={() => {
          setModalAdicionarAberto(false);
          setTecnicaEmEdicao(null);
        }}
        tecnica={tecnicaEmEdicao || {
          nome: "",
          categoria: "",
          posicao: "",
          novaPosicao: "",
          passos: [""],
          observacoes: [""],
          nota: 3,
          video: "",
          videoFile: null,
          videoWidth: null,
          videoHeight: null,
          videoDuration: null,
          videoError: null,
          video_url: null,
          video_poster: null,
          destacado: false,
          publica: false
        }}
        onSave={handleSalvarTecnica}
        posicoesCadastradas={posicoesCadastradas}
      />

      {/* Modal de técnicas destacadas */}
      <TecnicasDestacadasModal 
        isOpen={modalDestaquesAberto}
        onClose={() => setModalDestaquesAberto(false)}
        tecnicasDestacadas={tecnicasDestacadas}
        onRemoveDestaque={toggleDestaque}
      />
      
      {/* Modal de técnicas da comunidade */}
      <TecnicasComunidadeModal 
        isOpen={modalComunidadeAberto}
        onClose={() => setModalComunidadeAberto(false)}
        tecnicasComunidade={tecnicasComunidade}
        paginacao={paginacaoComunidade}
        onSearch={pesquisarTecnicasComunidade}
        carregando={carregandoComunidade}
      />

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={modalConfirmacaoExcluirAberto} onOpenChange={setModalConfirmacaoExcluirAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta técnica? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setModalConfirmacaoExcluirAberto(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

// Componente Wrapper com o Exp
const TecnicasWithExp = () => (
  <Exp>
    <Tecnicas />
  </Exp>
);

export default TecnicasWithExp;
