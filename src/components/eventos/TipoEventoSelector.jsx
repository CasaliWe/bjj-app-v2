import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Award } from "lucide-react";

/**
 * Componente para seleção do tipo de evento
 * @param {Object} props - Propriedades do componente
 * @param {string} props.tipoSelecionado - Tipo atualmente selecionado
 * @param {Function} props.onTipoChange - Função chamada quando o tipo muda
 * @param {boolean} props.carregando - Se está carregando dados
 * @returns {JSX.Element} Select para escolher tipo de evento
 */
const TipoEventoSelector = ({ tipoSelecionado, onTipoChange, carregando }) => {
  const opcoestipos = [
    {
      value: 'sou-competidor',
      label: 'Sou Competidor',
      icon: Trophy,
      description: 'Eventos da plataforma Sou Competidor'
    },
    {
      value: 'ibjjf',
      label: 'IBJJF',
      icon: Award,
      description: 'Eventos oficiais da IBJJF'
    }
  ];

  // Função para obter o label atual
  const getLabelAtual = () => {
    const opcaoAtual = opcoestipos.find(opcao => opcao.value === tipoSelecionado);
    return opcaoAtual ? opcaoAtual.label : 'Selecione a fonte';
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center gap-4">
        {/* Select centralizado */}
        <div className="w-full max-w-xs flex justify-center">
          <Select
            value={tipoSelecionado}
            onValueChange={onTipoChange}
            disabled={carregando}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-yellow-400 h-12">
              <div className="flex items-center justify-center gap-2 w-full">
                {opcoestipos.find(opcao => opcao.value === tipoSelecionado) && (
                  <>
                    {(() => {
                      const Icon = opcoestipos.find(opcao => opcao.value === tipoSelecionado)?.icon || Trophy;
                      return <Icon className="h-4 w-4 text-yellow-400" />;
                    })()}
                  </>
                )}
                <SelectValue placeholder="Selecione a fonte">
                  {getLabelAtual()}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {opcoestipos.map((opcao) => {
                const Icon = opcao.icon;
                return (
                  <SelectItem
                    key={opcao.value}
                    value={opcao.value}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-yellow-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">{opcao.label}</span>
                        <span className="text-xs text-gray-400">
                          {opcao.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TipoEventoSelector;