# Arquivos para Integração com API

Aqui está uma lista dos arquivos que precisarão ser modificados para integrar com uma API real:

## Principais Arquivos de Serviço

1. **src/services/treinos/treinosService.js**
   - Este é o arquivo principal que simula as chamadas de API
   - Você precisará substituir os dados mockados por chamadas reais para sua API
   - Funções importantes a modificar: 
     - `getTreinos`
     - `getTreinosComunidade`
     - `addTreino`
     - `updateTreino`
     - `deleteTreino`
     - `alterarVisibilidadeTreino`

## Arquivos de Hooks

2. **src/hooks/use-treinos.jsx**
   - Este hook conecta os componentes da UI com o serviço
   - Mantenha a mesma interface, mas atualize as chamadas para a API real
   - Precisará lidar com estados de carregamento e erros da API

## Serviços Relacionados

3. **src/services/auth/authService.js** (se existir)
   - Para autenticação e obtenção de tokens para autorização
   - Necessário para enviar cabeçalhos de autorização nas requisições da API

4. **src/services/upload/uploadService.js** (se existir)
   - Para upload de imagens para servidor/CDN
   - Substituir a implementação atual que usa URLs locais

## Considerações para a Implementação

### Upload de Imagens
- Considere usar FormData para enviar arquivos
- Pode precisar de um bucket S3, Cloudinary ou similar para armazenamento
- Implemente progresso de upload para melhor UX

### Autenticação
- Implemente tokens JWT ou similar para autenticação
- Armazene tokens com segurança (localStorage ou cookies HTTP-only)
- Configure interceptors para atualizar tokens expirados

### Tratamento de Erros
- Implemente tratamento consistente de erros da API
- Mostre mensagens amigáveis aos usuários
- Considere implementar retentativas para falhas de rede

### Paginação
- A API deverá suportar paginação no servidor
- Parâmetros comuns: page, limit ou pageSize
- A resposta deve incluir metadados como totalItems e totalPages

### Caching
- Considere implementar caching local para melhorar performance
- Use react-query ou swr para gerenciamento de estado do servidor

## Exemplo de Implementação (Axios)

```javascript
// Exemplo de como o treinosService.js poderia ser com Axios
import axios from 'axios';

const API_URL = 'https://api.example.com';

// Configurar instância Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funções do serviço
export const getTreinos = async (filtros = {}, pagina = 1, limite = 10) => {
  try {
    const response = await api.get('/treinos', {
      params: {
        ...filtros,
        page: pagina,
        limit: limite,
      },
    });
    
    return {
      treinos: response.data.items,
      paginacao: {
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    throw new Error('Não foi possível carregar os treinos. Tente novamente.');
  }
};

// Implementar outras funções de forma semelhante...
```
