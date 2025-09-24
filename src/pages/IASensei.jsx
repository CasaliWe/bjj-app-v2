import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatInterface } from "@/components/ia-sensei/ChatInterface";

// hooks
import { useGetUser } from "@/hooks/use-getUser";

// Upgrade
import UpgradeModal from "@/components/upgrade/UpgradeModal";

const IASensei = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Hook para buscar dados do usuário
  const { fetchUserData } = useGetUser();

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Cabeçalho da página */}
          <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                I.A Sensei
              </h1>
            </div>
          </header>

          <MobileNav />
          
          <main className="flex-1 p-4 md:p-6 overflow-hidden pb-20 md:pb-6">
            <Card className="h-full flex flex-col">
              <CardContent className="flex-1 flex flex-col p-0">
                <ChatInterface />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Modal de upgrade para o plano Plus */}
      <UpgradeModal />

    </SidebarProvider>
  );
};

export default IASensei;
