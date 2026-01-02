"use client";

import { useState } from "react";

interface EmailSignupFormProps {
  sourcePage?: string;
  className?: string;
}

export function EmailSignupForm({ sourcePage, className = "" }: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    
    setStatus("loading");
    
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sourcePage }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.ok) {
        setStatus("success");
        setMessage("You're subscribed! We'll send calm monthly picks.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-emerald-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 ${className}`}>
      <h3 className="font-semibold text-slate-800 mb-2">
        Get calm monthly picks
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Seasonal travel recommendations delivered monthly. No spam, ever.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      
      {status === "error" && message && (
        <p className="text-sm text-red-600 mt-3">{message}</p>
      )}
      
      <p className="text-xs text-slate-400 mt-3">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
