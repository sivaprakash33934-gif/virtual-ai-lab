import { iconPaths, IconName } from "./iconPaths";

export type { IconName };

interface FuturisticIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export default function FuturisticIcon({
  name,
  className = "",
  size = 24,
}: FuturisticIconProps) {
  const icon = iconPaths[name];
  if (!icon) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {icon.paths.map((p, i) => (
        <path key={i} d={p.d} fillRule={p.fillRule ?? "nonzero"} />
      ))}
    </svg>
  );
}