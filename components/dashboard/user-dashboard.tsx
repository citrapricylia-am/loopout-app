"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Clock, AlertCircle, CheckCircle, Eye } from "lucide-react"
import { CreateTicketForm } from "./create-ticket-form"
import type { Ticket, User } from "@/lib/types"
import Link from "next/link";

interface UserDashboardProps {
  user: User
  tickets: Ticket[]
  onCreateTicket: (
    ticketData: Omit<Ticket, "id" | "userId" | "userName" | "createdAt" | "updatedAt">,
  ) => Promise<void>
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<void>
}

export function UserDashboard({ user, tickets, onCreateTicket, onUpdateTicket }: UserDashboardProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

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
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tiket Saya</h2>
          <p className="text-gray-600 dark:text-gray-400">Kelola request IT support Anda</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Buat Tiket Baru
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Membuat Tiket Baru</CardTitle>
            <CardDescription>Isi form di bawah untuk membuat request IT</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTicketForm
              user={user}
              onSubmit={async (ticketData) => {
                await onCreateTicket({
                  ...ticketData,
                  userDepartment: user.department
                })
                setShowCreateForm(false)
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

     <Card>
  <CardHeader>
    <CardTitle>Daftar Tiket</CardTitle>
    <CardDescription>Lihat semua tiket yang telah Anda buat</CardDescription>
  </CardHeader>

  <CardContent>
    {tickets.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
  <Dialog
    open={selectedTicket?.id === ticket.id}
    onOpenChange={(open) => !open && setSelectedTicket(null)}
  >
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedTicket(ticket)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Detail
      </Button>
    </DialogTrigger>

   <DialogContent
  className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-gray-900 dark:text-gray-100"
>
  <DialogHeader>
    <DialogTitle className="text-2xl font-bold flex items-center justify-between">
      {ticket.title}

      {/* Tambahkan badge prioritas di pojok kanan title */}
      {ticket.priority && (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full
            ${ticket.priority === "urgent" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
              ticket.priority === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" :
              ticket.priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
        >
          {ticket.priority.toUpperCase()}
        </span>
      )}
    </DialogTitle>

    <DialogDescription className="text-gray-600 dark:text-gray-300">
      Dibuat pada {new Date(ticket.createdAt).toLocaleString("id-ID")}

    </DialogDescription>
  </DialogHeader>

  <div className="mt-6 space-y-5">
    <div>
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Deskripsi Singkat:</h4>
      <p>{ticket.shortDescription}</p>
    </div>

    <div>
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Jenis Request:</h4>
      <Badge variant="outline">{ticket.requestType}</Badge>
    </div>

    {ticket.bugUrl && (
      <div>
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">URL Bug:</h4>
        <a
          href={ticket.bugUrl}
          target="_blank"
          className="text-blue-600 hover:underline break-words"
        >
          {ticket.bugUrl}
        </a>
      </div>
    )}

    {ticket.websiteTitle && (
      <div>
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Judul Website:</h4>
        <p>{ticket.websiteTitle}</p>
      </div>
    )}

    <div>
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Detail Request:</h4>
      <p className="whitespace-pre-wrap">{ticket.detailRequest}</p>
    </div>

      {/* ✅ Lampiran */}
  {ticket.attachments && ticket.attachments.length > 0 && (
  <div>
    <h4 className="font-medium mb-2">Lampiran:</h4>
    <ul className="list-disc list-inside space-y-1">
      {ticket.attachments.map((attachment, index) => (
        <li key={index}>
          {attachment.startsWith("http") ? (
            <a
              href={attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words"
            >
              {attachment}
            </a>
          ) : (
            <span>{attachment}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

    {ticket.deadline && (
      <div>
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Deadline:</h4>
        <p><TableCell>{new Date(ticket.updatedAt).toLocaleDateString("id-ID")}</TableCell>
</p>
      </div>
    )}
  </div>
</DialogContent>

  </Dialog>
</TableCell>
</TableRow>
))}  
</TableBody>
</Table>
) : (
  <p className="text-center text-muted-foreground">Belum ada tiket.</p>
)}

</CardContent>
</Card>
</div>
)
}
