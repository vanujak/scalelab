import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex items-center selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-[20%] h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-6 sm:px-10 lg:py-0">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center min-h-[calc(100vh-3rem)]">
          <section className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 sm:mb-6">
              Create your <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Workspace.
              </span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 leading-relaxed">
              Start designing distributed systems, save architecture drafts, and compare simulation configurations in an interactive environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/login" variant="primary">
                Already have an account?
              </Button>
              <Button href="/" variant="ghost">
                Back to home
              </Button>
            </div>
          </section>

          <div className="w-full max-w-[460px] justify-self-center lg:justify-self-end rounded-[2rem] border border-white/10 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="relative rounded-[1.5rem] bg-slate-950 p-6 sm:p-8 border border-white/5">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">Sign Up</h2>
              </div>
              <AuthForm mode="signup" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
