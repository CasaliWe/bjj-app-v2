// Arquivo para administrar as preferências do PWA
const PWA_STORAGE_KEY = 'bjj-app-pwa-status';
const PROMPT_DELAY_MS = 30000; // 30 segundos

export const getPwaStatus = () => {
  try {
    return JSON.parse(localStorage.getItem(PWA_STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
};

export const setPwaStatus = (status) => {
  try {
    const current = getPwaStatus();
    localStorage.setItem(PWA_STORAGE_KEY, JSON.stringify({
      ...current,
      ...status
    }));
  } catch (e) {
    console.error('Erro ao salvar status do PWA:', e);
  }
};

export const shouldShowInstallPrompt = () => {
  const status = getPwaStatus();
  
  // Se o usuário já recusou recentemente (nas últimas 24h)
  if (status.lastDismissed) {
    const hoursSinceDismiss = (Date.now() - status.lastDismissed) / (1000 * 60 * 60);
    if (hoursSinceDismiss < 24) {
      return false;
    }
  }
  
  // Se o app já foi instalado, não mostra prompt
  if (status.installed) {
    return false;
  }
  
  // Controle de quantas visitas o usuário fez antes de mostrar o prompt
  if (!status.visitCount) {
    setPwaStatus({ visitCount: 1, firstVisit: Date.now() });
    return false; // Não mostra na primeira visita
  } else {
    setPwaStatus({ visitCount: status.visitCount + 1 });
    
    // Mostra após a segunda visita
    return status.visitCount >= 2;
  }
};

export const markPromptDismissed = () => {
  setPwaStatus({
    lastDismissed: Date.now()
  });
};

export const markAppInstalled = () => {
  setPwaStatus({
    installed: true,
    installedAt: Date.now()
  });
};

export const getPromptDelay = () => PROMPT_DELAY_MS;
