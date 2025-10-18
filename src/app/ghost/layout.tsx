import { getCurrentUser } from "@/app/actions/auth";
import { GhostSidebar } from "@/components/ghost-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function GhostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Si l'utilisateur n'est pas connecté, ne pas afficher la sidebar
  // (la page de login gère sa propre redirection)
  if (!user) {
    return <>{children}</>;
  }

  // Si l'utilisateur est connecté, afficher la sidebar
  return (
    <SidebarProvider>
      <GhostSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <span className="font-semibold">Dashboard Ghost</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

