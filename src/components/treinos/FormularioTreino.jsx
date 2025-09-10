import { useEffect } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DIAS_SEMANA, HORARIOS_TREINO } from "@/services/treinos/treinosService";

/**
 * Componente de formulário para adicionar/editar treino
 * @param {Object} props Propriedades do componente
 * @param {boolean} props.aberto Estado do modal (aberto/fechado)
 * @param {Function} props.setAberto Função para alterar estado do modal
 * @param {Object} props.treino Dados do treino sendo editado
 * @param {Object} props.novoTreino Dados do novo treino
 * @param {Function} props.setNovoTreino Função para atualizar dados do novo treino
 * @param {Array} props.imageUrls Lista de URLs de imagens
 * @param {Function} props.setImageUrls Função para alterar lista de imagens
 * @param {number} props.proximoNumeroAula Próximo número de aula disponível
 * @param {Function} props.onSalvar Função chamada ao salvar
 * @param {boolean} props.editando Flag indicando se está editando ou criando
 * @param {Function} props.onUploadImagens Função para fazer upload de imagens
 * @returns {JSX.Element} Componente React
 */
const FormularioTreino = ({
  aberto,
  setAberto,
  treino,
  novoTreino,
  setNovoTreino,
  imageUrls,
  setImageUrls,
  proximoNumeroAula,
  onSalvar,
  editando,
  onUploadImagens
}) => {
  // Usar useEffect para sincronizar imagens com o estado do treino
  useEffect(() => {
    // Quando o modal for aberto e estivermos editando, sincroniza as imagens
    if (aberto && editando && treino?.imagens) {
      setImageUrls(treino.imagens);
    }
  }, [aberto, editando, treino, setImageUrls]);
  
  // Efeito separado para atualizar novoTreino quando imageUrls mudar
  useEffect(() => {
    // Sincronizar novoTreino.imagens com imageUrls sempre que imageUrls mudar
    if (imageUrls) {
      setNovoTreino(prev => ({
        ...prev,
        imagens: [...imageUrls] // Criamos uma nova cópia do array para garantir uma atualização
      }));
    }
  }, [imageUrls, setNovoTreino]);
  
  // Função para adicionar imagem via URL
  const adicionarImagemViaUrl = () => {
    if (imageUrls.length >= 3) {
      alert("Máximo de 3 imagens permitido.");
      return;
    }
    
    const url = prompt("Insira a URL da imagem:");
    if (url && url.trim() !== "") {
      setImageUrls([...imageUrls, url.trim()]);
    }
  };
  
  // Função para remover imagem
  const removerImagem = (index) => {
    // Usando setState com callback para garantir o valor mais recente
    setImageUrls(prevUrls => {
      const novasImagens = [...prevUrls];
      novasImagens.splice(index, 1);
      
      // O useEffect se encarregará de atualizar novoTreino.imagens
      
      return novasImagens;
    });
  };
  
  // Função para fazer upload de arquivos
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Verificar limite de imagens
    if (imageUrls.length + files.length > 3) {
      alert(`Você só pode adicionar ${3 - imageUrls.length} imagens adicionais.`);
      return;
    }
    
    // Criar previews temporárias para exibição imediata
    const fileArray = Array.from(files);
    // Usar as URLs diretamente como imagens, sem fazer upload para a API
    const newImageUrls = fileArray.map(file => URL.createObjectURL(file));
    
    // Atualizar o estado com as novas URLs - usando uma única função para garantir consistência
    setImageUrls(prevUrls => {
      const updatedUrls = [...prevUrls, ...newImageUrls];
      
      // O useEffect se encarregará de sincronizar isso com novoTreino.imagens
      
      return updatedUrls;
    });
    
    // Limpar input file
    event.target.value = '';
  };
  
  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="max-w-[95%] w-full md:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar Treino" : "Novo Treino"}</DialogTitle>
          <DialogDescription>
            {editando
              ? "Edite os detalhes do treino selecionado."
              : "Adicione um novo treino ao seu histórico."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Tipo de Treino */}
            <div className="grid gap-2 flex-1">
              <Label htmlFor="tipo-treino">Tipo</Label>
              <Select
                value={novoTreino.tipo}
                onValueChange={(value) => setNovoTreino({ ...novoTreino, tipo: value })}
              >
                <SelectTrigger id="tipo-treino">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gi">Com Kimono (Gi)</SelectItem>
                  <SelectItem value="nogi">Sem Kimono (No-Gi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Número da Aula (automático) */}
            <div className="grid gap-2 flex-1">
              <Label htmlFor="numero-aula">Número da Aula</Label>
              <Input
                id="numero-aula"
                value={editando ? treino.numeroAula : proximoNumeroAula}
                readOnly
                disabled
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Dia da Semana */}
            <div className="grid gap-2 flex-1">
              <Label htmlFor="dia-semana-treino">Dia da Semana</Label>
              <Select
                value={novoTreino.diaSemana}
                onValueChange={(value) => setNovoTreino({ ...novoTreino, diaSemana: value })}
              >
                <SelectTrigger id="dia-semana-treino">
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {DIAS_SEMANA.map((dia) => (
                    <SelectItem key={dia.value} value={dia.value}>
                      {dia.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Horário do Treino */}
            <div className="grid gap-2 flex-1">
              <Label htmlFor="horario-treino">Horário</Label>
              <Select
                value={novoTreino.horario}
                onValueChange={(value) => setNovoTreino({ ...novoTreino, horario: value })}
              >
                <SelectTrigger id="horario-treino">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {HORARIOS_TREINO.map((horario) => (
                    <SelectItem key={horario.value} value={horario.value}>
                      {horario.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Data do Treino */}
          <div className="grid gap-2">
            <Label htmlFor="data-treino">Data</Label>
            <Input
              id="data-treino"
              type="date"
              value={novoTreino.data}
              onChange={(e) => setNovoTreino({ ...novoTreino, data: e.target.value })}
            />
          </div>
          
          {/* Opção Público/Privado */}
          <div className="flex items-center space-x-2">
            <Switch 
              id="treino-publico"
              checked={novoTreino.isPublico}
              onCheckedChange={(checked) => 
                setNovoTreino({ ...novoTreino, isPublico: checked })
              }
            />
            <Label htmlFor="treino-publico">
              Compartilhar com a comunidade
            </Label>
          </div>
          
          {/* Fotos do Treino */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Label>Fotos do Treino (máx: 3)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('upload-imagem').click()}
                  disabled={imageUrls.length >= 3}
                  className="h-8 text-xs"
                >
                  <ImagePlus className="h-3.5 w-3.5 mr-1" /> Upload
                </Button>
                <input
                  id="upload-imagem"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={imageUrls.length >= 3}
                />
              </div>
            </div>
            
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-video bg-muted rounded-md overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Foto ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => removerImagem(index)}
                        className="bg-black/60 text-white rounded-full p-2"
                        aria-label="Remover imagem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}/3
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Nenhuma imagem adicionada
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('upload-imagem').click()}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Observações */}
          <div className="grid gap-2">
            <Label htmlFor="observacoes-treino">Observações</Label>
            <Textarea
              id="observacoes-treino"
              placeholder="Anote o que foi trabalhado no treino, técnicas aprendidas, etc."
              value={novoTreino.observacoes}
              onChange={(e) => setNovoTreino({ ...novoTreino, observacoes: e.target.value })}
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <DialogFooter className="mt-4 sm:mt-6 pb-2 flex flex-col-reverse sm:flex-row gap-3">
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => setAberto(false)}>
            Cancelar
          </Button>
          <Button className="w-full sm:w-auto" onClick={onSalvar}>
            {editando ? "Salvar alterações" : "Adicionar treino"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormularioTreino;
