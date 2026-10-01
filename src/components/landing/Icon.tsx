export type IconName = "drop" | "check" | "arrow";

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
