"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Package as PackageIcon,
  ChartBar as ChartBarIcon,
  Faders as FadersIcon,
  ShoppingCartSimple as ShoppingCartSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const ADMIN_PATH = "/admin";

const ADMIN_NAV = [
  { tab: "overview", label: "Overview", icon: ChartBarIcon },
  { tab: "orders", label: "Orders", icon: ShoppingCartSimpleIcon },
  { tab: "products", label: "Products", icon: PackageIcon },
] as const;

function getActiveAdminTab(
  pathname: string,
  searchParams: URLSearchParams | null
) {
  if (pathname !== ADMIN_PATH) return null;
  const tab = searchParams?.get("tab") ?? "overview";
  const known = ADMIN_NAV.find((entry) => entry.tab === tab);
  return known?.tab ?? "overview";
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getActiveAdminTab(pathname, searchParams);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = React.useCallback(() => {
    if (!isMobile) return;
    setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  return (
    <Sidebar className="border-r bg-background/95">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <FadersIcon className="size-5" weight="bold" />
          <span className="font-semibold">Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wide text-muted-foreground/80">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.tab;

                return (
                  <SidebarMenuItem key={item.tab}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      onClick={handleNavClick}
                    >
                      <Link href={`${ADMIN_PATH}?tab=${item.tab}`}>
                        <Icon className="size-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-4 py-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Brew Commerce
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
