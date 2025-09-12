# Documentação API - Técnicas

Esta documentação descreve a estrutura da tabela e as requisições necessárias para implementar a API de gerenciamento de técnicas no BJJ App.

## Estrutura da Tabela

A tabela `tecnicas` deve ter a seguinte estrutura:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Identificador único da técnica (chave primária, auto incremento) |
| usuario_id | INT | ID do usuário que criou a técnica (chave estrangeira para tabela de usuários) |
| nome | VARCHAR(255) | Nome da técnica/finalização |
| categoria | VARCHAR(50) | Categoria da técnica (guardeiro/passador) |
| posicao | VARCHAR(100) | Posição de execução da técnica |
| passos | TEXT | Array de passos para executar a técnica (armazenado como JSON) |
| observacoes | TEXT | Array de observações sobre a técnica (armazenado como JSON) |
| nota | TINYINT | Avaliação de 1 a 5 atribuída pelo usuário |
| video | VARCHAR(255) | URL do vídeo externo (YouTube/Instagram, opcional) |
| video_url | VARCHAR(255) | Caminho do arquivo de vídeo curto (opcional) |
| video_poster | VARCHAR(255) | Caminho da imagem de capa do vídeo curto (opcional) |
| destacado | BOOLEAN | Se a técnica é destacada/favorita (1 = sim, 0 = não) |
| publica | BOOLEAN | Se a técnica é pública/visível para outros usuários (1 = sim, 0 = não) |
| criado_em | DATETIME | Data e hora de criação do registro |
| atualizado_em | DATETIME | Data e hora da última atualização do registro |

## Tabela Auxiliar

A tabela `posicoes` pode ser usada para armazenar as posições pré-definidas e personalizadas:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Identificador único da posição (chave primária, auto incremento) |
| nome | VARCHAR(100) | Nome da posição |
| usuario_id | INT | ID do usuário que criou a posição (NULL para posições padrão) |
| padrao | BOOLEAN | Indica se é uma posição padrão do sistema (1) ou personalizada (0) |
| criado_em | DATETIME | Data e hora de criação do registro |

## Endpoints da API

### 1. Listar Técnicas do Usuário

**Endpoint:** `endpoint/tecnicas/listar.php`

**Método:** GET

**Parâmetros de Query:**
- `pagina` (opcional, default: 1): Número da página para paginação
- `limite` (opcional, default: 20): Número de itens por página
- `categoria` (opcional): Filtrar por categoria (guardeiro/passador)
- `posicao` (opcional): Filtrar por posição específica

**Cabeçalhos:**
- `Authorization`: Bearer {token}

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Técnicas listadas com sucesso",
  "data": {
    "tecnicas": [
      {
        "id": 1,
        "nome": "Armlock da Guarda",
        "categoria": "guardeiro",
        "posicao": "Guarda Fechada",
        "passos": ["Passo 1", "Passo 2", "Passo 3"],
        "observacoes": ["Observação 1", "Observação 2"],
        "nota": 5,
        "video": "https://www.youtube.com/watch?v=example",
        "video_url": "/uploads/videos/tecnica_1_video.mp4",
        "video_poster": "/uploads/videos/tecnica_1_poster.jpg",
        "destacado": true,
        "publica": false,
        "criado_em": "2025-09-01T10:00:00",
        "atualizado_em": "2025-09-05T15:30:00"
      },
      // ... mais técnicas
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "itemsPerPage": 20
    }
  }
}
```

### 2. Buscar Técnicas da Comunidade

**Endpoint:** `endpoint/tecnicas/comunidade.php`

**Método:** GET

**Parâmetros de Query:**
- `pagina` (opcional, default: 1): Número da página para paginação
- `limite` (opcional, default: 20): Número de itens por página
- `termo` (opcional): Termo para pesquisa em nome, categoria ou posição

**Cabeçalhos:**
- `Authorization`: Bearer {token}

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Técnicas da comunidade listadas com sucesso",
  "data": {
    "tecnicas": [
      {
        "id": 42,
        "nome": "Berimbolo",
        "categoria": "guardeiro",
        "posicao": "Guarda De La Riva",
        "passos": ["Passo 1", "Passo 2", "Passo 3"],
        "observacoes": ["Observação 1", "Observação 2"],
        "nota": 4,
        "video": "https://www.youtube.com/watch?v=example2",
        "video_url": "/uploads/videos/tecnica_42_video.mp4",
        "video_poster": "/uploads/videos/tecnica_42_poster.jpg",
        "destacado": false,
        "publica": true,
        "autor": {
          "id": 15,
          "nome": "Pedro Martins",
          "faixa": "Faixa Preta",
          "imagem": "/user.jpeg"
        },
        "criado_em": "2025-08-10T16:30:00",
        "atualizado_em": "2025-08-10T16:30:00"
      },
      // ... mais técnicas
    ]
  }
}
```

### 3. Listar Posições

**Endpoint:** `endpoint/tecnicas/posicoes.php`

**Método:** GET

