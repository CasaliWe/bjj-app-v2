import { Trophy, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Componente para exibir estatísticas dos eventos
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.estatisticas - Estatísticas dos eventos
 * @param {boolean} props.carregando - Se está carregando dados
 * @returns {JSX.Element} Componente de estatísticas
 */
const EstatisticasEventos = ({ estatisticas = {}, carregando = false }) => {
  
  const stats = [
    {
      icon: Trophy,
      label: "Total de Eventos",
      value: estatisticas.total_eventos || 0,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      icon: MapPin,
      label: "Estados",
      value: estatisticas.total_estados || 0,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      icon: Calendar,
      label: "Disponíveis",
      value: `${estatisticas.total_eventos || 0} eventos`,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    }
  ];

  if (carregando) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {typeof stat.value === 'number' && stat.value > 999 
                      ? `${(stat.value / 1000).toFixed(1)}k` 
                      : stat.value
                    }
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EstatisticasEventos;