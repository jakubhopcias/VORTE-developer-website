type LogoMarkProps = {
  className?: string;
};

export default function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      className={`font-primary leading-none tracking-[0.08em] text-primary-white ${
        className ?? "text-[18px]"
      }`}
      aria-hidden
    >
      Vørte
    </span>
  );
}
