"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, activeClassName, idleClassName }) {
  const pathname = usePathname();
  const activo = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={activo ? activeClassName : idleClassName}>
      {children}
    </Link>
  );
}