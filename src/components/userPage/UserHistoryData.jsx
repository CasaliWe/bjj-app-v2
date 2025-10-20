import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trophy, Shield, Shirt, CircleOff, Calendar, Activity } from "lucide-react";

/**
 * Componente para exibir histórico de treinos e competições na página de usuário público
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.treinosDados - Dados de treinos e competições do usuário
 * @returns {JSX.Element} Componente React
 */
export function UserHistoryData({ treinosDados }) {
  // Se não tiver dados ou os campos necessários, não renderiza nada
  if (!treinosDados || (!treinosDados.gi && !treinosDados.noGi && !treinosDados.competicoesGi && !treinosDados.competicoesNoGi)) {
    return null;
  }

  return (
    <div className="mt-6">
      <Card className="bg-card border-border">                
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-bjj-gold" />
            Histórico de Atividades
          </CardTitle>
        </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1: Histórico de Treinos */}
          {(treinosDados.gi || treinosDados.noGi) && (
            <div>
              <h3 className="font-medium text-base mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bjj-gold" />
                Histórico de Treinos
              </h3>
              
              <div className="space-y-4">
                {treinosDados.gi && (
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Shirt className="w-4 h-4 text-bjj-gold" /> Com Kimono (Gi)
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Total Treinos:</span>
                        <span className="font-medium">{treinosDados.gi.total}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Este Mês:</span>
                        <span className="font-medium">{treinosDados.gi.esteMes}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Última Vez:</span>
                        <span className="font-medium">{treinosDados.gi.ultimaVez}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {treinosDados.noGi && (
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <CircleOff className="w-4 h-4 text-bjj-gold" /> Sem Kimono (No-Gi)
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Total Treinos:</span>
                        <span className="font-medium">{treinosDados.noGi.total}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Este Mês:</span>
                        <span className="font-medium">{treinosDados.noGi.esteMes}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Última Vez:</span>
                        <span className="font-medium">{treinosDados.noGi.ultimaVez}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Coluna 2: Histórico de Competições */}
          {(treinosDados.competicoesGi || treinosDados.competicoesNoGi) && (
            <div>
              <h3 className="font-medium text-base mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-bjj-gold" />
                Histórico de Competições
              </h3>
              
              <div className="space-y-4">
                {treinosDados.competicoesGi && (
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Shirt className="w-4 h-4 text-bjj-gold" /> Gi (Kimono)
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Eventos</p>
                        <p className="font-medium">{treinosDados.competicoesGi.eventos}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Lutas</p>
                        <p className="font-medium">{treinosDados.competicoesGi.lutas}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Vitórias</p>
                        <p className="font-medium text-green-400">{treinosDados.competicoesGi.vitorias}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Derrotas</p>
                        <p className="font-medium text-red-400">{treinosDados.competicoesGi.derrotas}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Finalizações</p>
                        <p className="font-medium">{treinosDados.competicoesGi.finalizacoes}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-border/30 pt-3">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                        <span className="text-xs">{treinosDados.competicoesGi.primeiroLugar}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                        <span className="text-xs">{treinosDados.competicoesGi.segundoLugar}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-amber-700"></div>
                        <span className="text-xs">{treinosDados.competicoesGi.terceiroLugar}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {treinosDados.competicoesNoGi && (
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <CircleOff className="w-4 h-4 text-bjj-gold" /> No-Gi (Sem Kimono)
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Eventos</p>
                        <p className="font-medium">{treinosDados.competicoesNoGi.eventos}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Lutas</p>
                        <p className="font-medium">{treinosDados.competicoesNoGi.lutas}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Vitórias</p>
                        <p className="font-medium text-green-400">{treinosDados.competicoesNoGi.vitorias}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Derrotas</p>
                        <p className="font-medium text-red-400">{treinosDados.competicoesNoGi.derrotas}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Finalizações</p>
                        <p className="font-medium">{treinosDados.competicoesNoGi.finalizacoes}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-border/30 pt-3">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                        <span className="text-xs">{treinosDados.competicoesNoGi.primeiroLugar}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                        <span className="text-xs">{treinosDados.competicoesNoGi.segundoLugar}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-amber-700"></div>
                        <span className="text-xs">{treinosDados.competicoesNoGi.terceiroLugar}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}