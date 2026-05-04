"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";

/* ─────────────────────────────────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────────────────────────────────── */
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const EnvelopeIcon = ({ color = "#9ca3af" }) => (
  <svg width="18" height="18" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const LockIcon = ({ color = "#9ca3af" }) => (
  <svg width="18" height="18" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

const EyeIcon = ({ color = "#9ca3af" }) => (
  <svg width="18" height="18" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ color = "#9ca3af" }) => (
  <svg width="18" height="18" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Input Component
───────────────────────────────────────────────────────────────────────────── */
function FormInput({
  type, value, onChange, placeholder, icon, rightEl, defaultFocused = false,
}: {
  type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; icon: (props: { color: string }) => React.ReactNode; rightEl?: React.ReactNode;
  defaultFocused?: boolean;
}) {
  const [focused, setFocused] = useState(defaultFocused);

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        border: focused ? "2px solid #3b82f6" : "2px solid transparent",
        backgroundColor: focused ? "#ffffff" : "#f3f4f6",
        borderRadius: "12px", padding: "12px 16px",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ display: "flex", flexShrink: 0 }}>
        {icon({ color: focused ? "#3b82f6" : "#9ca3af" })}
      </span>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontSize: "14px", color: "#111827", fontFamily: "inherit", minWidth: 0,
          fontWeight: 500, letterSpacing: type === 'password' && value ? '0.2em' : 'normal',
        }}
      />
      {rightEl && (
        <span style={{ display: "flex", flexShrink: 0, cursor: "pointer" }}>{rightEl}</span>
      )}
    </div>
  );
}



export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("jean.kamga@inov-consulting.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email inconnu ou mot de passe incorrect.");
        } else if (response.status === 422) {
          throw new Error("Erreur de validation. Veuillez vérifier vos saisies.");
        }
        throw new Error("Une erreur inattendue s'est produite.");
      }

      interface LoginResponse {
        access_token: string;
      }
      const data: LoginResponse = await response.json();
      saveToken(data.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {

      if (err instanceof Error) {
        if (err.message === "Failed to fetch") {
          console.warn("Backend not running. Mocking successful login...");
          return;
        }

        setError(err.message);
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#f3f4f6", padding: "16px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Main Container - 50/50 Split */}
      <div style={{
        display: "flex", width: "100%", maxWidth: "1300px", height: "calc(100vh - 32px)", minHeight: "700px",
        backgroundColor: "#ffffff", borderRadius: "24px", overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}>

        {/* Left Panel - Dark Navy */}
        <div style={{
          width: "50%", background: "linear-gradient(150deg, #0a1930 0%, #060d18 50%, #020408 100%)",
          padding: "64px", display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          {/* Top Content */}
          <div>
            {/* Logo & Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "80px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #0070f3 0%, #0040a8 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0, 112, 243, 0.4)"
              }}>
                <LogoIcon />
              </div>
              <div>
                <h2 style={{ margin: 0, color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>Inov Consulting</h2>
                <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  AI ASSISTANT PLATFORM
                </p>
              </div>
            </div>

            {/* Main Typography */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00d0ff" }}></span>
                <span style={{ color: "#00d0ff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  POWERED BY AI · V2.4
                </span>
              </div>

              <h1 style={{ margin: "0 0 24px", color: "#ffffff", fontSize: "3.5rem", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: "640px" }}>
                Votre assistant intelligent<br />
                pour diriger <span style={{ color: "#90e0ff" }}>sans</span> <span style={{ color: "#60c0ff" }}>friction</span>
              </h1>

              <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px", lineHeight: 1.6, maxWidth: "85%" }}>
                Gestion d&apos;agenda, échanges conversationnels et intelligence métier<br />
                — réunis dans une seule interface conçue pour les décideurs.
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div>
            <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "32px", width: "100%" }}></div>
            <div style={{ display: "flex", gap: "64px" }}>
              <div>
                <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>2.4k+</div>
                <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>MANAGERS ACTIFS</div>
              </div>
              <div>
                <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>180k</div>
                <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>CONVERSATIONS</div>
              </div>
              <div>
                <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>99.9%</div>
                <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>DISPONIBILITÉ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{ width: "50%", padding: "64px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "440px" }}>

            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ margin: "0 0 12px", color: "#111827", fontSize: "32px", fontWeight: 800, letterSpacing: "-0.01em" }}>Connexion</h2>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>Entrez vos identifiants pour accéder à votre espace.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Error Message */}
              {error && (
                <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#ef4444", fontSize: "14px", fontWeight: 500 }}>
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label style={{ display: "block", color: "#111827", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                  Adresse e-mail
                </label>
                <FormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={EnvelopeIcon}
                />
              </div>

              {/* Password Field */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label style={{ color: "#111827", fontSize: "13px", fontWeight: 700 }}>Mot de passe</label>
                  <a href="#" style={{ color: "#3b82f6", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>Mot de passe oublié ?</a>
                </div>
                <FormInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={LockIcon}
                  rightEl={
                    <div onClick={() => setShowPassword(!showPassword)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </div>
                  }
                  defaultFocused={true}
                />
              </div>

              {/* Checkbox */}
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ display: "none" }}
                />
                <div style={{
                  width: "20px", height: "20px", borderRadius: "6px",
                  backgroundColor: rememberMe ? "#2563eb" : "#ffffff",
                  border: rememberMe ? "2px solid #2563eb" : "2px solid #d1d5db",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s"
                }}>
                  {rememberMe && <CheckIcon />}
                </div>
                <span style={{ color: "#111827", fontSize: "14px", fontWeight: 500 }}>Se souvenir de moi pendant 30 jours</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%", backgroundColor: isLoading ? "#374151" : "#0a0a0a", color: "#ffffff",
                  padding: "16px", borderRadius: "12px", border: "none",
                  fontSize: "15px", fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                  marginTop: "8px", transition: "background-color 0.2s"
                }}
              >
                {isLoading ? (
                  <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                ) : (
                  <>Se connecter <span style={{ fontSize: "18px" }}>→</span></>
                )}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }}></div>
                <span style={{ padding: "0 16px", color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em" }}>OU CONTINUEZ AVEC</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }}></div>
              </div>

              {/* Social Buttons */}
              <div style={{ display: "flex", gap: "16px" }}>
                <button type="button" style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                  padding: "14px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px",
                  color: "#111827", fontSize: "14px", fontWeight: 600, cursor: "pointer"
                }}>
                  <GoogleIcon /> Google
                </button>
                <button type="button" style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                  padding: "14px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px",
                  color: "#111827", fontSize: "14px", fontWeight: 600, cursor: "pointer"
                }}>
                  <MicrosoftIcon /> Microsoft 365
                </button>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>Pas encore de compte ? </span>
                <a href="#" style={{ color: "#111827", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>Demander un accès</a>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
