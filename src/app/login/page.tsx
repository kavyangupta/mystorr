"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons";
import { useToast } from "@/components/ui/toast";
import { APP_NAME, appUrl } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const toast = useToast();

  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  // If the visitor arrived from a homepage template (/login?category=X),
  // stash the choice so onboarding can pre-select it after auth. localStorage
  // survives both the email flow and the Google OAuth redirect roundtrip.
  React.useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c && ["jewellery", "clothing", "homemade", "food"].includes(c)) {
      localStorage.setItem("mystorr-template-category", c);
      setMode("signup");
    }
  }, []);

  async function routeAfterAuth(userId: string) {
    const { data } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    router.replace(data ? "/dashboard" : "/onboarding");
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast("Enter your email and password", "error");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          toast("Check your email to confirm your account", "success");
          setLoading(false);
          return;
        }
        await routeAfterAuth(data.user!.id);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        await routeAfterAuth(data.user.id);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong", "error");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${appUrl()}/auth/callback` },
    });
    if (error) {
      toast(error.message, "error");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] rounded-card bg-card p-6 shadow-card">
        <div className="text-center">
          <Link
            href="/"
            className="text-[28px] font-extrabold tracking-tight text-brand"
          >
            {APP_NAME}
          </Link>
          <p className="mt-1 text-sm text-muted">
            {mode === "signin"
              ? "Welcome back to your shop"
              : "Create your shop in minutes"}
          </p>
        </div>

        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={handleGoogle}
          loading={googleLoading}
        >
          {!googleLoading && <GoogleIcon className="h-4 w-4" />}
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            {mode === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {mode === "signin" ? "New to MYSTORR?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-brand hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
