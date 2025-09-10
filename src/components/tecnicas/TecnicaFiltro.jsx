import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

/**
 * Componente de filtro para as técnicas
 * 
 * @param {Object} props
 * @param {string} props.filtroCategoria - Categoria selecionada
 * @param {string} props.filtroPosicao - Posição selecionada
 * @param {Function} props.onCategoriaChange - Função chamada quando a categoria é alterada
 * @param {Function} props.onPosicaoChange - Função chamada quando a posição é alterada
 * @param {Function} props.onLimparFiltros - Função para limpar todos os filtros
 * @param {Array} props.posicoesCadastradas - Lista de posições cadastradas
 * @param {number} props.totalResultados - Total de resultados encontrados
 */
const TecnicaFiltro = ({
  filtroCategoria,
  filtroPosicao,
  onCategoriaChange,
  onPosicaoChange,
  onLimparFiltros,
  posicoesCadastradas,
  totalResultados
}) => {
  // Verificar se os filtros estão ativos para exibir o botão de limpar
  const filtrosAtivos = 
    (filtroCategoria && filtroCategoria !== "todas") || 
    (filtroPosicao && filtroPosicao !== "todas");

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtrar Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="categoria">Categoria</Label>
            <Select 
              value={filtroCategoria} 
              onValueChange={onCategoriaChange}
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="guardeiro">Guardeiro</SelectItem>
                <SelectItem value="passador">Passador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="posicao">Posição</Label>
            <Select 
              value={filtroPosicao} 
              onValueChange={onPosicaoChange}
            >
              <SelectTrigger id="posicao">
                <SelectValue placeholder="Todas as posições" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {posicoesCadastradas.map((posicao, idx) => (
                  <SelectItem key={idx} value={posicao}>
                    {posicao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contador de resultados e botão limpar filtros */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {totalResultados} técnicas encontradas
        </p>
        {filtrosAtivos && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLimparFiltros}
          >
            Limpar filtros
          </Button>
        )}
      </div>
    </>
  );
};

export default TecnicaFiltro;
