# Plano de Jogo – Especificação da API e Modelo SQL

Este documento descreve os endpoints que o frontend espera para o módulo Plano de Jogo, o formato das requisições/respostas e um modelo de banco (MySQL/MariaDB) sugerido para implementação.

Observação importante: os padrões seguem o restante do sistema (services de Técnicas e Treinos):
- Base URL: `${VITE_API_URL}` (variável já usada no projeto)
- Autenticação: Header `Authorization: Bearer <token>` (token vem do cookie `auth_token` via `getAuthToken()`)
- Respostas em JSON com wrapper `{ data: ..., message?: string }`

## Entidades e conceitos

- Plano de Jogo (`plano`): cabeçalho com nome/descrição/categoria, pertence a um usuário.
- Node (`node`): item na árvore do plano (técnica, ação manual ou resultado), opcionalmente ligado a uma técnica cadastrada (`tecnicaId`).
  - Tipos previstos: `tecnica`, `acao`, `certo`, `errado`.
  - Hierarquia por `parent_id` (null = raiz). A ordem dos irmãos pode ser controlada por `ordem`.

## Endpoints

Prefixo sugerido: `endpoint/plano-jogo/`

### 1) Listar planos do usuário
- Rota: `GET endpoint/plano-jogo/listar.php`
- Headers: `Authorization: Bearer <token>`
- Query params: nenhum
- Response 200:
```
{
  "data": {
    "planos": [
      {
        "id": 123,
        "nome": "Plano para competição",
        "descricao": "Objetivo do plano...",
        "categoria": "Competição",
        "dataCriacao": "2025-09-20T12:34:56Z",
        "dataAtualizacao": "2025-09-20T12:40:00Z"
      }
    ]
  }
}
```

### 2) Obter um plano por ID (com árvore completa)
- Rota: `GET endpoint/plano-jogo/obter.php?id=<ID>`
- Headers: `Authorization: Bearer <token>`
- Response 200:
```
{
  "data": {
    "plano": {
      "id": 123,
      "nome": "Plano para competição",
      "descricao": "...",
      "categoria": "Competição",
      "dataCriacao": "2025-09-20T12:34:56Z",
      "dataAtualizacao": "2025-09-20T12:40:00Z",
      "nodes": [
        {
          "id": "n1",
          "parentId": null,
          "nome": "Quebra de pegada",
          "tipo": "tecnica",
          "descricao": "...",
          "tecnicaId": 456,
          "categoria": "passador",
          "posicao": "Guarda Fechada",
          "passos": ["..."],
          "observacoes": ["..."],
          "video_url": null,
          "video_poster": null,
          "video": null,
          "children": [
            { "id": "n1a", "parentId": "n1", "nome": "Deu certo", "tipo": "certo", "children": [] },
            { "id": "n1b", "parentId": "n1", "nome": "Deu errado", "tipo": "errado", "children": [] }
          ]
        }
      ]
    }
  }
}
```

### 3) Criar plano
- Rota: `POST endpoint/plano-jogo/criar.php`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body:
```
{
  "nome": "Plano para competição",
  "descricao": "...",
  "categoria": "Competição"
}
```
- Response 200:
```
{
  "data": {
    "plano": {
      "id": 123,
      "nome": "Plano para competição",
      "descricao": "...",
      "categoria": "Competição",
      "dataCriacao": "2025-09-20T12:34:56Z",
      "dataAtualizacao": "2025-09-20T12:34:56Z",
      "nodes": []
    }
  }
}
```

### 4) Atualizar plano
- Rota: `POST endpoint/plano-jogo/atualizar.php`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body:
```
{
  "id": 123,
  "nome": "Novo nome",
  "descricao": "Nova descrição",
  "categoria": "Competição"
}
```
- Response 200:
```
{
  "data": {
    "plano": { "id": 123, "nome": "Novo nome", "descricao": "Nova descrição", "categoria": "Competição", "dataAtualizacao": "..." }
  }
}
```

