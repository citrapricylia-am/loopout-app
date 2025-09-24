"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotProps {
  isOpen: boolean
  onToggle: () => void
}

export function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Saya adalah asisten virtual untuk Sistem Manajemen Tiket IT. Saya dapat membantu Anda dengan:\n\n• Cara membuat tiket\n• Penjelasan tentang website\n• Cara menghubungi admin\n\nAda yang bisa saya bantu?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const predefinedResponses = {
    "cara membuat tiket": {
      keywords: ["cara", "membuat", "tiket", "buat", "create", "ticket"],
      response:
        "Untuk membuat tiket baru, ikuti langkah berikut:\n\n1. Login ke sistem dengan akun Anda\n2. Klik tombol 'Buat Tiket Baru' di dashboard\n3. Isi form dengan:\n   • Judul tiket yang jelas\n   • Deskripsi masalah secara detail\n   • Pilih jenis permintaan (Bug Fixing/Website)\n   • Tentukan prioritas (Low/Medium/High)\n   • Upload dokumen jika diperlukan\n   • Pilih deadline jika urgent\n4. Klik 'Buat Tiket' untuk mengirim\n\nTiket Anda akan langsung terkirim ke admin untuk ditindaklanjuti!",
    },
    "penjelasan website": {
      keywords: ["website", "sistem", "penjelasan", "apa", "fungsi", "tentang"],
      response:
        "Sistem Manajemen Tiket IT adalah platform untuk mengelola permintaan dukungan IT di perusahaan Anda.\n\n🎯 **Fitur Utama:**\n• Pembuatan tiket dengan prioritas\n• Tracking status tiket real-time\n• Upload dokumen pendukung\n• Notifikasi otomatis\n• Dashboard admin dan user\n\n👥 **Untuk User:**\n• Buat tiket untuk masalah IT\n• Pantau progress tiket Anda\n• Komunikasi dengan admin\n\n🔧 **Untuk Admin:**\n• Kelola semua tiket masuk\n• Update status tiket\n• Kirim notifikasi ke user\n• Lihat detail dan dokumen\n\nSistem ini membantu mempercepat penyelesaian masalah IT dengan tracking yang jelas!",
    },
    "call admin": {
      keywords: ["admin", "hubungi", "kontak", "call", "bantuan", "help"],
      response:
        "Untuk menghubungi admin, Anda memiliki beberapa opsi:\n\n📞 **Kontak Langsung:**\n• Email: admin@company.com\n• Telepon: (021) 1234-5678\n• WhatsApp: +62 812-3456-7890\n\n🎫 **Melalui Sistem:**\n• Buat tiket dengan prioritas 'High' untuk masalah urgent\n• Admin akan merespons dalam 1-2 jam kerja\n• Anda akan mendapat notifikasi otomatis\n\n⏰ **Jam Kerja Admin:**\n• Senin - Jumat: 08:00 - 17:00 WIB\n• Sabtu: 08:00 - 12:00 WIB\n• Minggu: Libur (kecuali emergency)\n\n🚨 **Emergency:** Untuk masalah critical di luar jam kerja, hubungi nomor darurat: +62 811-9999-0000",
    },
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    for (const [key, data] of Object.entries(predefinedResponses)) {
      if (data.keywords.some((keyword) => message.includes(keyword))) {
        return data.response
      }
    }

    // Default response for unrecognized questions
    return "Maaf, saya belum memahami pertanyaan Anda. Saya dapat membantu dengan:\n\n• **Cara membuat tiket** - ketik 'cara membuat tiket'\n• **Penjelasan website** - ketik 'penjelasan website'\n• **Cara call admin** - ketik 'call admin'\n\nSilakan pilih salah satu topik di atas atau hubungi admin langsung untuk bantuan lebih lanjut."
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(inputMessage),
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botResponse])
    setInputMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          IT Support Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-white hover:bg-blue-700">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[280px] p-3 rounded-lg whitespace-pre-line ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
