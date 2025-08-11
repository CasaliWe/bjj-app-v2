import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";

export function AtividadesRecentes({recentActivities}) {
  return (
    <Card className="bg-card border-border">
        <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-bjj-gold" />
            Atividades Recentes
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="p-2 bg-bjj-gold/10 rounded-lg">
                <Target className="w-4 h-4 text-bjj-gold" />
            </div>
            <div className="flex-1 space-y-1">
                <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                <p className="text-muted-foreground text-xs">{activity.description}</p>
                <p className="text-bjj-gold text-xs font-medium">{activity.time}</p>
            </div>
            </div>
        ))}
        </CardContent>
    </Card>
  );
}
