import { useCallback, useEffect, useState } from "react";
import { addDays, startOfDay } from "date-fns";

export type StayDateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

function getDefaults(): StayDateRange {
  const today = startOfDay(new Date());
  return { from: today, to: addDays(today, 1) };
}

let currentRange: StayDateRange = getDefaults();
const subscribers = new Set<(range: StayDateRange) => void>();

function setGlobalRange(range: StayDateRange) {
  currentRange = range;
  subscribers.forEach((cb) => cb(currentRange));
}

export function useStayDates(): [StayDateRange, (range: StayDateRange) => void] {
  const [date, setDateState] = useState<StayDateRange>(currentRange);

  useEffect(() => {
    const cb = (next: StayDateRange) => setDateState(next);
    subscribers.add(cb);
    setDateState(currentRange);
    return () => {
      subscribers.delete(cb);
    };
  }, []);

  const setDate = useCallback((range: StayDateRange) => {
    setGlobalRange(range);
  }, []);

  return [date, setDate];
}
