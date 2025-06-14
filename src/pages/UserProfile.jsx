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

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Estados para os dados do perfil
  const [profileData, setProfileData] = useState({
    name: "Carlos Silva",
    email: "carlos.silva@email.com",
    phone: "(11) 98765-4321",
    academy: "Alliance Jiu-Jitsu",
    location: "São Paulo, SP",
    belt: "blue",
    degrees: "2",
    style: "guard",
    competitor: "yes",
    favSubmission: "Triângulo",
    since: "2022-08",
    bio: "Praticante de Jiu-Jitsu há 3 anos, focado em competições e desenvolvimento técnico. Especialista em guarda e jogo de lapela. Buscando evoluir em raspagens e finalizações."
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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagem de erro quando o usuário começa a digitar
    if (passwordError) setPasswordError("");
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      setIsSubmittingProfile(false);
      setProfileSuccess(true);
      
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    }, 1500);
  };
  
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
      setPasswordSuccess(true);
      
      // Limpar os campos de senha
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleBack = () => {
    navigate(-1);
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
              <h1 className="text-2xl font-bold text-foreground">Academy</h1>
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
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
                  <TabsTrigger value="password">Alterar Senha</TabsTrigger>
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
                      
                      <div className="w-full space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="bg-card/50 border-border/40"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <Label htmlFor="email">E-mail</Label>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
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
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="bg-card/50 border-border/40"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dados de Jiu-Jitsu</h3>
                        
                        <div>
                          <Label htmlFor="belt">Faixa</Label>
                          <Select 
                            name="belt" 
                            value={profileData.belt}
                            onValueChange={(value) => handleSelectChange("belt", value)}
                          >
                            <SelectTrigger className="bg-card/50 border-border/40">
                              <SelectValue placeholder="Selecione sua faixa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="white">Branca</SelectItem>
                              <SelectItem value="blue">Azul</SelectItem>
                              <SelectItem value="purple">Roxa</SelectItem>
                              <SelectItem value="brown">Marrom</SelectItem>
                              <SelectItem value="black">Preta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="degrees">Graus</Label>
                          <Select 
                            name="degrees"
                            value={profileData.degrees}
                            onValueChange={(value) => handleSelectChange("degrees", value)}
                          >
                            <SelectTrigger className="bg-card/50 border-border/40">
                              <SelectValue placeholder="Selecione os graus" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="style">Estilo</Label>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            <Select 
                              name="style" 
                              value={profileData.style}
                              onValueChange={(value) => handleSelectChange("style", value)}
                            >
                              <SelectTrigger className="bg-card/50 border-border/40">
                                <SelectValue placeholder="Selecione seu estilo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="guard">Guardeiro</SelectItem>
                                <SelectItem value="passer">Passador</SelectItem>
                                <SelectItem value="balanced">Equilibrado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="competitor">Competidor</Label>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-muted-foreground" />
                            <Select 
                              name="competitor" 
                              value={profileData.competitor}
                              onValueChange={(value) => handleSelectChange("competitor", value)}
                            >
                              <SelectTrigger className="bg-card/50 border-border/40">
                                <SelectValue placeholder="Você compete?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Sim</SelectItem>
                                <SelectItem value="no">Não</SelectItem>
                                <SelectItem value="sometimes">Eventualmente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="since">Treina desde</Label>
                          <Input
                            id="since"
                            name="since"
                            type="month"
                            value={profileData.since}
                            onChange={handleProfileChange}
                            className="bg-card/50 border-border/40"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Localização e Preferências</h3>
                        
                        <div>
                          <Label htmlFor="academy">Academia</Label>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="academy"
                              name="academy"
                              value={profileData.academy}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Cidade / Estado</Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="location"
                              name="location"
                              value={profileData.location}
                              onChange={handleProfileChange}
                              className="bg-card/50 border-border/40"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="favSubmission">Finalização Favorita</Label>
                          <Input
                            id="favSubmission"
                            name="favSubmission"
                            value={profileData.favSubmission}
                            onChange={handleProfileChange}
                            className="bg-card/50 border-border/40"
                          />
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
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Copyright footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">© 2025 BJJ Academy. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
