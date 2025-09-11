import { useState, useEffect, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../ui/button';
import { getAuthToken } from '@/services/cookies/cookies';

// Criando um contexto global para o modal de experiência
const ExpContext = createContext();

// Hook personalizado para usar o contexto de experiência
export const useExp = () => {
  const context = useContext(ExpContext);
  if (!context) {
    throw new Error('useExp deve ser usado dentro de um ExpProvider');
  }
  return context;
};

/**
 * Componente modal para exibir a experiência ganhada pelo usuário
 */
const Exp = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expGanho, setExpGanho] = useState(0);
  const [descricao, setDescricao] = useState('');
  const { user } = useUser();
  
  // Previne fechar o modal com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Função que mostra o modal de experiência
  const mostrarExp = (exp, desc) => {
    setExpGanho(exp);
    setDescricao(desc);
    setIsOpen(true);
  };

  // Função que será implementada para enviar os dados para a API *****************
  const enviarExpParaAPI = () => {
    // TODO: Implementar chamada para API
    // Essa função deverá enviar o ID do usuário e a quantidade de exp ganha
    // Exemplo:
    /*
    const userId = user?.id;
    
    const enviarExp = async () => {
      try {
        const response = await fetch('URL_DA_API/experiencia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            expGanho,
          }),
        });
        
        const data = await response.json();
        console.log('Experiência registrada com sucesso:', data);
      } catch (error) {
        console.error('Erro ao registrar experiência:', error);
      }
    };
    
    enviarExp();
    */
    
    console.log('Enviando para API:', { token: getAuthToken(), expGanho });
  };

  const handleFechar = () => {
    // Chama a função para enviar os dados para a API
    enviarExpParaAPI();
    
    // Fecha o modal
    setIsOpen(false);
  };

  return (
    <>
      <ExpContext.Provider value={{ mostrarExp }}>
        {children}
      </ExpContext.Provider>
      
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => e.stopPropagation()} // Impede cliques passarem para elementos abaixo
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md p-6 mx-4 bg-gray-800 rounded-lg shadow-xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()} // Impede que cliques no modal fechem-no
            >
              {/* Removido botão X para evitar que o usuário feche o modal sem chamar a API */}
              
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 text-3xl font-bold text-center text-primary"
                >
                  PARABÉNS!
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    delay: 0.4,
                    duration: 0.6,
                    times: [0, 0.6, 1]
                  }}
                  className="flex items-center justify-center w-24 h-24 mb-4 text-white rounded-full bg-primary"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">+{expGanho}</span>
                    <span className="text-sm font-medium">EXP</span>
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6 text-lg text-center text-primary font-medium"
                >
                  {descricao}
                </motion.p>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="w-full"
                >
                  <Button 
                    onClick={handleFechar} 
                    className="w-full py-3 text-white transition-all bg-primary hover:bg-primary/80 text-lg font-bold shadow-md hover:shadow-lg"
                  >
                    Fechar e continuar
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Exp;
