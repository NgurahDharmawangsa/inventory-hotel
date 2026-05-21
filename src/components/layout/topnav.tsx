"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { navItems } from "@/constants/nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useTransition } from "react";

// Helper: Get page title from current pathname
function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  const matched = navItems.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  );
  return matched?.label ?? "Dashboard";
}

export function TopNav() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [user, setUser] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const userEmail = user?.email || "admin@thesankarasuite.com";
  const userInitials = user?.email
    ? user.email.split("@")[0].substring(0, 2).toUpperCase()
    : "IT";
  const userName = user?.email ? user.email.split("@")[0] : "IT Admin";

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      {/* Mobile: Hamburger menu */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          }
        />
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-base font-extrabold text-foreground tracking-wide font-heading">{pageTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* User Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 outline-none cursor-pointer rounded-lg p-1.5 hover:bg-muted/40 transition-colors focus:ring-1 focus:ring-primary/20"
          >
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-sm font-medium text-foreground truncate max-w-[120px]">{userName}</span>
              <span className="text-[10px] text-muted-foreground">Administrator</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 bg-card border border-border rounded-lg shadow-lg">
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              My Profile
            </div>
            <div className="px-2 py-1 text-xs text-foreground/80 font-semibold break-all">
              {userEmail}
            </div>
            <DropdownMenuSeparator className="my-1.5 border-t border-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              variant="destructive"
              className="flex items-center gap-2 px-2.5 py-1.5 text-sm cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors w-full text-left"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isPending ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}