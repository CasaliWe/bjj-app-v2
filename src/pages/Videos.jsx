import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  RefreshCw,
  AlertCircle,
  Search,
  Video
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Hooks personalizados
import { useGetUser } from "@/hooks/use-getUser";
import { useVideosYoutube } from "@/hooks/use-videos-youtube";

// Componentes específicos da página
import VideoCard from "@/components/videos/VideoCard";
import EstatisticasVideos from "@/components/videos/EstatisticasVideos";

// Título da página
import TitleUpdater from "@/components/TitleUpdater";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const Videos = () => {
  // Estados para busca
  const [termoBusca, setTermoBusca] = useState("");

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Hook personalizado para gerenciar vídeos
  const {
    videos,
    totalVideos,
    carregando,
    erro,
    carregarVideos,
    buscarVideos,
    getEstatisticas,
    temVideos
  } = useVideosYoutube();

  // Obter estatísticas
  const estatisticas = getEstatisticas();

  // Aplicar busca nos vídeos
  const videosFiltrados = buscarVideos(termoBusca);

  // Recarregar dados
  const recarregarDados = async () => {
    try {
      await carregarVideos();
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
                <h1 className="text-xl font-semibold text-white">Vídeos</h1>
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
                <EstatisticasVideos 
                  estatisticas={estatisticas}
                  carregando={carregando}
                />

                {/* Busca */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar vídeos por título..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
                    disabled={carregando}
                  />
                </div>

                {/* Lista de Vídeos */}
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
                ) : !temVideos() ? (
                  <div className="text-center py-12">
                    <Video className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Nenhum vídeo disponível
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Os vídeos do YouTube serão exibidos aqui quando estiverem disponíveis.
                    </p>
                    <Button 
                      onClick={recarregarDados}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Recarregar
                    </Button>
                  </div>
                ) : videosFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Nenhum vídeo encontrado
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Tente ajustar o termo de busca para encontrar vídeos.
                    </p>
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
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header da lista de vídeos */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Play className="h-5 w-5 text-red-400" />
                        {videosFiltrados.length} vídeo{videosFiltrados.length !== 1 ? 's' : ''}
                        {termoBusca && ' encontrado' + (videosFiltrados.length !== 1 ? 's' : '')}
                      </h2>
                    </div>
                    
                    {/* Grid de vídeos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {videosFiltrados.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rodapé com informações */}
                {!carregando && videosFiltrados.length > 0 && (
                  <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-700">
                    Exibindo {videosFiltrados.length} de {totalVideos} vídeos
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

export default Videos;
