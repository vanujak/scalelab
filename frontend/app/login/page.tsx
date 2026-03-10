import { AuthForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 sm:px-10 lg:px-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700">Login</p>
          <h1 className="mt-3 text-5xl font-semibold text-slate-950">Return to your architecture workspace.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Sign in to continue working on systems, run simulations, and review performance trends.
          </p>
          <div className="mt-6">
            <Button href="/signup">Need an account?</Button>
          </div>
        </section>

        <Card title="Sign in" eyebrow="ScaleLab account">
          <AuthForm mode="login" />
        </Card>
      </div>
    </main>
  );
}
