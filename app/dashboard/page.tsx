"use client";

import React, { useState, useEffect, useRef } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { getToken } from "@/lib/auth";
import { UserProfile, Tool, Message, HistoryMessage } from "@/types";
import { 
  AttachmentIcon, 
  MicIcon, 
  SendIcon, 
  BarChartIcon, 
  UsersIcon, 
  AssistantStarsIcon, 
  ToolIcon,
  DocumentsIcon,
  PlusIcon
} from "@/components/icons";

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Je suis votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?",
    timeLabel: "Il y a quelques instants",
    isWidget: false
  },
  {
    id: "2",
    role: "user",
    content: "Peux-tu me donner un résumé des performances de cette semaine ?",
    timeLabel: "À l'instant",
    isWidget: false
  },
  {
    id: "3",
    role: "assistant",
    content: "Voici un aperçu de vos performances cette semaine :",
    timeLabel: "À l'instant",
    isWidget: true
  }
];

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────────────────────────────────────── */
export default function DashboardChatPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "À l'instant";
    }
  };

  const fetchSessionHistory = async (id: string) => {
    try {
      const token = getToken();
      if (!token) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/session/${id}/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const history: HistoryMessage[] = await response.json();
        const mappedMessages: Message[] = history.map((m, idx) => ({
          id: `hist-${idx}`,
          role: m.role,
          content: m.content,
          timeLabel: formatTimestamp(m.timestamp)
        }));
        setMessages(mappedMessages);
      } else if (response.status === 404) {
        setSessionId(null);
        localStorage.removeItem("inov_session_id");
      }
    } catch (err) {
      console.error("Failed to fetch session history:", err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const userRes = await fetch(`${baseUrl}/user/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (userRes.ok) {
          setUser(await userRes.json());
        }

        const toolsRes = await fetch(`${baseUrl}/agent/tools`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (toolsRes.ok) {
          setTools(await toolsRes.json());
        }

        // Restore Session
        const savedSessionId = localStorage.getItem("inov_session_id");
        if (savedSessionId) {
          setSessionId(savedSessionId);
          fetchSessionHistory(savedSessionId);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    fetchInitialData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timeLabel: "À l'instant"
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const token = getToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: newUserMsg.content
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.session_id && data.session_id !== sessionId) {
          setSessionId(data.session_id);
          localStorage.setItem("inov_session_id", data.session_id);
        }

        const newAssistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          tool_used: data.tool_used,
          timeLabel: "À l'instant"
        };
        setMessages(prev => [...prev, newAssistantMsg]);
      } else {
        console.error("Failed to send message", response.status);
      }
    } catch (error) {
      console.error("Error communicating with chat API", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const prenom = user?.prenom || "Jean";
  const initials = user && user.prenom && user.nom ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : "JK";

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", backgroundColor: "#ffffff", fontFamily: "'Inter', sans-serif" }}>

      {/* SIDEBAR */}
      <AppSidebar activeItem="conversations" />

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>

        {/* HEADER */}
        <AppHeader breadcrumbs={[{ label: "Espace" }, { label: "Conversations", active: true }]} />

        {/* CHAT SCROLLABLE AREA */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", paddingBottom: "24px" }}>

          {/* Chat Header inside feed */}
          <div style={{ borderBottom: "1px solid #f3f4f6", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 auto", width: "100%", maxWidth: "900px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#0070f3", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0, 112, 243, 0.3)" }}>
                <AssistantStarsIcon size={22} />
                <div style={{ position: "absolute", marginLeft: "28px", marginTop: "28px", width: "10px", height: "10px", backgroundColor: "#10b981", border: "2px solid #ffffff", borderRadius: "50%" }}></div>
              </div>
              <div>
                <h3 style={{ margin: 0, color: "#111827", fontSize: "15px", fontWeight: 700 }}>Assistant IA</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "#10b981", borderRadius: "50%" }}></span>
                  <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 500 }}>En ligne · Temps de réponse ~2s</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setMessages(initialMessages);
                setSessionId(null);
                localStorage.removeItem("inov_session_id");
              }}
              style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "10px 16px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Nouvelle conversation
            </button>
          </div>

          {/* Messages Container */}
          <div style={{ width: "100%", maxWidth: "860px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {messages.map((msg) => {
              if (msg.role === "assistant") {
                return (
                  <div key={msg.id} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "#0070f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AssistantStarsIcon size={18} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: msg.isWidget ? "100%" : "85%", flex: msg.isWidget ? 1 : undefined }}>

                      {msg.isWidget ? (
                        <>
                          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#374151" }}>{msg.content}</p>
                          <div style={{ border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", backgroundColor: "#ffffff" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                              {/* Stat 1 */}
                              <div style={{ backgroundColor: "#eff6ff", padding: "16px", borderRadius: "12px", border: "1px solid #dbeafe" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "28px", height: "28px", backgroundColor: "#2563eb", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}><BarChartIcon /></div>
                                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a8a" }}>Productivité</span>
                                  </div>
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}>+12%</span>
                                </div>
                                <div style={{ fontSize: "28px", fontWeight: 800, color: "#1e3a8a", marginBottom: "4px" }}>94%</div>
                                <div style={{ fontSize: "12px", color: "#60a5fa" }}>18 tâches complétées sur 19</div>
                              </div>
                              {/* Stat 2 */}
                              <div style={{ backgroundColor: "#fdf2f8", padding: "16px", borderRadius: "12px", border: "1px solid #fce7f3" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "28px", height: "28px", backgroundColor: "#c026d3", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}><UsersIcon /></div>
                                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#701a75" }}>Réunions</span>
                                  </div>
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#c026d3" }}>8 total</span>
                                </div>
                                <div style={{ fontSize: "28px", fontWeight: 800, color: "#701a75", marginBottom: "4px" }}>6.5h</div>
                                <div style={{ fontSize: "12px", color: "#f472b6" }}>Temps moyen : 48 min</div>
                              </div>
                              {/* Stat 3 */}
                              <div style={{ backgroundColor: "#fffbeb", padding: "16px", borderRadius: "12px", border: "1px solid #fef3c7" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "28px", height: "28px", backgroundColor: "#ea580c", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                                      <DocumentsIcon />
                                    </div>
                                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#7c2d12" }}>Documents</span>
                                  </div>
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#ea580c" }}>+5 nouveaux</span>
                                </div>
                                <div style={{ fontSize: "28px", fontWeight: 800, color: "#7c2d12", marginBottom: "4px" }}>23</div>
                                <div style={{ fontSize: "12px", color: "#fb923c" }}>Créés cette semaine</div>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "-4px" }}>
                            {tools.length > 0 ? tools.map(tool => (
                              <button
                                key={tool.name}
                                title={tool.description}
                                onClick={() => setInputValue(`Peux-tu utiliser l'outil ${tool.name} ?`)}
                                style={{ padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "13px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", transition: "all 0.2s" }}
                              >
                                ⚙️ {tool.name}
                              </button>
                            )) : (
                              <>
                                <button onClick={() => setInputValue("Rapport détaillé")} style={{ padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "13px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>📊 Rapport détaillé</button>
                                <button onClick={() => setInputValue("Planning semaine prochaine")} style={{ padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "13px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>📅 Planning semaine prochaine</button>
                                <button onClick={() => setInputValue("Suggestions")} style={{ padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "13px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>💡 Suggestions</button>
                              </>
                            )}
                          </div>
                          <span style={{ fontSize: "11px", color: "#9ca3af", paddingLeft: "4px", marginTop: "-12px" }}>{msg.timeLabel}</span>
                        </>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", padding: "16px 20px", borderRadius: "16px", borderTopLeftRadius: "4px" }}>
                            {msg.id === "1" && <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#111827", fontWeight: 600 }}>👋 Bonjour {prenom} !</p>}
                            <p style={{ margin: 0, fontSize: "14px", color: "#4b5563", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                            {msg.tool_used && (
                              <div style={{ marginTop: "12px", padding: "6px 10px", backgroundColor: "#f3f4f6", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, color: "#6b7280" }}>
                                <ToolIcon />
                                Outil utilisé : {msg.tool_used}
                              </div>
                            )}
                          </div>
                          <span style={{ fontSize: "11px", color: "#9ca3af", paddingLeft: "4px" }}>{msg.timeLabel}</span>
                        </div>
                      )}

                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={msg.id} style={{ display: "flex", gap: "16px", alignItems: "flex-start", alignSelf: "flex-end", flexDirection: "row-reverse" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", maxWidth: "85%" }}>
                      <div style={{ backgroundColor: "#2563eb", padding: "14px 20px", borderRadius: "16px", borderTopRightRadius: "4px", color: "#ffffff", fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </div>
                      <span style={{ fontSize: "11px", color: "#9ca3af", paddingRight: "4px" }}>{msg.timeLabel}</span>
                    </div>
                  </div>
                );
              }
            })}

            {/* Assistant Bubble 3 (Typing) */}
            {isTyping && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "#0070f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AssistantStarsIcon size={18} />
                </div>
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", padding: "12px 20px", borderRadius: "20px", borderTopLeftRadius: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both" }}></span>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.2s" }}></span>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}

            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
            `}</style>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA (FIXED BOTTOM) */}
        <div style={{ padding: "0 24px 32px", width: "100%" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", backgroundColor: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "16px" }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question ou décrivez ce dont vous avez besoin..."
              style={{
                width: "100%", border: "none", backgroundColor: "transparent", outline: "none",
                resize: "none", height: "44px", fontSize: "14px", color: "#111827",
                fontFamily: "inherit"
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                  <AttachmentIcon />
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                  <MicIcon />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>{inputValue.length} / 2000</span>
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputValue.trim()}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    backgroundColor: isTyping || !inputValue.trim() ? "#9ca3af" : "#2563eb",
                    display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: isTyping || !inputValue.trim() ? "not-allowed" : "pointer",
                    boxShadow: isTyping || !inputValue.trim() ? "none" : "0 4px 12px rgba(37, 99, 235, 0.3)",
                    transition: "all 0.2s"
                  }}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

