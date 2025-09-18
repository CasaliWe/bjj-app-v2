# API de Gerenciamento de Posições

Esta documentação descreve os endpoints necessários para o gerenciamento de posições no sistema de técnicas de Jiu-Jitsu.

## Endpoint Base
```
/endpoint/tecnicas/posicoes.php
```

## Autenticação
Todos os endpoints requerem autenticação via Bearer Token no header:
```
Authorization: Bearer {token}
```

---

## 1. Listar Posições

### Método: `GET`
### URL: `/endpoint/tecnicas/posicoes.php`

### Headers:
```
Authorization: Bearer {token}
```

### Resposta de Sucesso (200):
```json
{
    "success": true,
    "message": "Posições listadas com sucesso",
    "data": {
        "posicoes": [
            "Guarda Fechada",
            "Guarda Aberta",
            "Meia Guarda",
            "Monte",
            "Lateral",
            "100kg",
            "Posições Personalizadas..."
        ]
    }
}
```

### Resposta de Erro (400/401/500):
```json
{
    "success": false,
    "message": "Descrição do erro",
    "data": null
}
```

---

## 2. Adicionar Nova Posição

### Método: `POST`
### URL: `/endpoint/tecnicas/adicionar-posicoes.php`

### Headers:
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Body:
```json
{
    "nome": "Nova Posição"
}
```

### Validações:
- Campo `nome` é obrigatório
- Nome deve ter entre 1 e 100 caracteres
- Nome não pode ser duplicado (verificação case-insensitive)
- Remove espaços em branco no início e fim

### Resposta de Sucesso (201):
```json
{
    "success": true,
    "message": "Posição adicionada com sucesso",
    "data": {
        "nome": "Nova Posição",
        "criada_em": "2025-09-18T10:30:00"
    }
}
```

### Resposta de Erro (400):
```json
{
    "success": false,
    "message": "Posição já existe" | "Nome é obrigatório" | "Nome muito longo",
    "data": null
}
```

---

## 3. Excluir Posição

### Método: `DELETE`
### URL: `/endpoint/tecnicas/posicoes.php`

### Headers:
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Body:
```json
{
    "nome": "Posição a ser excluída"
}
```

### Comportamento:
- Remove a posição da lista de posições disponíveis
- **NÃO afeta técnicas existentes** que usam esta posição
- Técnicas mantêm o nome da posição mesmo após exclusão

### Resposta de Sucesso (200):
```json
{
    "success": true,
    "message": "Posição excluída com sucesso",
    "data": null
}
```

### Resposta de Erro (404):
```json
{
    "success": false,
    "message": "Posição não encontrada",
    "data": null
}
```

---

## Estrutura do Banco de Dados

### Tabela: `posicoes` (sugestão)
```sql
CREATE TABLE posicoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_posicao_usuario (usuario_id, nome)
);
```

### Considerações:
- Cada usuário tem suas próprias posições personalizadas
- Posições padrão podem ser compartilhadas entre usuários
- Index na coluna `usuario_id` para performance
- Constraint única para evitar duplicatas por usuário

---

## Integração com Técnicas

### Comportamento Atual:
1. **Criar Técnica**: Se uma posição não existe, ela é criada automaticamente
2. **Listar Técnicas**: Usa posições existentes + posições criadas automaticamente
3. **Filtrar**: Filtra pelas posições disponíveis no dropdown

### Novo Comportamento:
1. **Gerenciar Posições**: CRUD completo via modal dedicado
2. **Criar Técnica**: Ainda permite criar nova posição se necessário
3. **Sincronização**: Modal sempre mostra posições atualizadas após operações

---

## Exemplo de Fluxo de Uso

1. **Usuário abre modal de posições**
   ```
   GET /endpoint/tecnicas/posicoes.php
   ```

2. **Usuário adiciona nova posição "Spider Guard"**
   ```
   POST /endpoint/tecnicas/posicoes.php
   Body: {"nome": "Spider Guard"}
   ```

3. **Lista é recarregada automaticamente**
   ```
   GET /endpoint/tecnicas/posicoes.php
   ```

4. **Usuário exclui posição "Posição Antiga"**
   ```
   DELETE /endpoint/tecnicas/posicoes.php
   Body: {"nome": "Posição Antiga"}
   ```

5. **Lista é recarregada automaticamente**
   ```
   GET /endpoint/tecnicas/posicoes.php
   ```

---

## Notas de Implementação

- **Segurança**: Sempre validar `usuario_id` via token JWT
- **Performance**: Cache da lista de posições por usuário
- **UX**: Frontend mostra feedback visual durante operações
- **Erro**: Retorna mensagens específicas para cada tipo de erro
- **Logging**: Registrar operações de CRUD para auditoria