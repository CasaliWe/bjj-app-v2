/**
 * Utilitário para controlar Wake Lock API
 * Mantém a tela ativa quando necessário (cronômetros, etc.)
 */
class WakeLockManager {
  constructor() {
    this.wakeLock = null;
    this.isSupported = 'wakeLock' in navigator;
  }

  /**
   * Ativa o wake lock para manter a tela ligada
   */
  async ativar() {
    if (!this.isSupported) {
      console.warn('Wake Lock API não suportada neste navegador');
      return false;
    }

    try {
      // Se já existe um wake lock ativo, não criar outro
      if (this.wakeLock && !this.wakeLock.released) {
        return true;
      }

      this.wakeLock = await navigator.wakeLock.request('screen');
      
      // Listener para quando o wake lock for liberado
      this.wakeLock.addEventListener('release', () => {
        console.log('Wake lock foi liberado');
      });

      console.log('Wake lock ativado - tela permanecerá ativa');
      return true;
    } catch (error) {
      console.error('Erro ao ativar wake lock:', error);
      return false;
    }
  }

  /**
   * Desativa o wake lock
   */
  async desativar() {
    if (this.wakeLock && !this.wakeLock.released) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        console.log('Wake lock desativado');
        return true;
      } catch (error) {
        console.error('Erro ao desativar wake lock:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * Verifica se wake lock está ativo
   */
  isAtivo() {
    return this.wakeLock && !this.wakeLock.released;
  }

  /**
   * Verifica se a API é suportada
   */
  isSuportado() {
    return this.isSupported;
  }
}

// Instância singleton
const wakeLockManager = new WakeLockManager();

export default wakeLockManager;