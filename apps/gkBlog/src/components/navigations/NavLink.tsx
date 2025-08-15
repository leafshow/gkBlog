import clsx from "clsx";
import Link from "next/link";

import type { ReactNode } from "react";

export type NavLinkProps = {
  title: string;
  href: string;
  icon?: ReactNode;
  onClick?: () => void;
};

function NavLink({
  title,
  href,
  icon = null,
  onClick = () => {},
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "nav-link",
        "hover:bg-slate-300/50 dark:hover:bg-slate-600/50", // 添加悬浮背景效果
      )}
      onClick={onClick}
    >
      {title}
      {icon}
    </Link>
  );
}

export default NavLink;
