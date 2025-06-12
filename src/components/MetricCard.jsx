
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ title, value, description, icon: Icon, trend }) {
  return (
    <Card className="bg-card border-border hover:border-bjj-gold/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {trend && (
              <div className={`text-xs font-medium ${
                trend.type === 'up' ? 'text-green-400' : 
                trend.type === 'down' ? 'text-red-400' : 
                'text-muted-foreground'
              }`}>
                {trend.text}
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
