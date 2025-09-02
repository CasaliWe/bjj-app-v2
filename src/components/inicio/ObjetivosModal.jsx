import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ObjetivosModal = ({ isOpen, onClose, metrics, onUpdateMetrics }) => {
  // Estado local para armazenar temporariamente as alterações antes de salvar
  const [localMetrics, setLocalMetrics] = useState({
    tecnicasMeta: metrics.tecnicasMeta,
    treinosMeta: metrics.treinosMeta,
    competicoesMeta: metrics.competicoesMeta
  });

  // Atualiza o estado local quando o componente recebe novas props
  useEffect(() => {
    setLocalMetrics({
      tecnicasMeta: metrics.tecnicasMeta,
      treinosMeta: metrics.treinosMeta,
      competicoesMeta: metrics.competicoesMeta
    });
  }, [isOpen, metrics]); // Atualiza quando o modal abre ou as métricas mudam

  // Função para lidar com mudanças nos campos de input
  const handleMetricsChange = (e) => {
    const { name, value } = e.target;
    setLocalMetrics(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para calcular os valores de "faltando" e "upDown"
  const calculateMetrics = (name, value, currentMetrics) => {
    const newMetrics = { ...currentMetrics };
    
    if (name === 'tecnicasMeta') {
      const tecnicasFaltando = Math.max(0, parseInt(value) - parseInt(currentMetrics.tecnicas));
      newMetrics.tecnicasFaltando = tecnicasFaltando.toString();
      // Se o valor atual for maior ou igual à meta, está "up" (verde), caso contrário "down" (vermelho)
      newMetrics.upDownTecnicas = parseInt(currentMetrics.tecnicas) >= parseInt(value) ? "up" : "down";
      newMetrics.tecnicasMeta = value;
    }
    else if (name === 'treinosMeta') {
      const treinosFaltando = Math.max(0, parseInt(value) - parseInt(currentMetrics.treinos));
      newMetrics.treinosFaltando = treinosFaltando.toString();
      // Se o valor atual for maior ou igual à meta, está "up" (verde), caso contrário "down" (vermelho)
      newMetrics.upDownTreinos = parseInt(currentMetrics.treinos) >= parseInt(value) ? "up" : "down";
      newMetrics.treinosMeta = value;
    }
    else if (name === 'competicoesMeta') {
      const competicoesFaltando = Math.max(0, parseInt(value) - parseInt(currentMetrics.competicoes));
      newMetrics.competicoesFaltando = competicoesFaltando.toString();
      // Se o valor atual for maior ou igual à meta, está "up" (verde), caso contrário "down" (vermelho)
      newMetrics.upDownCompeticoes = parseInt(currentMetrics.competicoes) >= parseInt(value) ? "up" : "down";
      newMetrics.competicoesMeta = value;
    }
    
    return newMetrics;
  };

  // Função para recalcular todas as métricas ao salvar
  const recalcularTodasMetricas = () => {
    const newMetrics = { ...metrics };
    
    // Atualizar técnicas
    const tecnicasFaltando = Math.max(0, parseInt(localMetrics.tecnicasMeta) - parseInt(metrics.tecnicas));
    newMetrics.tecnicasFaltando = tecnicasFaltando.toString();
    newMetrics.upDownTecnicas = parseInt(metrics.tecnicas) >= parseInt(localMetrics.tecnicasMeta) ? "up" : "down";
    newMetrics.tecnicasMeta = localMetrics.tecnicasMeta;
    
    // Atualizar treinos
    const treinosFaltando = Math.max(0, parseInt(localMetrics.treinosMeta) - parseInt(metrics.treinos));
    newMetrics.treinosFaltando = treinosFaltando.toString();
    newMetrics.upDownTreinos = parseInt(metrics.treinos) >= parseInt(localMetrics.treinosMeta) ? "up" : "down";
    newMetrics.treinosMeta = localMetrics.treinosMeta;
    
    // Atualizar competições
    const competicoesFaltando = Math.max(0, parseInt(localMetrics.competicoesMeta) - parseInt(metrics.competicoes));
    newMetrics.competicoesFaltando = competicoesFaltando.toString();
    newMetrics.upDownCompeticoes = parseInt(metrics.competicoes) >= parseInt(localMetrics.competicoesMeta) ? "up" : "down";
    newMetrics.competicoesMeta = localMetrics.competicoesMeta;
    
    return newMetrics;
  };

  // Função para salvar as alterações
  const handleSalvarObjetivos = () => {
    const updatedMetrics = recalcularTodasMetricas();

    // verifica se tem algum vazio '' 
    const hasEmptyFields = Object.values(localMetrics).some(value => value === '');
    if (hasEmptyFields) {
      alert("Todos os campos devem ser preenchidos.");
      return;
    }

    // Atualiza as métricas no componente pai
    onUpdateMetrics(updatedMetrics);
    
    // Fecha o modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar Objetivos Mensais</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="tecnicasMeta" className="text-right col-span-2">
              Técnicas no mês:
            </label>
            <Input
              id="tecnicasMeta"
              name="tecnicasMeta"
              type="number"
              value={localMetrics.tecnicasMeta}
              onChange={handleMetricsChange}
              className="col-span-2"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="treinosMeta" className="text-right col-span-2">
              Treinos no mês:
            </label>
            <Input
              id="treinosMeta"
              name="treinosMeta"
              type="number"
              value={localMetrics.treinosMeta}
              onChange={handleMetricsChange}
              className="col-span-2"
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="competicoesMeta" className="text-right col-span-2">
              Competições no mês:
            </label>
            <Input
              id="competicoesMeta"
              name="competicoesMeta"
              type="number"
              value={localMetrics.competicoesMeta}
              onChange={handleMetricsChange}
              className="col-span-2"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSalvarObjetivos} className="mb-3 bg-bjj-gold hover:bg-bjj-gold/90">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ObjetivosModal;
