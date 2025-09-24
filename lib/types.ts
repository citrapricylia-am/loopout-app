export interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: "admin" | "user"
}

export interface Ticket {
  id: string
  title: string
  shortDescription: string
  requestType: "Bug Fixing" | "Website"
  bugUrl?: string
  websiteTitle?: string
  detailRequest: string
  attachments?: string[]
  deadline?: string // MySQL biasanya return sebagai string (DATE/DATETIME)
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  userId: string
  userName: string
  userDepartment: string
  userEmail?: string
  userPhone?: string
  createdAt: string // ✅ ubah ke string
  updatedAt: string // ✅ ubah ke string
}

