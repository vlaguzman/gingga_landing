import Image from "next/image";

/** The GINGGA mark, scaled by width (the source is 605 × 425). */
export function Mark({ size = 22, alt = "" }: { size?: number; alt?: string }) {
  return <Image src="/assets/mark.png" alt={alt} width={size} height={Math.round((size * 425) / 605)} />;
}
