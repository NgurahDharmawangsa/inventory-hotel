"use client";

import { Clock, Laptop, Key, Wrench } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  type: "hardware" | "software" | "maintenance";
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
};

const activityIcons = {
  hardware: Laptop,
  software: Key,
  maintenance: Wrench,
};

const activityColors = {
  hardware: "text-blue-500 bg-blue-500/10",
  software: "text-emerald-500 bg-emerald-500/10",
  maintenance: "text-amber-500 bg-amber-500/10",
};

const activityLinks = {
  hardware: "/hardware",
  software: "/software",
  maintenance: "/maintenance",
};

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground font-medium">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];
        const link = activityLinks[activity.type];
        
        return (
          <Link
            key={activity.id}
            href={link}
            className="group block p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorClass} transition-transform group-hover:scale-110`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-[#c9a342] transition-colors">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {activity.subtitle}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {formatDistanceToNow(new Date(activity.updated_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}