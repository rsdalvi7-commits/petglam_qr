import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function PetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const { data: tokenRow } = await supabase
    .from("qr_tokens")
    .select("*, pets(*)")
    .eq("token", token)
    .single()

  if (!tokenRow) {
    return (
      <main className="min-h-screen bg-white max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Invalid collar</h1>
        <p className="text-gray-500 mt-2">This QR code is not recognised. Please contact PetGlam support.</p>
      </main>
    )
  }

  if (!tokenRow.activated) {
    redirect(`/register/${token}`)
  }

  const pet = tokenRow.pets

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Pet details</h1>

      <div className="mt-6 space-y-4">
        {pet.pet_name && (
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Pet name</p>
            <p className="text-lg font-semibold text-gray-900">{pet.pet_name}</p>
          </div>
        )}

        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Owner phone number</p>
          <a href={`tel:${pet.owner_phone}`} className="text-lg font-semibold text-sky-600 hover:text-sky-500 hover:underline">
            📞 {pet.owner_phone}
          </a>
        </div>

        {pet.owner_phone2 && (
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Alternate phone number</p>
            <a href={`tel:${pet.owner_phone2}`} className="text-lg font-semibold text-sky-600 hover:text-sky-500 hover:underline">
              📞 {pet.owner_phone2}
            </a>
          </div>
        )}

        <div className="border border-gray-200 rounded-xl p-4 min-h-[100px]">
          <p className="text-sm text-gray-500">Address</p>
          <p className="text-lg font-semibold text-gray-900 mt-2 whitespace-pre-wrap">{pet.address}</p>
        </div>

        {pet.medical_notes && (
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Medical notes</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{pet.medical_notes}</p>
          </div>
        )}
      </div>
    </main>
  )
}