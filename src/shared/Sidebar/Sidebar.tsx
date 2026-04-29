"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// MUI Icons
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { Roles } from "@/repository/auth/dto";
import { useLogout } from "@/repository/auth/query";
import React from "react";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface Navigation {
  roles?: Roles;
  navItems: NavItem[];
}

export interface SidebarProps {
  roles: Roles;
}

const navItems: Navigation[] = [
  {
    roles: "perawat",
    navItems: [
      {
        label: "Pindai Raga",
        href: "/pindai-raga",
        icon: <DocumentScannerOutlinedIcon fontSize="small" />,
      },
      {
        label: "Rekam Vital",
        href: "/rekam-vital",
        icon: <MonitorHeartOutlinedIcon fontSize="small" />,
      },
      {
        label: "Jurnal Jaga",
        href: "/jurnal-jaga",
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
      {
        label: "Kelola Obat",
        href: "/kelola-obat",
        icon: <MedicationOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    roles: "pengelola",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <DashboardOutlinedIcon fontSize="small" />,
      },
      {
        label: "Pusat Wreda",
        href: "/pusat-wreda",
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
      {
        label: "Pusat Pengurus",
        href: "/pusat-pengurus",
        icon: <MedicationOutlinedIcon fontSize="small" />,
      },
      {
        label: "Code Generator",
        href: "/code-generator",
        icon: <QrCode2OutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    roles: "keluarga",
    navItems: [
      {
        label: "Memori tamu",
        href: "/memori-tamu",
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    roles: "superadmin",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <DashboardOutlinedIcon fontSize="small" />,
      },
      {
        label: "Pusat Wreda",
        href: "/pusat-wreda",
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
      {
        label: "Pusat Pengurus",
        href: "/pusat-pengurus",
        icon: <MedicationOutlinedIcon fontSize="small" />,
      },
      {
        label: "Pindai Raga",
        href: "/pindai-raga",
        icon: <DocumentScannerOutlinedIcon fontSize="small" />,
      },
      {
        label: "Rekam Vital",
        href: "/rekam-vital",
        icon: <MonitorHeartOutlinedIcon fontSize="small" />,
      },
      {
        label: "Jurnal Jaga",
        href: "/jurnal-jaga",
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
      {
        label: "Kelola Obat",
        href: "/kelola-obat",
        icon: <MedicationOutlinedIcon fontSize="small" />,
      },
      {
        label: "Memori tamu",
        href: "/memori-tamu",
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
      {
        label: "Code Generator",
        href: "/code-generator",
        icon: <QrCode2OutlinedIcon fontSize="small" />,
      },
    ],
  },
];

export const Sidebar = ({ roles }: SidebarProps) => {
  const pathname = usePathname();
  const logout = useLogout();

  const currentNav = navItems.find((nav) => nav.roles === roles);
  if (!currentNav) return null;
  const items = currentNav.navItems ?? [];

  const handleSignOut = () => {
    logout.mutate();
  };

  const error = logout.error instanceof Error ? logout.error.message : null;

  return (
    <aside className="flex flex-col w-[288px] min-h-screen h-full shrink-0 bg-surface-container-low border-r border-outline-variant">
      {/* Header / Brand */}
      <div className="flex flex-col items-center justify-center px-6 pt-8 pb-6 gap-3">
        <div className="w-20 h-20 bg-surface-variant flex items-center justify-center rounded-xl overflow-hidden">
          <Image
            src="/Icon.png"
            alt="Goldencare Icon"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-center flex-col ">
          <strong className="block text-base font-bold font-headline text-primary leading-tight">
            Goldencare
          </strong>
          <p className="text-sm text-on-surface-variant font-normal font-body leading-normal">
            Care Management
          </p>
        </div>
      </div>

      {/* Emergency Alert Button */}
      <div className="px-4 pb-4">
        <button className="w-full flex items-center justify-center gap-2 bg-error text-on-error rounded-full py-3 px-4 font-semibold text-sm font-body transition-opacity hover:opacity-90 active:opacity-80">
          <NotificationsActiveOutlinedIcon fontSize="small" />
          Emergency Alert
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium font-body transition-colors
                ${
                  isActive
                    ? "bg-surface-container text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container"
                }
              `}
            >
              <span
                className={`flex items-center ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Bottom Actions */}
      <div className="flex flex-col gap-1 px-3 pb-6 mt-4">
        <button className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium font-body text-on-surface-variant hover:bg-surface-container transition-colors w-full text-left">
          <HelpOutlineOutlinedIcon fontSize="small" />
          Help Center
        </button>
        <button
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium font-body text-on-surface-variant hover:bg-surface-container transition-colors w-full text-left cursor-pointer"
          disabled={logout.isPending}
          onClick={handleSignOut}
        >
          <LogoutOutlinedIcon fontSize="small" />
          {logout.isPending ? "Signing out..." : "Sign Out"}
        </button>
        {error && <p className="text-xs text-error font-body -mt-1">{error}</p>}
      </div>
    </aside>
  );
};
