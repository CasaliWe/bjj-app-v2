import React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CATEGORIAS_TAGS } from '@/services/observacoes/observacoesService.jsx';

/**
 * Componente de tag personalizada com cores diferentes
 * @param {Object} props - Propriedades do componente
 * @param {string} props.categoria - Valor da categoria/tag
 * @param {string} props.tamanho - Tamanho da tag ('normal' ou 'pequeno')
 */
export const TagBadge = ({ categoria, tamanho = "normal" }) => {
  const tagInfo = CATEGORIAS_TAGS.find(tag => tag.value === categoria) || {
    value: categoria,
    label: categoria,
    cor: "bg-gray-500 hover:bg-gray-600"
  };
  
  const tamanhoClasses = tamanho === "pequeno" 
    ? "text-xs py-0 px-2" 
    : "py-1";

  return (
    <Badge className={`${tagInfo.cor} text-white font-medium ${tamanhoClasses}`}>
      {tagInfo.label}
    </Badge>
  );
};

/**
 * Componente para exibir texto com opção de expandir
 * @param {Object} props - Propriedades do componente
 * @param {string} props.texto - Texto a ser exibido
 * @param {number} props.linhas - Número de linhas a mostrar antes de truncar
 */
export const TextoExpandivel = ({ texto, linhas = 3 }) => {
  const [expandido, setExpandido] = React.useState(false);
  const excedeLimite = texto.length > 150; // Verifica se o texto é longo o suficiente para precisar expandir
  
  return (
    <div>
      <p className={`text-sm ${!expandido && excedeLimite ? `line-clamp-${linhas}` : ''}`}>
        {texto}
      </p>
      {excedeLimite && (
        <button 
          className="text-xs text-muted-foreground hover:text-primary mt-1 hover:underline"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Mostrar menos" : "Mostrar mais"}
        </button>
      )}
    </div>
  );
};

/**
 * Formatador de data
 * @param {string} dataString - String da data no formato ISO
 * @returns {string} Data formatada por extenso
 */
export const formatarData = (dataString) => {
  const data = new Date(dataString);
  return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

/**
 * Formatador de data curta
 * @param {string} dataString - String da data no formato ISO
 * @returns {string} Data formatada de forma abreviada
 */
export const formatarDataCurta = (dataString) => {
  const data = new Date(dataString);
  return format(data, "dd 'de' MMM 'às' HH:mm", { locale: ptBR });
};
