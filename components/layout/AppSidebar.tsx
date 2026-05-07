"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";

import {
  LogoIcon,
  DashboardIcon,
  ChatIcon,
  CalendarIcon,
  DocumentsIcon,
  ProfileIcon,
  SettingsIcon,
  SupportIcon,
  LogoutIcon
} from "@/components/icons";

import { NEXT_PUBLIC_API_URL } from "@/env_varaible";

interface AppSidebarProps {
  activeItem?: 'conversations' | 'profile' | 'dashboard' | 'calendar' | 'documents' | 'settings' | 'support';
}

interface NavItemProps {
  id: string;
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: React.ReactNode;
  activeItem?: string;
}

const NavItem = ({ id, href, icon: Icon, label, badge, activeItem }: NavItemProps) => {
  const isActive = activeItem === id;

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 12px", borderRadius: "8px",
        backgroundColor: isActive ? "#0a0a0a" : "transparent",
        color: isActive ? "#ffffff" : "#6b7280",
        fontSize: "14px", fontWeight: isActive ? 600 : 500, cursor: "pointer"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Icon /> {label}
        </div>
        {badge && (
          <div style={{ backgroundColor: "#064e3b", color: "#34d399", fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "12px" }}>
            {badge}
          </div>
        )}
      </div>
    </Link>
  );
};

interface UserProfile {
  prenom: string;
  nom: string;
  role?: string;
}

export default function AppSidebar({ activeItem = 'conversations' }: AppSidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const baseUrl = NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/user/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user in sidebar:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  const fullName = user ? `${user.prenom} ${user.nom}` : "Jean Kamga";
  const initials = user && user.prenom && user.nom ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : "JK";
  const userRole = user?.role || "Directeur";

  return (
    <aside style={{ width: "260px", borderRight: "1px solid #f3f4f6", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
      {/* Logo Section */}
      <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #0070f3 0%, #0040a8 100%)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <LogoIcon />
        </div>
        <div>
          <h2 style={{ margin: 0, color: "#111827", fontSize: "16px", fontWeight: 700, lineHeight: 1.1 }}>Inov</h2>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            AI ASSISTANT
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ padding: "0 12px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Section: ESPACE */}
        <div>
          <p style={{ padding: "0 12px", margin: "0 0 8px", color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            ESPACE
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <NavItem id="dashboard" href="/dashboard" icon={DashboardIcon} label="Tableau de bord" activeItem={activeItem} />
            <NavItem id="conversations" href="/dashboard" icon={ChatIcon} label="Conversations" badge="12" activeItem={activeItem} />
            <NavItem id="calendar" href="/dashboard/calendrier" icon={CalendarIcon} label="Calendrier" activeItem={activeItem} />
            <NavItem id="documents" href="/dashboard" icon={DocumentsIcon} label="Documents" activeItem={activeItem} />
          </nav>
        </div>

        {/* Section: COMPTE */}
        <div>
          <p style={{ padding: "0 12px", margin: "0 0 8px", color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            COMPTE
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <NavItem id="profile" href="/dashboard/profile" icon={ProfileIcon} label="Mon profil" activeItem={activeItem} />
            <NavItem id="settings" href="/dashboard" icon={SettingsIcon} label="Paramètres" activeItem={activeItem} />
            <NavItem id="support" href="/dashboard" icon={SupportIcon} label="Aide & support" activeItem={activeItem} />
          </nav>
        </div>
      </div>

      {/* User Profile Footer */}
      <div style={{ padding: "16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "12px", fontWeight: 700 }}>
            {initials}
          </div>
          <div>
            <p style={{ margin: 0, color: "#111827", fontSize: "13px", fontWeight: 600 }}>{fullName}</p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "11px" }}>{userRole}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: "4px" }}>
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
