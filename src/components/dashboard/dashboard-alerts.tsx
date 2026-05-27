import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getExpiringSoftwareAction, getDashboardStatsAction } from "@/app/actions/dashboard";

export async function DashboardAlerts() {
  const [expiringSoftwareResponse, statsResponse] = await Promise.all([
    getExpiringSoftwareAction(30),
    getDashboardStatsAction(),
  ]);

  const expiringSoftware = expiringSoftwareResponse.success ? expiringSoftwareResponse.data : [];
  const stats = statsResponse.success ? statsResponse.data : null;

  return (
    <>
      {expiringSoftware.length > 0 && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500 font-semibold">
            Software License Expiration Alert
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {expiringSoftware.length} software license{expiringSoftware.length > 1 ? 's' : ''} expiring within 30 days.{' '}
            <Link href="/software" className="underline font-medium text-amber-500 hover:text-amber-600">
              View details
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {(stats?.software.expired ?? 0) > 0 && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <Clock className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-500 font-semibold">
            Expired Software Licenses
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {stats?.software.expired} software license{stats && stats.software.expired > 1 ? 's have' : ' has'} expired.{' '}
            <Link href="/software" className="underline font-medium text-red-500 hover:text-red-600">
              Renew now
            </Link>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}