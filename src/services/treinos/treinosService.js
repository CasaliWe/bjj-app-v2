// Dados fictícios simulando os dados que virão da API
const MOCK_TREINOS = [
  {
    id: 1,
    numeroAula: 1,
    tipo: "gi",
    diaSemana: "segunda",
    horario: "19:30",
    data: "2025-06-10",
    imagens: [
      "https://images.unsplash.com/photo-1614151282806-fbb546ab4320?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593435221502-c5d7bfc26cab?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Trabalhamos muito na passagem de guarda. O professor mostrou técnicas de raspagem da meia guarda. Preciso melhorar minha defesa quando estou por baixo.",
    isPublico: false,
    usuario: {
      nome: "Carlos Silva",
      foto: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop",
      faixa: "roxa"
    }
  },
  {
    id: 2,
    numeroAula: 2,
    tipo: "nogi",
    diaSemana: "quarta",
    horario: "18:00",
    data: "2025-06-12",
    imagens: [
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Treinamos finalizações da posição montada. Consegui aplicar um armlock com sucesso. Preciso trabalhar mais na transição da meia-guarda para a montada.",
    isPublico: true,
    usuario: {
      nome: "Ana Santos",
      foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      faixa: "azul"
    }
  },
  {
    id: 3,
    numeroAula: 3,
    tipo: "gi",
    diaSemana: "sexta",
    horario: "20:30",
    data: "2025-06-07",
    imagens: [],
    observacoes: "Aula focada em defesa pessoal. Aprendemos técnicas de defesa contra faca e socos. Foi uma aula intensa com bastante cardio.",
    isPublico: false,
    usuario: {
      nome: "João Oliveira",
      foto: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop",
      faixa: "marrom"
    }
  },
  {
    id: 4,
    numeroAula: 4,
    tipo: "nogi",
    diaSemana: "terça",
    horario: "06:30",
    data: "2025-06-11",
    imagens: [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Treino matinal super produtivo. Trabalhamos leg locks e heel hooks. Estou melhorando minha posição de ashi garami.",
    isPublico: true,
    usuario: {
      nome: "Mariana Costa",
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
      faixa: "preta"
    }
  },
  {
    id: 5,
    numeroAula: 5,
    tipo: "gi",
    diaSemana: "quinta",
    horario: "21:00",
    data: "2025-06-13",
    imagens: [
      "https://images.unsplash.com/photo-1583590019972-a146a712d72a?q=80&w=1974&auto=format&fit=crop"
    ],
    observacoes: "Aula de drills e condicionamento. Muitos exercícios de ponte e fuga de quadril. Terminamos com 10 minutos de sparring leve.",
    isPublico: false,
    usuario: {
      nome: "Pedro Almeida",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop",
      faixa: "branca"
    }
  }
];

// Opções para horários de treino
export const HORARIOS_TREINO = [
  { value: "06:30", label: "06:30" },
  { value: "10:00", label: "10:00" },
  { value: "12:00", label: "12:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:30", label: "19:30" },
  { value: "20:30", label: "20:30" },
  { value: "21:00", label: "21:00" },
  { value: "22:00", label: "22:00" }
];

// Dias da semana
export const DIAS_SEMANA = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" }
];

/**
 * Busca todos os treinos do usuário
 * @param {number} page Número da página
 * @param {number} limit Limite de itens por página
 * @param {string} filtroTipo Tipo de treino (gi, nogi, todos)
 * @param {string} filtroDiaSemana Dia da semana
 * @returns {Promise<Object>} Lista de treinos e informações de paginação
 */
export const getTreinos = async (page = 1, limit = 20, filtroTipo = 'todos', filtroDiaSemana = 'todos') => {
  // Aqui você faria a chamada para a API real
  // const response = await fetch(`api/treinos?page=${page}&limit=${limit}&tipo=${filtroTipo}&diaSemana=${filtroDiaSemana}`);
  // return response.json();
  
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      // Aplicar filtros primeiro
      let treinosFiltrados = [...MOCK_TREINOS];
      
      if (filtroTipo !== 'todos') {
        treinosFiltrados = treinosFiltrados.filter(t => t.tipo === filtroTipo);
      }
      
      if (filtroDiaSemana !== 'todos') {
        treinosFiltrados = treinosFiltrados.filter(t => t.diaSemana === filtroDiaSemana);
      }
      
      // Ordenar por número da aula (decrescente)
      treinosFiltrados = treinosFiltrados.sort((a, b) => b.numeroAula - a.numeroAula);
      
      // Calcular total de páginas
      const totalItems = treinosFiltrados.length;
      const totalPages = Math.ceil(totalItems / limit) || 1; // Garantir pelo menos 1 página
      
      // Limitar página ao número máximo de páginas
      const currentPage = Math.min(page, totalPages);
      
      // Paginar os resultados
      const startIndex = (currentPage - 1) * limit;
      const endIndex = currentPage * limit;
      const treinosPaginados = treinosFiltrados.slice(startIndex, endIndex);
      
      resolve({
        treinos: treinosPaginados,
        pagination: {
          currentPage: currentPage,
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      });
    }, 500);
  });
};

/**
 * Filtra os treinos por tipo e dia da semana
 * @param {Array} treinos Lista de treinos
 * @param {string} filtroTipo Tipo de treino (gi, nogi, todos)
 * @param {string} filtroDiaSemana Dia da semana
 * @returns {Array} Lista filtrada
 */
export const filtrarTreinos = (treinos, filtroTipo, filtroDiaSemana) => {
  return treinos.filter(treino => {
    const matchTipo = filtroTipo === "todos" || treino.tipo === filtroTipo;
    const matchDiaSemana = filtroDiaSemana === "todos" || treino.diaSemana === filtroDiaSemana;
    return matchTipo && matchDiaSemana;
  });
};

/**
 * Cria um novo treino
 * @param {Object} treino Dados do treino
 * @param {Object} usuarioAtual Dados do usuário atual
 * @returns {Promise<Object>} Treino criado
 */
export const criarTreino = async (treino, usuarioAtual = null) => {
  // Aqui você faria a chamada para a API real
  // const response = await fetch('api/treinos', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(treino),
  // });
  // return response.json();
  
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      const novoTreino = {
        ...treino,
        id: Date.now() // Gera um ID único baseado no timestamp
      };
      
      // Se for público e temos dados do usuário, adicionar dados do usuário
      if (treino.isPublico && usuarioAtual) {
        novoTreino.usuario = {
          nome: usuarioAtual.nome || "Usuário",
          foto: usuarioAtual.imagem 
            ? `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${usuarioAtual.imagem}`
            : null,
          faixa: usuarioAtual.faixa || "branca"
        };
      }
      
      MOCK_TREINOS.push(novoTreino);
      resolve(novoTreino);
    }, 500);
  });
};

/**
 * Atualiza um treino existente
 * @param {Object} treino Dados do treino
 * @param {Object} usuarioAtual Dados do usuário atual
 * @returns {Promise<Object>} Treino atualizado
 */
