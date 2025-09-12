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
    // Caso especial para videoFile para garantir que a referência seja mantida
    if (campo === "videoFile" && valor instanceof File) {
      // Armazenar uma referência global para recuperação de emergência
      window._ultimoArquivoVideo = valor;
    }
    
    // Usar uma função para atualizar o estado para garantir que estamos trabalhando com o estado mais recente
    onChange((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
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
              {Array.isArray(posicoesCadastradas) && posicoesCadastradas.length > 0 ? (
                posicoesCadastradas.map((posicao, idx) => (
                  <SelectItem key={idx} value={posicao}>
                    {posicao}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default" disabled>
                  Nenhuma posição disponível
                </SelectItem>
              )}
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
        <div className="text-xs text-blue-600">
          {Array.isArray(posicoesCadastradas) ? 
            `${posicoesCadastradas.length} posições disponíveis` : 
            "Carregando posições..."}
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
          Vídeo Curto (Opcional, máx. 20MB - MP4)
        </Label>
        <div className="space-y-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800 text-sm mb-2">
            <p className="font-medium text-blue-800 dark:text-blue-300">Instruções para o upload de vídeo:</p>
            <ol className="list-decimal ml-4 text-blue-700 dark:text-blue-300 mt-1">
              <li>O arquivo deve estar no formato MP4</li>
              <li>Tamanho máximo: 20MB</li>
              <li>Duração recomendada: até 7 segundos</li>
              <li>O upload só ocorre quando você salva a técnica</li>
            </ol>
          </div>
          
          <div className="relative">
            <input
              type="file"
              id="video-curto"
              name="videoFile"
              accept="video/mp4"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
              onChange={(e) => {
                try {
                  const fileInput = e.target;
                  const file = fileInput.files && fileInput.files[0];
                  
                  if (!file) {
                    handleChange("videoFile", null);
                    handleChange("videoNome", null);
                    handleChange("videoWidth", null);
                    handleChange("videoHeight", null);
                    handleChange("videoDuration", null);
                    handleChange("videoError", null);
                    return;
                  }
                  
                  // Salvar o arquivo diretamente no estado sem manipulação
                  handleChange("videoFile", file);
                  handleChange("videoNome", file.name);
                  
                  // Criar backup global para garantir que o arquivo não seja perdido
                  window._ultimoArquivoVideo = file;
                  
                  // Verificar tamanho do arquivo (20MB = 20 * 1024 * 1024 bytes)
                  if (file.size > 20 * 1024 * 1024) {
                    handleChange("videoError", "O arquivo é muito grande. O tamanho máximo é 20MB.");
                    return;
                  }
                  
                  // Verificar tipo do arquivo
                  if (!file.type.startsWith('video/mp4')) {
                    handleChange("videoError", "Apenas arquivos MP4 são suportados.");
                    return;
                  }
                  
                  // Criar elemento de vídeo para obter metadados
                  const video = document.createElement('video');
                  video.preload = 'metadata';
                  
                  // Criar URL temporária para metadados
                  const videoURL = URL.createObjectURL(file);
                  video.src = videoURL;
                  
                  video.onloadedmetadata = () => {
                    const duracao = Math.round(video.duration * 10) / 10;
                    const width = video.videoWidth;
                    const height = video.videoHeight;
                    
                    // Atualizar metadados no estado
                    handleChange("videoWidth", width);
                    handleChange("videoHeight", height);
                    handleChange("videoDuration", duracao);
                    
                    // Verificar duração (aviso, mas não impede o upload)
                    if (duracao > 7) {
                      handleChange("videoError", `Atenção: O vídeo tem ${duracao.toFixed(1)}s. Vídeos mais curtos são recomendados.`);
                    } else {
                      handleChange("videoError", null);
                    }
                    
                    URL.revokeObjectURL(videoURL); // Liberar URL para evitar memory leak
                  };
                  
                  video.onerror = () => {
                    URL.revokeObjectURL(videoURL);
                    handleChange("videoError", "Erro ao carregar o vídeo. Verifique se o formato é suportado.");
                  };
                } catch (error) {
                  console.error("Erro ao processar arquivo de vídeo:", error);
                  handleChange("videoError", "Erro ao processar o vídeo: " + error.message);
                }
              }}
            />
          </div>
          
          {tecnica.videoNome && (
            <div className="text-sm border border-blue-200 rounded p-2 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800">
              <p className="text-blue-600">
                <span className="font-medium">Arquivo selecionado:</span> <strong>{tecnica.videoNome}</strong>
              </p>
              <p className="text-blue-600 mt-1">
                <span className="font-medium">Tamanho:</span> {tecnica.videoFile ? 
                  `${Math.round(tecnica.videoFile.size / 1024)} KB` : "Desconhecido"}
              </p>
              {tecnica.videoDuration && (
                <p className="text-blue-600 mt-1">
                  <span className="font-medium">Duração:</span> {tecnica.videoDuration.toFixed(1)}s 
                  {tecnica.videoDuration <= 7 ? 
                    <span className="text-green-500 ml-1">✓</span> : 
                    <span className="text-amber-500 ml-1">⚠️</span>}
                </p>
              )}
              {tecnica.videoWidth && tecnica.videoHeight && (
                <p className="text-blue-600 mt-1">
                  <span className="font-medium">Dimensões:</span> {tecnica.videoWidth} x {tecnica.videoHeight} pixels
                </p>
              )}
              
              <p className="text-blue-700 mt-2 font-semibold">
                {tecnica.videoFile instanceof File ? 
                  "✅ Arquivo pronto para upload" : 
                  "❌ Arquivo não está mais disponível, selecione novamente"}
              </p>
              
              {/* Botão para testar reprodução do vídeo */}
              <div className="mt-2">
                <button 
                  type="button"
                  className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                  onClick={() => {
                    try {
                      if (!(tecnica.videoFile instanceof File)) {
                        throw new Error("Arquivo não está mais disponível. Por favor, selecione-o novamente.");
                      }
                      const url = URL.createObjectURL(tecnica.videoFile);
                      window.open(url, '_blank');
                      // Limpar URL após abrir
                      setTimeout(() => URL.revokeObjectURL(url), 1000);
                    } catch (e) {
                      console.error("Erro ao visualizar vídeo:", e);
                      alert("Erro ao visualizar o vídeo: " + e.message);
                    }
                  }}
                >
                  Testar visualização do vídeo
                </button>
              </div>
            </div>
          )}
          
          {tecnica.videoError && (
            <p className="text-sm text-red-500">{tecnica.videoError}</p>
          )}
          
          {tecnica.videoFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                handleChange("videoFile", null);
                handleChange("videoError", null);
                handleChange("videoWidth", null);
                handleChange("videoHeight", null);
                handleChange("videoDuration", null);
                handleChange("videoNome", null);
                
                // Limpar o input file
                const fileInput = document.getElementById('video-curto');
                if (fileInput) fileInput.value = '';
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
