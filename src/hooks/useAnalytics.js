import { useMemo } from 'react';

import { useHistoryStore } from '@/store/historyStore';
import { AnalyticsPeriodEnum } from '@/enums/AnalyticsEnums';
import {
  filterActionsByPeriod,
  calculateTotals,
  buildDailySeries,
  calculateStreak,
} from '@/services/analyticsService';

/* ---------------------------------
   DEFENSIVE DEFAULTS
--------------------------------- */
const defaultProps = {
  counterId: '',
  period: AnalyticsPeriodEnum.WEEK,
};

/* ---------------------------------
   ANALYTICS HOOK
--------------------------------- */
export const useAnalytics = ({
  counterId = defaultProps.counterId,
  period = defaultProps.period,
} = defaultProps) => {
  const historyEntry = useHistoryStore(
    (state) => state.analyticsHistory?.[counterId] ?? null
  );

  const pastActions = historyEntry?.past ?? [];

  const analyticsData = useMemo(() => {
    if (!counterId || pastActions.length === 0) {
      return getEmptyAnalytics();
    }

    const filteredActions = filterActionsByPeriod({
      actions: pastActions,
      period,
    });

    return {
      total: calculateTotals(filteredActions),
      chartData: buildDailySeries(filteredActions),
      streak: calculateStreak(filteredActions),
      hasData: filteredActions.length > 0,
    };
  }, [counterId, pastActions, period]);

  return analyticsData;
};

/* ---------------------------------
   HELPERS
--------------------------------- */
const getEmptyAnalytics = () => ({
  total: 0,
  chartData: [],
  streak: 0,
  hasData: false,
});
