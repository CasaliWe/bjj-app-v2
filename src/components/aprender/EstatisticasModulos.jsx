import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Video, 
  Clock,
  TrendingUp,
  Target
} from "lucide-react";

/**
 * Componente de Estatísticas dos Módulos - exibe resumo dos dados de aprendizado
 * 
 * @param {Object} props
 * @param {Object} props.estatisticas - Dados das estatísticas
 * @param {boolean} props.carregando - Se está carregando os dados
 */
const EstatisticasModulos = ({ 
  estatisticas = {},
  carregando = false
}) => {
  const {
    totalModulos = 0,
    totalTecnicas = 0
  } = estatisticas;

  const cards = [
    {
      titulo: "Total de Módulos",
      valor: totalModulos,
      icon: BookOpen,
      cor: "yellow",
      descricao: "Módulos disponíveis"
    },
    {
      titulo: "Total de Técnicas",
      valor: totalTecnicas,
      icon: Video,
      cor: "yellow",
      descricao: "Técnicas para aprender"
    }
  ];

  if (carregando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-600 rounded w-20"></div>
                <div className="h-5 w-5 bg-gray-600 rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-600 rounded w-12 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        const corClasses = {
          yellow: "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20"
        };

        return (
          <Card key={index} className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {card.titulo}
                </CardTitle>
                <div className={`p-2 rounded-lg ${corClasses[card.cor]}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {card.valor}
                {card.sufixo && (
                  <span className="text-lg text-yellow-400">{card.sufixo}</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {card.descricao}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EstatisticasModulos;