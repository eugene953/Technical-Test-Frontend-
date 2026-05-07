"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { getToken } from "@/lib/auth";
import { Event } from "@/types";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  MONTH_NAMES,
  DAY_NAMES
} from "@/lib/utils/date";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  TrashIcon,
  UsersIcon
} from "@/components/icons";

import { NEXT_PUBLIC_API_URL } from "@/env_varaible";

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<Partial<Event>>({});
  const [loading, setLoading] = useState(true);

  const fetchEvents = React.useCallback(() => {
    const token = getToken();
    if (!token) {
      setTimeout(() => setLoading(false), 0);
      return;
    }
    const baseUrl = NEXT_PUBLIC_API_URL;
    fetch(`${baseUrl}/agenda`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Failed to fetch");
      })
      .then((data: Event[]) => {
        setEvents(data);
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) return;
      const baseUrl = NEXT_PUBLIC_API_URL;

      const method = modalMode === "create" ? "POST" : "PATCH";
      const url = modalMode === "create" ? `${baseUrl}/agenda` : `${baseUrl}/agenda/${selectedEvent.id}`;

      const payload = {
        title: selectedEvent.title,
        date: selectedEvent.date || selectedDate,
        time: selectedEvent.time,
        participants: selectedEvent.participants || "",
        notes: selectedEvent.notes || ""
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    try {
      const token = getToken();
      if (!token) return;
      const baseUrl = NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/agenda/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedEvent({ date: selectedDate, title: "", time: "12:00", participants: "", notes: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setModalMode("edit");
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    // Padding for start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentDate]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => e.date === selectedDate);
  }, [events, selectedDate]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter(e => new Date(e.date) > today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  const hasEvent = (day: number) => {
    const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return events.some(e => e.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day;
  };

  const isSelected = (day: number) => {
    const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return selectedDate === dateStr;
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", backgroundColor: "#ffffff", fontFamily: "'Inter', sans-serif", opacity: loading ? 0.8 : 1, transition: "opacity 0.2s" }}>

      <AppSidebar activeItem="calendar" />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f9fafb" }}>
        <AppHeader breadcrumbs={[{ label: "Espace" }, { label: "Calendrier", active: true }]} />

        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#111827" }}>Calendrier</h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Gérez vos événements et rendez-vous.</p>
              </div>
              <button onClick={openCreateModal} style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                backgroundColor: "#0070f3", border: "1px solid #0070f3", borderRadius: "8px",
                fontSize: "14px", fontWeight: 600, color: "#ffffff", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 112, 243, 0.3)"
              }}>
                <PlusIcon /> Nouvel événement
              </button>
            </div>

            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

              {/* LEFT COLUMN: CALENDAR GRID */}
              <div style={{ flex: "1.2", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                  <button onClick={prevMonth} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronLeftIcon />
                  </button>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                    {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button onClick={nextMonth} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronRightIcon />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "16px" }}>
                  {DAY_NAMES.map((day, idx) => (
                    <div key={idx} style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>{day}</div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: "16px" }}>
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      onClick={() => day && setSelectedDate(formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)))}
                      style={{
                        height: "64px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        cursor: day ? "pointer" : "default", position: "relative"
                      }}
                    >
                      {day && (
                        <>
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "14px", fontWeight: isSelected(day) || isToday(day) ? 700 : 500,
                            backgroundColor: isSelected(day) ? "#0070f3" : isToday(day) ? "#eff6ff" : "transparent",
                            color: isSelected(day) ? "#ffffff" : isToday(day) ? "#0070f3" : "#111827",
                            transition: "all 0.2s"
                          }}>
                            {day}
                          </div>
                          {hasEvent(day) && !isSelected(day) && (
                            <div style={{ position: "absolute", bottom: "8px", width: "4px", height: "4px", backgroundColor: "#0070f3", borderRadius: "50%" }}></div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: EVENTS LIST */}
              <div style={{ flex: "0.8", display: "flex", flexDirection: "column", gap: "24px" }}>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                      {selectedDate === formatDate(new Date()) ? "Aujourd'hui" : selectedDate}
                    </h3>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af" }}>{filteredEvents.length} événement(s)</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filteredEvents.map((event, idx) => (
                      <div key={event.id} style={{
                        backgroundColor: "#ffffff", border: "1px solid #e5e7eb",
                        borderLeft: `4px solid ${["#0070f3", "#a855f7", "#10b981"][idx % 3]}`,
                        borderRadius: "12px", padding: "16px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>{event.title}</h4>
                          <button onClick={() => handleDelete(event.id)} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}><TrashIcon /></button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px", marginBottom: "12px" }}>
                          <ClockIcon /> {event.time}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#9ca3af", fontSize: "12px", marginBottom: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><UsersIcon /> {event.participants || "Pas de participants"}</div>
                        </div>
                        <button onClick={() => openEditModal(event)} style={{ width: "100%", padding: "8px 0", backgroundColor: "#f3f4f6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Modifier</button>
                      </div>
                    ))}
                    {filteredEvents.length === 0 && (
                      <div style={{ padding: "32px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px dashed #e5e7eb" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>Aucun événement pour cette date.</p>
                      </div>
                    )}
                  </div>
                </div>

                {upcomingEvents.length > 0 && (
                  <div style={{ marginTop: "8px" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>À venir</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {upcomingEvents.map(event => (
                        <div key={event.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ borderRight: "1px solid #f3f4f6", paddingRight: "16px", textAlign: "center", minWidth: "48px" }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#0070f3" }}>
                              {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#0070f3", lineHeight: 1 }}>
                              {new Date(event.date).getDate()}
                            </div>
                          </div>
                          <div>
                            <h4 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: "#111827" }}>{event.title}</h4>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>{event.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", width: "400px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}>{modalMode === "create" ? "Nouvel événement" : "Modifier l'événement"}</h2>
            <form onSubmit={handleCreateOrUpdate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>Titre</label>
                <input required value={selectedEvent.title} onChange={e => setSelectedEvent({ ...selectedEvent, title: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>Date</label>
                  <input type="date" required value={selectedEvent.date} onChange={e => setSelectedEvent({ ...selectedEvent, date: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>Heure</label>
                  <input type="time" required value={selectedEvent.time} onChange={e => setSelectedEvent({ ...selectedEvent, time: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>Participants</label>
                <input value={selectedEvent.participants} onChange={e => setSelectedEvent({ ...selectedEvent, participants: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>Notes</label>
                <textarea value={selectedEvent.notes} onChange={e => setSelectedEvent({ ...selectedEvent, notes: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", outline: "none", resize: "none", height: "80px" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#ffffff", fontWeight: 600, cursor: "pointer" }}>Annuler</button>
                <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#0070f3", color: "#ffffff", fontWeight: 600, cursor: "pointer" }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

