import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';

const API_URL = import.meta.env.VITE_IA_URL;
const STORAGE_KEY = 'ia-sensei-chat-history';
const MAX_MESSAGES = 15; // Máximo de 15 interações (30 mensagens no total)
const MESSAGE_PATH_ENV = import.meta.env.VITE_IA_MESSAGE_PATH; // ex: data.content ou choices.0.message.content
const DEBUG_IA = String(import.meta.env.VITE_IA_DEBUG || '').toLowerCase() === 'true';

// Helper para acessar propriedades por caminho (com suporte a índices numéricos)
function getByPath(obj, path) {
  try {
    if (!obj || !path) return undefined;
    const segs = String(path).split('.');
    let cur = obj;
    for (let s of segs) {
      if (s === '') continue;
      if (/^\d+$/.test(s)) {
        const idx = Number(s);
        cur = Array.isArray(cur) ? cur[idx] : undefined;
      } else {
        cur = cur?.[s];
      }
      if (cur === undefined || cur === null) break;
    }
    return cur;
  } catch (_) {
    return undefined;
  }
}

// Caminhos ordenados por prioridade para extrair texto de respostas JSON conhecidas
const ORDERED_PATHS = [
  'choices.0.message.content',
  'choices.0.text',
  'content',
  'text',
  'output',
  'result',
  'response',
  'resposta',
  'message',
  'data.choices.0.message.content',
  'data.choices.0.text',
  'data.content',
  'data.text',
  'data.output',
  'data.result',
  'data.response',
  'data.resposta',
  'data.message',
];

/**
 * Hook para gerenciar o chat da IA Sensei
 * Inclui gerenciamento do localStorage, histórico de mensagens e integração com API
 */
