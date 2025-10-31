"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ListIcon,
  SunIcon,
  MoonIcon,
  PackageIcon,
  ChartBarIcon,
  SignOutIcon,
  FadersIcon,
  ShoppingCartSimpleIcon,
} from "@phosphor-icons/react";

import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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

function AdminNavLinks({
  activeTab,
  itemClassName,
  iconClassName,
}: {
  activeTab: string | null;
  itemClassName?: string;
  iconClassName?: string;
}) {
  return ADMIN_NAV.map((item) => {
    const Icon = item.icon;
    const active = activeTab === item.tab;
    return (
      <Link
        key={item.tab}
        href={`${ADMIN_PATH}?tab=${item.tab}`}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition",
          active ? "bg-muted font-medium" : "hover:bg-muted",
          itemClassName
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Icon className={cn("size-5", iconClassName)} />
          {item.label}
        </span>
      </Link>
    );
  });
}

function AdminHeaderTitle({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FadersIcon className="size-5" weight="bold" />
      <span className="font-semibold">Dashboard</span>
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = React.useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setDark((previous) => !previous)}
    >
      {dark ? <SunIcon size={24} /> : <MoonIcon size={24} />}
    </Button>
  );
}

function DesktopSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getActiveAdminTab(pathname, searchParams);

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
      <AdminHeaderTitle className="h-14 items-center border-b px-4" />
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="grid gap-1.5">
          <AdminNavLinks activeTab={activeTab} />
        </nav>
      </ScrollArea>
      <div className="border-t p-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Brew Commerce
      </div>
    </aside>
  );
}

function MobileSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getActiveAdminTab(pathname, searchParams);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <ListIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminHeaderTitle />
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-56px)] px-2 py-3">
          <nav className="grid gap-1.5">
            <AdminNavLinks activeTab={activeTab} iconClassName="size-4" />
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Topbar() {
  const { user, logout } = useAuth();
  const initials =
    user?.name?.slice(0, 2).toUpperCase() ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "AD";

  return (
    <div className="flex h-14 items-center gap-3 border-b bg-background px-3 lg:px-4">
      <MobileSidebar />
      <div className="ml-1 flex-1" />
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="size-7">
                {user?.profilePicture ? (
                  <AvatarImage
                    src={user.profilePicture}
                    alt={user.name ?? user.email ?? "Admin"}
                  />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {user?.name ?? "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="leading-tight">
              <div className="font-medium">{user?.name ?? "Administrator"}</div>
              <div className="text-xs text-muted-foreground">
                {user?.email ?? "admin@example.com"}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <SignOutIcon size={16} className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid min-h-screen grid-rows-[auto_1fr] bg-muted/20 text-foreground lg:grid-cols-[16rem_1fr] lg:grid-rows-[1fr]">
        <DesktopSidebar />
        <div className="flex min-w-0 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 overflow-x-hidden px-3 py-4 lg:px-6 lg:py-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin-login";

  return (
    <ToastProvider>
      <AuthProvider verifyOnMount={!isAdminLogin}>
        {isAdminLogin ? (
          <div className="min-h-screen">{children}</div>
        ) : (
          <AdminLayoutShell>{children}</AdminLayoutShell>
        )}
      </AuthProvider>
    </ToastProvider>
  );
}
