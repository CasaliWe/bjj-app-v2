
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ title, value, meta, icon: Icon, faltando, totalObs }) {
  return (
    <Card className="bg-card border-border hover:border-bjj-gold/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {meta && (
                <p className="text-xs text-muted-foreground">Objetivo: {meta}</p>
              )}
            </div>
            {faltando && (
              <div className={`text-xs font-medium ${
                faltando.type === 'up' ? 'text-green-400' : 
                faltando.type === 'down' ? 'text-red-400' : 
                'text-muted-foreground'
              }`}>
                Ainda Faltando: {faltando.text}
              </div>
            )}

            {totalObs && (
              <div className="text-xs font-medium text-muted-foreground">
                total de observações: {totalObs}
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-2 bg-bjj-gold/10 rounded-lg group-hover:bg-bjj-gold/20 transition-colors duration-300">
              <Icon className="w-5 h-5 text-bjj-gold" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