export const useIASensei = () => {
  const { user } = useUser();
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Log simples das interações (para depuração)
  const logApiInteracao = useCallback((entrada) => {
    try {
      const key = 'ia-sensei-api-log';
      const atual = JSON.parse(localStorage.getItem(key) || '[]');
      const novo = [...atual, entrada].slice(-20); // manter últimas 20
      localStorage.setItem(key, JSON.stringify(novo));
      localStorage.setItem('ia-sensei-last-api', JSON.stringify(entrada));
    } catch (_) {}
  }, []);

  // Carrega o histórico salvo
  const carregarHistorico = useCallback(() => {
    try {
      const historicoSalvo = localStorage.getItem(STORAGE_KEY);
      if (historicoSalvo) {
        const mensagensSalvas = JSON.parse(historicoSalvo);
        setMensagens(mensagensSalvas);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico do chat:', error);
    }
  }, []);

  // Salva o histórico no localStorage
  const salvarHistorico = useCallback((mensagensParaSalvar) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mensagensParaSalvar));
    } catch (error) {
      console.error('Erro ao salvar histórico do chat:', error);
    }
  }, []);

  // Adiciona uma mensagem ao histórico com anti-duplicação e limite
  const adicionarMensagem = useCallback(
    (mensagem) => {
      setMensagens((mensagensAtuais) => {
        const novaEntrada = {
          ...mensagem,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
        };

        const ultima = mensagensAtuais[mensagensAtuais.length - 1];
        const ehDuplicadoConsecutivo =
          ultima && ultima.tipo === 'ia' && mensagem.tipo === 'ia' && ultima.conteudo === mensagem.conteudo;
        const base = ehDuplicadoConsecutivo ? mensagensAtuais.slice(0, -1) : mensagensAtuais;

        let novasMensagens = [...base, novaEntrada];
        if (novasMensagens.length > MAX_MESSAGES * 2) {
          const excesso = novasMensagens.length - MAX_MESSAGES * 2;
          novasMensagens = novasMensagens.slice(excesso);
        }

        salvarHistorico(novasMensagens);
        return novasMensagens;
      });
    },
    [salvarHistorico]
  );

  // Extrai o texto de uma resposta JSON (quando não é texto puro)
  const extrairTextoResposta = useCallback((data) => {
    if (!data || typeof data !== 'object') return { primary: '', alternatives: [], source: 'json' };

    // Se existir caminho definido via env, tentar primeiro
    if (MESSAGE_PATH_ENV) {
      const val = getByPath(data, MESSAGE_PATH_ENV);
      const str = val == null ? '' : String(val).trim();
      if (str) return { primary: str, alternatives: [], source: `json:${MESSAGE_PATH_ENV}` };
    }

    const alternativas = [];
    for (const p of ORDERED_PATHS) {
      const v = getByPath(data, p);
      if (v != null) {
        const s = String(v).trim();
        if (s && !alternativas.includes(s)) alternativas.push(s);
      }
    }

    const primary = alternativas[0] || '';
    return { primary, alternatives: alternativas.slice(1), source: primary ? 'json:auto' : 'json' };
  }, []);

  // Envia mensagem ao backend e processa resposta (texto puro por padrão)
  const enviarMensagem = useCallback(
    async (mensagemUsuario, dadosUsuario) => {
      if (!user?.bjj_id) {
        setErro('Usuário não autenticado');
        return null;
      }

      if (!mensagemUsuario?.trim()) {
        setErro('Mensagem não pode estar vazia');
        return null;
      }

      setCarregando(true);
      setErro(null);

      // Mensagem do usuário
      adicionarMensagem({ tipo: 'usuario', conteudo: mensagemUsuario, autor: 'Você' });

      const reqId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            dados_user: dadosUsuario,
            bjj_id: user.bjj_id,
            mensagem_user: mensagemUsuario,
            req_id: reqId,
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        const rawBody = await response.text();

        // Log da interação (sempre guarda o corpo bruto)
        logApiInteracao({
          reqId,
          at: new Date().toISOString(),
          status: response.status,
          request: { mensagem_user: mensagemUsuario, bjj_id: user.bjj_id },
          response: rawBody,
          contentType,
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        let conteudoIA = '';
        let source = 'text';

        // Se aparenta ser JSON, tentar extrair; senão, usar texto puro
        let parsed = null;
        const rawTrimmed = (rawBody || '').trim();
        if (rawTrimmed.startsWith('{') || rawTrimmed.startsWith('[')) {
          try {
            parsed = JSON.parse(rawTrimmed);
          } catch (_) {
            parsed = null;
          }
        }

        if (parsed && typeof parsed === 'object') {
          const { primary, alternatives, source: src } = extrairTextoResposta(parsed);
          conteudoIA = primary || '';
          source = src || 'json';

          if (!conteudoIA) {
            conteudoIA = rawTrimmed; // fallback para o bruto caso a extração falhe
            source = 'text';
          } else {
            // Evitar repetir exatamente o último texto de IA
            const ultimoIa = [...mensagens].reverse().find((m) => m.tipo === 'ia');
            if (ultimoIa && ultimoIa.conteudo === conteudoIA && alternatives?.length) {
              const alternativo = alternatives.find((a) => a !== conteudoIA);
              if (alternativo) conteudoIA = alternativo;
            }
          }
        } else {
          conteudoIA = rawTrimmed;
          source = 'text';
        }

        if (!conteudoIA) {
          throw new Error('Resposta vazia da API');
        }

        adicionarMensagem({ tipo: 'ia', conteudo: conteudoIA, autor: 'IA Sensei', meta: { source } });
        return conteudoIA;
      } catch (error) {
        console.error('Erro ao enviar mensagem para IA:', error);
        const mensagemErro =
          'Estamos com dificuldades em estabelecer conexão no momento. Tente novamente em alguns minutos.';
        setErro(mensagemErro);
        adicionarMensagem({ tipo: 'erro', conteudo: mensagemErro, autor: 'Sistema' });
        return null;
      } finally {
        setCarregando(false);
      }
    },
    [user, adicionarMensagem, extrairTextoResposta, logApiInteracao, mensagens]
  );

  // Limpa histórico
  const limparHistorico = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMensagens([]);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }, []);

  // Conta interações (aproximação: 1 interação ~ 2 mensagens)
  const contarInteracoes = useCallback(() => {
    return Math.floor(mensagens.length / 2);
  }, [mensagens]);

  // Carregamento inicial do histórico
  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  return {
    mensagens,
    carregando,
    erro,
    enviarMensagem,
    limparHistorico,
    contarInteracoes: contarInteracoes(),
    adicionarMensagem,
  };
};