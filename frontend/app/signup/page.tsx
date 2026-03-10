import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Sign up</p>
          <h1 className="mt-3 text-5xl font-semibold text-white">Create your ScaleLab workspace.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Start designing distributed systems, save architecture drafts, and compare simulation runs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/" variant="ghost">
              Back to landing
            </Button>
            <Button href="/login" variant="primary">
              Already have an account?
            </Button>
          </div>
        </section>

        <Card title="Create account" eyebrow="Project access">
          <AuthForm mode="signup" />
        </Card>
      </div>
    </main>
  );
}
