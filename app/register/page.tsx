"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      }),
    });

    setLoading(false);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.message || "Registratie mislukt.");
      return;
    }

    router.push("/dashboard");
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
            <span className="text-2xl font-bold">MijnLogo</span>
          </Link>

          <h1 className="mt-6 text-balance text-xl font-semibold">
            <span className="text-muted-foreground">Welkom!</span> Maak een
            account aan om verder te gaan
          </h1>
        </div>

        {/* Invoervelden */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-sm">
              Naam
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jouw naam"
              className="ring-foreground/15 border-transparent ring-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Email
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

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm" className="block text-sm">
              Herhaal wachtwoord
            </Label>
            <Input
              id="passwordConfirm"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className="ring-foreground/15 border-transparent ring-1"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Bezig…" : "Account aanmaken"}
        </Button>

        {/* Footer */}
        <p className="text-muted-foreground text-sm">
          Heb je al een account?
          <Link href="/login" className="underline px-2">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}
