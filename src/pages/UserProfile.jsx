import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  User,
  Save,
  Lock,
  Shield,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Trophy
} from "lucide-react";
import { InstallPWAButton } from "@/components/InstallPWAButton";

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Estados para os dados do perfil
  const [profileData, setProfileData] = useState({
    nome: 'Weslei Casali',
    email: 'weslei.casali@example.com',
    idade: 28,
    peso: 75,
    faixa: 'Azul',
    imagem: '/user.jpeg',
    telefone: '(11) 98765-4321',
    instagram: '@instagram',
    tiktok: '@tiktok',
    youtube: '@youtube',
    perfilPublico: true,
    academia: 'Gracie Barra',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    estilo: 'Guardeiro',
    competidor: 'Sim',
    finalizacao: 'Triângulo',
    bio: 'Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações.',
  });
  
  // Estados para as senhas
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Estados para o envio dos formulários
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // MUDANDO DADOS DOS INPUTS
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // MUDANDO ITEM DO SELECT
  const handleSelectChange = (name, value) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // ATUALIZANDO DADOS DO USER VIA API
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      setIsSubmittingProfile(false);

      console.log("Dados do perfil atualizados:", profileData);

      setProfileSuccess(true);
      
      setTimeout(() => {
        setProfileSuccess(false);
      }, 4000);
    }, 1500);
  };


  // ATUALIZANDO IMPUTS DA SENHA
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagem de erro quando o usuário começa a digitar
    if (passwordError) setPasswordError("");
  };
  
  // ATUALIZANDO A SENHA VIA API
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validação
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    
    setIsSubmittingPassword(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      setIsSubmittingPassword(false);

      console.log("Dados da senha atualizados:", passwordData);

      setPasswordSuccess(true);
      
      // Limpar os campos de senha
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 4000);
    }, 1500);
  };



  // VOLTANDO PARA PÁG ANTERIOR
  const handleBack = () => {
    window.location.href = "/app"; 
  };

  return (
    <div className="min-h-screen bg-[#121315] flex flex-col p-4">
      {/* Círculos decorativos sutis */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-bjj-gold/5 rounded-full blur-xl hidden lg:block" />
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-bjj-gold/5 rounded-full blur-2xl hidden lg:block" />
      
      <div className="flex-grow flex flex-col max-w-5xl mx-auto w-full relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bjj-gold rounded-xl flex items-center justify-center">
              <span className="text-bjj-dark font-bold text-lg">BJJ</span>
            </div>
            <div>
              <h1 className="text-2xl mb-2 font-bold text-foreground">Academy</h1>
              <p className="text-muted-foreground text-xs">Perfil do Usuário</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-9 px-3 border-border hover:border-bjj-gold/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </header>

        {/* Conteúdo Principal */}
        <div className="flex-grow animate-fade-in">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-bjj-gold" />
                Meu Perfil
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e credenciais de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>              
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-28 md:mb-16">
                  <TabsTrigger value="profile">Informações</TabsTrigger>
                  <TabsTrigger value="password">Alterar Senha</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                      <div className="w-32 h-32 rounded-full bg-bjj-gold/10 flex items-center justify-center flex-shrink-0 relative group">
                        <User className="w-16 h-16 text-bjj-gold" />
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <p className="text-white text-xs font-medium">Alterar foto</p>
                        </div>
                      </div>
                      
                      {/* campos gerais user */}
                      <div className="w-full space-y-2">                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <Label htmlFor="nome">Nome Completo</Label>
                            <Input
                              id="nome"
                              name="nome"
                              value={profileData.nome}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>

                          <div>
                            <Label htmlFor="email">E-mail</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="bg-card/50 border-border/40"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div>
                            <Label htmlFor="telefone">Telefone</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="telefone"
                                name="telefone"
                                value={profileData.telefone}
                                onChange={handleProfileChange}
                                className="bg-card/50 border-border/40"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="idade">Idade</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="idade"
                                name="idade"
                                type="number"
                                value={profileData.idade}
                                onChange={handleProfileChange}
                                className="bg-card/50 border-border/40"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="peso">Peso</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="peso"
                                name="peso"
                                type="number"
                                value={profileData.peso}
                                onChange={handleProfileChange}
                                className="bg-card/50 border-border/40"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              name="instagram"
                              value={profileData.instagram}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tiktok">TikTok</Label>
                            <Input
                              id="tiktok"
                              name="tiktok"
                              value={profileData.tiktok}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                          <div>
                            <Label htmlFor="youtube">YouTube</Label>
                            <Input
                              id="youtube"
                              name="youtube"
                              value={profileData.youtube}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            className="bg-card/50 border-border/40 resize-none"
                          />
                        </div>
                      </div>
                      {/* campos gerais user */}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dados de Jiu-Jitsu</h3>
                        
                        <div>
                          <Label htmlFor="faixa">Faixa</Label>
                          <Select 
                            name="faixa" 
                            value={profileData.faixa}
                            onValueChange={(value) => handleSelectChange("faixa", value)}
                          >
                            <SelectTrigger className="bg-card/50 border-border/40">
                              <SelectValue placeholder="Selecione sua faixa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Branca">Branca</SelectItem>
                              <SelectItem value="Azul">Azul</SelectItem>
                              <SelectItem value="Roxa">Roxa</SelectItem>
                              <SelectItem value="Marrom">Marrom</SelectItem>
                              <SelectItem value="Preta">Preta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="estilo">Estilo</Label>
                          <div className="flex items-center gap-2">
                            <Select
                              name="estilo"
                              value={profileData.estilo}
                              onValueChange={(value) => handleSelectChange("estilo", value)}
                            >
                              <SelectTrigger className="bg-card/50 border-border/40">
                                <SelectValue placeholder="Selecione seu estilo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Guardeiro">Guardeiro</SelectItem>
                                <SelectItem value="Passador">Passador</SelectItem>
                                <SelectItem value="Equilibrado">Equilibrado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="competidor">Competidor</Label>
                          <div className="flex items-center gap-2">
                            <Select
                              name="competidor"
                              value={profileData.competidor}
                              onValueChange={(value) => handleSelectChange("competidor", value)}
                            >
                              <SelectTrigger className="bg-card/50 border-border/40">
                                <SelectValue placeholder="Você compete?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sim">Sim</SelectItem>
                                <SelectItem value="Não">Não</SelectItem>
                                <SelectItem value="Eventualmente">Eventualmente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="finalizacao">Finalização Favorita</Label>
                          <Input
                            id="finalizacao"
                            name="finalizacao"
                            value={profileData.finalizacao}
                            onChange={handleProfileChange}
                            className="bg-card/50 border-border/40"
                          />
                        </div>
                      
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Localização</h3>
                        
                        <div>
                          <Label htmlFor="academia">Academia</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="academia"
                              name="academia"
                              value={profileData.academia}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="cidade">Cidade</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="cidade"
                              name="cidade"
                              value={profileData.cidade}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="estado">Estado</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="estado"
                              name="estado"
                              value={profileData.estado}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40 uppercase"
                              maxLength={2}
                              minLength={2}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="pais">País</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="pais"
                              name="pais"
                              value={profileData.pais}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                        </div>
                    
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmittingProfile}
                        className="bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                      >
                        {isSubmittingProfile ? (
                          <>
                            <span className="animate-pulse mr-2">●</span>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {profileSuccess && (
                      <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2 rounded-md text-sm flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        Perfil atualizado com sucesso!
                      </div>
                    )}
                  </form>
                </TabsContent>
                
                <TabsContent value="password">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md mx-auto">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Lock className="h-5 w-5 text-bjj-gold" />
                        Alterar Senha
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                    </div>
                    
                    {passwordError && (
                      <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded-md text-sm">
                        {passwordError}
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmittingPassword}
                        className="w-full bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                      >
                        {isSubmittingPassword ? (
                          <>
                            <span className="animate-pulse mr-2">●</span>
                            Alterando senha...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Alterar Senha
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {passwordSuccess && (
                      <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2 rounded-md text-sm flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        Senha alterada com sucesso!
                      </div>
                    )}
                  </form>                
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6 max-w-md mx-auto">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Shield className="h-5 w-5 text-bjj-gold" />
                        Configurações do Aplicativo
                      </h3>
                      
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Instalar Aplicativo</CardTitle>
                          <CardDescription>
                            Instale o BJJ Academy na tela inicial do seu dispositivo para acesso offline e melhor experiência.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {/* Importamos o componente aqui */}
                          <InstallPWAButton />
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Notificações</CardTitle>
                          <CardDescription>
                            Configure como deseja receber notificações do aplicativo.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="notify-treinos" className="cursor-pointer flex items-center gap-2">
                              Lembretes de Treino
                            </Label>
                            <input
                              type="checkbox"
                              id="notify-treinos"
                              className="toggle toggle-primary"
                              defaultChecked
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="notify-competicoes" className="cursor-pointer flex items-center gap-2">
                              Alertas de Competições
                            </Label>
                            <input
                              type="checkbox"
                              id="notify-competicoes"
                              className="toggle toggle-primary"
                              defaultChecked
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Copyright footer */}
        <div className="text-center mt-6 mb-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BJJ Academy. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
