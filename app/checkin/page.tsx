"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCodeSVG } from "qrcode.react"


export default function CheckInPage() {
  const [email, setEmail] = useState("")
  const [reservation, setReservation] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [documentId, setDocumentId] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")  


  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("reservations")
      .select("*, hotels(slug)")
      .eq("guest_email", email)
      .eq("status", "booked")
      .single()

    if (error || !data) {
      setError("No encontramos una reserva activa con ese correo.")
      setReservation(null)
    } else {
      setReservation(data)
    }

    setLoading(false)
  }

  const handleCheckIn = async () => {
    if (!reservation) return
  
    setLoading(true)
    setError(null)
  
    // 1. Insertar check-in
    const { error: checkinError } = await supabase
      .from("checkins")
      .insert({
        reservation_id: reservation.id,
        completed_at: new Date().toISOString(),
      })
  
    if (checkinError) {
      setError("Ocurrió un error al guardar el check-in.")
      setLoading(false)
      return
    }
  
    // 2. Actualizar estado de la reserva
    const { error: reservationError } = await supabase
      .from("reservations")
      .update({ status: "checked_in" })
      .eq("id", reservation.id)
  
    if (reservationError) {
      setError("No se pudo actualizar la reserva.")
      setLoading(false)
      return
    }
  
    // 3. Marcar como completado
    setReservation({
      ...reservation,
      status: "checked_in",
    })
  
    setLoading(false)
  }  

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-neutral-900 text-center">
            Check-in digital
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!reservation && (
            <>
              <Input
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button
                className="w-full"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Buscando..." : "Continuar"}
              </Button>
            </>
          )}

{reservation?.status === "checked_in" && (
  <div className="text-center space-y-4">
    <p className="text-xl font-medium text-neutral-900">
      ✅ Check-in completado
    </p>

    <p className="text-sm text-neutral-600">
      Escanea este código en recepción para recibir tu llave
    </p>

    <div className="flex justify-center">
      <QRCodeSVG
        value={`${window.location.origin}/hotel/${reservation.hotels.slug}/scan`}
        size={180}
      />
    </div>
  </div>
)}

{reservation && (
  <div className="space-y-4">
    <p className="text-center text-neutral-900 font-medium">
      Completa tu check-in
    </p>

    <div className="space-y-2">
      <label className="text-sm text-neutral-700">
        Nombre completo
      </label>
      <Input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Tu nombre completo"
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm text-neutral-700">
        Documento de identidad
      </label>
      <Input
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        placeholder="Cédula / Pasaporte"
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm text-neutral-700">
        Hora estimada de llegada
      </label>
      <Input
        type="time"
        value={arrivalTime}
        onChange={(e) => setArrivalTime(e.target.value)}
      />
    </div>

    <Button
  className="w-full"
  onClick={handleCheckIn}
  disabled={
    !fullName || !documentId || !arrivalTime || loading
  }
>
  {loading ? "Guardando..." : "Finalizar check-in"}
</Button>


    <p className="text-xs text-center text-neutral-500">
      Podrás recoger tu llave al llegar al hotel
    </p>
  </div>
)}
        </CardContent>
      </Card>
    </main>
  )
}
