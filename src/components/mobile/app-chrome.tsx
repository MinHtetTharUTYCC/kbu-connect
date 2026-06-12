"use client";

import { GraduationCap, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { initials } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export function MobileScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-white text-[#1c1b1b]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TopBar({
  title = "UniMatch",
  action,
  backHref,
}: {
  title?: string;
  action?: ReactNode;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white/90 px-5 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        {backHref ? (
          <Link
            href={backHref}
            className="-ml-2 grid size-10 place-items-center text-primary"
            aria-label="Go back"
          >
            <span className="text-xl">‹</span>
          </Link>
        ) : (
          <GraduationCap className="size-6 text-primary" />
        )}
        <span className="truncate text-xl font-bold text-primary">{title}</span>
      </div>
      {action ?? (
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-[#434655] transition active:scale-95"
          aria-label="Filters"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      )}
    </header>
  );
}

export function Avatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-[#fff1ed] text-sm font-bold text-primary",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name || "Profile"}
          fill
          sizes="96px"
          unoptimized
          className="object-cover"
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}

export function Chip({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-xs font-medium",
        active
          ? "border-primary bg-primary text-white"
          : "border-black/10 bg-[#f9f9f8] text-[#6b6b6b]",
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#fff1ed] text-primary">
        <GraduationCap className="size-7" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6b6b6b]">{body}</p>
    </div>
  );
}
