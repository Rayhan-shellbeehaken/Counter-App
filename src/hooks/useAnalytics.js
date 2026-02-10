import { useState, useMemo } from "react";
import { TimePeriodEnum } from "@/enums/AnalyticsEnums";
import { useCounterStore } from "@/store/counterStore";
import { useAnalyticsStore } from "@/store/analyticsStore";
import {
  calculateCounterStats,
  getChartDataPoints,
} from "@/services/analyticsService";

const noop = () => {};

export function useAnalytics({
  initialPeriod = TimePeriodEnum.SEVEN_DAYS,
} = {}) {
  const counters = useCounterStore((s) => s.counters);
  const events = useAnalyticsStore((s) => s.events);

  const [period, setPeriod] = useState(initialPeriod);

  const analyticsData = useMemo(() => {
    return counters.map((counter) => {
      const counterEvents = events.filter(
        (e) => e.counterId === counter.id
      );

      return {
        counter,
        stats: calculateCounterStats(counter, counterEvents, period),
        chart: getChartDataPoints(counterEvents, period),
      };
    });
  }, [counters, events, period]);

  return {
    period,
    setPeriod,
    analyticsData,
    hasCounters: counters.length > 0,
  };
}
