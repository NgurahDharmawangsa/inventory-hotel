"use client";

import * as React from "react";
import { SecurityWithRelations } from "@/repositories/security.repository";
import { Shield, ShieldCheck, ShieldAlert, Settings } from "lucide-react";

interface SecurityStatsCardsProps {
  items: SecurityWithRelations[];
}

export function SecurityStatsCards({ items }: SecurityStatsCardsProps) {
  const stats = React.useMemo(() => {
    const total = items.length;
    let online = 0;
    let offline = 0;
    let maintenance = 0;

    for (const item of items) {
      switch (item.status) {
        case "ONLINE":
          online++;
          break;
        case "OFFLINE":
          offline++;
          break;
        case "MAINTENANCE":
          maintenance++;
          break;
      }
    }

    return { total, online, offline, maintenance };
  }, [items]);

  const cards = [
    {
      title: "Total Devices",
      value: stats.total,
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      subtext: "Registered devices",
    },
    {
      title: "Online",
      value: stats.online,
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      subtext: "Active & operational",
    },
    {
      title: "Offline",
      value: stats.offline,
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      subtext: "Not responding",
      alert: stats.offline > 0,
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      icon: Settings,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      subtext: "Under maintenance",
      alert: stats.maintenance > 0,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#c9a342]/20 hover:-translate-y-0.5"
          >
            {/* Alert indicator */}
            {card.alert && (
              <div className="absolute top-2 right-2 z-10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              </div>
            )}

            {/* Gold gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,163,66,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.bg} ${card.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 space-y-0.5">
                <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-[#c9a342]">{card.value}</h3>
                <p className="text-[10px] font-medium text-muted-foreground">{card.subtext}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}