"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { sessionService } from "@/services/session.service";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  useEffect(() => {
    if (sessionService.getUser()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = isSignup
        ? await authService.register({ name: name.trim(), email: email.trim(), password })
        : await authService.login({ email: email.trim(), password });

      sessionService.setUser(response.user);
      setStatus("success");
      setMessage(`${response.message} Redirecting to dashboard...`);
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Request failed.");
    }
  }

  const inputStyles = "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder-slate-500 focus:border-cyan-500 focus:bg-white/10";
  const labelStyles = "text-sm font-medium text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSignup ? (
        <label className="block space-y-2">
          <span className={labelStyles}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={status === "submitting"}
            className={inputStyles}
            placeholder="Ada Lovelace"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className={labelStyles}>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={status === "submitting"}
          className={inputStyles}
          placeholder="you@scalelab.dev"
        />
      </label>

      <label className="block space-y-2">
        <span className={labelStyles}>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          disabled={status === "submitting"}
          className={inputStyles}
          placeholder="At least 8 characters"
        />
      </label>

      <div className="pt-2">
        <Button type="submit" variant="primary" disabled={status === "submitting"}>
          <span className="w-full text-center">
            {status === "submitting" ? "Authenticating..." : isSignup ? "Create account" : "Login securely"}
          </span>
        </Button>
      </div>

      {message ? (
        <div className={`rounded-xl p-4 text-sm font-medium border flex justify-center text-center ${status === "error" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
          {message}
        </div>
      ) : null}
    </form>
  );
}
