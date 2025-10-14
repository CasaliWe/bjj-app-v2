import { Card, CardContent } from "@/components/ui/card";
import { Play, Video } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EstatisticasVideos = ({ estatisticas, carregando }) => {
  if (carregando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      titulo: "Total de Vídeos",
      valor: estatisticas.total_videos || 0,
      icone: Video,
      cor: "text-blue-400"
    },
    {
      titulo: "Conteúdo Disponível",
      valor: `${estatisticas.videos_carregados || 0} vídeos`,
      icone: Play,
      cor: "text-green-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconeComponente = card.icone;
        
        return (
          <Card key={index} className="bg-gray-800 border-gray-700 hover:border-yellow-400 transition-colors duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-700 ${card.cor}`}>
                  <IconeComponente className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    {card.titulo}
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {typeof card.valor === 'number' ? card.valor.toLocaleString() : card.valor}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EstatisticasVideos;