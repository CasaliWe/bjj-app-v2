// Dados fictícios simulando os dados que virão da API
// Estes dados serão substituídos por chamadas à API real no futuro

/**
 * Modelo de dados para técnicas:
 * @typedef {Object} Tecnica
 * @property {number} id - ID único da técnica
 * @property {string} nome - Nome da técnica
 * @property {string} categoria - Categoria (guardeiro/passador)
 * @property {string} posicao - Posição de execução
 * @property {string[]} passos - Array com os passos para executar a técnica
 * @property {string[]} observacoes - Array com observações sobre a técnica
 * @property {number} nota - Avaliação de 1 a 5
 * @property {string|null} video - URL do vídeo demonstrativo (opcional)
 * @property {boolean} destacado - Se é uma técnica destacada/favorita
 * @property {boolean} publica - Se a técnica é pública (visível para outros usuários)
 * @property {Object|null} autor - Informações do autor (para técnicas da comunidade)
 */

// Dados mockados para técnicas do usuário
export const MOCK_TECNICAS = [
  {
    id: 1,
    nome: "Armlock da Guarda",
    categoria: "guardeiro",
    posicao: "Guarda Fechada",
    passos: [
      "Segure a manga e o punho do oponente",
      "Abra a guarda e posicione a perna sobre o peito",
      "Posicione o outro pé no quadril do oponente",
      "Puxe o braço do oponente para o seu peito",
      "Estenda as pernas e arqueia o quadril para finalizar"
    ],
    observacoes: [
      "Mantenha os joelhos unidos para maior força",
      "O cotovelo do oponente deve estar alinhado com seu peito"
    ],
    nota: 5,
    video: "https://www.youtube.com/watch?v=example1",
    destacado: true,
    publica: false,
    autor: null
  },
  {
    id: 2,
    nome: "Estrangulamento Triângulo",
    categoria: "guardeiro",
    posicao: "Guarda Aberta",
    passos: [
      "Controle um braço do oponente e puxe-o para baixo",
      "Posicione uma perna atrás do pescoço do oponente",
      "A outra perna forma um triângulo cruzando sobre a primeira",
      "Puxe a cabeça do oponente para baixo para apertar",
      "Estenda os quadris para aumentar a pressão"
    ],
    observacoes: [
      "Ajuste o ângulo para melhor pressão",
      "Corte o ângulo para o lado oposto do braço preso"
    ],
    nota: 4,
    video: "https://www.instagram.com/p/example2/",
    destacado: true,
    publica: true,
    autor: null
  },
  {
    id: 3,
    nome: "Passagem de Guarda 100kg",
    categoria: "passador",
    posicao: "100kg",
    passos: [
      "Posicione-se ao lado do oponente com o joelho próximo à axila",
      "Distribua seu peso sobre o peito do oponente",
      "Mantenha o braço mais próximo da cabeça do oponente controlado",
      "Use o braço livre para controlar os quadris",
      "Deslize o joelho sobre o abdômen para estabilizar a posição"
    ],
    observacoes: [
      "Mantenha pressão constante",
      "Não deixe espaço para o oponente escapar ou inserir a guarda"
    ],
    nota: 5,
    video: null,
    destacado: false,
    publica: false,
    autor: null
  },
  {
    id: 4,
    nome: "Americana",
    categoria: "passador",
    posicao: "Montada",
    passos: [
      "Posicione-se na montada ou 100kg",
      "Capture o braço do oponente no solo",
      "Coloque sua mão sob o pulso do oponente",
      "Com a outra mão, pegue seu próprio pulso formando um 'L'",
      "Rotacione o cotovelo do oponente para fora, mantendo-o no solo"
    ],
    observacoes: [
      "Mantenha o cotovelo do oponente no solo",
      "Use o peso do corpo, não apenas a força dos braços"
    ],
    nota: 3,
    video: "https://www.youtube.com/watch?v=example4",
    destacado: false,
    publica: true,
    autor: null
  },
  {
    id: 5,
    nome: "Kimura da Guarda",
    categoria: "guardeiro",
    posicao: "Meia Guarda",
    passos: [
      "Da posição de guarda, segure o pulso do oponente",
      "Passe seu braço por baixo do braço do oponente",
      "Segure seu próprio pulso formando um 'figure four'",
      "Controle o corpo do oponente com as pernas",
      "Rotacione o braço para trás para finalizar"
    ],
    observacoes: [
      "Mantenha o controle do oponente com as pernas",
      "Pode-se usar a transição para outras posições como omoplata"
    ],
    nota: 4,
    video: "https://www.instagram.com/p/example5/",
    destacado: false,
    publica: false,
    autor: null
  }
];

