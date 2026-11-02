import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SharedProps = {
  children: ReactNode;
  className?: string;
  /** Show a trailing arrow that appears on group hover */
  arrow?: boolean;
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

type SpanProps = SharedProps & {
  as: "span";
  href?: never;
};

function UnderlineTrack() {
  return (
    <span className="mt-1 block h-px w-full overflow-clip" aria-hidden="true">
      <span className="flex h-full w-[calc(200%+12px)] gap-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-x-[calc(50%+6px)]">
        <span className="flex h-full flex-1 justify-end">
          <span className="h-full w-[65%] bg-current" />
        </span>
        <span className="h-full flex-1 bg-current" />
      </span>
    </span>
  );
}

function Label({
  children,
  arrow,
}: {
  children: ReactNode;
  arrow?: boolean;
}) {
  return (
    <span>
      {children}
      {arrow ? (
        <span
          className="inline-block -translate-x-1 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden="true"
        >
          {" →"}
        </span>
      ) : null}
    </span>
  );
}

export default function LinkUnderline(
  props: AnchorProps | NextLinkProps | SpanProps,
) {
  const { children, className = "", arrow } = props;
  const content = (
    <>
      <Label arrow={arrow}>{children}</Label>
      <UnderlineTrack />
    </>
  );

  if (props.as === "span") {
    return (
      <span className={`relative inline-flex w-fit flex-col ${className}`.trim()}>
        {content}
      </span>
    );
  }

  const classes =
    `group relative inline-flex w-fit flex-col ${className}`.trim();

  if (props.as === "link") {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { as: _as, arrow: _arrow, className: _c, children: _ch, ...anchorProps } =
    props as AnchorProps;

  return (
    <a {...anchorProps} href={props.href} className={classes}>
      {content}
    </a>
  );
}
