"use client";

import React from "react";
import { BellIcon, SearchIcon, SettingsIcon } from "@/components/icons";

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
