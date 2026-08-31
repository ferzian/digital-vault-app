import Link from "next/link";
import { HiShieldCheck } from "react-icons/hi2";

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({
  showTagline = true,
  size = "md",
  href = "/",
}: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-9 h-9 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
  };

  const shieldSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      <div
        className={`${iconSizes[size]} bg-linear-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0`}
      >
        <HiShieldCheck className={shieldSizes[size]} />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1 ${textSizes[size]}`}
        >
          FS-DIGITAL<span className="text-sky-500">VAULT</span>
        </span>
        {showTagline && (
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 -mt-1 font-medium tracking-wider uppercase">
            Secure Assets
          </span>
        )}
      </div>
    </Link>
  );
}
