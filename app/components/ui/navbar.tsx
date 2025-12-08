"use client";

import {
  ListBulletIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display
const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "Projects",
    href: "/projects",
    icon: DocumentDuplicateIcon,
  },
  { name: "Tasks", href: "/tasks", icon: ListBulletIcon },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div className="flex gap-[12px] grow">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 text-black rounded-md bg-gray-50 border-box p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
