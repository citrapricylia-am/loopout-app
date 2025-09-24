"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogoutClick = () => {
    setShowConfirm(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    window.location.href = "/"   // Redirect ke halaman home
  }

  const cancelLogout = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <header className="bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            LoopOut
          </Link>
          <nav className="flex items-center gap-4">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {currentUser.name}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 border rounded hover:bg-gray-100">
                Masuk
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Modal Konfirmasi Logout */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-center mb-4">
              Konfirmasi Logout
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari sistem?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
