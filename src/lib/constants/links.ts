import {
  Bell,
  Heart,
  Home,
  type LucideIcon,
  Megaphone,
  Search,
  User,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const userLinks: NavItem[] = [
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/shoutouts", label: "Shoutouts", icon: Megaphone },
  { href: "/notification", label: "Alerts", icon: Bell },
  { href: "/profile/me", label: "Profile", icon: User },
];

export const adminLinks: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Users", icon: User },
];
