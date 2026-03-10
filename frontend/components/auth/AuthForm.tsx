"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = isSignup
        ? await authService.register({ name, email, password })
        : await authService.login({ email, password });

      setStatus("success");
      setMessage(response.message);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Request failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isSignup ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
            placeholder="Ada Lovelace"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
          placeholder="you@scalelab.dev"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
          placeholder="At least 8 characters"
        />
      </label>

      <Button type="submit" variant="primary">
        {status === "submitting" ? "Submitting..." : isSignup ? "Create account" : "Login"}
      </Button>

      {message ? (
        <p className={status === "error" ? "text-sm text-rose-600" : "text-sm text-emerald-600"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
