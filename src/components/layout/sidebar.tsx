"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants/nav-items";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      {/* Classic Hotel-IT Logo / Brand */}
      <div className="flex flex-col px-6 py-6">
        {/* Stars Luxury Badge */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[rgba(201,163,66,0.15)] border border-[rgba(201,163,66,0.3)] px-2.5 py-1 mb-3 shadow-xs">

          <span className="font-mono text-[9px] font-extrabold text-[#e8c05a] tracking-widest uppercase leading-none">IT DEPT.</span>
        </div>

        {/* Hotel Name */}
        <h2 className="font-heading font-black text-[15px] text-foreground tracking-wider leading-tight uppercase">
          The Sankara
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground/60 tracking-widest uppercase font-semibold mt-0.5">
          Suites & Villas
        </span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <div className="px-4 mb-2 text-[9px] font-extrabold tracking-widest uppercase text-muted-foreground/45 font-mono">
          MENU UTAMA
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 border-l-2 border-transparent",
                isActive
                  ? "bg-[rgba(201,163,66,0.15)] text-[#e8c05a] border-l-[#c9a342] shadow-sm"
                  : "text-muted-foreground hover:bg-[rgba(201,163,66,0.06)] hover:text-foreground hover:border-l-muted-foreground/30"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[#c9a342]" : "text-muted-foreground/75")} />
              <span className={isActive ? "font-bold text-[#e8c05a]" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Classic Sidebar Footer Meta */}
      <div className="px-6 py-4 bg-[#0a0d14]/40">
        <div className="font-mono text-[9.5px] leading-relaxed text-muted-foreground/50">
          <div>IT Mgr: <span className="text-foreground/80 font-bold">Ngurah Dharmawangsa</span></div>
          <div>Rooms: <span className="text-foreground/80 font-bold">29 unit</span></div>
          <div>Code: <span className="text-[#c9a342] font-extrabold font-mono">UBD-001</span></div>
        </div>
      </div>
    </aside>
  );
}
