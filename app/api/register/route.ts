import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const token = formData.get("token") as string
  const owner_phone = formData.get("owner_phone") as string
  const owner_phone2 = formData.get("owner_phone2") as string
  const address = formData.get("address") as string
  const pet_name = formData.get("pet_name") as string
  const medical_notes = formData.get("medical_notes") as string

  // 1. Check token exists and is not already activated
  const { data: tokenRow, error: tokenError } = await supabase
    .from("qr_tokens")
    .select("*")
    .eq("token", token)
    .single()

  if (tokenError || !tokenRow) {
    return NextResponse.json({ error: "Invalid collar token" }, { status: 404 })
  }

  if (tokenRow.activated) {
    return NextResponse.json({ error: "This collar is already registered" }, { status: 400 })
  }

  // 2. Insert pet row
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .insert({ pet_name, owner_phone, owner_phone2, address, medical_notes })
    .select()
    .single()

  if (petError || !pet) {
    return NextResponse.json({ error: "Failed to save pet details" }, { status: 500 })
  }

  // 3. Activate the token and link it to the pet
  const { error: updateError } = await supabase
    .from("qr_tokens")
    .update({ pet_id: pet.pet_id, activated: true })
    .eq("token", token)

  if (updateError) {
    return NextResponse.json({ error: "Failed to activate collar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}