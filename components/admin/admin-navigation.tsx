"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type AdminNavigationItem = {
  href: string;
  label: string;
  description?: string;
};

type AdminNavigationProps = {
  items: AdminNavigationItem[];
};

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation({ items }: AdminNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <nav
      className="flex flex-col gap-1 md:mt-2"
      aria-label="Admin navigation"
    >
      <div className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors md:block ${
                active
                  ? "bg-brand-forest text-white"
                  : "text-brand-ink hover:bg-brand-cream"
              }`}
            >
              <span className="whitespace-nowrap md:whitespace-normal">
                {item.label}
              </span>
              {item.description ? (
                <span
                  className={`mt-0.5 hidden text-xs md:block ${
                    active ? "text-white/80" : "text-brand-ink/60"
                  }`}
                >
                  {item.description}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 rounded-md border border-brand-gold/40 px-3 py-2 text-left text-sm font-medium text-brand-ink transition-colors hover:bg-brand-gold/10 md:mt-4"
      >
        Logout
      </button>
    </nav>
  );
}
