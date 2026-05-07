"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { 
  LogoIcon, 
  EnvelopeIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  GoogleIcon, 
  MicrosoftIcon, 
  CheckIcon 
} from "@/components/icons";

import { NEXT_PUBLIC_API_URL } from "@/env_varaible";

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
      const baseUrl = NEXT_PUBLIC_API_URL;
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
