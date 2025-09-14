# Documentação da API - Página de Usuário

## Índice

1. [Visão Geral](#visão-geral)
2. [Endpoints](#endpoints)
   - [Obter Perfil de Usuário](#obter-perfil-de-usuário)
   - [Obter Treinos Públicos](#obter-treinos-públicos)
   - [Obter Competições Públicas](#obter-competições-públicas)
   - [Obter Técnicas Públicas](#obter-técnicas-públicas)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Códigos de Erro](#códigos-de-erro)

## Visão Geral

A API de Página de Usuário permite visualizar informações públicas de perfis de usuários do sistema BJJ Academy, incluindo:

- Dados pessoais e de perfil
- Treinos públicos
- Competições públicas
- Técnicas públicas

Esses endpoints são públicos e não requerem autenticação.

## Endpoints

### Obter Perfil de Usuário

**Endpoint:** `endpoint/user/getProfile.php`

**Método:** GET

**Parâmetros de Query:**
- `bjj_id` (obrigatório): ID do usuário cujo perfil deseja visualizar

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Perfil obtido com sucesso",
  "data": {
    "profile": {
      "id": "123",
      "nome": "João Silva",
      "email": "joao.silva@example.com",
      "imagem": "joao-silva.jpg",
      "whatsapp": "(54) 9 9999-9999",
      "idade": 30,
      "peso": 80,
      "faixa": "Azul",
      "graduacao": "3 graus",
      "competidor": "Sim",
      "estilo": "Competitivo",
      "guarda": "De La Riva",
      "posicao": "100kg",
      "finalizacao": "Armlock",
      "academia": "BJJ Elite",
      "cidade": "Porto Alegre",
      "estado": "RS",
      "pais": "Brasil",
      "instagram": "joaosilva",
      "youtube": "joaosilvabjj",
      "tiktok": "joaosilvabjj",
      "bio": "Praticante de Jiu-Jitsu há 5 anos."
    }
  }
}
```

### Obter Treinos Públicos

**Endpoint:** `endpoint/user/getPublicTrainings.php`

**Método:** GET

**Parâmetros de Query:**
- `bjj_id` (obrigatório): ID do usuário cujos treinos deseja visualizar
- `pagina` (opcional, default: 1): Número da página para paginação
- `limite` (opcional, default: 10): Número de itens por página

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Treinos públicos obtidos com sucesso",
  "data": {
    "treinos": [
      {
        "id": "456",
        "tipo": "gi",
        "diaSemana": "segunda",
        "horario": "19:30",
        "numeroAula": 42,
        "data": "2025-09-10",
        "imagens": [
          "https://url-da-imagem-1.jpg",
          "https://url-da-imagem-2.jpg"
        ],
        "observacoes": "Texto com as observações do treino",
        "isPublico": true,
        "usuario": {
          "nome": "João Silva",
          "imagem": "joao-silva.jpg",
          "faixa": "Azul"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    }
  }
}
```

### Obter Competições Públicas

**Endpoint:** `endpoint/user/getPublicCompetitions.php`

**Método:** GET

**Parâmetros de Query:**
- `bjj_id` (obrigatório): ID do usuário cujas competições deseja visualizar
- `pagina` (opcional, default: 1): Número da página para paginação
- `limite` (opcional, default: 10): Número de itens por página

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Competições públicas obtidas com sucesso",
  "data": {
    "competicoes": [
      {
        "id": "789",
        "nome": "Campeonato Brasileiro de Jiu-Jitsu",
        "data": "2025-10-15",
        "local": "São Paulo, SP",
        "modalidade": "gi",
        "categoria": "Adulto",
        "resultado": "Ouro",
        "imagens": [
          "https://url-da-imagem-1.jpg",
          "https://url-da-imagem-2.jpg"
        ],
        "observacoes": "Texto com as observações da competição",
        "isPublico": true,
        "usuario": {
          "nome": "João Silva",
          "imagem": "joao-silva.jpg",
          "faixa": "Azul"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 12,
      "itemsPerPage": 10
    }
  }
}
```

### Obter Técnicas Públicas

**Endpoint:** `endpoint/user/getPublicTechniques.php`

**Método:** GET

**Parâmetros de Query:**
- `bjj_id` (obrigatório): ID do usuário cujas técnicas deseja visualizar
- `pagina` (opcional, default: 1): Número da página para paginação
- `limite` (opcional, default: 10): Número de itens por página

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Técnicas públicas obtidas com sucesso",
  "data": {
    "tecnicas": [
      {
        "id": "101",
        "nome": "Armlock da Guarda",
        "categoria": "guardeiro",
        "posicao": "Guarda Fechada",
        "passos": ["Passo 1", "Passo 2", "Passo 3"],
        "observacoes": ["Observação 1", "Observação 2"],
        "nota": 5,
        "video": "https://www.youtube.com/watch?v=example",
        "video_url": "/uploads/videos/tecnica_1_video.mp4",
        "video_poster": "/uploads/videos/tecnica_1_poster.jpg",
        "destacado": false,
        "publica": true,
        "criado_em": "2025-09-01T10:00:00",
        "atualizado_em": "2025-09-05T15:30:00",
        "usuario": {
          "nome": "João Silva",
          "imagem": "joao-silva.jpg",
          "faixa": "Azul"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

## Estrutura de Dados

### Perfil de Usuário

| Campo              | Tipo     | Descrição                                       |
|--------------------|----------|-------------------------------------------------|
| id                 | string   | ID único do usuário                             |
| nome               | string   | Nome completo do usuário                        |
| email              | string   | Email do usuário                                |
| imagem             | string   | Nome do arquivo de imagem de perfil             |
| whatsapp           | string   | Número de WhatsApp formatado                    |
| idade              | number   | Idade do usuário                                |
| peso               | number   | Peso do usuário em kg                           |
| faixa              | string   | Faixa do usuário (Branca, Azul, etc.)           |
| graduacao          | string   | Graduação na faixa (graus)                      |
| competidor         | string   | Se é competidor (Sim/Não)                       |
| estilo             | string   | Estilo de luta                                  |
| guarda             | string   | Tipo de guarda preferida                        |
| posicao            | string   | Posição preferida                               |
| finalizacao        | string   | Finalização preferida                           |
| academia           | string   | Nome da academia                                |
| cidade             | string   | Cidade onde mora                                |
| estado             | string   | Estado onde mora                                |
| pais               | string   | País onde mora                                  |
| instagram          | string   | Perfil do Instagram                             |
| youtube            | string   | Canal do YouTube                                |
| tiktok             | string   | Perfil do TikTok                                |
| bio                | string   | Biografia curta                                 |

### Treino

| Campo      | Tipo      | Descrição                                       |
|------------|-----------|--------------------------------------------------|
| id         | string    | ID único do treino                              |
| tipo       | string    | Tipo de treino ("gi" ou "nogi")                 |
| diaSemana  | string    | Dia da semana do treino                         |
| horario    | string    | Horário do treino                               |
| numeroAula | number    | Número sequencial da aula                       |
| data       | string    | Data do treino (formato YYYY-MM-DD)             |
| imagens    | string[]  | Array de URLs das imagens do treino             |
| observacoes| string    | Observações sobre o treino                      |
| isPublico  | boolean   | Se o treino é público ou não                    |
| usuario    | Object    | Dados do usuário (apenas para treinos públicos) |

### Competição

| Campo      | Tipo      | Descrição                                           |
|------------|-----------|-----------------------------------------------------|
| id         | string    | ID único da competição                              |
| nome       | string    | Nome da competição                                  |
| data       | string    | Data da competição (formato YYYY-MM-DD)             |
| local      | string    | Local da competição                                 |
| modalidade | string    | Modalidade ("gi" ou "nogi")                         |
| categoria  | string    | Categoria da competição                             |
| resultado  | string    | Resultado obtido                                    |
| imagens    | string[]  | Array de URLs das imagens da competição             |
| observacoes| string    | Observações sobre a competição                      |
| isPublico  | boolean   | Se a competição é pública ou não                    |
| usuario    | Object    | Dados do usuário (apenas para competições públicas) |

### Técnica

| Campo         | Tipo      | Descrição                                        |
|---------------|-----------|--------------------------------------------------|
| id            | string    | ID único da técnica                              |
| nome          | string    | Nome da técnica                                  |
| categoria     | string    | Categoria ("guardeiro" ou "passador")            |
| posicao       | string    | Posição de onde a técnica é executada            |
| passos        | string[]  | Lista de passos para executar a técnica          |
| observacoes   | string[]  | Lista de observações sobre a técnica             |
| nota          | number    | Nota dada pelo usuário (1-5)                     |
| video         | string    | URL do vídeo no YouTube                          |
| video_url     | string    | URL do vídeo armazenado no servidor              |
| video_poster  | string    | URL da imagem de capa do vídeo                   |
| destacado     | boolean   | Se a técnica está destacada                      |
| publica       | boolean   | Se a técnica é pública                           |
| criado_em     | string    | Data de criação (ISO 8601)                       |
| atualizado_em | string    | Data da última atualização (ISO 8601)            |
| usuario       | Object    | Dados do usuário (apenas para técnicas públicas) |

### Usuário (resumido para itens públicos)

| Campo  | Tipo   | Descrição                                    |
|--------|--------|----------------------------------------------|
| nome   | string | Nome do usuário                              |
| imagem | string | URL da imagem de perfil                      |
| faixa  | string | Faixa do usuário (Branca, Azul, Roxa, etc.) |

### Paginação

| Campo        | Tipo   | Descrição                              |
|--------------|--------|----------------------------------------|
| currentPage  | number | Número da página atual                 |
| totalPages   | number | Número total de páginas                |
| totalItems   | number | Número total de itens                  |
| itemsPerPage | number | Número de itens por página             |

## Códigos de Erro

| Código | Descrição                                          |
|--------|---------------------------------------------------|
| 400    | Parâmetros inválidos ou ausentes                  |
| 401    | Não autorizado (token inválido ou expirado)       |
| 403    | Acesso negado (perfil privado ou sem permissão)   |
| 404    | Recurso não encontrado                            |
| 500    | Erro interno do servidor                          |

**Observação importante:** Para o endpoint de obtenção de perfil (`getProfile.php`), quando o perfil do usuário for privado, a API deve retornar o código de erro 403 com uma mensagem apropriada como "Este perfil é privado". O frontend utilizará esse código para exibir uma interface específica para perfis privados.