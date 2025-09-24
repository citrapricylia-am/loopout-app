"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, CheckCircle, Users, TicketIcon, Bell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Ticket, User } from "@/lib/types"

interface AdminDashboardProps {
  tickets: Ticket[]
  users: User[]
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void
  onDeleteTicket: (ticketId: string) => void
}

export function AdminDashboard({ tickets, users, onUpdateTicket, onDeleteTicket }: AdminDashboardProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [notifications, setNotifications] = useState<string[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const sendNotification = (ticket: Ticket, newStatus: string) => {
    const user = users.find((u) => Number(u.id) === Number(ticket.userId));
    if (user) {
      const message = `Notifikasi ke ${user.name} (${user.phone}): Status tiket "${ticket.title}" telah diubah menjadi "${newStatus}"`
      console.log(`[v0] ${message}`)
      setNotifications((prev) => [...prev, message])

      // Show notification in UI for 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== message))
      }, 5000)
    }
  }

  const handleStatusChange = (ticket: Ticket, newStatus: string) => {
    onUpdateTicket(ticket.id, { status: newStatus as any })
    sendNotification(ticket, newStatus)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredTickets =
    selectedStatus === "all" ? tickets : tickets.filter((ticket) => ticket.status === selectedStatus)

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h2>
        <p className="text-gray-600 dark:text-gray-400">Kelola semua tiket dukungan IT dan pengguna</p>
      </div>

      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-200">{notification}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tiket</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Terbuka</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dalam Proses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Selesai</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList>
          <TabsTrigger value="tickets">Tiket</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
        </TabsList>

<div className="grid gap-4">
  {filteredTickets.length > 0 ? (
    filteredTickets.map((ticket) => {
      const user = users.find((u) => Number(u.id) === Number(ticket.userId));
 // ✅ perbaiki tipe
      return (
        <Card key={ticket.id} className="shadow-sm border rounded-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                <CardDescription className="text-sm">
                  Oleh {ticket.userName ?? "Unknown"} • Dibuat{" "}
                   {new Date(ticket.createdAt).toLocaleDateString("id-ID")}
                </CardDescription>


                <p className="text-gray-700 text-sm mt-2">{ticket.detailRequest}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Terakhir diperbarui: {new Date(ticket.updatedAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status === "open"
                      ? "Terbuka"
                      : ticket.status === "in-progress"
                      ? "Dalam Proses"
                      : ticket.status === "resolved"
                      ? "Selesai"
                      : "Ditutup"}
                  </Badge>
                </div>

                <div className="flex gap-2 mt-2">
                  {/* ✅ Tombol Detail */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    👁 Detail
                  </Button>

                  {/* ✅ Dropdown Status */}
                  <Select
                    value={ticket.status}
                    onValueChange={(value) => handleStatusChange(ticket, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Terbuka</SelectItem>
                      <SelectItem value="in-progress">Dalam Proses</SelectItem>
                      <SelectItem value="resolved">Selesai</SelectItem>
                      <SelectItem value="closed">Ditutup</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* ✅ Tombol Hapus */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteTicket(ticket.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    })
  ) : (
    <p className="text-gray-500 text-center py-4">Belum ada tiket.</p>
  )}
</div>

<Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
  <DialogContent className="max-w-2xl p-0">
    {selectedTicket && (
      <Card className="bg-white dark:bg-gray-900 shadow-md rounded-xl">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-xl font-bold">Detail Tiket</CardTitle>
          <CardDescription>Informasi lengkap tentang tiket yang dipilih</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* 2 kolom: Judul + Status / Prioritas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Judul Tiket</p>
              <p className="text-lg">{selectedTicket.title}</p>

              <p className="mt-3 font-semibold">Dibuat Oleh</p>
              <p className="font-medium">{selectedTicket.userName ?? "-"}</p>
              <p className="text-sm text-gray-600">{selectedTicket.userEmail ?? "-"}</p>
              <p className="text-sm text-gray-600">HP: {selectedTicket.userPhone ?? "-"}</p>
              <p className="text-sm text-gray-600">Departemen: {selectedTicket.userDepartment ?? "-"}</p>

            </div>

            {/* Status & Prioritas */}
            <div className="text-right space-y-3">
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status === "open"
                    ? "Terbuka"
                    : selectedTicket.status === "in-progress"
                    ? "Dalam Proses"
                    : selectedTicket.status === "resolved"
                    ? "Selesai"
                    : "Ditutup"}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Prioritas</p>
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
              </div>
            </div>
          </div>

          {/* URL bug jika ada */}
          {selectedTicket.bugUrl && (
            <div>
              <p className="font-semibold">URL Bug</p>
              <a
                href={selectedTicket.bugUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {selectedTicket.bugUrl}
              </a>
            </div>
          )}

          {/* Deskripsi */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <p className="font-semibold mb-1">Deskripsi</p>
            <p className="text-gray-700">{selectedTicket.detailRequest}</p>
          </div>

          {/* Waktu */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Dibuat: {new Date(selectedTicket.createdAt).toLocaleString("id-ID")}</span>
            <span>Terakhir diperbarui: {new Date(selectedTicket .updatedAt).toLocaleString("id-ID")}</span>

          </div>

          {/* Dropdown + tombol notifikasi */}
          <div className="flex justify-between pt-3 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => sendNotification(selectedTicket, selectedTicket.status)}
            >
              🔔 Kirim Notifikasi
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
  </DialogContent>
</Dialog>



        <TabsContent value="users" className="space-y-4">
          <h3 className="text-lg font-medium">Pengguna Sistem</h3>
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-gray-400 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        HP: {user.phone} • Departemen: {user.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "Pengguna"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
