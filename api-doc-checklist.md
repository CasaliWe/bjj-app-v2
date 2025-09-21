# API Checklist

Este documento descreve os endpoints para gerenciar Checklists e seus itens, seguindo o mesmo padrão utilizado em Observações (Bearer Token, JSON). Inclui exemplos de request/response e SQL sugerido.

## Autenticação
- Header obrigatório: `Authorization: Bearer <TOKEN>`
- Content-Type: `application/json`

## Lista Checklists
- Endpoint: `POST endpoint/checklists/listar.php`
- Body:
```json
{
  "filtros": { "categoria": "treino" | "todas", "termo": "texto" },
  "pagina": 1,
  "limite": 12
}
```
- Response (200):
```json
{
  "success": true,
  "message": "Checklists obtidos com sucesso",
  "data": {
    "checklists": [
      {
        "id": 1,
        "titulo": "Rotina de Treino",
        "categoria": "treino",
        "data": "2025-09-10T14:30:00",
        "finalizadoEm": null,
        "itens": [
          { "id": 11, "texto": "Aquecimento", "concluido": true, "data": "2025-09-10T14:30:00", "finalizadoEm": "2025-09-10T14:45:00" }
        ]
      }
    ],
    "paginacao": { "currentPage": 1, "totalPages": 3, "totalItems": 25 }
  }
}
```

## Obter Checklist por ID
- Endpoint: `POST endpoint/checklists/obter.php`
- Body:
```json
{ "id": 1 }
```
- Response:
```json
{
  "success": true,
  "message": "Checklist obtido",
  "data": {
    "id": 1,
    "titulo": "Rotina de Treino",
    "categoria": "treino",
    "data": "2025-09-10T14:30:00",
    "finalizadoEm": null,
    "itens": [
      { "id": 11, "texto": "Aquecimento", "concluido": true, "data": "2025-09-10T14:30:00", "finalizadoEm": "2025-09-10T14:45:00" }
    ]
  }
}
```

## Adicionar Checklist
- Endpoint: `POST endpoint/checklists/adicionar.php`
- Body:
```json
{ "titulo": "...", "categoria": "treino" }
```
- Response:
```json
{
  "success": true,
  "message": "Checklist criado",
  "data": { "id": 10, "titulo": "...", "categoria": "treino", "data": "2025-09-10T14:30:00", "finalizadoEm": null, "itens": [] }
}
```

## Atualizar Checklist
- Endpoint: `PUT endpoint/checklists/atualizar.php`
- Body:
```json
{ "id": 10, "titulo": "Atualizado", "categoria": "treino" }
```
- Response:
```json
{ "success": true, "message": "Checklist atualizado", "data": { "id": 10, "titulo": "Atualizado", "categoria": "treino", "data": "2025-09-10T14:30:00", "finalizadoEm": null } }
```

## Excluir Checklist
- Endpoint: `DELETE endpoint/checklists/excluir.php`
- Body:
```json
{ "id": 10 }
```
- Response:
```json
{ "success": true, "message": "Checklist excluído", "data": null }
```

## Adicionar Item
- Endpoint: `POST endpoint/checklists/item/adicionar.php`
- Body:
```json
{ "checklistId": 10, "texto": "Novo item" }
```
- Response:
```json
{ "success": true, "message": "Item criado", "data": { "id": 99, "texto": "Novo item", "concluido": false, "data": "2025-09-10T14:30:00", "finalizadoEm": null } }
```

## Atualizar Item
- Endpoint: `PUT endpoint/checklists/item/atualizar.php`
- Body:
```json
{ "checklistId": 10, "itemId": 99, "texto": "Item editado" }
```
- Response:
```json
{ "success": true, "message": "Item atualizado", "data": { "id": 99, "texto": "Item editado", "concluido": false, "data": "2025-09-10T14:30:00", "finalizadoEm": null } }
```

## Excluir Item
- Endpoint: `DELETE endpoint/checklists/item/excluir.php`
- Body:
```json
{ "checklistId": 10, "itemId": 99 }
```
- Response:
```json
{ "success": true, "message": "Item excluído", "data": null }
```

## Alternar Conclusão do Item
- Endpoint: `PUT endpoint/checklists/item/toggle.php`
- Body:
```json
{ "checklistId": 10, "itemId": 99 }
```
- Response:
```json
{ "success": true, "message": "Item alternado", "data": { "id": 99, "texto": "Item", "concluido": true, "data": "2025-09-10T14:30:00", "finalizadoEm": "2025-09-10T14:45:00" } }
```

## Marcar/Desmarcar Todos os Itens
- Endpoint: `PUT endpoint/checklists/item/marcar-todos.php`
- Body:
```json
{ "checklistId": 10, "concluido": true }
```
- Response (sugestão retornar checklist):
```json
{ "success": true, "message": "Itens atualizados", "data": { "id": 10, "titulo": "...", "categoria": "treino", "data": "2025-09-10T14:30:00", "finalizadoEm": "2025-09-10T15:00:00", "itens": [ { "id": 99, "texto": "...", "concluido": true, "data": "...", "finalizadoEm": "..." } ] } }
```

## Atualizar Status de Conclusão do Checklist
- Endpoint: `PUT endpoint/checklists/finalizar.php`
- Body:
```json
{ "checklistId": 10 }
```
- Descrição: Atualiza automaticamente o `finalizado_em` do checklist baseado no status dos itens (se todos concluídos, marca como finalizado; se algum não concluído, remove a data de finalização)
- Response:
```json
{ "success": true, "message": "Status do checklist atualizado", "data": { "id": 10, "titulo": "...", "categoria": "treino", "data": "2025-09-10T14:30:00", "finalizadoEm": "2025-09-10T15:00:00" } }
```

---

## SQL Sugerido

Tabela: `checklists`
```sql
CREATE TABLE checklists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finalizado_em DATETIME NULL,
  INDEX(usuario_id),
  INDEX(categoria),
  INDEX(data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Tabela: `checklist_itens`
```sql
CREATE TABLE checklist_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  checklist_id INT NOT NULL,
  texto VARCHAR(500) NOT NULL,
  concluido TINYINT(1) NOT NULL DEFAULT 0,
  data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finalizado_em DATETIME NULL,
  FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE,
  INDEX(checklist_id),
  INDEX(concluido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Observações:
- O backend deve inferir `usuario_id` a partir do token e restringir operações ao dono.
- **IMPORTANTE**: Após qualquer alteração em itens (`toggle`, `marcar-todos`, `adicionar`, `excluir`), o backend deve verificar automaticamente se todos os itens do checklist estão concluídos:
  - Se SIM: atualizar `finalizado_em` do checklist com CURRENT_TIMESTAMP
  - Se NÃO: definir `finalizado_em` como NULL
- Ao marcar todos como concluído, preencher `finalizado_em` no checklist e nos itens que mudarem para concluídos.
- O endpoint `/finalizar.php` serve para forçar a verificação/atualização manual caso necessário.
- Retornar sempre o modelo mínimo acima; o frontend mapeia chaves similares (`data`/`dataCriacao`, `finalizadoEm`/`dataFinalizacao`).
