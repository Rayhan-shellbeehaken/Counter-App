import { useMemo } from 'react';

import { useHistoryStore } from '@/store/historyStore';
import { AnalyticsPeriodEnum } from '@/enums/AnalyticsEnums';
import {
  filterActionsByPeriod,
  calculateTotals,
  buildDailySeries,
  calculateStreak,
} from '@/services/analyticsService';

export const useAnalytics = ({
  counterId = '',
  period = AnalyticsPeriodEnum.WEEK,
} = {}) => {
  const analyticsHistory =
    useHistoryStore(
      (state) => state.analyticsHistory[counterId]
    ) ?? [];

  const analyticsData = useMemo(() => {
    const filteredActions = filterActionsByPeriod({
      actions: analyticsHistory,
      period,
    });

    return {
      total: calculateTotals(filteredActions),
      chartData: buildDailySeries(filteredActions),
      streak: calculateStreak(filteredActions),
      hasData: filteredActions.length > 0,
    };
  }, [analyticsHistory, period]);

  return analyticsData;
};
