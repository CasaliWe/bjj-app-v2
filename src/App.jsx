// IMPORTAÇÕES
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import TitleUpdater from "@/components/TitleUpdater";
import { getAuthToken, removeAuthToken } from "./services/cookies/cookies";
import Exp from "./components/exp/Exp";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// CONTEXTS
import { UserProvider } from "./contexts/UserContext";

// REACT QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// PAGES
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Support from "./pages/Support";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import UserPage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import IASensei from "./pages/IASensei";
import Tecnicas from "./pages/Tecnicas";
import Treinos from "./pages/Treinos";
import Competicoes from "./pages/Competicoes";
import Observacoes from "./pages/Observacoes";
import PlanoDeJogo from "./pages/PlanoDeJogo";
import Checklist from "./pages/Checklist";
import Videos from "./pages/Videos";
import PesquisarUsuarios from "./pages/PesquisarUsuarios";
import TreinosCronometrados from "./pages/TreinosCronometrados";
import Aprender from "./pages/Aprender";
import Eventos from "./pages/Eventos";


const queryClient = new QueryClient();

// Componente para rotas privadas ****************
const PrivateRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const token = getAuthToken();
  const URL = import.meta.env.VITE_API_URL + 'endpoint/auth/verificar-token-valido.php';

  useEffect(() => {
    const validateToken = async () => {
      // Se não tem token, não está autenticado
      if (!token) {
        setIsAuth(false);
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if(data.success) {
          setIsAuth(data.success);
        }else{
          setIsAuth(data.success);
          removeAuthToken(); // Remove o token inválido
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        setIsAuth(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, URL]);

  // Exibir um indicador de carregamento enquanto verifica o token
  if (isValidating) {
    return <LoadingSpinner message="Verificando autenticação..." fullScreen={true} />;
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver autenticado, permite o acesso à rota
  return children;
};

// Componente para rotas públicas que usuários logados não devem acessar ****************
const AuthRedirectRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const token = getAuthToken();
  const URL = import.meta.env.VITE_API_URL + 'endpoint/auth/verificar-token-valido.php';

  useEffect(() => {
    const validateToken = async () => {
      // Se não tem token, não está autenticado
      if (!token) {
        setIsAuth(false);
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if(data.success) {
          setIsAuth(data.success);
        }else{
          setIsAuth(data.success);
          removeAuthToken(); // Remove o token inválido
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        setIsAuth(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, URL]);

  // Exibir um indicador de carregamento enquanto verifica o token
  if (isValidating) {
    return <LoadingSpinner message="Verificando autenticação..." fullScreen={true} />;
  }
  
  // Se estiver autenticado, redireciona para a página principal da aplicação
  if (isAuth) {
    return <Navigate to="/app" replace />;
  }
  
  // Se não estiver autenticado, permite o acesso à rota pública
  return children;
};

// Componente simples para rastrear rotas para Google Analytics
const Analytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (window.gtag) {
      // Envia evento de page_view para cada mudança de rota
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Analytics />
      <UserProvider>
        <Exp>
          <TooltipProvider>
            <PWAInstallPrompt />
            <Toaster />
            <Sonner />      
            <TitleUpdater />
            <Routes>
              {/* Rotas privadas - Requerem autenticação */}
              <Route path="/app" element={<PrivateRoute><Index /></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
              <Route path="/tecnicas" element={<PrivateRoute><Tecnicas /></PrivateRoute>} />
              <Route path="/treinos" element={<PrivateRoute><Treinos /></PrivateRoute>} />
              <Route path="/competicoes" element={<PrivateRoute><Competicoes /></PrivateRoute>} />
              <Route path="/observacoes" element={<PrivateRoute><Observacoes /></PrivateRoute>} />
              <Route path="/pesquisar-usuarios" element={<PrivateRoute><PesquisarUsuarios /></PrivateRoute>} />
              <Route path="/plano-de-jogo" element={<PrivateRoute><PlanoDeJogo /></PrivateRoute>} />
              <Route path="/checklist" element={<PrivateRoute><Checklist /></PrivateRoute>} />
              <Route path="/treinos-cronometrados" element={<PrivateRoute><TreinosCronometrados /></PrivateRoute>} />
              <Route path="/aprender" element={<PrivateRoute><Aprender /></PrivateRoute>} />
              <Route path="/videos" element={<PrivateRoute><Videos /></PrivateRoute>} />
              <Route path="/eventos" element={<PrivateRoute><Eventos /></PrivateRoute>} />
              <Route path="/usuario" element={<PrivateRoute><UserPage /></PrivateRoute>} />
              <Route path="/ia-sensei" element={<PrivateRoute><IASensei /></PrivateRoute>} />
            
            {/* Rotas públicas com redirecionamento para usuários autenticados */}
            <Route path="/login" element={<AuthRedirectRoute><Login /></AuthRedirectRoute>} />
            <Route path="/register" element={<AuthRedirectRoute><Register /></AuthRedirectRoute>} />
            <Route path="/recuperar-senha" element={<AuthRedirectRoute><PasswordRecovery /></AuthRedirectRoute>} />
            
            {/* Rotas públicas que podem ser acessadas por todos */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/suporte" element={<Support />} />
            <Route path="/sobre-nos" element={<AboutUs />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </TooltipProvider>
        </Exp>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
