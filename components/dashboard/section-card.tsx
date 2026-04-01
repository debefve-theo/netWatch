"use client";

import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-800 p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        {description ? <p className="mt-1.5 text-xs text-zinc-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
