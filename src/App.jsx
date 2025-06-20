// IMPORTAÇÕES
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { UpdateNotification } from "@/components/UpdateNotification";

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


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PWAInstallPrompt />
      <UpdateNotification />
      <Toaster />
      <Sonner />
      <BrowserRouter>        <Routes>
          <Route path="/" element={<LandingPage />} />          <Route path="/app" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-senha" element={<PasswordRecovery />} />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/suporte" element={<Support />} />
          <Route path="/sobre-nos" element={<AboutUs />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/perfil" element={<UserProfile />} />        <Route path="/ia-sensei" element={<IASensei />} />        <Route path="/tecnicas" element={<Tecnicas />} />
        <Route path="/treinos" element={<Treinos />} />        <Route path="/competicoes" element={<Competicoes />} />
        <Route path="/objetivos" element={<Objetivos />} />
        <Route path="/observacoes" element={<Observacoes />} />
        <Route path="/plano-de-jogo" element={<PlanoDeJogo />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/metricas" element={<Metricas />} />
        <Route path="/dojo-market" element={<DojoMarket />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/alongamentos" element={<Alongamentos />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
