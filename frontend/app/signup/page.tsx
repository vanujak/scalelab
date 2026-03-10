import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 sm:px-10 lg:px-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700">Sign up</p>
          <h1 className="mt-3 text-5xl font-semibold text-slate-950">Create your ScaleLab workspace.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Start designing distributed systems, save architecture drafts, and compare simulation runs.
          </p>
          <div className="mt-6">
            <Button href="/login">Already have an account?</Button>
          </div>
        </section>

        <Card title="Create account" eyebrow="Project access">
          <AuthForm mode="signup" />
        </Card>
      </div>
    </main>
  );
}
