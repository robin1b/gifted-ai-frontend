// app/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Als je shadcn's Label hebt toegevoegd:
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Inloggen mislukt");
    }
  }

  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="max-w-92 m-auto h-fit w-full space-y-6"
      >
        {/* Kop en logo */}
        <div>
          <Link href="/" aria-label="go home">
            {/* Gebruik je eigen logo of laat de LogoIcon staan als die in je project zit */}
          </Link>
          <h1 className="mt-6 text-balance text-xl font-semibold text-black ">
            <span className="text-muted-foreground">Welkom terug!</span> Meld je
            aan om verder te gaan
          </h1>
        </div>

        {/* Invoervelden */}
        <div className="space-y-4">
          <div className="space-y-2">
            {/* label via shadcn of native <label> */}
            <Label htmlFor="email" className="block text-sm">
              E‑mail
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jij@voorbeeld.be"
              className="ring-foreground/15 border-transparent ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="block text-sm">
              Wachtwoord
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="ring-foreground/15 border-transparent ring-1"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Inlogknop */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Bezig..." : "Continue"}
        </Button>

        {/* Footer met link naar registreren */}
        <p className="text-muted-foreground text-sm">
          Heb je nog geen account?
          <Link href="/register" className="underline px-2">
            Maak account aan
          </Link>
        </p>
      </form>
    </section>
  );
}
