import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MaintenanceContent from "./MaintenanceContent";

export default function MaintenancePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 text-center rounded-xl border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold text-muted-foreground">Loading maintenance logs...</p>
      </div>
    }>
      <MaintenanceContent />
    </Suspense>
  );
}