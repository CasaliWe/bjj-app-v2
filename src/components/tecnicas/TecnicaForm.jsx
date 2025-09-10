import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Plus, Trash2, Youtube, Instagram } from "lucide-react";

/**
 * Componente de formulário para adicionar ou editar técnicas
 * 
 * @param {Object} props
 * @param {Object} props.tecnica - Dados da técnica sendo editada ou objeto vazio para nova técnica
 * @param {Function} props.onChange - Função chamada quando o formulário é alterado
 * @param {Array} props.posicoesCadastradas - Lista de posições cadastradas
 * @param {Function} props.onAddItem - Função para adicionar um novo passo ou observação
 * @param {Function} props.onUpdateItem - Função para atualizar um passo ou observação
 * @param {Function} props.onRemoveItem - Função para remover um passo ou observação
 */
const TecnicaForm = ({ 
  tecnica, 
  onChange, 
  posicoesCadastradas,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}) => {

  // Função auxiliar para atualizar o estado do formulário
  const handleChange = (campo, valor) => {
    onChange({ ...tecnica, [campo]: valor });
  };

  return (
    <div className="grid gap-4">
      {/* Categoria */}
      <div className="grid gap-2">
        <Label htmlFor="categoria-tecnica">Categoria</Label>
        <Select
          value={tecnica.categoria}
          onValueChange={(value) => handleChange("categoria", value)}
          required
        >
          <SelectTrigger id="categoria-tecnica">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="guardeiro">Guardeiro</SelectItem>
            <SelectItem value="passador">Passador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Posição */}
      <div className="grid gap-2">
        <Label htmlFor="posicao-tecnica">Posição</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Select
            value={tecnica.posicao}
            onValueChange={(value) => handleChange("posicao", value)}
          >
            <SelectTrigger id="posicao-tecnica">
              <SelectValue placeholder="Selecione a posição" />
            </SelectTrigger>
            <SelectContent>
              {posicoesCadastradas.map((posicao, idx) => (
                <SelectItem key={idx} value={posicao}>
                  {posicao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">ou</span>
            <Input
              placeholder="Digite nova posição"
              value={tecnica.novaPosicao || ""}
              onChange={(e) => handleChange("novaPosicao", e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Nome da Finalização */}
      <div className="grid gap-2">
        <Label htmlFor="nome-tecnica">Nome da Finalização</Label>
        <Input
          id="nome-tecnica"
          placeholder="Ex: Armlock da Guarda"
          value={tecnica.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          required
        />
      </div>
      
      {/* Passo a Passo */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>Passo a Passo</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddItem("passo")}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Passo
          </Button>
        </div>
        <div className="space-y-2">
          {tecnica.passos.map((passo, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium w-10">#{index + 1}</span>
              <Input
                placeholder={`Passo ${index + 1}`}
                value={passo}
                onChange={(e) => onUpdateItem("passo", index, e.target.value)}
              />
              {tecnica.passos.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem("passo", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Observações */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>Observações</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddItem("observacao")}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Observação
          </Button>
        </div>
        <div className="space-y-2">
          {tecnica.observacoes.map((obs, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium w-10">•</span>
              <Input
                placeholder="Observação"
                value={obs}
                onChange={(e) => onUpdateItem("observacao", index, e.target.value)}
              />
              {tecnica.observacoes.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem("observacao", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Nota */}
      <div className="grid gap-2">
        <Label>Nota (1-5)</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <Button
              key={estrela}
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleChange("nota", estrela)}
              className={`rounded-full ${
                estrela <= tecnica.nota ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              <Star
                className={`h-5 w-5 ${
                  estrela <= tecnica.nota ? "fill-yellow-500" : ""
                }`}
              />
            </Button>
          ))}
        </div>
      </div>
      
      {/* Vídeo curto */}
      <div className="grid gap-2">
        <Label htmlFor="video-curto">
          Vídeo Curto (Opcional, máx. 7 segundos)
        </Label>
        <div className="space-y-2">
          <input
            type="file"
            id="video-curto"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Verificar duração do vídeo
                const video = document.createElement('video');
                video.preload = 'metadata';
                
                // Criar URL temporária para visualização
                const videoURL = URL.createObjectURL(file);
                handleChange("videoPreview", videoURL);
                
                video.onloadedmetadata = () => {
                  const duracao = Math.round(video.duration * 10) / 10;
                  
                  if (duracao > 7) {
                    // Mostrar aviso de vídeo muito longo
                    handleChange("videoError", `O vídeo tem ${duracao}s, mas deve ter no máximo 7 segundos`);
                  } else {
                    // Vídeo válido
                    handleChange("videoFile", file);
                    handleChange("videoError", null);
                    handleChange("videoDuration", duracao);
                    
                    // Gerar thumbnail para poster
                    try {
                      video.currentTime = 0.1; // Avança um pouco para pegar um frame melhor
                      
                      video.onseeked = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const posterUrl = canvas.toDataURL('image/jpeg');
                        handleChange("videoPoster", posterUrl);
                      };
                    } catch (err) {
                      console.error("Erro ao gerar thumbnail:", err);
                    }
                  }
                };
                
                video.onerror = () => {
                  handleChange("videoError", "Formato de vídeo não suportado");
                };
                
                video.src = videoURL;
              }
            }}
          />
          <div 
            onClick={() => document.getElementById('video-curto').click()}
            className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            {tecnica.videoPreview ? (
              <div className="space-y-2">
                <div className="max-w-full mx-auto">
                  <video 
                    src={tecnica.videoPreview} 
                    poster={tecnica.videoPoster}
                    className="w-full rounded" 
                    style={{ maxHeight: "300px" }}
                    controls
                  ></video>
                </div>
                {tecnica.videoDuration && (
                  <p className="text-sm text-blue-500">
                    Duração: {tecnica.videoDuration.toFixed(1)}s 
                    {tecnica.videoDuration <= 7 ? 
                      <span className="text-green-500"> ✓</span> : 
                      <span className="text-red-500"> ✗</span>}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Clique para alterar o vídeo</p>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-sm font-medium">Clique para fazer upload do vídeo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, WebM ou QuickTime - máximo 7 segundos
                </p>
              </div>
            )}
          </div>
          
          {tecnica.videoError && (
            <p className="text-sm text-red-500">{tecnica.videoError}</p>
          )}
          
          {tecnica.videoPreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                URL.revokeObjectURL(tecnica.videoPreview);
                handleChange("videoPreview", null);
                handleChange("videoFile", null);
                handleChange("videoError", null);
                handleChange("videoPoster", null);
                handleChange("videoDuration", null);
              }}
            >
              Remover vídeo
            </Button>
          )}
        </div>
      </div>
      
      {/* Link do Vídeo */}
      <div className="grid gap-2">
        <Label htmlFor="video-url">Link do Vídeo (Opcional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="video-url"
            placeholder="URL do YouTube ou Instagram"
            value={tecnica.video || ""}
            onChange={(e) => handleChange("video", e.target.value)}
          />
          <div className="flex gap-1">
            <Youtube className="h-5 w-5 text-red-600" />
            <Instagram className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>
      
      {/* Opções adicionais */}
      <div className="grid gap-2">
        <Label>Opções</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="destacar"
              className="h-4 w-4"
              checked={tecnica.destacado}
              onChange={(e) => handleChange("destacado", e.target.checked)}
            />
            <Label htmlFor="destacar" className="text-sm">
              Destacar esta técnica
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publica"
              className="h-4 w-4"
              checked={tecnica.publica}
              onChange={(e) => handleChange("publica", e.target.checked)}
            />
            <Label htmlFor="publica" className="text-sm">
              Tornar pública (visível para outros usuários)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TecnicaForm;
