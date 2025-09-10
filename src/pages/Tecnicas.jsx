import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Book, Plus, Heart, Users } from "lucide-react";
import Exp from "@/components/exp/Exp";

// Hooks personalizados
import { useGetUser } from "@/hooks/use-getUser";
import { useTecnicas } from "@/hooks/use-tecnicas";

// Componentes específicos da página de técnicas
import TecnicaCard from "@/components/tecnicas/TecnicaCard";
import TecnicaFiltro from "@/components/tecnicas/TecnicaFiltro";
import TecnicaFormModal from "@/components/tecnicas/TecnicaFormModal";
import TecnicasDestacadasModal from "@/components/tecnicas/TecnicasDestacadasModal";
import TecnicasComunidadeModal from "@/components/tecnicas/TecnicasComunidadeModal";

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
  
  // Estado para técnica sendo editada
  const [tecnicaEmEdicao, setTecnicaEmEdicao] = useState(null);
  
  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();
  
  // Hook personalizado para gerenciar técnicas
  const { 
    tecnicas, 
    posicoesCadastradas, 
    tecnicasComunidade,
    carregando, 
    erro, 
    adicionarTecnica, 
    editarTecnica, 
    excluirTecnica, 
    toggleDestaque,
    togglePublica,
    filtrarTecnicas,
    getTecnicasDestacadas,
    carregarTecnicasComunidade
  } = useTecnicas();

  // Técnicas filtradas com base nos filtros selecionados
  const tecnicasFiltradas = filtrarTecnicas(filtroCategoria, filtroPosicao);
  
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
      destacado: false,
      publica: false
    });
    setModalAdicionarAberto(true);
  };

  // Função para editar uma técnica
  const handleEditarTecnica = (tecnica) => {
    setTecnicaEmEdicao({
      ...tecnica,
      novaPosicao: ""
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
      }
      
      // Fechar modal e limpar técnica em edição
      setModalAdicionarAberto(false);
      setTecnicaEmEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar técnica:", error);
      // TODO: Mostrar notificação de erro
    }
  };

  // Função para abrir modal de técnicas da comunidade
  const abrirModalComunidade = async () => {
    await carregarTecnicasComunidade();
    setModalComunidadeAberto(true);
  };

  // Pesquisar técnicas da comunidade
  const pesquisarTecnicasComunidade = (termo) => {
    carregarTecnicasComunidade(termo);
  };

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroCategoria("todas");
    setFiltroPosicao("todas");
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
                className="hidden md:flex"
              >
                <Users className="mr-2 h-4 w-4" />
                Comunidade
              </Button>
              <Button
                onClick={() => setModalDestaquesAberto(true)}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                <Heart className="mr-2 h-4 w-4" />
                Destaques ({tecnicasDestacadas.length})
              </Button>
              <Button
                onClick={iniciarNovaTecnica}
                size="sm"
                className="hidden md:flex"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Técnica
              </Button>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-32 md:pb-6">
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold hidden md:block">Biblioteca de Técnicas</h2>
                <div className="flex flex-col gap-2 md:hidden w-full">
                  <Button
                    onClick={iniciarNovaTecnica}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Técnica
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setModalDestaquesAberto(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Destaques ({tecnicasDestacadas.length})
                    </Button>
                    
                    <Button
                      onClick={abrirModalComunidade}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Comunidade
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filtros */}
              <TecnicaFiltro 
                filtroCategoria={filtroCategoria}
                filtroPosicao={filtroPosicao}
                onCategoriaChange={setFiltroCategoria}
                onPosicaoChange={setFiltroPosicao}
                onLimparFiltros={limparFiltros}
                posicoesCadastradas={posicoesCadastradas}
                totalResultados={tecnicasFiltradas.length}
              />

              {/* Lista de Técnicas */}
              {carregando ? (
                <div className="flex justify-center items-center py-12">
                  <p>Carregando técnicas...</p>
                </div>
              ) : erro ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-destructive">{erro}</p>
                  <Button className="mt-4" onClick={() => window.location.reload()}>
                    Tentar novamente
                  </Button>
                </div>
              ) : tecnicasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tecnicasFiltradas.map((tecnica) => (
                    <TecnicaCard 
                      key={tecnica.id}
                      tecnica={tecnica}
                      onEdit={handleEditarTecnica}
                      onDelete={excluirTecnica}
                      onToggleDestaque={toggleDestaque}
                      onShare={togglePublica}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Book className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Nenhuma técnica encontrada</h3>
                  <p className="text-muted-foreground">
                    {filtroCategoria !== "todas" || filtroPosicao !== "todas"
                      ? "Tente mudar os filtros ou"
                      : "Comece"}{" "}
                    adicionando uma nova técnica.
                  </p>
                  <Button className="mt-4" onClick={iniciarNovaTecnica}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Técnica
                  </Button>
                </div>
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
        onSearch={pesquisarTecnicasComunidade}
      />

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />
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
