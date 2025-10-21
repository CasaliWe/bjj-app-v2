import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { 
  Trophy,
  AlertCircle,
  Video,
  Calendar
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Hooks personalizados
import { useGetUser } from "@/hooks/use-getUser";

// Título da página
import TitleUpdater from "@/components/TitleUpdater";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Services
import { getAuthToken } from '@/services/cookies/cookies';

const LutasEpicas = () => {
  // Estados
  const [lutaEpica, setLutaEpica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Função para buscar luta épica do dia
  const carregarLutaEpica = async () => {
    setCarregando(true);
    setErro("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/lutas-epicas/get-luta-epica.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setLutaEpica(data.data);
      } else {
        setErro(data.message || "Erro ao carregar luta épica");
      }
    } catch (error) {
      console.error("Erro ao buscar luta épica:", error);
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para recarregar dados
  const recarregarDados = async () => {
    try {
      await carregarLutaEpica();
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    carregarLutaEpica();
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
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  Lutas Épicas
                </h1>
              </div>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 overflow-auto">
              <div className="p-4 max-w-4xl mx-auto pb-20 md:pb-4">
                
                {/* Aviso sobre lutas épicas diárias */}
                <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                        Nova Luta Épica Diariamente
                      </h3>
                      <p className="text-xs text-gray-300">
                        Todo dia uma nova luta épica do mundo do Jiu-Jitsu para você se inspirar e aprender com os grandes mestres!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Loading */}
                {carregando ? (
                  <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : erro ? (
                  /* Erro */
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
                ) : !lutaEpica ? (
                  /* Sem dados */
                  <div className="text-center py-12">
                    <Video className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Nenhuma luta épica disponível
                    </h3>
                    <p className="text-gray-400 mb-4">
                      A luta épica do dia será exibida aqui quando estiver disponível.
                    </p>
                    <Button 
                      onClick={recarregarDados}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Recarregar
                    </Button>
                  </div>
                ) : (
                  /* Conteúdo da luta épica */
                  <div className="space-y-6">
                    {/* Título */}
                    <div className="text-start">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {lutaEpica.titulo}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Luta épica do dia
                      </p>
                    </div>

                    {/* Vídeo */}
                    <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                      {lutaEpica.url ? (
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={lutaEpica.url}
                            title={lutaEpica.titulo}
                            className="absolute top-0 left-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-800">
                          <div className="text-center">
                            <Video className="h-16 w-16 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-400">Vídeo não disponível</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descrição */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Sobre esta luta
                      </h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {lutaEpica.descricao}
                        </p>
                      </div>
                    </div>
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

export default LutasEpicas;