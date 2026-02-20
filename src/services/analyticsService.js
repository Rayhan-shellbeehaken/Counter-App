import { TimePeriodEnum } from '@/enums/AnalyticsEnums';

/* ---------------------------------
   TIME HELPERS
--------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

const getPeriodDays = (
  period = TimePeriodEnum.SEVEN_DAYS
) => {
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

export const getPeriodLabel = (
  period = TimePeriodEnum.SEVEN_DAYS
) => {
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
   STATS CALCULATION (FIXED)
--------------------------------- */

export const calculateCounterStats = (
  counter = {},
  actions = [],
  period = TimePeriodEnum.SEVEN_DAYS
) => {
  const days = getPeriodDays(period);
  const cutoff = Date.now() - days * DAY_MS;

  /* ✅ FIX: convert timestamp string → number */
  const filteredActions = actions.filter(
    (a) =>
      Date.parse(a?.timestamp ?? '') >= cutoff
  );

  const totalChanges = filteredActions.reduce(
    (sum, action) =>
      sum + Math.abs(action?.step ?? 0),
    0
  );

  const avgDaily =
    days > 0
      ? (totalChanges / days).toFixed(2)
      : '0';

  return {
    currentValue: counter?.value ?? 0,
    totalChanges,
    avgDaily,
  };
};

/* ---------------------------------
   CHART DATA (FIXED)
--------------------------------- */

export const getChartDataPoints = (
  actions = [],
  period = TimePeriodEnum.SEVEN_DAYS
) => {
  const days = getPeriodDays(period);
  const now = Date.now();

  return Array.from({ length: days }).map(
    (_, index) => {
      const dayStart =
        now - (days - index) * DAY_MS;
      const dayEnd = dayStart + DAY_MS;

      const value = actions.filter(
        (a) => {
          const ts = Date.parse(
            a?.timestamp ?? ''
          );
          return ts >= dayStart && ts < dayEnd;
        }
      ).length;

      return {
        date: `${index + 1}`,
        value,
      };
    }
  );
};

/* ---------------------------------
   SNAPSHOT (GOALS)
--------------------------------- */

export const getAnalyticsSnapshot = ({
  actions = [],
} = {}) => {
  return {
    total: actions.reduce(
      (sum, action) =>
        sum + Math.abs(action?.step ?? 0),
      0
    ),
  };
};
