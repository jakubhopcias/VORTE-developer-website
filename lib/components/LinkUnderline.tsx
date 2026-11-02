import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SharedProps = {
  children: ReactNode;
  className?: string;
};

type AnchorProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & {
    href: string;
    as?: "a";
  };

type NextLinkProps = SharedProps & {
  href: ComponentPropsWithoutRef<typeof Link>["href"];
  as: "link";
};

function UnderlineTrack() {
  return (
    <span className="mt-1 block h-px w-full overflow-clip" aria-hidden="true">
      <span className="flex h-full w-[calc(200%+12px)] gap-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-x-[calc(50%+6px)]">
        {/* Rest: short line flush right → space on the left */}
        <span className="flex h-full flex-1 justify-end">
          <span className="h-full w-[65%] bg-current" />
        </span>
        {/* Hover: full-width line under the whole text */}
        <span className="h-full flex-1 bg-current" />
      </span>
    </span>
  );
}

export default function LinkUnderline(props: AnchorProps | NextLinkProps) {
  const { children, className = "", href } = props;
  const classes =
    `group relative inline-flex w-fit flex-col ${className}`.trim();

  if ("as" in props && props.as === "link") {
    return (
      <Link href={href} className={classes}>
        <span>{children}</span>
        <UnderlineTrack />
      </Link>
    );
  }

  const { as: _as, ...anchorProps } = props as AnchorProps;

  return (
    <a {...anchorProps} href={href as string} className={classes}>
      <span>{children}</span>
      <UnderlineTrack />
    </a>
  );
}