### 5) Excluir plano
- Rota: `POST endpoint/plano-jogo/excluir.php`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body:
```
{ "id": 123 }
```
- Response 200:
```
{ "data": { "success": true } }
```

### 6) Adicionar nó
- Rota: `POST endpoint/plano-jogo/adicionar-node.php`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body:
```
{
  "planoId": 123,
  "parentId": null, // ou "n1" para adicionar como filho
  "node": {
    "nome": "Quebra de pegada",
    "tipo": "tecnica", // "acao" | "certo" | "errado"
    "descricao": "...",
    "tecnicaId": 456,
    "categoria": "passador",
    "posicao": "Guarda Fechada",
    "passos": ["..."],
    "observacoes": ["..."],
    "video_url": null,
    "video_poster": null,
    "video": null
  }
}
```
- Response 200 (retornando plano atualizado completo):
```
{ "data": { "plano": { ...mesma estrutura do obter.php... } } }
```

### 7) Remover nó
- Rota: `POST endpoint/plano-jogo/remover-node.php`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body:
```
{ "planoId": 123, "nodeId": "n1b" }
```
- Response 200:
```
{ "data": { "plano": { ...plano atualizado... } } }
```

## Observações de implementação na API

- Todas as rotas usam o `user_id` obtido do token para isolar dados por usuário.
- No `obter.php`, retornar a árvore montada (pais com seus `children`) já ordenada por `ordem`.
- IDs dos nodes podem ser UUIDs (string) gerados no backend.
- Para `tipo` = `certo` e `errado`, apenas `nome`, `tipo`, `parentId` e `children` são necessários; os demais campos são opcionais.

## Modelo SQL (MySQL/MariaDB)

```
-- Tabela de planos
CREATE TABLE planos_jogo (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT NULL,
  categoria VARCHAR(80) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de nós da árvore
CREATE TABLE plano_jogo_nodes (
  id VARCHAR(64) PRIMARY KEY,               -- pode usar UUID/ULID
  plano_id INT UNSIGNED NOT NULL,
  parent_id VARCHAR(64) NULL,
  nome VARCHAR(200) NOT NULL,
  tipo ENUM('tecnica','acao','certo','errado') NOT NULL,
  descricao TEXT NULL,
  tecnica_id INT NULL,
  categoria VARCHAR(80) NULL,
  posicao VARCHAR(120) NULL,
  passos JSON NULL,                         -- array de strings
  observacoes JSON NULL,                    -- array de strings
  video_url VARCHAR(255) NULL,
  video_poster VARCHAR(255) NULL,
  video VARCHAR(255) NULL,
  ordem INT UNSIGNED NOT NULL DEFAULT 0,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_plano FOREIGN KEY (plano_id) REFERENCES planos_jogo(id) ON DELETE CASCADE,
  CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES plano_jogo_nodes(id) ON DELETE CASCADE,
  INDEX idx_plano (plano_id),
  INDEX idx_parent (parent_id),
  INDEX idx_plano_ordem (plano_id, parent_id, ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Observações SQL
- Use JSON válido (`["passo 1","passo 2"]`) para `passos` e `observacoes`.
- Para gerar a árvore no `obter.php`, carregue todos os nós do `plano_id` e faça a montagem em memória (hash por id + agrupamento por parent_id).
- Garanta que o `user_id` do plano pertence ao usuário do token antes de qualquer operação.

## Padrão de erro

Para manter o padrão do frontend, quando ocorrer erro, retornar status HTTP apropriado e corpo com:
```
{ "message": "Descrição do erro" }
```

## Checklist de compatibilidade
- [x] Todas as rotas usam `Authorization: Bearer <token>`
- [x] Respostas com wrapper `{ data: ... }`
- [x] `listar.php` retorna apenas cabeçalhos, `obter.php` retorna o plano com `nodes`
- [x] Mutations retornam o plano atualizado completo

Com esta especificação, basta implementar as rotas do backend conforme descrito que o frontend já vai operar 100% integrado à API.
