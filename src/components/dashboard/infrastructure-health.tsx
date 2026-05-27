import { TrendingUp, Activity } from "lucide-react";
import { getDashboardStatsAction } from "@/app/actions/dashboard";

export async function InfrastructureHealth() {
  const statsResponse = await getDashboardStatsAction();
  const stats = statsResponse.success ? statsResponse.data : null;

  // Calculate network uptime percentage
  const networkUptime = stats?.networking.total 
    ? ((stats.networking.online / stats.networking.total) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Health Indicator */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            System Status: {stats?.networking.offline === 0 ? 'Excellent' : 'Good'}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {stats?.networking.online || 0} of {stats?.networking.total || 0} nodes operational
          </p>
        </div>
      </div>

      {/* Micro indicators */}
      <div className="space-y-4 pt-2 border-t border-border">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#c9a342]" />
            Monthly Budget Used
          </span>
          <span className="text-foreground">{stats?.budget.percentageUsed || 0}%</span>
        </div>
        <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden relative">
          <div 
            className="bg-[#c9a342] h-full rounded-full transition-all" 
            style={{ width: `${Math.min(stats?.budget.percentageUsed || 0, 100)}%` }} 
          />
          {/* Shimmer pulse stream overlay */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent h-full animate-shimmer" />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            Network Uptime
          </span>
          <span className="text-foreground">{networkUptime}%</span>
        </div>
        <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden relative">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all" 
            style={{ width: `${networkUptime}%` }} 
          />
          {/* Shimmer pulse stream overlay */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent h-full animate-shimmer" />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="pt-2 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Active Staff</span>
          <span className="text-foreground font-semibold">{stats?.staff.active || 0}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Pending Maintenance</span>
          <span className="text-foreground font-semibold">{stats?.maintenance.pending || 0}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Budget Remaining</span>
          <span className="text-foreground font-semibold">
            ${(stats?.budget.remaining || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}