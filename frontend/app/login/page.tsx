import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex items-center selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <section className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur-md self-start">
              Welcome Back
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6">
              Return to your <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Architecture Lab.
              </span>
            </h1>
            <p className="max-w-xl text-lg text-slate-400 mb-10 leading-relaxed">
              Sign in to continue modeling systems, simulating burst traffic scenarios, and reviewing historical performance trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/signup" variant="primary">
                Need an account?
              </Button>
              <Button href="/" variant="ghost">
                Back to home
              </Button>
            </div>
          </section>

          <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="relative rounded-[2rem] bg-slate-950 p-8 sm:p-10 border border-white/5">
              <div className="mb-8">
                <p className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-2">ScaleLab Login</p>
                <h2 className="text-3xl font-semibold text-white">Sign In</h2>
              </div>
              <AuthForm mode="login" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
