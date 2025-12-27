import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center text-neutral-900">
          Bienvenido a tu check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-neutral-600">
            Completa el proceso antes de llegar al hotel y ahorra tiempo.
          </p>
          <Button asChild className="w-full">
          <Link href="/checkin">Empezar check-in</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}



