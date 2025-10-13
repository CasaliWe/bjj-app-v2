import { MapPin, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Componente para filtros de eventos
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.estadosDisponiveis - Lista de estados disponíveis
 * @param {string} props.estadoSelecionado - Estado atualmente selecionado
 * @param {Function} props.onEstadoChange - Função chamada quando o estado muda
 * @param {boolean} props.carregando - Se está carregando dados
 * @returns {JSX.Element} Componente de filtros
 */
const EventosFilters = ({ 
  estadosDisponiveis = [], 
  estadoSelecionado = 'todos', 
  onEstadoChange,
  carregando = false 
}) => {
  
  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Título do filtro */}
          <div className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-yellow-400" />
            <span className="font-medium">Filtrar por estado:</span>
          </div>

          {/* Select de estado */}
          <div className="flex-1 max-w-xs">
            <Select
              value={estadoSelecionado}
              onValueChange={onEstadoChange}
              disabled={carregando}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-yellow-400" />
                  <SelectValue placeholder="Selecione um estado" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem 
                  value="todos" 
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  Todos os estados
                </SelectItem>
                {estadosDisponiveis.map((estado) => (
                  <SelectItem 
                    key={estado} 
                    value={estado}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informação adicional */}
          {estadoSelecionado !== 'todos' && (
            <div className="text-sm text-gray-400">
              Mostrando eventos de <span className="text-yellow-400 font-medium">{estadoSelecionado}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventosFilters;