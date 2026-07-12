"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminNavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Pricing History", href: "/admin/pricing/history" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Portfolio", href: "/admin/portfolio" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation() {
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
    <div className="flex w-full items-center justify-between gap-2">
      <nav
        className="flex gap-1 overflow-x-auto"
        aria-label="Admin navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#2D5016] text-white"
                  : "text-[#1A1A1A] hover:bg-[#FAF8F5]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="shrink-0 rounded-md border border-[#C8A96E] px-3 py-2 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#E8C5C5]"
      >
        Logout
      </button>
    </div>
  );
}
