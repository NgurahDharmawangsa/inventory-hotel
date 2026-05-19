import { 
  Laptop, 
  Key, 
  Wifi, 
  Wrench, 
  DollarSign, 
  PlusCircle, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Users 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WelcomeBanner } from "@/components/layout/welcome-banner";

export default function DashboardHome() {
  const stats = [
    {
      title: "Hardware Assets",
      value: "248",
      subtext: "12 assigned this month",
      icon: Laptop,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/hardware"
    },
    {
      title: "Software Licenses",
      value: "42",
      subtext: "3 expiring in 30 days",
      icon: Key,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/software"
    },
    {
      title: "Network Devices",
      value: "36",
      subtext: "All nodes operational",
      icon: Wifi,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/networking"
    },
    {
      title: "Active Maintenance",
      value: "8",
      subtext: "3 high priority tasks",
      icon: Wrench,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/maintenance"
    }
  ];

  const quickActions = [
    {
      title: "Add New Asset",
      description: "Register new hardware to inventory",
      href: "/hardware?action=new",
      icon: PlusCircle
    },
    {
      title: "Track License Keys",
      description: "Manage active keys and expirations",
      href: "/software",
      icon: ShieldCheck
    },
    {
      title: "Log Support Ticket",
      description: "Create a new maintenance record",
      href: "/maintenance?action=new",
      icon: Wrench
    },
    {
      title: "Staff Accounts",
      description: "Manage registered IT support staff",
      href: "/staff",
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="group block relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#c9a342]/20 hover:-translate-y-1">
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

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Quick Management Actions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={i} href={action.href} className="group block relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-md hover:border-[#c9a342]/20 hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgba(201,163,66,0.01)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="flex items-start gap-4 p-4 relative z-10">
                    <div className="mt-0.5 p-2 rounded-lg bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-[#c9a342] group-hover:text-[#0a0d14] group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1 transition-colors group-hover:text-[#c9a342]">
                        {action.title}
                        <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#c9a342]" />
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Budget & Health Status Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Infrastructure Health</h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            {/* Health Indicator */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">System Status: Excellent</p>
                <p className="text-xs text-muted-foreground font-medium">All critical nodes operational</p>
              </div>
            </div>

            {/* Micro indicators */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#c9a342]" />
                  Monthly Budget Used
                </span>
                <span className="text-foreground">72%</span>
              </div>
              <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden relative">
                <div className="bg-[#c9a342] h-full rounded-full transition-all" style={{ width: "72%" }} />
                {/* Shimmer pulse stream overlay */}
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent h-full animate-shimmer" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  Network Uptime
                </span>
                <span className="text-foreground">99.98%</span>
              </div>
              <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden relative">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: "99.98%" }} />
                {/* Shimmer pulse stream overlay */}
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent h-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
