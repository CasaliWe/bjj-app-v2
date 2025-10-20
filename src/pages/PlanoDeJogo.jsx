import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Gamepad2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetUser } from "@/hooks/use-getUser";
import PlanoJogoContainer from "@/components/planoJogo/PlanoJogoContainer";
import TitleUpdater from "@/components/TitleUpdater";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

// Tutorial
import Tutorial from "@/components/ui/Tutorial";

const PlanoDeJogo = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SidebarProvider>
      <TitleUpdater title="Plano de Jogo" />
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Plano de Jogo</h1>
            </div>
            <Tutorial />
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 pb-32 md:pb-6 overflow-x-hidden">
            <PlanoJogoContainer />
          </main>
        </div>
      </div>

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

    </SidebarProvider>
  );
};

export default PlanoDeJogo;
