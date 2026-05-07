"use client";

import React, { useState, useEffect } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { getToken } from "@/lib/auth";
import { UserProfile } from "@/types";
import {
  DownloadIcon,
  EditIcon,
  VerifiedIcon,
  ChatIcon,
  ChatBubbleIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  TrendUpIcon,
  PlusIcon,
  UsersIcon
} from "@/components/icons";

import { NEXT_PUBLIC_API_URL } from "@/env_varaible";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = React.useCallback(async () => {
    try {
      const token = getToken();
      const baseUrl = NEXT_PUBLIC_API_URL;
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
                  <PlusIcon /> Nouvelle action
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
                    <ChatIcon />
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
