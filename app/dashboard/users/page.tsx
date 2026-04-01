"use client";

import { Shield, User, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const mockUsers = [
  { id: "u1", name: "Admin", email: "admin@netpulse.io", role: "Owner", lastLogin: "Just now", mfa: true },
  { id: "u2", name: "Théodore", email: "theo@netpulse.io", role: "Admin", lastLogin: "2h ago", mfa: true },
  { id: "u3", name: "Marie Dupont", email: "marie@netpulse.io", role: "Viewer", lastLogin: "Yesterday", mfa: false },
  { id: "u4", name: "Pierre Martin", email: "pierre@netpulse.io", role: "Viewer", lastLogin: "3 days ago", mfa: false },
];

const roleConfig: Record<string, { class: string }> = {
  Owner: { class: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  Admin: { class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  Viewer: { class: "bg-zinc-700/50 text-zinc-400 border-zinc-600" },
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Users" value={mockUsers.length} icon={<Users className="h-4 w-4" />} accent="blue" />
        <StatCard title="Admins" value={2} icon={<Shield className="h-4 w-4" />} accent="violet" />
        <StatCard title="MFA Enabled" value={2} subtitle="50% of users" icon={<Shield className="h-4 w-4" />} accent="emerald" />
      </section>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-3.5">
          <p className="text-sm font-semibold text-zinc-100">Team members</p>
          <button className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400 transition hover:bg-blue-500/20">
            Invite user
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-xs">
            <thead>
              <tr className="border-b border-zinc-700/50">
                {["User", "Email", "Role", "MFA", "Last login"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/30">
              {mockUsers.map((u) => (
                <tr key={u.id} className="transition hover:bg-zinc-700/20">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-200">
                        {u.name[0]}
                      </div>
                      <span className="font-medium text-zinc-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleConfig[u.role].class}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={u.mfa ? "text-emerald-400" : "text-zinc-500"}>
                      {u.mfa ? "✓ Enabled" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
