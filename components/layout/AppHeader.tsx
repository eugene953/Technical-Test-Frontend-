"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────────────────────────────────── */
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function AppHeader({ breadcrumbs }: AppHeaderProps) {
  return (
    <header style={{ height: "64px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, backgroundColor: "#ffffff" }}>
      {/* Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span style={{ color: crumb.active ? "#111827" : "#6b7280", fontWeight: crumb.active ? 600 : 400 }}>
              {crumb.label}
            </span>
            {idx < breadcrumbs.length - 1 && (
              <span style={{ color: "#d1d5db" }}>›</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right Header Items */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher..." 
            style={{
              width: "240px", height: "36px", padding: "0 40px 0 36px",
              backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "18px",
              fontSize: "13px", outline: "none", color: "#111827",
              fontFamily: "inherit"
            }} 
          />
          <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, color: "#6b7280" }}>
            ⌘ K
          </div>
        </div>
        
        <button style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e5e7eb", borderRadius: "50%", background: "none", cursor: "pointer" }}>
          <BellIcon />
        </button>
        <button style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e5e7eb", borderRadius: "50%", background: "none", cursor: "pointer" }}>
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
}
