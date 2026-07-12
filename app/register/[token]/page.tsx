"use client"
import React, { useState } from "react"

export default function RegisterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = React.use(params)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("token", token)

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      setLoading(false)
      return
    }

    window.location.href = `/pet/${token}`
  }

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Register your PetGlam collar</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input name="owner_phone" placeholder="Phone number" type="tel" required
          inputMode="numeric" maxLength={10} pattern="[0-9]*"
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full" />
        <input name="owner_phone2" placeholder="Alternate phone number" type="tel" required
          inputMode="numeric" maxLength={10} pattern="[0-9]*"
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full" />
        <textarea name="address" placeholder="Address" required rows={3} maxLength={300}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full resize-none" />
        <input name="pet_name" placeholder="Pet name (Optional)" maxLength={50}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full" />
        <textarea name="medical_notes" placeholder="Medical notes (optional)" rows={3} maxLength={500}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full resize-none" />

        <button type="submit" disabled={loading}
          className="w-full bg-green-500 text-white font-semibold py-4 rounded-2xl mt-2 disabled:opacity-50">
          {loading ? "Saving..." : "Save pet profile"}
        </button>
      </form>
    </main>
  )
}