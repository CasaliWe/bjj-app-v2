
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Book, Award } from "lucide-react";

const quickActions = [
  {
    title: "Nova Técnica",
    description: "Adicionar técnica aprendida",
    icon: Book,
    action: () => window.location.href = "/tecnicas",
    variant: "outline"
  },
  {
    title: "Registrar Treino",
    description: "Marcar treino de hoje",
    icon: Calendar,
    action: () => window.location.href = "/treinos",
    variant: "outline"
  },
  {
    title: "Nova Competição",
    description: "Cadastrar competição",
    icon: Award,
    action: () => window.location.href = "/competicoes",
    variant: "outline"
  }
];

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="w-5 h-5 text-bjj-gold" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full justify-start h-auto p-4 hover:border-bjj-gold/50 transition-all duration-200"
            onClick={action.action}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-bjj-gold/10 rounded-lg">
                <action.icon className="w-4 h-4 text-bjj-gold" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
