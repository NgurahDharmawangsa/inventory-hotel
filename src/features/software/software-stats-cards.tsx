"use client";

import * as React from "react";
import { SoftwareWithRelations } from "@/repositories/software.repository";
import { getDaysRemaining } from "@/utils/date";
import { Key, ShieldCheck, AlertTriangle, Clock, Infinity } from "lucide-react";

interface SoftwareStatsCardsProps {
  items: SoftwareWithRelations[];
}

export function SoftwareStatsCards({ items }: SoftwareStatsCardsProps) {
  const stats = React.useMemo(() => {
    const total = items.length;
    let active = 0;
    let expiringSoon = 0;
    let expired = 0;
    let lifetime = 0;

    for (const item of items) {
      if (!item.expiration_date) {
        lifetime++;
        active++;
        continue;
      }
      const days = getDaysRemaining(item.expiration_date);
      if (days === null) {
        lifetime++;
        active++;
      } else if (days < 0) {
        expired++;
      } else if (days <= 30) {
        expiringSoon++;
      } else {
        active++;
      }
    }

    return { total, active, expiringSoon, expired, lifetime };
  }, [items]);

  const cards = [
    {
      title: "Total Licenses",
      value: stats.total,
      icon: Key,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      subtext: "Registered licenses",
    },
    {
      title: "Active",
      value: stats.active,
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      subtext: `${stats.lifetime} lifetime included`,
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      subtext: "≤ 30 days remaining",
      alert: stats.expiringSoon > 0,
    },
    {
      title: "Expired",
      value: stats.expired,
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      subtext: "Past expiration date",
      alert: stats.expired > 0,
    },
    {
      title: "Lifetime",
      value: stats.lifetime,
      icon: Infinity,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      subtext: "No expiration set",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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