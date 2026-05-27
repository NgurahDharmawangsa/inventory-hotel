import { Laptop, Key, Wifi, Wrench } from "lucide-react";
import Link from "next/link";
import { getDashboardStatsAction } from "@/app/actions/dashboard";

export async function StatsCards() {
  const statsResponse = await getDashboardStatsAction();
  const stats = statsResponse.success ? statsResponse.data : null;

  const dashboardStats = [
    {
      title: "Hardware Assets",
      value: stats?.hardware.total.toString() || "0",
      subtext: `${stats?.hardware.recentlyAdded || 0} assigned this month`,
      icon: Laptop,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/hardware"
    },
    {
      title: "Software Licenses",
      value: stats?.software.total.toString() || "0",
      subtext: `${stats?.software.expiringSoon || 0} expiring in 30 days`,
      icon: Key,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/software",
      alert: (stats?.software.expiringSoon || 0) > 0
    },
    {
      title: "Network Devices",
      value: stats?.networking.total.toString() || "0",
      subtext: `${stats?.networking.online || 0} nodes operational`,
      icon: Wifi,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/networking"
    },
    {
      title: "Active Maintenance",
      value: stats?.maintenance.pending.toString() || "0",
      subtext: `${stats?.maintenance.highPriority || 0} high priority tasks`,
      icon: Wrench,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/maintenance",
      alert: (stats?.maintenance.highPriority || 0) > 0
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dashboardStats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Link 
            key={i} 
            href={stat.href} 
            className="group block relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#c9a342]/20 hover:-translate-y-1"
          >
            {/* Alert indicator */}
            {stat.alert && (
              <div className="absolute top-2 right-2 z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>
            )}
            
            {/* Gold gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,163,66,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">{stat.title}</span>
                <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-[#c9a342]">{stat.value}</h3>
                <p className="text-xs font-medium text-muted-foreground">{stat.subtext}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}