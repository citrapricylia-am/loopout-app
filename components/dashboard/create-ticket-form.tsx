"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X, Calendar as CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Ticket, User } from "@/lib/types"

interface CreateTicketFormProps {
  user: User
  onSubmit: (
    ticketData: Omit<Ticket, "id" | "userId" | "userName" | "createdAt" | "updatedAt">,
  ) => Promise<void>
  onCancel: () => void
}

export function CreateTicketForm({ user, onSubmit, onCancel }: CreateTicketFormProps) {
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [requestType, setRequestType] = useState<"Bug Fixing" | "Website" | "">("")
  const [bugUrl, setBugUrl] = useState("")
  const [websiteTitle, setWebsiteTitle] = useState("")
  const [detailRequest, setDetailRequest] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [deadline, setDeadline] = useState<Date>()
   const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low">("medium")
  const [open, setOpen] = useState(false)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestType) return

    await onSubmit({
      title,
      shortDescription,
      requestType: requestType as "Bug Fixing" | "Website",
      bugUrl: requestType === "Bug Fixing" ? bugUrl : undefined,
      websiteTitle: requestType === "Website" ? websiteTitle : undefined,
      detailRequest,
      attachments,
      deadline: deadline ? new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).toISOString().split('T')[0] : undefined,
      priority,
      status: "open",
      userDepartment: user.department,
    })
  }

  const handleAttachmentAdd = () => {
    const attachment = prompt("Enter attachment URL or description:")
    if (attachment) {
      setAttachments([...attachments, attachment])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama</Label>
          <Input value={user.name} disabled className="bg-gray-50 dark:bg-gray-800" />
        </div>
        <div className="space-y-2">
          <Label>Divisi</Label>
          <Input value={user.department} disabled className="bg-gray-50 dark:bg-gray-800" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Judul Request</Label>
        <Input
          id="title"
          type="text"
          placeholder="Judul singkat untuk request Anda"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
        <Input
          id="shortDescription"
          type="text"
          placeholder="Deskripsi singkat tentang request"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requestType">Jenis Request</Label>
        <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis request" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bug Fixing">Bug Fixing</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {requestType === "Bug Fixing" && (
        <div className="space-y-2">
          <Label htmlFor="bugUrl">URL Bug</Label>
          <Input
            id="bugUrl"
            type="url"
            placeholder="https://example.com/page-with-bug"
            value={bugUrl}
            onChange={(e) => setBugUrl(e.target.value)}
            required
          />
        </div>
      )}

       {/* Tambahkan Select Priority */}
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priority}
          onValueChange={(val) => setPriority(val as "urgent" | "high" | "medium" | "low")}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Pilih Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {requestType === "Website" && (
        <div className="space-y-2">
          <Label htmlFor="websiteTitle">Judul Website</Label>
          <Input
            id="websiteTitle"
            type="text"
            placeholder="Nama atau judul website yang diinginkan"
            value={websiteTitle}
            onChange={(e) => setWebsiteTitle(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="detailRequest">Detail Request</Label>
        <Textarea
          id="detailRequest"
          placeholder="Jelaskan detail request Anda secara lengkap..."
          value={detailRequest}
          onChange={(e) => setDetailRequest(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Lampiran (Optional)</Label>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAttachmentAdd}
            className="w-full flex items-center gap-2 bg-transparent"
          >
            <Upload className="h-4 w-4" />
            Tambah Lampiran (File, Screenshot, Link Design)
          </Button>
          {attachments.length > 0 && (
            <div className="space-y-1">
              {attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm truncate">{attachment}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                    {"×"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

<div className="space-y-2">
  <Label>Tanggal Request / Deadline (Optional)</Label>
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button
        type="button"
        variant="outline"
        className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {deadline ? format(deadline, "PPP") : "Pilih tanggal deadline"}
      </Button>
    </DialogTrigger>

    <DialogContent className="m-0 p-0">
  <DialogTitle className="sr-only">Pilih Tanggal</DialogTitle>
  <DialogDescription className="sr-only">Gunakan kalender untuk memilih tanggal</DialogDescription>
  <div className="relative rounded-md border bg-white shadow-md">
    <Calendar
      mode="single"
      selected={deadline}
      onSelect={(date) => {
        if (date) setDeadline(date) // Set the Date object in state
        setOpen(false)
      }}
      initialFocus
      className="p-2 rounded-md"
    />
  </div>
</DialogContent>

  </Dialog>
</div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">Buat Tiket</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  )
}
function normalizeDate(date: Date): string {
  // Buat date dengan jam 00:00:00 lokal, supaya tidak bergeser
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // Return as ISO string date part to match Ticket interface
  return normalizedDate.toISOString().split('T')[0];
}

