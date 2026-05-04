"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "@/lib/auth";

/* ─────────────────────────────────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────────────────────────────────── */
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DocumentsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SupportIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
