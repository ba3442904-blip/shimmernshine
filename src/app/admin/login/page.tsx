"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/Button";

export default function AdminLoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin",
    });

    if (res?.error) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="card-surface card-hover w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold">Owner login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Access your Shimmer N Shine dashboard.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input
              name="email"
              type="email"
              required
              className="input-surface rounded-xl px-4 py-3 text-sm"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Password
            <input
              name="password"
              type="password"
              required
              className="input-surface rounded-xl px-4 py-3 text-sm"
            />
          </label>
          <Button type="submit">Sign in</Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
