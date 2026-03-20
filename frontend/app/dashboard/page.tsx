"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sessionService } from "@/services/session.service";
import type { AuthUser } from "@/services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUser = sessionService.getUser();
      setUser(currentUser);
      if (currentUser) {
        router.replace("/playground");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  if (user === undefined) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
        <div className="h-64 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
        <Card title="Sign in to open your workspace" eyebrow="Dashboard access" tone="dark">
          <p className="text-sm leading-7 text-slate-300">
            Your workspace is personalized around the active ScaleLab account. Login or create an
            account to access the System Design Playground.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/login" variant="primary">
              Login
            </Button>
            <Button href="/signup" variant="ghost">
              Create account
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12 text-slate-100">
      <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
    </main>
  );
}

