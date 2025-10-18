"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mountain,
  Mail,
  LogOut,
  Menu,
  Trophy,
} from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/app/actions/auth";

interface GhostSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    email?: string;
    id?: string;
  } | null;
}

const navigationItems = [
  {
    title: "Dashboard",
    url: "/ghost/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Utilisateurs",
    url: "/ghost/utilisateurs",
    icon: Users,
  },
  {
    title: "Randonnées",
    url: "/ghost/randonnees",
    icon: Mountain,
  },
  {
    title: "Trails",
    url: "/ghost/trail",
    icon: Trophy,
  },
  {
    title: "Messages",
    url: "/ghost/messages",
    icon: Mail,
    badge: "Bientôt",
  },
];

export function GhostSidebar({ user, ...props }: GhostSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/ghost/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Les Mornes Denisien
                  </span>
                  <span className="truncate text-xs">Dashboard Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2 p-2">
              {user?.email && (
                <div className="text-xs text-muted-foreground px-2 truncate">
                  {user.email}
                </div>
              )}
              <form action={logoutAdmin} className="w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </form>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

