# Documentação da API de Competições

Este documento descreve a estrutura e os endpoints da API de competições do aplicativo BJJ App. A API permite gerenciar competições, incluindo a criação, atualização, exclusão e listagem de competições, bem como o compartilhamento com a comunidade.

## Estrutura da Tabela

A tabela `competicoes` no banco de dados deve ter a seguinte estrutura:

```sql
CREATE TABLE competicoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nome_evento VARCHAR(255) NOT NULL,
    cidade VARCHAR(255),
    data DATE,
    modalidade ENUM('gi', 'nogi') DEFAULT 'gi',
    colocacao VARCHAR(100),
    numero_lutas INT DEFAULT 0,
    numero_vitorias INT DEFAULT 0,
    numero_derrotas INT DEFAULT 0,
    numero_finalizacoes INT DEFAULT 0,
    observacoes TEXT,
    is_publico TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Tabela para armazenar as imagens das competições:

```sql
CREATE TABLE competicoes_imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    competicao_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    ordem INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competicao_id) REFERENCES competicoes(id) ON DELETE CASCADE
);
```

## Endpoints da API

### 1. Listar Competições do Usuário

**Endpoint:** `GET /endpoint/competicoes/listar.php`

**Parâmetros de Query:**
- `pagina` (opcional, padrão: 1): Número da página para paginação
- `limite` (opcional, padrão: 10): Quantidade de itens por página
- `modalidade` (opcional): Filtrar por modalidade ('gi' ou 'nogi')
- `busca` (opcional): Termo para buscar no nome do evento, cidade, colocação ou observações

**Headers necessários:**
- `Authorization: Bearer [token]`

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Competições listadas com sucesso",
  "data": {
    "competicoes": [
      {
        "id": 1,
        "nomeEvento": "Copa São Paulo de Jiu-Jitsu",
        "cidade": "São Paulo, SP",
        "data": "2025-05-15",
        "modalidade": "gi",
        "colocacao": "1º lugar",
        "numeroLutas": 4,
        "numeroVitorias": 4,
        "numeroDerrotas": 0,
        "numeroFinalizacoes": 2,
        "observacoes": "Consegui finalizar na semifinal com um armlock e na final com um triângulo.",
        "isPublico": true,
        "imagens": [
          {
            "id": 1,
            "url": "https://exemplo.com/imagem1.jpg"
          },
          {
            "id": 2,
            "url": "https://exemplo.com/imagem2.jpg"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10
    }
  }
}
```

### 2. Listar Competições da Comunidade

**Endpoint:** `GET /endpoint/competicoes/comunidade.php`

**Parâmetros de Query:**
- `pagina` (opcional, padrão: 1): Número da página para paginação
- `limite` (opcional, padrão: 10): Quantidade de itens por página
- `modalidade` (opcional): Filtrar por modalidade ('gi' ou 'nogi')
- `busca` (opcional): Termo para buscar no nome do evento, cidade, colocação ou observações

