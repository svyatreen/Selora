import { useEffect, useState } from 'react';
import { GitCompare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'selora-compare-list';
const MAX_COMPARE = 4;

export function getCompareList(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'number') : [];
  } catch {
    return [];
  }
}

export function setCompareList(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('selora:compare-changed'));
}

export function useCompareList() {
  const [list, setList] = useState<number[]>(() => getCompareList());

  useEffect(() => {
    const handler = () => setList(getCompareList());
    window.addEventListener('selora:compare-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('selora:compare-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return {
    list,
    add: (id: number) => {
      const cur = getCompareList();
      if (cur.includes(id)) return;
      if (cur.length >= MAX_COMPARE) return;
      setCompareList([...cur, id]);
    },
    remove: (id: number) => {
      setCompareList(getCompareList().filter((x) => x !== id));
    },
    toggle: (id: number) => {
      const cur = getCompareList();
      if (cur.includes(id)) {
        setCompareList(cur.filter((x) => x !== id));
      } else if (cur.length < MAX_COMPARE) {
        setCompareList([...cur, id]);
      }
    },
    clear: () => setCompareList([]),
    isFull: list.length >= MAX_COMPARE,
    has: (id: number) => list.includes(id),
  };
}

export function CompareButton({
  hotelId,
  variant = 'default',
}: {
  hotelId: number;
  variant?: 'default' | 'outline' | 'ghost';
}) {
  const { t } = useTranslation();
  const compare = useCompareList();
  const inList = compare.has(hotelId);

  const onClick = () => {
    if (inList) {
      compare.remove(hotelId);
      toast.success(t('compare.removed'));
    } else if (compare.list.length >= MAX_COMPARE) {
      toast.error(t('compare.maxReached', { max: MAX_COMPARE }));
    } else {
      compare.add(hotelId);
      toast.success(
        t('compare.added', { count: compare.list.length + 1 }),
      );
    }
  };

  return (
    <Button
      variant={inList ? 'default' : variant}
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      {inList ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
      {inList ? t('compare.inCompare') : t('compare.addToCompare')}
    </Button>
  );
}
