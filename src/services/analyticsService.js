// src/services/analyticsService.js

import { TimePeriodEnum } from '@/enums/AnalyticsEnums';

/* ---------------------------------
   TIME HELPERS
--------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

const getPeriodDays = (period = TimePeriodEnum.SEVEN_DAYS) => {
  switch (period) {
    case TimePeriodEnum.THIRTY_DAYS:
      return 30;
    case TimePeriodEnum.NINETY_DAYS:
      return 90;
    case TimePeriodEnum.SEVEN_DAYS:
    default:
      return 7;
  }
};

/* ---------------------------------
   LABELS
--------------------------------- */

export const getPeriodLabel = (period = TimePeriodEnum.SEVEN_DAYS) => {
  switch (period) {
    case TimePeriodEnum.THIRTY_DAYS:
      return '30 Days';
    case TimePeriodEnum.NINETY_DAYS:
      return '90 Days';
    case TimePeriodEnum.SEVEN_DAYS:
    default:
      return '7 Days';
  }
};

/* ---------------------------------
   STATS CALCULATION
--------------------------------- */

export const calculateCounterStats = (
  counter = {},
  actions = [],
  period = TimePeriodEnum.SEVEN_DAYS
) => {
  const days = getPeriodDays(period);
  const cutoff = Date.now() - days * DAY_MS;

  const filteredActions = actions.filter(
    (a) => a?.timestamp >= cutoff
  );

  const totalChanges = filteredActions.length;

  const avgDaily =
    days > 0 ? (totalChanges / days).toFixed(2) : '0';

  return {
    currentValue: counter.value ?? 0,
    totalChanges,
    avgDaily,
  };
};

/* ---------------------------------
   CHART DATA
--------------------------------- */

export const getChartDataPoints = (
  actions = [],
  period = TimePeriodEnum.SEVEN_DAYS
) => {
  const days = getPeriodDays(period);
  const now = Date.now();

  const buckets = Array.from({ length: days }).map((_, index) => {
    const dayStart =
      now - (days - index) * DAY_MS;
    const dayEnd = dayStart + DAY_MS;

    const value = actions.filter(
      (a) =>
        a.timestamp >= dayStart &&
        a.timestamp < dayEnd
    ).length;

    return {
      date: `${index + 1}`,
      value,
    };
  });

  return buckets;
};
