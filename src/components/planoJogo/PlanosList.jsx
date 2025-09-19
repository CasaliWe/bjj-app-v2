import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePlanoJogo } from "@/hooks/use-plano-jogo";
import PlanoFormModal from "./PlanoFormModal";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function PlanosList({ onSelectPlano }) {
  const { planos, criarPlano, excluirPlano, carregando } = usePlanoJogo();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [planoParaEditar, setPlanoParaEditar] = useState(null);
  const { toast } = useToast();

  const handleCreate = (dados) => {
    const novoPlano = criarPlano(dados);
    if (novoPlano) {
      setIsFormOpen(false);
    }
  };

  const handleDelete = (id) => {
    const sucesso = excluirPlano(id);
    if (sucesso) {
      toast({
        title: "Plano excluído",
        description: "O plano de jogo foi excluído com sucesso.",
      });
    }
  };

  const handleEdit = (plano) => {
    setPlanoParaEditar(plano);
    setIsFormOpen(true);
  };

  const handleSelect = (plano) => {
    if (onSelectPlano) {
      onSelectPlano(plano);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Meus Planos de Jogo</h2>
          <Button onClick={() => {
            setPlanoParaEditar(null);
            setIsFormOpen(true);
          }} variant="outline" size="sm" className="whitespace-nowrap">
            <Plus className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Novo Plano</span>
          </Button>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : planos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center p-4 border rounded-lg border-dashed">
            <p className="text-muted-foreground mb-4 text-sm">Você ainda não possui planos de jogo cadastrados.</p>
            <Button onClick={() => {
              setPlanoParaEditar(null);
              setIsFormOpen(true);
            }} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Criar meu primeiro plano
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {planos.map((plano) => (
                <Card key={plano.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-1 sm:pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm sm:text-base truncate max-w-[150px] sm:max-w-full">{plano.nome}</CardTitle>
                      <div className="flex space-x-0 ml-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(plano)} className="h-6 w-6 sm:h-8 sm:w-8">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir plano de jogo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o plano "{plano.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(plano.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription className="text-[10px] sm:text-xs">
                      Criado {formatDistanceToNow(new Date(plano.dataCriacao), { addSuffix: true, locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-1 sm:pb-2">
                    <p className="text-xs sm:text-sm mb-2 line-clamp-2">{plano.descricao || "Sem descrição"}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5">
                        {plano.nodes?.length || 0} técnicas
                      </Badge>
                      {plano.categoria && (
                        <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5">
                          {plano.categoria}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-2">
                    <Button 
                      variant="ghost" 
                      className="w-full text-[10px] sm:text-xs justify-between h-7 sm:h-8"
                      onClick={() => handleSelect(plano)}
                    >
                      <span>Ver plano</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Botão flutuante para mobile */}
        <div className="sm:hidden fixed bottom-20 right-4 z-50">
          <Button 
            onClick={() => {
              setPlanoParaEditar(null);
              setIsFormOpen(true);
            }}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {isFormOpen && (
          <PlanoFormModal 
            isOpen={isFormOpen} 
            onClose={() => {
              setIsFormOpen(false);
              setPlanoParaEditar(null);
            }}
            onSubmit={handleCreate}
            planoParaEditar={planoParaEditar}
          />
        )}
      </>
    );
}