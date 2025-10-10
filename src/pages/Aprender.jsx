import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Hooks personalizados
import { useGetUser } from "@/hooks/use-getUser";
import { useAprender } from "@/hooks/use-aprender";

// Componentes específicos da página
import ModuloCard from "@/components/aprender/ModuloCard";
import EstatisticasModulos from "@/components/aprender/EstatisticasModulos";
import FiltrosAprender from "@/components/aprender/FiltrosAprender";

// Título da página
import TitleUpdater from "@/components/TitleUpdater";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const Aprender = () => {
  // Estados para busca
  const [termoBusca, setTermoBusca] = useState("");

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Hook personalizado para gerenciar módulos de aprendizado
  const {
    modulos,
    carregando,
    erro,
    carregarModulos,
    selecionarTecnica,
    getEstatisticas,
    moduloTemTecnicas
  } = useAprender();

  // Obter estatísticas
  const estatisticas = getEstatisticas();

  // Aplicar busca nos módulos
  const modulosFiltrados = modulos.filter(modulo => {
    // Filtro de busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase();
      const nomeModulo = modulo.nome.toLowerCase().includes(termo);
      const descricaoModulo = modulo.descricao?.toLowerCase().includes(termo);
      const tecnicasModulo = modulo.tecnicas?.some(tecnica => 
        tecnica.nome.toLowerCase().includes(termo) ||
        tecnica.descricao?.toLowerCase().includes(termo)
      );
      
      if (!nomeModulo && !descricaoModulo && !tecnicasModulo) {
        return false;
      }
    }

    return true;
  });



  // Recarregar dados
  const recarregarDados = async () => {
    try {
      await carregarModulos();
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <TitleUpdater />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-900">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            {/* Header único para mobile e desktop */}
            <header className="sticky top-0 z-10 border-b border-gray-700 bg-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold text-white">Aprender</h1>
              </div>
              
              <Button
                onClick={recarregarDados}
                variant="outline"
                size="sm"
                disabled={carregando}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-yellow-400 hover:border-yellow-400"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${carregando ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 overflow-auto">
              <div className="p-4 max-w-7xl mx-auto pb-20 md:pb-4">
                {/* Estatísticas */}
                <EstatisticasModulos 
                  estatisticas={estatisticas}
                  carregando={carregando}
                />

                {/* Busca */}
                <FiltrosAprender
                  onBuscar={setTermoBusca}
                  termoBusca={termoBusca}
                  carregando={carregando}
                />

                {/* Lista de Módulos */}
                {carregando ? (
                  <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : erro ? (
                  <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>{erro}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={recarregarDados}
                        className="ml-2 border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        Tentar novamente
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : modulosFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {termoBusca 
                        ? "Nenhum módulo encontrado" 
                        : "Nenhum módulo disponível"
                      }
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {termoBusca
                        ? "Tente ajustar o termo de busca."
                        : "Os módulos de aprendizado serão exibidos aqui quando estiverem disponíveis."
                      }
                    </p>
                    {termoBusca && (
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setTermoBusca("")}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Limpar busca
                        </Button>
                        <Button 
                          onClick={recarregarDados}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        >
                          Recarregar
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-4">
                    {modulosFiltrados.map((modulo) => (
                      <ModuloCard
                        key={modulo.id}
                        modulo={modulo}
                        onSelecionarTecnica={selecionarTecnica}
                      />
                    ))}
                  </Accordion>
                )}

                {/* Rodapé com informações */}
                {!carregando && modulosFiltrados.length > 0 && (
                  <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-700">
                    Exibindo {modulosFiltrados.length} de {modulos.length} módulos
                    {termoBusca && (
                      <span className="text-yellow-400"> • Busca: "{termoBusca}"</span>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        <MobileNav />
      </SidebarProvider>
      
      <UpgradeModal />
    </>
  );
};

export default Aprender;