"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-600"
      >
        A
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-52 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
          <div className="border-b border-zinc-800 px-4 py-3">
            <p className="text-sm font-medium text-zinc-100">Admin</p>
            <p className="text-xs text-zinc-500">admin@netpulse.io</p>
          </div>
          <div className="p-1.5">
            {[
              { label: "Profile", icon: User },
              { label: "Settings", icon: Settings },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Icon className="h-4 w-4 text-zinc-500" />
                {label}
              </button>
            ))}
          </div>
          <div className="border-t border-zinc-800 p-1.5">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