**Cabeçalhos:**
- `Authorization`: Bearer {token}

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Posições listadas com sucesso",
  "data": {
    "posicoes": [
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
      "North-South",
      // ... mais posições padrão e personalizadas
    ]
  }
}
```

### 4. Criar Técnica

**Endpoint:** `endpoint/tecnicas/criar.php`

**Método:** POST

**Cabeçalhos:**
- `Authorization`: Bearer {token}
- Sem Content-Type (definido automaticamente pelo FormData)

**Corpo da Requisição:**
- FormData contendo os campos da técnica e arquivo de vídeo
- Campos:
  - `nome`: Nome da técnica
  - `categoria`: Categoria (guardeiro/passador)
  - `posicao`: Posição da técnica
  - `passos`: Array JSON de passos
  - `observacoes`: Array JSON de observações
  - `nota`: Nota de 1 a 5
  - `destacado`: Se a técnica é destacada (0 ou 1)
  - `publica`: Se a técnica é pública (0 ou 1)
  - `video`: URL do vídeo externo (opcional)
  - `videoFile`: Arquivo de vídeo curto (opcional, máximo 7 segundos)

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Técnica criada com sucesso",
  "data": {
    "id": 123,
    "nome": "Nova Técnica",
    "categoria": "guardeiro",
    "posicao": "Guarda Fechada",
    "passos": ["Passo 1", "Passo 2", "Passo 3"],
    "observacoes": ["Observação 1", "Observação 2"],
    "nota": 4,
    "video": "https://www.youtube.com/watch?v=example",
    "video_url": "/uploads/videos/tecnica_123_video.mp4",
    "video_poster": "/uploads/videos/tecnica_123_poster.jpg",
    "destacado": false,
    "publica": true,
    "criado_em": "2025-09-12T14:00:00",
    "atualizado_em": "2025-09-12T14:00:00"
  }
}
```

### 5. Atualizar Técnica

**Endpoint:** `endpoint/tecnicas/atualizar.php`

**Método:** POST

**Cabeçalhos:**
- `Authorization`: Bearer {token}
- Sem Content-Type (definido automaticamente pelo FormData)

**Corpo da Requisição:**
- FormData contendo os campos da técnica e arquivo de vídeo
- Campos:
  - `id`: ID da técnica a ser atualizada
  - `nome`: Nome da técnica
  - `categoria`: Categoria (guardeiro/passador)
  - `posicao`: Posição da técnica
  - `passos`: Array JSON de passos
  - `observacoes`: Array JSON de observações
  - `nota`: Nota de 1 a 5
  - `destacado`: Se a técnica é destacada (0 ou 1)
  - `publica`: Se a técnica é pública (0 ou 1)
  - `video`: URL do vídeo externo (opcional)
  - `videoFile`: Arquivo de vídeo curto (opcional, máximo 7 segundos)
    - Se um novo vídeo for enviado, o antigo deve ser excluído e substituído

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Técnica atualizada com sucesso",
  "data": {
    "id": 123,
    "nome": "Técnica Atualizada",
    "categoria": "passador",
    "posicao": "Montada",
    "passos": ["Passo 1 atualizado", "Passo 2", "Novo passo 3"],
    "observacoes": ["Observação 1", "Nova observação"],
    "nota": 5,
    "video": "https://www.youtube.com/watch?v=example_novo",
    "video_url": "/uploads/videos/tecnica_123_video_novo.mp4",
    "video_poster": "/uploads/videos/tecnica_123_poster_novo.jpg",
    "destacado": true,
    "publica": false,
    "criado_em": "2025-09-12T14:00:00",
    "atualizado_em": "2025-09-12T16:30:00"
  }
}
```

### 6. Excluir Técnica

**Endpoint:** `endpoint/tecnicas/excluir.php`

**Método:** POST

**Cabeçalhos:**
- `Authorization`: Bearer {token}
- `Content-Type`: application/json

**Corpo da Requisição:**
```json
{
  "id": 123
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Técnica excluída com sucesso",
  "data": null
}
```

### 7. Alterar Destaque

**Endpoint:** `endpoint/tecnicas/destaque.php`

**Método:** POST

**Cabeçalhos:**
- `Authorization`: Bearer {token}
- `Content-Type`: application/json

**Corpo da Requisição:**
```json
{
  "id": 123,
  "destacado": true
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Destaque atualizado com sucesso",
  "data": {
    "id": 123,
    "destacado": true
  }
}
```

### 8. Alterar Visibilidade

**Endpoint:** `endpoint/tecnicas/visibilidade.php`

**Método:** POST

**Cabeçalhos:**
- `Authorization`: Bearer {token}
- `Content-Type`: application/json

**Corpo da Requisição:**
```json
{
  "id": 123,
  "publica": true
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Visibilidade atualizada com sucesso",
  "data": {
    "id": 123,
    "publica": true
  }
}
```

## Validações Importantes

1. O vídeo curto deve ter no máximo 7 segundos de duração
2. O usuário só pode manipular suas próprias técnicas
3. Campos obrigatórios: nome, categoria e posicao
4. O array de passos deve ter pelo menos um item
5. A nota deve estar entre 1 e 5
6. Se uma nova posição for adicionada, ela deve ser salva na tabela de posições para uso futuro