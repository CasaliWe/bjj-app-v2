import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  X
} from "lucide-react";

/**
 * Componente de Busca - permite buscar módulos
 * 
 * @param {Object} props
 * @param {Function} props.onBuscar - Função para buscar módulos
 * @param {string} props.termoBusca - Termo de busca atual
 * @param {boolean} props.carregando - Se está carregando
 */
const FiltrosAprender = ({ 
  onBuscar,
  termoBusca = "",
  carregando = false
}) => {
  const [busca, setBusca] = useState(termoBusca);

  // Aplicar busca
  const handleBuscar = (e) => {
    e.preventDefault();
    if (onBuscar) {
      onBuscar(busca.trim());
    }
  };

  // Limpar busca
  const limparBusca = () => {
    setBusca("");
    if (onBuscar) {
      onBuscar("");
    }
  };

  return (
    <div className="mb-6">
      {/* Barra de busca */}
      <form onSubmit={handleBuscar} className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar módulos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
            disabled={carregando}
          />
          {busca && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={limparBusca}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-yellow-400"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FiltrosAprender;