export const atualizarTreino = async (treino, usuarioAtual = null) => {
  // Aqui você faria a chamada para a API real
  // const response = await fetch(`api/treinos/${treino.id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(treino),
  // });
  // return response.json();
  
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_TREINOS.findIndex(t => t.id === treino.id);
      if (index !== -1) {
        // Se for público e temos dados do usuário, adicionar dados do usuário
        if (treino.isPublico && usuarioAtual) {
          treino.usuario = {
            nome: usuarioAtual.nome || "Usuário",
            foto: usuarioAtual.imagem 
              ? `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${usuarioAtual.imagem}`
              : null,
            faixa: usuarioAtual.faixa || "branca"
          };
        }

        MOCK_TREINOS[index] = treino;
        resolve(treino);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Exclui um treino
 * @param {number} id ID do treino
 * @returns {Promise<boolean>} Sucesso da operação
 */
export const excluirTreino = async (id) => {
  // Aqui você faria a chamada para a API real
  // await fetch(`api/treinos/${id}`, {
  //   method: 'DELETE',
  // });
  // return true;
  
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_TREINOS.findIndex(t => t.id === id);
      if (index !== -1) {
        MOCK_TREINOS.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

/**
 * Obtém treinos públicos da comunidade
 * @param {number} page Número da página
 * @param {number} limit Limite de itens por página
 * @returns {Promise<Object>} Treinos da comunidade e informações de paginação
 */
export const getTreinosComunidade = async (page = 1, limit = 20) => {
  // Aqui você faria a chamada para a API real
  // const response = await fetch(`api/treinos/comunidade?page=${page}&limit=${limit}`);
  // return response.json();
  
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrar apenas treinos públicos
      const treinosPublicos = MOCK_TREINOS.filter(t => t.isPublico);
      
      // Calcular total de páginas
      const totalItems = treinosPublicos.length;
      const totalPages = Math.ceil(totalItems / limit) || 1; // Garantir pelo menos 1 página
      
      // Limitar página ao número máximo de páginas
      const currentPage = Math.min(page, totalPages);
      
      // Paginar os resultados
      const startIndex = (currentPage - 1) * limit;
      const endIndex = currentPage * limit;
      const treinos = treinosPublicos.slice(startIndex, endIndex);
      
      resolve({
        treinos,
        pagination: {
          currentPage: currentPage,
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      });
    }, 500);
  });
};

/**
 * Altera a visibilidade (público/privado) de um treino
 * @param {number} id ID do treino
 * @param {boolean} isPublico Estado de visibilidade
 * @param {Object} usuarioAtual Dados do usuário atual
 * @returns {Promise<Object>} Treino atualizado
 */
export const alterarVisibilidadeTreino = async (id, isPublico, usuarioAtual = null) => {
  // Aqui você faria a chamada para a API real
  // const response = await fetch(`api/treinos/${id}/visibilidade`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ isPublico }),
  // });
  // return response.json();
  
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_TREINOS.findIndex(t => t.id === id);
      if (index !== -1) {
        // Atualizar visibilidade
        MOCK_TREINOS[index].isPublico = isPublico;
        
        // Se tornando público e temos dados do usuário, adicionar dados do usuário
        if (isPublico && usuarioAtual) {
          MOCK_TREINOS[index].usuario = {
            nome: usuarioAtual.nome || "Usuário",
            foto: usuarioAtual.imagem 
              ? `${import.meta.env.VITE_API_URL}admin/assets/imagens/arquivos/perfil/${usuarioAtual.imagem}`
              : null,
            faixa: usuarioAtual.faixa || "branca"
          };
        }
        
        resolve(MOCK_TREINOS[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Adiciona múltiplos treinos de teste
 * @param {number} quantidade Quantidade de treinos a adicionar
 * @returns {Promise<Array>} Lista de treinos adicionados
 */
export const adicionarTreinosTeste = async (quantidade = 20) => {
  // Simulação com dados mockados
  return new Promise((resolve) => {
    setTimeout(() => {
      const tiposTreino = ['gi', 'nogi'];
      const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
      const horarios = ['06:30', '10:00', '12:00', '14:00', '15:00', '16:00', '18:00', '19:30', '20:30', '21:00'];
      const observacoes = [
        'Treino focado em raspagens e recuperação de guarda.',
        'Trabalhamos defesa de estrangulamento e finalizações da montada.',
        'Aula de drills e movimentação. Muitos exercícios de ponte e shrimp.',
        'Treino técnico com foco em passagem de guarda aberta.',
        'Aula de sparring com vários rounds de 5 minutos.',
        'Treino específico de leglock e heel hooks.',
        'Aprendemos defesa contra leg drags e técnicas de controle lateral.'
      ];
      
      const ultimoNumeroAula = MOCK_TREINOS.length > 0 
        ? Math.max(...MOCK_TREINOS.map(t => t.numeroAula)) 
        : 0;
      
      const novosTreinos = [];
      
      for (let i = 1; i <= quantidade; i++) {
        const numeroAula = ultimoNumeroAula + i;
        const tipo = tiposTreino[Math.floor(Math.random() * tiposTreino.length)];
        const diaSemana = diasSemana[Math.floor(Math.random() * diasSemana.length)];
        const horario = horarios[Math.floor(Math.random() * horarios.length)];
        
        // Gerar data aleatória entre hoje e 60 dias atrás
        const hoje = new Date();
        const diasAtras = Math.floor(Math.random() * 60);
        const dataAleatoria = new Date(hoje);
        dataAleatoria.setDate(hoje.getDate() - diasAtras);
        const dataFormatada = dataAleatoria.toISOString().split('T')[0];
        
        // Decidir se terá imagens e quantas
        const numImagens = Math.floor(Math.random() * 4); // 0 a 3 imagens
        const imagens = [];
        
        for (let j = 0; j < numImagens; j++) {
          const randomSize = Math.floor(Math.random() * 500) + 500;
          const randomId = Math.floor(Math.random() * 1000);
          imagens.push(`https://source.unsplash.com/random/${randomSize}x${randomSize}?bjj,${randomId}`);
        }
        
        // Decidir se será público
        const isPublico = Math.random() > 0.7; // 30% de chance de ser público
        
        // Criar o treino
        const novoTreino = {
          id: Date.now() + i, // Gerar ID único
          numeroAula,
          tipo,
          diaSemana,
          horario,
          data: dataFormatada,
          imagens,
          observacoes: observacoes[Math.floor(Math.random() * observacoes.length)],
          isPublico
        };
        
        // Adicionar dados do usuário se for público
        if (isPublico) {
          const usuarios = [
            {
              nome: "Carlos Silva",
              foto: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop",
              faixa: "roxa"
            },
            {
              nome: "Ana Santos",
              foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
              faixa: "azul"
            },
            {
              nome: "João Oliveira",
              foto: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop",
              faixa: "marrom"
            },
            {
              nome: "Mariana Costa",
              foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
              faixa: "preta"
            }
          ];
          
          novoTreino.usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
        }
        
        MOCK_TREINOS.push(novoTreino);
        novosTreinos.push(novoTreino);
      }
      
      resolve(novosTreinos);
    }, 1000);
  });
};

/**
 * Faz upload de imagens para um treino
 * @param {Array<File>} files Arquivos de imagem
 * @returns {Promise<Array<string>>} URLs das imagens
 */
export const uploadImagensTreino = async (files) => {
  // Aqui você faria o upload real para o servidor
  // const formData = new FormData();
  // files.forEach((file, index) => {
  //   formData.append(`image-${index}`, file);
  // });
  // const response = await fetch('api/upload/treinos', {
  //   method: 'POST',
  //   body: formData,
  // });
  // return response.json();
  
  // Simulação de URLs de imagens
  return new Promise((resolve) => {
    setTimeout(() => {
      // Gera URLs fictícias para simular o upload
      const mockUrls = files.map((_, index) => {
        // Usando URLs do Unsplash para simular imagens reais
        const randomId = Math.floor(Math.random() * 1000);
        const randomSize = Math.floor(Math.random() * 500) + 500;
        return `https://source.unsplash.com/random/${randomSize}x${randomSize}?bjj,${randomId}`;
      });
      resolve(mockUrls);
    }, 1000);
  });
};
