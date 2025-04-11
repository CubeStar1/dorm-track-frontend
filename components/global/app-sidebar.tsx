"use client"

import { 
  LayoutDashboard,
  BedDouble,
  Building2,
  Wrench,
  UtensilsCrossed,
  Calendar,
  Users,
  Settings,
  Shirt,
  ShoppingBag,
  Bell,
  User,
  AlertTriangle,
  School,
  Home
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSection } from "@/components/navigation/nav-section"
import Link from "next/link"
import { NavProfile } from "@/components/navigation/nav-profile"
import useUser from "@/hooks/use-user"

const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of your hostel life",
      },
    ]
  },
  {
    label: "Hostel Activities",
    items: [
      {
        title: "My Room",
        href: "/my-room",
        icon: BedDouble,
        description: "Browse and manage rooms",
      },
      {
        title: "Room Booking",
        href: "/rooms",
        icon: BedDouble,
        description: "Browse and manage rooms",
      },
      {
        title: "Maintenance",
        href: "/maintenance",
        icon: Wrench,
        description: "Maintenance requests",
      },
      {
        title: "Complaints",
        href: "/complaints",
        icon: AlertTriangle,
        description: "View and manage complaints",
      },
      {
        title: "Mess Menu",
        href: "/mess",
        icon: UtensilsCrossed,
        description: "Mess menu and feedback",
      },
      {
        title: "Events",
        href: "/events",
        icon: Calendar,
        description: "Hostel events and activities",
      },
      {
        title: "Laundry",
        href: "/laundry",
        icon: Shirt,
        description: "Laundry services",
      },
      {
        title: "Marketplace",
        href: "/marketplace",
        icon: ShoppingBag,
        description: "Buy and sell items",
      },
    ]
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        href: "/profile",
        icon: User,
        description: "Manage your profile",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Account settings",
      },
    ]
  }
]

export function AppSidebar() {
  const { data: user } = useUser();

  return (
    <Sidebar className="">
      <SidebarHeader>
        <div className="relative border-b border-border/10 bg-gradient-to-br from-background/90 via-background/50 to-background/90 px-6 py-5 backdrop-blur-xl">
          <Link href="/" className="relative flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-lg ring-2 ring-blue-500/20 dark:from-blue-500 dark:via-indigo-500 dark:to-violet-500">
              <Building2 className="h-5 w-5 text-white shadow-sm" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                DormTrack
              </h1>
              <p className="text-sm text-muted-foreground">
                Hostel Management
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-background/80 to-background/20 dark:from-background/60 dark:to-background/0">
        <div className="space-y-6 py-4">
          {navigationGroups.map((group, index) => (
            <div key={index} className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
      <SidebarRail className="" />
      <SidebarFooter className="border-t border-border/20 bg-gradient-to-t from-background/90 to-background/40 px-6 py-3 backdrop-blur-xl dark:from-background/80 dark:to-background/20">
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
} 