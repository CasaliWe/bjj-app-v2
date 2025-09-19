import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { usePlanoJogo } from "@/hooks/use-plano-jogo";
import PlanosList from "./PlanosList";
import PlanoTreeView from "./PlanoTreeView";

export default function PlanoJogoContainer() {
  const { planos, planoAtual, selecionarPlano, carregarPlanos, updateCounter } = usePlanoJogo();
  const [selectedPlanoId, setSelectedPlanoId] = useState(null);
  
  // Recarregar planos ao montar o componente
  useEffect(() => {
    carregarPlanos();
    // Limpar a seleção quando o componente for desmontado
    return () => setSelectedPlanoId(null);
  }, [carregarPlanos]);
  
  // Recarregar o plano atual quando houver mudanças
  useEffect(() => {
    if (selectedPlanoId) {
      selecionarPlano(selectedPlanoId);
    }
  }, [selectedPlanoId, selecionarPlano, planos.length, planos]);
  
  const handleSelectPlano = (plano) => {
    setSelectedPlanoId(plano.id);
    selecionarPlano(plano.id);
  };
  
  const handleBackToList = () => {
    // Recarregar os planos ao voltar para a lista
    carregarPlanos();
    setSelectedPlanoId(null);
  };
  
  return (
    <div className="space-y-4">
      {selectedPlanoId ? (
        <PlanoTreeView 
          plano={planoAtual} 
          onBack={handleBackToList} 
          key={`tree-${planoAtual?.id}-${updateCounter}`} 
        />
      ) : (
        <PlanosList 
          onSelectPlano={handleSelectPlano} 
          key={`list-${updateCounter}`} 
        />
      )}
    </div>
  );
}