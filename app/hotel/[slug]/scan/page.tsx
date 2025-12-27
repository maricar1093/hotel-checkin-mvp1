"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ScanPage({ params }: { params: { slug: string } }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    setLoading(true)
    setStatus("idle")

    const { data, error } = await supabase
      .from("reservations")
      .select("id, status")
      .eq("guest_email", email)
      .eq("status", "checked_in")
      .single()

    if (error || !data) {
      setStatus("error")
    } else {
      setStatus("ok")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-neutral-900">
            Recepción – Validar check-in
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Correo del huésped"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? "Validando..." : "Validar"}
          </Button>

          {status === "ok" && (
            <p className="text-green-600 text-center font-medium">
              🟢 Check-in válido — Entregar llave
            </p>
          )}

          {status === "error" && (
            <p className="text-red-600 text-center">
              🔴 No hay check-in válido
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
