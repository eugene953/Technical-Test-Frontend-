"use client";

import React, { useState, useEffect } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { getToken } from "@/lib/auth";

/* ─────────────────────────────────────────────────────────────────────────────
   Icons (SVG Inline)
───────────────────────────────────────────────────────────────────────────── */
const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0070f3">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" fill="#0070f3" />
    <path d="M10.1 16.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" fill="white" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);


interface UserProfile {
  prenom: string;
  nom: string;
  email: string;
  role?: string;
  adresse?: string;
  created_at?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Profile Page Component
───────────────────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = React.useCallback(async () => {
    try {
      const token = getToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/user/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUser]);

  const fullName = user ? `${user.prenom} ${user.nom}` : "Chargement...";
  const initials = user && user.prenom && user.nom ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : "JK";
  const userEmail = user?.email || "chargement...";
  const userLocation = user?.adresse || "Douala, CM";
  const userRole = user?.role || "Directeur";
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : "Mars 2024";

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", backgroundColor: "#ffffff", fontFamily: "'Inter', sans-serif", opacity: loading ? 0.7 : 1 }}>

      {/* SIDEBAR */}
      <AppSidebar activeItem="profile" />

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>

        {/* HEADER */}
        <AppHeader breadcrumbs={[{ label: "Compte" }, { label: "Mon profil", active: true }]} />

        {/* SCROLLABLE PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Page Title & Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#111827" }}>Mon profil</h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Gérez vos informations personnelles et préférences de compte.</p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                  <DownloadIcon /> Exporter
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600, color: "#ffffff", cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                  <EditIcon /> Modifier le profil
                </button>
              </div>
            </div>

            {/* Hero Card */}
            <div style={{
              backgroundColor: "#0f172a", borderRadius: "16px", padding: "32px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "20px",
                  background: "linear-gradient(135deg, #0070f3 0%, #0040a8 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#ffffff", fontSize: "32px", fontWeight: 700,
                  boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.2)"
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#ffffff" }}>{fullName}</h2>
                    <VerifiedIcon />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#9ca3af", fontSize: "14px" }}>
                    <span>{userEmail}</span>
                    <span style={{ color: "#4b5563" }}>•</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "12px" }}>
                      <div style={{ width: "6px", height: "6px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
                      <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 600 }}>Actif</span>
                    </div>
                    <span style={{ color: "#4b5563" }}>•</span>
                    <span>{userLocation}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600, color: "#e2e8f0", cursor: "pointer",
                }}>
                  <ChatBubbleIcon /> Démarrer un chat
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#0070f3", border: "1px solid #0070f3", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600, color: "#ffffff", cursor: "pointer",
                }}>
                  + Nouvelle action
                </button>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {/* Card 1 */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "16px" }}>
                  <BriefcaseIcon />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Rôle</span>
                </div>
                <div style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: "16px", fontSize: "13px", fontWeight: 600, display: "inline-block", marginBottom: "8px" }}>
                  {userRole}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Accès complet · Niveau 4</div>
              </div>

              {/* Card 2 */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "16px" }}>
                  <ClockIcon />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Statut</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#10b981" }}>Actif</span>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>En ligne maintenant</div>
              </div>

              {/* Card 3 */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "16px" }}>
                  <CalendarIcon />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Membre depuis</span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "8px", textTransform: "capitalize" }}>{memberSince}</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Il y a 13 mois</div>
              </div>

              {/* Card 4 */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", marginBottom: "16px" }}>
                  <MapPinIcon />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Localisation</span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>{userLocation.split(',')[0]}</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Cameroun (GMT+1)</div>
              </div>
            </div>

            {/* Activité récente */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", backgroundColor: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Activité récente</h3>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#2563eb", cursor: "pointer" }}>Voir tout</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Activity 1 */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>Nouvelle conversation</h4>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#4b5563" }}>Discussion sur le projet Q2 2026</p>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>Il y a 2 heures</span>
                  </div>
                </div>

                {/* Activity 2 */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TrendUpIcon />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>Rapport généré</h4>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#4b5563" }}>Analyse mensuelle des performances</p>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>Il y a 5 heures</span>
                  </div>
                </div>

                {/* Activity 3 */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f3e8ff", color: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <UsersIcon />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>Réunion planifiée</h4>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#4b5563" }}>Briefing équipe - Jeudi 14:00</p>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>Il y a 1 jour</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
