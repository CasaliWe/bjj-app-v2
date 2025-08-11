import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  TabsContent 
} from "@/components/ui/tabs";
import {
  Lock
} from "lucide-react";


export function AlterarSenha() {

  // Estados para as senhas
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // ATUALIZANDO INPUTS DA SENHA
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagem de erro quando o usuário começa a digitar
    if (passwordError) setPasswordError("");
  };
  
  // ATUALIZANDO A SENHA VIA API ****************************
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


  return(
    <TabsContent value="password">
        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md mx-auto">
          {/* content */}
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
          {/* content */}
          
          {/* aviso erro */}
          {passwordError && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded-md text-sm">
              {passwordError}
              </div>
          )}
          {/* aviso erro */}
          
          {/* botão submit */}
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
          {/* botão submit */}
          
          {/* aviso success */}
          {passwordSuccess && (
              <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2 rounded-md text-sm flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              Senha alterada com sucesso!
              </div>
          )}
          {/* aviso success */}
        </form>                
    </TabsContent>
  )
}

