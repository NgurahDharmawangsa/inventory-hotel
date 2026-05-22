"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Loader2, KeyRound, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowLoadingOverlay(true);
      // Delay redirect to show loading animation
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [state]);

  useEffect(() => {
    if (isPending) {
      setShowLoadingOverlay(true);
    } else if (state && !state.success) {
      setShowLoadingOverlay(false);
    }
  }, [isPending, state]);

  return (
    <>
      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d14]/95 backdrop-blur-md animate-in fade-in-0 duration-300">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[rgba(201,163,66,0.05)] blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDelay: "700ms" }} />
          </div>

          {/* Loading content */}
          <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
            {/* Spinning loader with glow effect */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-[#c9a342]/20 blur-xl animate-pulse" />
              
              {/* Main spinner */}
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a342]/20 to-transparent border border-[#c9a342]/30 shadow-[0_0_30px_rgba(201,163,66,0.15)]">
                <Loader2 className="w-10 h-10 text-[#c9a342] animate-spin" strokeWidth={2.5} />
              </div>

              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c9a342]/40 animate-spin" style={{ animationDuration: "1.5s" }} />
            </div>

            {/* Loading text */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-foreground tracking-wide animate-pulse">
                {state?.success ? "Login Successful!" : "Verifying Credentials..."}
              </p>
              
              {/* Animated dots */}
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#c9a342] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#c9a342] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#c9a342] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>

            {/* Sankara branding */}
            <div className="mt-4 flex flex-col items-center gap-1 opacity-60">
              <span className="font-mono text-[9px] font-extrabold text-[#e8c05a] tracking-widest uppercase">
                The Sankara
              </span>
              <span className="font-mono text-[8px] text-muted-foreground/60 tracking-widest uppercase">
                IT System
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0d14] via-[#101524] to-[#05060a] p-4 overflow-hidden">
      {/* Glow elements in the background */}
      <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] rounded-full bg-[rgba(201,163,66,0.03)] blur-3xl pointer-events-none" />
      <div className="absolute left-[-10%] bottom-[-20%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Decorative luxury abstract lines */}
      <div className="absolute top-10 left-10 opacity-5 pointer-events-none hidden md:block">
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#c9a342" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[spin_120s_linear_infinite]" />
          <circle cx="50" cy="50" r="30" stroke="#c9a342" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-8 duration-500">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Emblem stars */}
          <div className="inline-flex items-center gap-1 bg-[rgba(201,163,66,0.12)] border border-[rgba(201,163,66,0.25)] rounded-full px-3 py-1 mb-4 shadow-sm">
            <span className="font-mono text-[9px] font-extrabold text-[#e8c05a] tracking-widest uppercase leading-none">IT SYSTEM SECURE</span>
          </div>

          <h2 className="font-heading font-black text-2xl text-foreground tracking-wider leading-tight uppercase">
            The Sankara
          </h2>
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase font-semibold mt-1">
            Suites & Villas
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#1a2235]/60 backdrop-blur-xl border border-[rgba(201,163,66,0.12)] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="mb-6 space-y-1.5">
            <h3 className="text-xl font-bold text-foreground">Sign In</h3>
            <p className="text-xs font-medium text-muted-foreground">
              Please enter your administrator credentials to manage IT Inventory.
            </p>
          </div>

          <form action={action} className="space-y-5">
            {/* Error Notification */}
            {state && !state.success && (
              <div className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-500 animate-in fade-in-0 duration-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{state.error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@thesankarasuite.com"
                  className="flex h-10 w-full rounded-lg border border-border bg-[#0f1420]/80 pl-10 pr-4 text-sm shadow-xs transition-all duration-300 placeholder:text-muted-foreground/40 focus:border-[#c9a342]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a342]/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="flex h-10 w-full rounded-lg border border-border bg-[#0f1420]/80 pl-10 pr-4 text-sm shadow-xs transition-all duration-300 placeholder:text-muted-foreground/40 focus:border-[#c9a342]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a342]/30"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 rounded-lg bg-[#c9a342] text-[#0a0d14] font-extrabold uppercase tracking-wider text-xs transition-all duration-300 hover:bg-[#b08b35] hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(201,163,66,0.25)] focus:ring-2 focus:ring-[#c9a342]/50 disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Session...
                </>
              ) : (
                "Authorize Login"
              )}
            </Button>
          </form>
        </div>

        {/* Footer Meta */}
        <p className="mt-8 text-center text-[10px] font-mono tracking-widest text-muted-foreground/40 uppercase">
          Secured by Sankara IT Department &copy; {new Date().getFullYear()}
        </p>
      </div>
      </div>
    </>
  );
}
