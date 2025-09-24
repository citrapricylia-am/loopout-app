"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { Chatbot } from "@/components/chatbot/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketIcon, Users } from "lucide-react"
import type { Ticket as TicketType, User } from "@/lib/types"
import Lottie from "lottie-react";
import animationData from "@/public/animations/pU0iMDChxM.json";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [showAuth, setShowAuth] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

const updateTicket = async (ticketId: string, updates: Partial<TicketType>) => {
  try {
    const res = await fetch("/api/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, updates }),
    });

    if (!res.ok) throw new Error("Gagal update tiket");

    // Perbarui state supaya UI langsung reflect
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  } catch (err) {
    console.error("Gagal update tiket:", err);
  }
};


useEffect(() => {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setCurrentUser(parsedUser);
    refreshTickets(parsedUser.id, parsedUser.role);
  }
}, []);

 const handleLogin = async (email: string, password: string) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Login gagal");


     localStorage.setItem("currentUser", JSON.stringify(data));

    setCurrentUser(data);
    await refreshTickets(data.id, data.role); // ✅ ambil tiket user setelah login
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat login.");
  }
};


 const handleRegister = async (name: string, email: string, phone: string, department: string, password: string) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, department, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Registrasi gagal");

    alert("Registrasi berhasil! Silakan login.");
    const loginTrigger = document.querySelector('[value="login"]') as HTMLElement;
    loginTrigger?.click();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat registrasi.");
  }
};

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null)
    setShowAuth(false)
    setShowLogoutConfirm(false)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const handleCreateTicket = async (
  ticketData: Omit<TicketType, "id" | "userId" | "userName" | "createdAt" | "updatedAt">
) => {
  if (!currentUser) return;
  try {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ticketData, userId: currentUser.id }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Gagal membuat tiket");

    await refreshTickets(currentUser.id, currentUser.role);
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat membuat tiket.");
  }
};

const refreshTickets = async (userId?: string, role?: string) => {
  try {
    const url =
      role === "admin"
        ? "/api/tickets?all=1"
        : userId
        ? `/api/tickets?userId=${userId}`
        : null;

    if (!url) return;

    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal memuat tiket");

    setTickets(
  data.map((t: any) => ({
    id: t.id,
    title: t.title,
    shortDescription: t.short_description, // ✅ mapping dari DB -> camelCase
    detailRequest: t.detail_request,
    requestType: t.request_type,
    bugUrl: t.bug_url,
    websiteTitle: t.website_title,
    priority: t.priority,
    status: t.status,
    userId: t.user_id,
    userName: t.userName,
    userEmail: t.userEmail, 
    userPhone: t.userPhone,           
    userDepartment: t.userDepartment,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    deadline: t.deadline ?? null,
  }))
);

  } catch (err) {
    console.error(err);
    alert("Tidak bisa memuat tiket dari server.");
  }
};

  const handleUpdateTicket = async (ticketId: string, updates: Partial<TicketType>) => {
    setTickets(
      tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } as TicketType
          : ticket
      ),
    )
  }

  const handleDeleteTicket = async (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== ticketId))
  }

  if (!currentUser && !showAuth) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT - Text */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Launch smart.{" "}
            <span className="bg-yellow-300 px-1">Grow fast.</span>{" "}
            On IT Ticket System.
          </h1>
          <p className="text-lg text-gray-600">
            Kelola dan lacak semua permintaan dukungan IT Anda dengan mudah dan efisien.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => setShowAuth(true)}
            >
              Mulai Membuat Tiket
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3"
              onClick={() => setShowAuth(true)}
            >
              Masuk
            </Button>
          </div>
        </div>

        {/* RIGHT - Illustration */}
        <div className="flex justify-center lg:justify-end">
      <Lottie
        animationData={animationData}
        loop={true}           // akan terus looping
        autoplay={true}       // otomatis jalan
        className="w-72 h-72 md:w-96 md:h-96"
      />
    </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <p className="text-center text-gray-500 text-sm">
          Created by Citra • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

  if (!currentUser && showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuth(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </Button>
              <div className="flex-1" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">IT Ticket System</CardTitle>
            <CardDescription>Manage your IT support requests efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onLogin={handleLogin} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm onRegister={handleRegister} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Chatbot isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser!.role === "admin" ? (
          <AdminDashboard
            tickets={tickets}
            users={[] as User[]}
            onUpdateTicket={updateTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        ) : (
          <UserDashboard
            user={currentUser!}
            tickets={tickets.filter((ticket) => ticket.userId === currentUser!.id)}
            onCreateTicket={handleCreateTicket}
            onUpdateTicket={updateTicket}
          />
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center">Konfirmasi Logout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600">Apakah Anda yakin ingin keluar dari sistem?</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={cancelLogout}>
                  Batal
                </Button>
                <Button onClick={confirmLogout} className="bg-red-600 hover:bg-red-700">
                  Ya, Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Chatbot isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
    </div>
  )
}