**Headers necessários:**
- `Authorization: Bearer [token]`

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Competições da comunidade listadas com sucesso",
  "data": {
    "competicoes": [
      {
        "id": 1,
        "nomeEvento": "Copa São Paulo de Jiu-Jitsu",
        "cidade": "São Paulo, SP",
        "data": "2025-05-15",
        "modalidade": "gi",
        "colocacao": "1º lugar",
        "numeroLutas": 4,
        "numeroVitorias": 4,
        "numeroDerrotas": 0,
        "numeroFinalizacoes": 2,
        "observacoes": "Consegui finalizar na semifinal com um armlock e na final com um triângulo.",
        "usuario": {
          "id": 1,
          "nome": "João Silva",
          "foto": "https://exemplo.com/foto-usuario.jpg",
          "faixa": "roxa"
        },
        "imagens": [
          {
            "id": 1,
            "url": "https://exemplo.com/imagem1.jpg"
          },
          {
            "id": 2,
            "url": "https://exemplo.com/imagem2.jpg"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10
    }
  }
}
```

### 3. Criar Nova Competição

**Endpoint:** `POST /endpoint/competicoes/criar.php`

**Formato:** `multipart/form-data`

**Headers necessários:**
- `Authorization: Bearer [token]`

**Campos do formulário:**
- `nomeEvento` (obrigatório): Nome do evento
- `cidade`: Cidade/Estado onde ocorreu
- `data`: Data do evento (formato: YYYY-MM-DD)
- `modalidade`: 'gi' (com kimono) ou 'nogi' (sem kimono)
- `colocacao`: Posição obtida
- `numeroLutas`: Número total de lutas
- `numeroVitorias`: Número de vitórias
- `numeroDerrotas`: Número de derrotas
- `numeroFinalizacoes`: Número de finalizações
- `observacoes`: Observações sobre a competição
- `isPublico`: 1 (público) ou 0 (privado)
- `imagens[]`: Arrays de arquivos de imagem (múltiplos arquivos)

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Competição criada com sucesso",
  "data": {
    "id": 1,
    "nomeEvento": "Copa São Paulo de Jiu-Jitsu",
    "cidade": "São Paulo, SP",
    "data": "2025-05-15",
    "modalidade": "gi",
    "colocacao": "1º lugar",
    "numeroLutas": 4,
    "numeroVitorias": 4,
    "numeroDerrotas": 0,
    "numeroFinalizacoes": 2,
    "observacoes": "Consegui finalizar na semifinal com um armlock e na final com um triângulo.",
    "isPublico": true,
    "imagens": [
      {
        "id": 1,
        "url": "https://exemplo.com/imagem1.jpg"
      },
      {
        "id": 2,
        "url": "https://exemplo.com/imagem2.jpg"
      }
    ]
  }
}
```

### 4. Atualizar Competição

**Endpoint:** `POST /endpoint/competicoes/atualizar.php`

**Formato:** `multipart/form-data`

**Headers necessários:**
- `Authorization: Bearer [token]`

**Campos do formulário:**
- `id` (obrigatório): ID da competição
- `nomeEvento`: Nome do evento
- `cidade`: Cidade/Estado onde ocorreu
- `data`: Data do evento (formato: YYYY-MM-DD)
- `modalidade`: 'gi' (com kimono) ou 'nogi' (sem kimono)
- `colocacao`: Posição obtida
- `numeroLutas`: Número total de lutas
- `numeroVitorias`: Número de vitórias
- `numeroDerrotas`: Número de derrotas
- `numeroFinalizacoes`: Número de finalizações
- `observacoes`: Observações sobre a competição
- `isPublico`: 1 (público) ou 0 (privado)
- `imagens[]`: Arrays de novos arquivos de imagem (múltiplos arquivos)
- `imagensExistentes[]`: Array com IDs das imagens a manter

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Competição atualizada com sucesso",
  "data": {
    "id": 1,
    "nomeEvento": "Copa São Paulo de Jiu-Jitsu (Atualizado)",
    "cidade": "São Paulo, SP",
    "data": "2025-05-15",
    "modalidade": "gi",
    "colocacao": "1º lugar",
    "numeroLutas": 4,
    "numeroVitorias": 4,
    "numeroDerrotas": 0,
    "numeroFinalizacoes": 2,
    "observacoes": "Observações atualizadas sobre a competição.",
    "isPublico": true,
    "imagens": [
      {
        "id": 1,
        "url": "https://exemplo.com/imagem1.jpg"
      },
      {
        "id": 3,
        "url": "https://exemplo.com/imagem3-nova.jpg"
      }
    ]
  }
}
```

### 5. Excluir Competição

**Endpoint:** `POST /endpoint/competicoes/excluir.php`

**Formato:** `application/json`

**Headers necessários:**
- `Authorization: Bearer [token]`
- `Content-Type: application/json`

**Corpo da requisição:**
```json
{
  "id": 1
}
```

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Competição excluída com sucesso"
}
```

### 6. Alterar Visibilidade da Competição

**Endpoint:** `POST /endpoint/competicoes/visibilidade.php`

**Formato:** `application/json`

**Headers necessários:**
- `Authorization: Bearer [token]`
- `Content-Type: application/json`

**Corpo da requisição:**
```json
{
  "id": 1,
  "isPublico": true
}
```

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Visibilidade da competição alterada com sucesso",
  "data": {
    "id": 1,
    "isPublico": true
  }
}
```

### 7. Remover Imagem de Competição

**Endpoint:** `POST /endpoint/competicoes/remover-imagem.php`

**Formato:** `application/json`

**Headers necessários:**
- `Authorization: Bearer [token]`
- `Content-Type: application/json`

**Corpo da requisição:**
```json
{
  "competicaoId": 1,
  "imagemId": 2
}
```

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "message": "Imagem removida com sucesso",
  "data": {
    "competicaoId": 1,
    "imagensRestantes": [
      {
        "id": 1,
        "url": "https://exemplo.com/imagem1.jpg"
      }
    ]
  }
}
```

## Códigos de Erro

Os endpoints podem retornar os seguintes códigos de erro:

- `400 Bad Request`: Requisição inválida ou parâmetros faltando
- `401 Unauthorized`: Token de autenticação inválido ou expirado
- `403 Forbidden`: Usuário não tem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

Exemplo de resposta de erro:
```json
{
  "status": "error",
  "message": "Competição não encontrada",
  "errorCode": 404
}
```