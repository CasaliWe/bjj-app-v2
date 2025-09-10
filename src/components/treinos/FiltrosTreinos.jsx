import { Calendar, ChevronDown, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DIAS_SEMANA } from "@/services/treinos/treinosService";
import { useState } from "react";

/**
 * Componente de filtros para treinos
 * @param {Object} props Propriedades do componente
 * @param {string} props.filtroTipo Tipo de treino selecionado
 * @param {string} props.filtroDiaSemana Dia da semana selecionado
 * @param {Function} props.setFiltroTipo Função para alterar o tipo
 * @param {Function} props.setFiltroDiaSemana Função para alterar o dia
 * @param {Function} props.limparFiltros Função para limpar os filtros
 * @param {number} props.totalResultados Total de resultados encontrados
 * @returns {JSX.Element} Componente React
 */
const FiltrosTreinos = ({
  filtroTipo,
  filtroDiaSemana,
  setFiltroTipo,
  setFiltroDiaSemana,
  limparFiltros,
  totalResultados
}) => {
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);
  const mostrarBotaoLimpar = filtroTipo !== "todos" || filtroDiaSemana !== "todos";
  
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Filtros
            </CardTitle>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-1" />
              {filtrosExpandidos ? "Ocultar" : "Mostrar"}
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${filtrosExpandidos ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        {/* Em dispositivos móveis, o conteúdo dos filtros só aparece quando expandido */}
        <CardContent className={`flex flex-col md:flex-row gap-4 ${!filtrosExpandidos ? 'hidden md:flex' : ''}`}>
          <div className="flex-1">
            <Label htmlFor="tipo">Tipo</Label>
            <Select 
              value={filtroTipo} 
              onValueChange={(value) => {
                setFiltroTipo(value);
                // Em mobile, após selecionar, fecha os filtros
                if (window.innerWidth < 768) {
                  setFiltrosExpandidos(false);
                }
              }}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="gi">Com Kimono (Gi)</SelectItem>
                <SelectItem value="nogi">Sem Kimono (No-Gi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="dia-semana">Dia da Semana</Label>
            <Select 
              value={filtroDiaSemana} 
              onValueChange={(value) => {
                setFiltroDiaSemana(value);
                // Em mobile, após selecionar, fecha os filtros
                if (window.innerWidth < 768) {
                  setFiltrosExpandidos(false);
                }
              }}
            >
              <SelectTrigger id="dia-semana">
                <SelectValue placeholder="Todos os dias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {DIAS_SEMANA.map((dia) => (
                  <SelectItem key={dia.value} value={dia.value}>
                    {dia.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Contador de resultados e botão limpar */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-muted-foreground">
          {totalResultados} treinos encontrados
        </p>
        {mostrarBotaoLimpar && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              limparFiltros();
              setFiltrosExpandidos(false);
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>
    </>
  );
};

export default FiltrosTreinos;
