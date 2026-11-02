"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PixelIcon from "./PixelIcon";

const TABS = [
  { href: "/", label: "今天", icon: "sun" },
  { href: "/course", label: "课程", icon: "map" },
  { href: "/practice", label: "练习", icon: "cardI" },
  { href: "/me", label: "我的", icon: "bunny" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur">
      <ul className="mx-auto flex max-w-xl justify-around px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-xs font-bold transition ${
                  on ? "bg-grass-soft text-grass-ink" : "text-muted hover:text-ink"
                }`}
              >
                <PixelIcon name={t.icon} size={2} className={on ? "" : "opacity-60 grayscale"} />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