// Dados mockados para técnicas da comunidade
export const MOCK_TECNICAS_COMUNIDADE = [
  {
    id: 101,
    nome: "Raspagem de Gancho",
    categoria: "guardeiro",
    posicao: "Guarda Aberta",
    passos: [
      "Controle a manga e a lapela do oponente",
      "Posicione seu pé no quadril do oponente",
      "Gire para o lado e insira o gancho com a outra perna",
      "Puxe o oponente para a direção do gancho e empurre com o pé no quadril",
      "Complete a raspagem e estabeleça a posição de montada"
    ],
    observacoes: [
      "Mantenha o oponente desequilibrado durante todo o movimento",
      "O timing é essencial para o sucesso da técnica"
    ],
    nota: 5,
    video: "https://www.youtube.com/watch?v=example101",
    destacado: false,
    publica: true,
    autor: {
      id: 42,
      nome: "Carlos Silva",
      imagem: "/user.jpeg",
      bjjId: "carlosbjj123"
    }
  },
  {
    id: 102,
    nome: "Berimbolo",
    categoria: "guardeiro",
    posicao: "Guarda De La Riva",
    passos: [
      "Estabeleça a guarda De La Riva com controle da manga e calça",
      "Inicie a inversão rolando para o lado do gancho",
      "Durante a inversão, mantenha o controle das pernas do oponente",
      "Complete a inversão e posicione-se nas costas do oponente",
      "Estabeleça os ganchos para controle completo"
    ],
    observacoes: [
      "Manter o quadril móvel durante toda a execução",
      "Foco no controle do oponente em vez da velocidade da inversão"
    ],
    nota: 4,
    video: "https://www.instagram.com/p/example102/",
    destacado: false,
    publica: true,
    autor: {
      id: 28,
      nome: "Ana Rodrigues",
      imagem: "/user.jpeg",
      bjjId: "anabjj456"
    }
  },
  {
    id: 103,
    nome: "Estrangulamento Relógio",
    categoria: "passador",
    posicao: "Costas",
    passos: [
      "A partir do controle das costas, insira a mão no colarinho",
      "Aprofunde o controle da gola até a nuca do oponente",
      "Posicione o antebraço da outra mão atrás da cabeça do oponente",
      "Conecte as mãos em um movimento circular",
      "Aplique pressão puxando os cotovelos para trás"
    ],
    observacoes: [
      "O movimento deve ser suave, não force com os braços",
      "A pressão vem do posicionamento correto, não da força bruta"
    ],
    nota: 5,
    video: "https://www.youtube.com/watch?v=example103",
    destacado: false,
    publica: true,
    autor: {
      id: 15,
      nome: "Pedro Martins",
      imagem: "/user.jpeg",
      bjjId: "pedrobjj789"
    }
  }
];

// Posições pré-cadastradas
export const MOCK_POSICOES = [
  "Guarda Fechada",
  "Guarda Aberta",
  "Meia Guarda",
  "100kg",
  "Montada",
  "Costas",
  "Quatro Apoios",
  "Raspagem",
  "Guarda De La Riva",
  "Guarda X",
  "Meia Guarda Profunda",
  "North-South"
];
