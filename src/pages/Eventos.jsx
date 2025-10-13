import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  RefreshCw,
  AlertCircle,
  Search
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Hooks personalizados
import { useGetUser } from "@/hooks/use-getUser";
import { useEventos } from "@/hooks/use-eventos";

// Componentes específicos da página
import EventoCard from "@/components/eventos/EventoCard";
import EstatisticasEventos from "@/components/eventos/EstatisticasEventos";
import EventosFilters from "@/components/eventos/EventosFilters";

// Título da página
import TitleUpdater from "@/components/TitleUpdater";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const Eventos = () => {
  // Estados para busca
  const [termoBusca, setTermoBusca] = useState("");

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  // Hook personalizado para gerenciar eventos
  const {
    eventosPorEstado,
    estadoSelecionado,
    carregando,
    erro,
    estadosDisponiveis,
    carregarEventos,
    alterarEstadoSelecionado,
    getEstatisticas,
    buscarEventos,
    temEventos
  } = useEventos();

  // Obter estatísticas
  const estatisticas = getEstatisticas();

  // Aplicar busca nos eventos
  const eventosFiltrados = buscarEventos(termoBusca);

  // Obter lista de todos os eventos para contagem
  const todosEventosFiltrados = Object.values(eventosFiltrados).reduce((acc, estadoData) => {
    return acc + (estadoData.total_eventos || 0);
  }, 0);

  // Recarregar dados
  const recarregarDados = async () => {
    try {
      await carregarEventos();
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
                <h1 className="text-xl font-semibold text-white">Eventos</h1>
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
                <EstatisticasEventos 
                  estatisticas={estatisticas}
                  carregando={carregando}
                />

                {/* Filtros */}
                <EventosFilters
                  estadosDisponiveis={estadosDisponiveis}
                  estadoSelecionado={estadoSelecionado}
                  onEstadoChange={alterarEstadoSelecionado}
                  carregando={carregando}
                />

                {/* Busca */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar eventos por nome, local ou data..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
                    disabled={carregando}
                  />
                </div>

                {/* Lista de Eventos */}
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
                ) : !temEventos() ? (
                  <div className="text-center py-12">
                    <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Nenhum evento disponível
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Os eventos de grappling serão exibidos aqui quando estiverem disponíveis.
                    </p>
                    <Button 
                      onClick={recarregarDados}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Recarregar
                    </Button>
                  </div>
                ) : todosEventosFiltrados === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {termoBusca 
                        ? "Nenhum evento encontrado" 
                        : "Nenhum evento no estado selecionado"
                      }
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {termoBusca
                        ? "Tente ajustar o termo de busca ou selecionar outro estado."
                        : "Selecione 'Todos os estados' ou outro estado para ver mais eventos."
                      }
                    </p>
                    <div className="flex justify-center gap-2">
                      {termoBusca && (
                        <Button
                          variant="outline"
                          onClick={() => setTermoBusca("")}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Limpar busca
                        </Button>
                      )}
                      {estadoSelecionado !== 'todos' && (
                        <Button
                          variant="outline"
                          onClick={() => alterarEstadoSelecionado('todos')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Ver todos os estados
                        </Button>
                      )}
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
                    {/* Eventos organizados por estado */}
                    {Object.entries(eventosFiltrados).map(([estado, estadoData]) => (
                      <div key={estado} className="space-y-4">
                        {/* Cabeçalho do estado */}
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            {estado} - {estadoData.total_eventos} evento{estadoData.total_eventos !== 1 ? 's' : ''}
                          </h2>
                        </div>
                        
                        {/* Lista de eventos do estado */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {estadoData.eventos.map((evento) => (
                            <EventoCard
                              key={evento.id}
                              evento={evento}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rodapé com informações */}
                {!carregando && todosEventosFiltrados > 0 && (
                  <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-700">
                    Exibindo {todosEventosFiltrados} de {estatisticas.total_eventos} eventos
                    {estadoSelecionado !== 'todos' && (
                      <span className="text-yellow-400"> • Estado: {estadoSelecionado}</span>
                    )}
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

export default Eventos;