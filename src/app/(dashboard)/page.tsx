import { Suspense } from "react";
import { 
  PlusCircle, 
  ChevronRight, 
  ShieldCheck, 
  Wrench, 
  Users
} from "lucide-react";
import Link from "next/link";
import { WelcomeBanner } from "@/components/layout/welcome-banner";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { InfrastructureHealth } from "@/components/dashboard/infrastructure-health";
import { 
  StatsCardsSkeleton, 
  AlertSectionSkeleton, 
  InfrastructureHealthSkeleton, 
  RecentActivitySkeleton 
} from "@/components/dashboard/stats-skeleton";
import { getRecentActivityAction } from "@/app/actions/dashboard";

export const dynamic = 'force-dynamic';

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

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner - Static, appears immediately */}
      <WelcomeBanner />

      {/* Alerts Section - Loads asynchronously */}
      <Suspense fallback={<AlertSectionSkeleton />}>
        <DashboardAlerts />
      </Suspense>

      {/* Stats Cards - Loads asynchronously */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Three Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions - Static, appears immediately */}
        <div className="lg:col-span-2 space-y-4">
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

        {/* Infrastructure Health - Loads asynchronously */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Infrastructure Health</h2>
          <Suspense fallback={<InfrastructureHealthSkeleton />}>
            <InfrastructureHealth />
          </Suspense>
        </div>
      </div>

      {/* Recent Activity Section - Loads asynchronously */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          <p className="text-xs text-muted-foreground font-medium">Last 8 updates</p>
        </div>
        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivityWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function RecentActivityWrapper() {
  const recentActivityResponse = await getRecentActivityAction(8);
  const recentActivity = recentActivityResponse.success ? recentActivityResponse.data : [];
  return <RecentActivity activities={recentActivity} />;
}
