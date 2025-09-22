import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  
  TabsContent
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  User,
  Save,
  Camera,
  Upload
} from "lucide-react";

import { getAuthToken } from '@/services/cookies/cookies';



export function Informacoes({profileData, setProfileData}) {

    // Estados para o envio dos formulários
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    
    // Estados para o upload de imagem
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    // MUDANDO DADOS DOS INPUTS
    const handleProfileChange = (e) => {
      const { name, value } = e.target;
      
      // Aplicar máscara de telefone
      if (name === 'whatsapp') {
        const formattedValue = formatPhoneNumber(value || '');
        setProfileData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          [name]: value || ''
        }));
      }
    };
  
    // MASK INPUT TEL
    const formatPhoneNumber = (value) => {
      // Garantir que value seja uma string
      if (!value) return '';
      
      // Remove todos os caracteres não numéricos
      const phoneNumber = value.replace(/\D/g, '');
      
      // Aplica a formatação conforme a quantidade de dígitos
      if (phoneNumber.length <= 2) {
        return phoneNumber.length ? `(${phoneNumber}` : '';
      } else if (phoneNumber.length <= 3) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
      } else if (phoneNumber.length <= 7) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length <= 11) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
      } else {
        // Limita a 11 dígitos (com DDD e 9 dígito)
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
    };
  
    // MUDANDO ITEM DO SELECT
    const handleSelectChange = (name, value) => {
      setProfileData(prev => ({
        ...prev,
        [name]: value || ''
      }));
    };

    // GERENCIAR UPLOAD IMAGEM
    const handleOpenImageModal = () => {
      setIsImageModalOpen(true);
    };

    // ABRIR MODAL IMAGEM
    const handleCloseImageModal = () => {
      setIsImageModalOpen(false);
      setSelectedImage(null);
      setPreviewImage(null);
    };

    // SELECIONANDO IMAGEM NO MODAL E VERIFICANDO SE É IMAGEM
    const handleImageSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.includes('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      setSelectedImage(file);
      
      // Cria um preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    };

    // ATUALIZANDO DADOS DO USER VIA API **************************
    const handleProfileSubmit = async (e) => {
      e.preventDefault();
      setIsSubmittingProfile(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/updateProfile.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(profileData)
        });
        const data = await response.json();
        setProfileSuccess(true);
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
      } finally {
        setIsSubmittingProfile(false);
      }
    };

    // CHAMANDO API PARA ATUALIZAR IMAGEM *************************
    const handleImageUpload = async () => {
      if (!selectedImage) {
        alert('Por favor, selecione uma imagem para upload.');
        return;
      }

      setIsUploadingImage(true);

      // enviando imagem para API em formdata
      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}endpoint/user/uploadProfileImage.php`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          // Atualiza o estado com a nova imagem
          setProfileData(prev => ({
            ...prev,
            imagem: data.image // URL retornada pela API
          }));
          setIsUploadingImage(false);
          setIsImageModalOpen(false);
          setSelectedImage(null);
          setPreviewImage(null);
          // Exibe mensagem de sucesso
          setProfileSuccess(true);  
          setTimeout(() => {
            setProfileSuccess(false);
          }, 4000);
        } else {
          throw new Error(data.message || 'Erro ao enviar imagem.');
        }
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        alert('Erro ao enviar imagem. Por favor, tente novamente.');
        setIsUploadingImage(false);
      }
    };


    return(
      <TabsContent value="profile">
          <form onSubmit={handleProfileSubmit} className="space-y-6">

            {/* DADOS PESSOAIS E IMAGEM */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                {/* Imagem de perfil */}
                <div className="w-32 h-32 rounded-full bg-bjj-gold/10 flex items-center justify-center flex-shrink-0 relative group overflow-hidden">
                  {profileData.imagem ? (
                      <img 
                      src={profileData.tipo_acesso === 'Google' ? profileData.imagem : `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${profileData.imagem}`}
                      alt={`Foto de perfil de ${profileData.nome}`}
                      className="w-full h-full object-cover"
                      {...(profileData.tipo_acesso === 'Google' && {
                          referrerPolicy: "no-referrer",
                          crossOrigin: "anonymous"
                      })}
                      />
                  ) : null}
                  <User 
                      className={`w-16 h-16 text-bjj-gold fallback-icon ${profileData.imagem ? 'hidden' : ''}`} 
                      style={{ display: profileData.imagem ? 'none' : 'block' }}
                  />
                  <div 
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      onClick={handleOpenImageModal}
                  >
                      <div className="flex flex-col items-center">
                      <Camera className="w-5 h-5 text-white mb-1" />
                      <p className="text-white text-xs font-medium">Alterar foto</p>
                      </div>
                  </div>
                </div>
                {/* Imagem de perfil */}
                
                {/* Modal para upload de imagem */}
                <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                  <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50 sm:max-w-md">
                      <DialogHeader>
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                          <Camera className="h-5 w-5 text-bjj-gold" />
                          Alterar Foto de Perfil
                      </DialogTitle>
                      <DialogDescription>
                          Selecione uma nova foto para seu perfil
                      </DialogDescription>
                      </DialogHeader>
                      
                      <div className="flex flex-col items-center space-y-4 py-4">
                        <div className="w-40 h-40 rounded-full bg-bjj-gold/10 flex items-center justify-center relative overflow-hidden border-2 border-bjj-gold/20">
                            {previewImage ? (
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                            ) : profileData.imagem ? (
                            <img 
                                src={profileData.tipo_acesso === 'Google' ? profileData.imagem : `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${profileData.imagem}`} 
                                alt={`Foto atual de ${profileData.nome}`}
                                className="w-full h-full object-cover"
                                {...(profileData.tipo_acesso === 'Google' && {
                                    referrerPolicy: "no-referrer",
                                    crossOrigin: "anonymous"
                                })}
                                onError={(e) => {
                                    console.log('Erro ao carregar imagem no modal:', e.target.src);
                                    console.log('Tipo de acesso:', profileData.tipo_acesso);
                                    console.log('URL da imagem:', profileData.imagem);
                                    e.target.style.display = 'none';
                                    const parent = e.target.parentElement;
                                    const fallbackIcon = parent.querySelector('.fallback-icon-modal');
                                    if (fallbackIcon) {
                                        fallbackIcon.style.display = 'block';
                                    }
                                }}
                                onLoad={(e) => {
                                    console.log('Imagem do modal carregada com sucesso:', e.target.src);
                                    const parent = e.target.parentElement;
                                    const fallbackIcon = parent.querySelector('.fallback-icon-modal');
                                    if (fallbackIcon) {
                                        fallbackIcon.style.display = 'none';
                                    }
                                }}
                            />
                            ) : null}
                            {!previewImage && (
                                <User 
                                    className={`w-20 h-20 text-bjj-gold fallback-icon-modal ${profileData.imagem ? 'hidden' : ''}`} 
                                    style={{ display: profileData.imagem ? 'none' : 'block' }}
                                />
                            )}
                        </div>
                        
                        <div className="space-y-2 w-full">
                            <Label htmlFor="image-upload" className="text-sm font-medium">
                            Escolha uma imagem
                            </Label>
                            <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            className="bg-card/50 border-border/40"
                            />
                            {selectedImage && (
                            <p className="text-xs text-muted-foreground">
                                {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
                            </p>
                            )}
                        </div>
                      </div>
                      
                      <DialogFooter className="sm:justify-between flex flex-col-reverse sm:flex-row gap-2">
                      <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseImageModal}
                          className="border-border/40"
                      >
                          Cancelar
                      </Button>
                      <Button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={!selectedImage || isUploadingImage}
                          className="bg-bjj-gold hover:bg-bjj-gold/90 text-primary-foreground"
                      >
                          {isUploadingImage ? (
                          <>
                              <span className="animate-pulse mr-2">●</span>
                              Salvando...
                          </>
                          ) : (
                          <>
                              <Upload className="mr-2 h-4 w-4" />
                              Salvar Imagem
                          </>
                          )}
                      </Button>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* Modal para upload de imagem */}
                
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
                            disabled
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="bg-card/50 border-border/40"
                            />
                        </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label htmlFor="whatsapp">Whatsapp</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          value={profileData.whatsapp}
                          onChange={handleProfileChange}
                          placeholder="(54) 9 9999-9999"
                          maxLength={17}
                          className="bg-card/50 border-border/40 w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp_verificado">Autorizar mensagens</Label>
                        <Select 
                          name="whatsapp_verificado" 
                          value={profileData.whatsapp_verificado ? "1" : "0"}
                          onValueChange={(value) => handleSelectChange("whatsapp_verificado", value === "1" ? 1 : 0)}
                        >
                          <SelectTrigger className="bg-card/50 border-border/40">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Sim</SelectItem>
                            <SelectItem value="0">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label htmlFor="idade">Idade</Label>
                        <Input
                          id="idade"
                          name="idade"
                          type="number"
                          value={profileData.idade}
                          onChange={handleProfileChange}
                          className="bg-card/50 border-border/40"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="peso">Peso</Label>
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
            {/* DADOS PESSOAIS E IMAGEM */}


            {/* DADOS JIU JITSU e LOCALIZAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* jiu jitsu */}
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
                {/* jiu jitsu */}

                {/* localização */}
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
                {/* localização */}

            </div>
            {/* DADOS JIU JITSU e LOCALIZAÇÃO */}


            {/* BOTÃO SUBMIT */}
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
            {/* BOTÃO SUBMIT */}


            {/* MENSAGEM DE AVISO */}
            {profileSuccess && (
                <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2 rounded-md text-sm flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                Atualização feita com sucesso!
                </div>
            )}
            {/* MENSAGEM DE AVISO */}

          </form>
      </TabsContent>
    )
}

