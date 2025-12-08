"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const missing: string[] = [];
    if (!email.trim()) missing.push("E-mail");
    if (!password.trim()) missing.push("Wachtwoord");

    if (missing.length > 0) {
      setErrors([`Vul alle verplichte velden in: ${missing.join(", ")}.`]);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
      router.push("/dashboard");
      return;
    }

    const data = await res.json().catch(() => null);

    if (data?.errors) {
      // Laravel validation errors
      const all = Object.values(data.errors).flat() as string[];
      setErrors(all);
    } else if (data?.message) {
      setErrors([data.message]);
    } else {
      setErrors(["Inloggen mislukt, probeer opnieuw."]);
    }
  }

  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-92 m-auto h-fit w-full space-y-6"
      >
        {/* Titel */}
        <div>
          <h1 className="mt-6 text-balance text-xl font-semibold">
            <span className="text-muted-foreground">Welkom terug!</span> Meld je
            aan om verder te gaan
          </h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="ring-foreground/15 border-transparent ring-1"
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((msg, idx) => (
              <p key={idx} className="text-red-600 text-sm">
                {msg}
              </p>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer hover:opacity-90"
        >
          {loading ? "Bezig…" : "Inloggen"}
        </Button>

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
