import {
  LayoutDashboard,
  Monitor,
  Code2,
  Network,
  Shield,
  Hotel,
  Wrench,
  Wallet,
  Users,
  Database,
  Building2,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Master Data",
    href: "/master-data",
    icon: Database,
  },
  {
    label: "Hardware",
    href: "/hardware",
    icon: Monitor,
  },
  {
    label: "Software",
    href: "/software",
    icon: Code2,
  },
  {
    label: "Networking",
    href: "/networking",
    icon: Network,
  },
  {
    label: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    label: "Budget",
    href: "/budget",
    icon: Wallet,
  },
  {
    label: "Staff",
    href: "/staff",
    icon: Users,
  },
  {
    label: "Vendors",
    href: "/vendors",
    icon: Building2,
  },
  {
    label: "Email Management",
    href: "/emails",
    icon: Mail,
  },
];
