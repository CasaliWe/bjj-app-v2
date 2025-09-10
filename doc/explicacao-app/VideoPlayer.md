# VideoPlayer Component

Este componente foi criado para exibir vídeos curtos de técnicas de BJJ, com foco em simplicidade e performance.

## Características

- **Otimizado para performance**: Carrega o vídeo apenas quando o usuário clica para reproduzir
- **Leve e responsivo**: Código simples e direto para minimizar o uso de recursos
- **Controles simples**: Apenas play/pause para fácil usabilidade
- **Suporte a poster**: Exibe uma imagem de capa antes da reprodução
- **Responsivo**: Adapta-se a diferentes tamanhos de tela, tanto para vídeos horizontais quanto verticais

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| src | string | (obrigatório) | URL do vídeo |
| posterSrc | string | undefined | URL da imagem de capa |
| className | string | "" | Classes CSS adicionais |
| loop | boolean | false | Repetir vídeo ao finalizar |

## Exemplo de Uso

```jsx
import VideoPlayer from "@/components/tecnicas/VideoPlayer";

// Uso básico
<VideoPlayer 
  src="https://exemplo.com/video.mp4" 
  posterSrc="https://exemplo.com/poster.jpg" 
/>

// Com loop
<VideoPlayer 
  src="https://exemplo.com/video.mp4" 
  posterSrc="https://exemplo.com/poster.jpg"
  className="rounded-xl"
  loop={true}
/>
```

## Integração com Upload de Vídeo

Para integrar com upload de vídeo e validação de duração, consulte o componente `TecnicaForm.jsx` que implementa:

1. Upload de vídeo com limite de 7 segundos
2. Validação de duração com feedback ao usuário
3. Geração automática de poster (thumbnail)
4. Exibição de duração do vídeo carregado

## Considerações Técnicas

- O vídeo usa `preload="none"` para evitar o carregamento desnecessário, economizando dados do usuário
- Só carrega efetivamente quando o usuário clica no botão play
- Usa o atributo poster para mostrar uma imagem até que o vídeo seja reproduzido
- Funciona bem em conexões lentas por carregar o vídeo sob demanda

## Considerações para API

Ao implementar a API para este recurso, será necessário:

1. Endpoint para upload de vídeo com validação de duração no servidor
2. Armazenamento de vídeos curtos (possível uso de CDN)
3. Geração automática de thumbnails
4. Limitação de tamanho de arquivo (recomendado: máx. 5MB)
5. Campos adicionais no modelo de dados:
   - `videoUrl`: URL do vídeo curto
   - `videoPoster`: URL da imagem de capa
   - `videoDuration`: Duração em segundos (validação)
