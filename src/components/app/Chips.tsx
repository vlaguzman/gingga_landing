import { CHAN, STAGES, VIA } from "@/data/app/chips";
import type { ChannelId, StageId, ViaId } from "@/data/app/types";

export function ViaChip({ v }: { v: ViaId }) {
  const m = VIA[v];
  return (
    <span className="via" title={m.name}>
      <i className={`mark mark--${m.tone}`}>{m.mark}</i>
      <span>{m.name}</span>
    </span>
  );
}

export function ChanChip({ p }: { p: ChannelId }) {
  const m = CHAN[p];
  return (
    <span className="plat" title={m.name}>
      <i className={`mark mark--${m.tone}`}>{m.mark}</i>
      <span>{m.name}</span>
    </span>
  );
}

export function StageChip({ r }: { r: StageId }) {
  const d = STAGES[r];
  return (
    <span className={`role-chip role-chip--${r}`} title={d.hint}>
      {d.name}
    </span>
  );
}
