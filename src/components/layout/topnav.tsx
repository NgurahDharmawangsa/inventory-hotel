"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { navItems } from "@/constants/nav-items";

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

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              IT
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">IT Admin</span>
            <span className="text-[11px] text-muted-foreground">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
