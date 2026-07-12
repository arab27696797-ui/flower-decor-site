"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type AdminNavigationItem = {
  label: string;
  href: string;
};

type AdminNavigationProps = {
  items: AdminNavigationItem[];
};

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
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
      className="flex flex-col gap-1 md:flex-1"
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
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors md:whitespace-normal ${
                active
                  ? "bg-brand-forest text-white"
                  : "text-brand-ink hover:bg-brand-cream"
              }`}
            >
              {item.label}
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
