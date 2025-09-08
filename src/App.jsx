// IMPORTAÇÕES
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import TitleUpdater from "@/components/TitleUpdater";
import { isAuthenticated } from "./services/cookies/cookies";

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
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import IASensei from "./pages/IASensei";
import Tecnicas from "./pages/Tecnicas";
import Treinos from "./pages/Treinos";
import Competicoes from "./pages/Competicoes";
import Objetivos from "./pages/Objetivos";
import Observacoes from "./pages/Observacoes";
import PlanoDeJogo from "./pages/PlanoDeJogo";
import Videos from "./pages/Videos";
import Noticias from "./pages/Noticias";
import Metricas from "./pages/Metricas";
import DojoMarket from "./pages/DojoMarket";
import Drills from "./pages/Drills";
import Alongamentos from "./pages/Alongamentos";


const queryClient = new QueryClient();

// Componente para rotas privadas ****************
const PrivateRoute = ({ children }) => {
  // Usa a função isAuthenticated do serviço de cookies
  const isAuth = isAuthenticated();
  
  // Se não estiver autenticado, redireciona para login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver autenticado, permite o acesso à rota
  return children;
};

// Componente para rotas públicas que usuários logados não devem acessar ****************
const AuthRedirectRoute = ({ children }) => {
  // Usa a função isAuthenticated do serviço de cookies
  const isAuth = isAuthenticated();
  
  // Se estiver autenticado, redireciona para a página principal da aplicação
  if (isAuth) {
    return <Navigate to="/app" replace />;
  }
  
  // Se não estiver autenticado, permite o acesso à rota pública
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
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

            {/* <Route path="/plano-de-jogo" element={<PlanoDeJogo />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/metricas" element={<Metricas />} />
            <Route path="/dojo-market" element={<DojoMarket />} />
            <Route path="/drills" element={<Drills />} />
            <Route path="/alongamentos" element={<Alongamentos />} />
            <Route path="/objetivos" element={<Objetivos />} />
            <Route path="/ia-sensei" element={<IASensei />} /> */}
          </Routes>
        </TooltipProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
