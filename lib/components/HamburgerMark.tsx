type HamburgerMarkProps = {
  className?: string;
};

export default function HamburgerMark({ className = "" }: HamburgerMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={10}
      viewBox="0 0 25 10"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 0.5H24.2857" stroke="currentColor" />
      <path
        d="M0 9.5H24.2857"
        stroke="currentColor"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={0.38}
        className="transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[stroke-dashoffset:0]"
      />
    </svg>
  );
}
