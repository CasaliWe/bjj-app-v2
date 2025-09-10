import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  getTreinos, 
  criarTreino, 
  atualizarTreino, 
  excluirTreino, 
  filtrarTreinos,
  getTreinosComunidade,
  alterarVisibilidadeTreino,
  uploadImagensTreino
} from '@/services/treinos/treinosService';
import { useGetUser } from './use-getUser';

/**
 * Hook personalizado para gerenciar treinos
 * @returns {Object} Métodos e estados para gerenciar treinos
 */
export const useTreinos = () => {
  // Estados
  const [treinos, setTreinos] = useState([]);
  const [treinosFiltrados, setTreinosFiltrados] = useState([]);
  const [treinosComunidade, setTreinosComunidade] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  
  // Estado de paginação para a comunidade
  const [paginacao, setPaginacao] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  
  // Estado de paginação para os treinos pessoais
  const [paginacaoTreinos, setPaginacaoTreinos] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroDiaSemana, setFiltroDiaSemana] = useState('todos');
  
  // Form de edição/criação
  const [editandoTreino, setEditandoTreino] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [modalComunidadeAberto, setModalComunidadeAberto] = useState(false);
  
  // Valor inicial para novo treino
  const [novoTreino, setNovoTreino] = useState({
    tipo: "gi",
    diaSemana: "segunda",
    horario: "19:30",
    data: format(new Date(), "yyyy-MM-dd"),
    imagens: [],
    observacoes: "",
    isPublico: false
  });

  // Próximo número de aula baseado nos treinos existentes
  const proximoNumeroAula = treinos.length > 0 
    ? Math.max(...treinos.map(t => t.numeroAula)) + 1 
    : 1;

  // Carregar treinos
  const carregarTreinos = useCallback(async (pagina = 1) => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Passar os filtros para o serviço
      const { treinos: dadosTreinos, pagination } = await getTreinos(pagina, 20, filtroTipo, filtroDiaSemana);
      setTreinos(dadosTreinos);
      setPaginacaoTreinos(pagination);
      
      // Os treinos já vêm filtrados e ordenados do serviço
      setTreinosFiltrados(dadosTreinos);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      setErro('Não foi possível carregar os treinos. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }, [filtroTipo, filtroDiaSemana]);

  // Carregar treinos da comunidade
  const carregarTreinosComunidade = useCallback(async (pagina = 1) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const { treinos, pagination } = await getTreinosComunidade(pagina);
      setTreinosComunidade(treinos);
      setPaginacao(pagination);
    } catch (error) {
      console.error('Erro ao carregar treinos da comunidade:', error);
      setErro('Não foi possível carregar os treinos da comunidade. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Aplicar filtros
  const aplicarFiltros = useCallback((tipo, diaSemana) => {
    setFiltroTipo(tipo);
    setFiltroDiaSemana(diaSemana);
  }, []);

  // Efeito para recarregar treinos quando os filtros mudam
  useEffect(() => {
    // Recarregar treinos com os novos filtros, voltando para a página 1
    carregarTreinos(1);
  }, [filtroTipo, filtroDiaSemana, carregarTreinos]);

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroTipo('todos');
    setFiltroDiaSemana('todos');
  };

  // Salvar treino (novo ou editado)
  const salvarTreino = async () => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Usar sempre o estado mais recente de imageUrls para as imagens
      // Isso garante consistência entre o que é mostrado e o que é salvo
      
      // Preparar o treino com os dados atuais
      const treinoFinal = {
        ...novoTreino,
        imagens: imageUrls, // Usar sempre o imageUrls mais recente
        numeroAula: editandoTreino ? editandoTreino.numeroAula : proximoNumeroAula,
        id: editandoTreino ? editandoTreino.id : undefined // A API atribuirá um ID para novos treinos
      };

      let treinoSalvo;
      
      if (editandoTreino) {
        // Atualizar treino existente
        treinoSalvo = await atualizarTreino(treinoFinal, user);
        setTreinos(prevTreinos => 
          prevTreinos.map(t => t.id === treinoSalvo.id ? treinoSalvo : t)
        );
      } else {
        // Adicionar novo treino
        treinoSalvo = await criarTreino(treinoFinal, user);
        setTreinos(prevTreinos => [...prevTreinos, treinoSalvo]);
      }

      // Reset do formulário e fechamento do modal
      resetFormulario();
      setModalAberto(false);
      
      // Recarregar a lista de treinos para garantir que está atualizada
      carregarTreinos(paginacaoTreinos.currentPage);
      
      return treinoSalvo;
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      setErro('Não foi possível salvar o treino. Tente novamente mais tarde.');
      return null;
    } finally {
      setCarregando(false);
    }
  };

  // Editar treino
  const editarTreino = (treino) => {
    // Fazer uma cópia profunda do treino para evitar referências
    const treinoCopy = { ...treino };
    
    // Garantir que imagens seja sempre um array
    const imagens = treinoCopy.imagens ? [...treinoCopy.imagens] : [];
    
    // Primeiro, resetar o formulário para limpar qualquer estado anterior
    resetFormulario();
    
    // Depois, configurar o estado com os dados do treino a ser editado
    setEditandoTreino(treinoCopy);
    
    // Configurar o formulário com os dados do treino
    setNovoTreino({
      tipo: treinoCopy.tipo,
      diaSemana: treinoCopy.diaSemana,
      horario: treinoCopy.horario,
      data: treinoCopy.data,
      observacoes: treinoCopy.observacoes,
      isPublico: treinoCopy.isPublico || false,
      imagens: imagens // Incluir as imagens aqui também
    });
    
    // Definir as URLs das imagens
    setImageUrls(imagens);
    
    // Abrir o modal
    setModalAberto(true);
  };

  // Excluir treino
  const removerTreino = async (id) => {
    setCarregando(true);
    setErro(null);
    
    try {
      await excluirTreino(id);
      
      // Recarregar a lista de treinos para garantir que está atualizada
      carregarTreinos(paginacaoTreinos.currentPage);
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      setErro('Não foi possível excluir o treino. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  };

  // Obter dados do usuário
  const { user } = useGetUser();
  
  // Alterar visibilidade do treino (público/privado)
  const alterarVisibilidade = async (id, isPublico) => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Passar os dados do usuário atual para adicionar ao treino quando torná-lo público
      const treinoAtualizado = await alterarVisibilidadeTreino(id, isPublico, user);
      
      // Recarregar a lista de treinos para garantir que está atualizada
      carregarTreinos(paginacaoTreinos.currentPage);
      
      return true;
    } catch (error) {
      console.error('Erro ao alterar visibilidade do treino:', error);
      setErro('Não foi possível alterar a visibilidade do treino. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  };

  // Upload de imagens
  const uploadImagens = async (files) => {
    if (files.length === 0) return [];
    
    setCarregando(true);
    setErro(null);
    
    try {
      const urls = await uploadImagensTreino(files);
      return urls;
    } catch (error) {
      console.error('Erro ao fazer upload de imagens:', error);
      setErro('Não foi possível fazer o upload das imagens. Tente novamente mais tarde.');
      return [];
    } finally {
      setCarregando(false);
    }
  };

  // Adicionar imagem
  const adicionarImagem = (url) => {
    if (!url || url.trim() === "") return;
    if (imageUrls.length >= 3) {
      setErro('Você pode adicionar no máximo 3 imagens por treino.');
      return;
    }
    
    setImageUrls([...imageUrls, url.trim()]);
  };

  // Remover imagem
  const removerImagem = (index) => {
    const novasImagens = [...imageUrls];
    novasImagens.splice(index, 1);
    setImageUrls(novasImagens);
  };

  // Reset do formulário
  const resetFormulario = () => {
    setNovoTreino({
      tipo: "gi",
      diaSemana: "segunda",
      horario: "19:30",
      data: format(new Date(), "yyyy-MM-dd"),
      imagens: [],
      observacoes: "",
      isPublico: false
    });
    setImageUrls([]);
    setEditandoTreino(null);
  };

  // Abrir modal para novo treino
  const abrirModalNovoTreino = () => {
    resetFormulario();
    setModalAberto(true);
  };

  // Abrir modal da comunidade
  const abrirModalComunidade = () => {
    carregarTreinosComunidade();
    setModalComunidadeAberto(true);
  };

  // Mudar página dos treinos da comunidade
  const mudarPaginaTreinosComunidade = (pagina) => {
    carregarTreinosComunidade(pagina);
  };
  
  // Mudar página dos treinos pessoais
  const mudarPaginaTreinos = (pagina) => {
    carregarTreinos(pagina);
  };

  // Carregar treinos ao montar o componente
  useEffect(() => {
    carregarTreinos();
  }, [carregarTreinos]);

  return {
    // Estados
    treinos,
    treinosFiltrados,
    treinosComunidade,
    carregando,
    erro,
    filtroTipo,
    filtroDiaSemana,
    editandoTreino,
    modalAberto,
    imageUrls,
    novoTreino,
    proximoNumeroAula,
    paginacao,
    paginacaoTreinos,
    modalComunidadeAberto,
    
    // Métodos
    setNovoTreino,
    setModalAberto,
    setImageUrls,
    setModalComunidadeAberto,
    carregarTreinos,
    carregarTreinosComunidade,
    aplicarFiltros,
    limparFiltros,
    salvarTreino,
    editarTreino,
    removerTreino,
    alterarVisibilidade,
    uploadImagens,
    adicionarImagem,
    removerImagem,
    resetFormulario,
    abrirModalNovoTreino,
    abrirModalComunidade,
    mudarPaginaTreinosComunidade,
    mudarPaginaTreinos,
    setFiltroTipo,
    setFiltroDiaSemana,
  };
};
