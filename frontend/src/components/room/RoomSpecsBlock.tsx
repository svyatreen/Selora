import type { ReactElement } from 'react';
import {
  Maximize2, Building2, Eye, BedDouble, Bath, Volume2, Cigarette,
} from 'lucide-react';
import {
  VIEW_LABELS, FLOOR_LABELS, BATH_LABELS, BED_TYPE_LABELS,
} from '@/lib/amenity-codes';

type Room = {
  sizeSqm?: number | null;
  floor?: string | null;
  viewType?: string | null;
  bedConfiguration?: Array<{ type: string; count: number }> | null;
  bathType?: string | null;
  soundproofing?: boolean | null;
  nonSmoking?: boolean | null;
};

type Strings = {
  size: string;
  floor: string;
  view: string;
  bed: string;
  bath: string;
  soundproofed: string;
  nonSmoking: string;
};

export function RoomSpecsBlock({
  room,
  lang,
  s,
}: {
  room: Room;
  lang: 'ru' | 'en';
  s: Strings;
}) {
  const items: Array<{ icon: ReactElement; label: string; value: string }> = [];

  if (room.sizeSqm) {
    items.push({
      icon: <Maximize2 className="h-5 w-5" />,
      label: s.size,
      value: `${room.sizeSqm} ${lang === 'ru' ? 'м²' : 'm²'}`,
    });
  }

  if (room.floor) {
    const fm = FLOOR_LABELS[room.floor];
    items.push({
      icon: <Building2 className="h-5 w-5" />,
      label: s.floor,
      value: fm ? (lang === 'ru' ? fm.ru : fm.en) : room.floor,
    });
  }

  if (room.viewType) {
    const vm = VIEW_LABELS[room.viewType];
    items.push({
      icon: <Eye className="h-5 w-5" />,
      label: s.view,
      value: vm ? (lang === 'ru' ? vm.ru : vm.en) : room.viewType,
    });
  }

  if (room.bedConfiguration && room.bedConfiguration.length > 0) {
    const beds = room.bedConfiguration
      .map((b) => {
        const meta = BED_TYPE_LABELS[b.type];
        const name = meta ? (lang === 'ru' ? meta.ru : meta.en) : b.type;
        return b.count > 1 ? `${b.count}× ${name}` : name;
      })
      .join(' + ');
    items.push({
      icon: <BedDouble className="h-5 w-5" />,
      label: s.bed,
      value: beds,
    });
  }

  if (room.bathType) {
    const bm = BATH_LABELS[room.bathType];
    items.push({
      icon: <Bath className="h-5 w-5" />,
      label: s.bath,
      value: bm ? (lang === 'ru' ? bm.ru : bm.en) : room.bathType,
    });
  }

  if (items.length === 0 && !room.soundproofing && !room.nonSmoking) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="bg-secondary/40 rounded-xl p-4 flex items-start gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
              {it.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{it.label}</p>
              <p className="font-semibold text-sm truncate">{it.value}</p>
            </div>
          </div>
        ))}
      </div>
      {(room.soundproofing || room.nonSmoking) && (
        <div className="flex flex-wrap gap-2">
          {room.soundproofing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <Volume2 className="h-3.5 w-3.5" />
              {s.soundproofed}
            </span>
          )}
          {room.nonSmoking && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-medium">
              <Cigarette className="h-3.5 w-3.5" />
              {s.nonSmoking}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
