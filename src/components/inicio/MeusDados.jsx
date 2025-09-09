import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trophy, Shield, Shirt, CircleOff, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MeusDados({user, treinosDados}) {
  const navigate = useNavigate();

  return (
    <Card className="bg-card border-border">                
        <CardHeader>
            <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-bjj-gold" />
                Meus Dados Gerais
            </CardTitle>
            <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs border-bjj-gold/30 text-bjj-gold hover:bg-bjj-gold/10"
                onClick={() => navigate('/perfil')}
            >
                <Pencil className="h-3 w-3 mr-1" /> Editar
            </Button>
            </div>
        </CardHeader>

        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna 1: Dados Pessoais e Foto */}
                <div className="md:col-span-1">
                    <div className="flex flex-col items-center text-center mb-4">                        
                        <div className="w-32 h-32 rounded-full bg-bjj-gold/10 flex items-center justify-center mb-4 overflow-hidden">
                            {user.imagem ? (
                                <img 
                                src={`${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${user.imagem}`} 
                                alt="Foto de perfil" 
                                className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-bjj-gold" />
                            )}
                        </div>
                        <p className="text-[10px] font-light mb-2">ID: {user.bjj_id}</p>
                        <h3 className="font-semibold text-lg mb-0">{user.nome}</h3>
                        <p className="mb-1 text-sm">{user.idade} Anos</p>
                        <p className="mb-1 text-sm text-bjj-gold">Faixa {user.faixa}</p>
                        <p className="mb-2 text-[12px] text-gray-400">Exp: {user.exp} pontos</p>
                        <div className="flex space-x-2 mt-2">
                            {user.instagram && (
                            <a href={`${user.instagram}`} target="_blank" rel="noopener noreferrer">
                                <img src="/instagram.png" alt="Instagram" className="w-5 h-5 text-bjj-gold" />
                            </a>
                            )}
                            {user.tiktok && (
                            <a href={`${user.tiktok}`} target="_blank" rel="noopener noreferrer">
                                <img src="/tiktok.png" alt="TikTok" className="w-5 h-5 text-bjj-gold" />
                            </a>
                            )}
                            {user.youtube && (
                            <a href={`${user.youtube}`} target="_blank" rel="noopener noreferrer">
                                <img src="/youtube.png" alt="YouTube" className="w-5 h-5 text-bjj-gold" />
                            </a>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm">
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="col-span-2">{user.email}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Whatsapp:</span>
                            <span className="col-span-2">{user.whatsapp}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Peso:</span>
                            <span className="col-span-2">{user.peso} kg</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Academia:</span>
                            <span className="col-span-2">{user.academia}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Localização:</span>
                            <span className="col-span-2">{user.cidade} - {user.estado} - {user.pais}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Estilo:</span>
                            <span className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bjj-gold/10 text-bjj-gold">
                                <Shield className="w-3 h-3 mr-1" />
                                {user.estilo === 'Guardeiro' ? 'Guardeiro' : user.estilo === 'Passador' ? 'Passador' : 'Equilibrado'}
                            </span>
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Competidor:</span>
                            <span className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bjj-gold/10 text-bjj-gold">
                                <Trophy className="w-3 h-3 mr-1" /> 
                                {user.competidor === 'Sim' ? 'Ativo' : user.competidor === 'Não' ? 'Inativo' : 'Eventualmente'}
                            </span>
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-muted-foreground">Finalização:</span>
                            <span className="col-span-2">{user.finalizacao}</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border/50">
                    <h4 className="text-sm font-medium mb-2">Bio:</h4>
                    <p className="text-xs text-muted-foreground">
                        {user.bio}
                    </p>
                    </div>
                </div>
                {/* Coluna 1: Dados Pessoais e Foto */}
                
                {/* Coluna 2: Histórico de Treinos */}
                <div className="md:col-span-1">
                    <h3 className="font-medium text-base mb-4">Histórico de Treinos</h3>
                    
                    <div className="space-y-4">
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
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
                        
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
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
                    </div>
                </div>
                {/* Coluna 2: Histórico de Treinos */}
                
                {/* Coluna 3: Histórico de Competições */}
                <div className="md:col-span-1">
                    <h3 className="font-medium text-base mb-4">Histórico de Competições</h3>
                    
                    <div className="space-y-4">
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
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
                        
                        <div className="bg-card/50 border border-border/50 rounded-lg p-4">                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
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
                    </div>
                </div>
                {/* Coluna 3: Histórico de Competições */}
            </div>
        </CardContent>
    </Card>
  );
}
