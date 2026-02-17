import { TimePeriodEnum } from '@/enums/AnalyticsEnums';

/* ---------------------------------
   TIME HELPERS
--------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

const getPeriodDays = (period = TimePeriodEnum.SEVEN_DAYS) => {
  switch (period) {
    case TimePeriodEnum.THIRTY_DAYS:  return 30;
    case TimePeriodEnum.NINETY_DAYS:  return 90;
    default:                          return 7;
  }
};

const getDayKey = (timestamp) => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const getTodayKey = () => getDayKey(Date.now());

/* ---------------------------------
   LABELS
--------------------------------- */

export const getPeriodLabel = (period = TimePeriodEnum.SEVEN_DAYS) => {
  switch (period) {
    case TimePeriodEnum.THIRTY_DAYS:  return '30 Days';
    case TimePeriodEnum.NINETY_DAYS:  return '90 Days';
    default:                          return '7 Days';
  }
};

/* ---------------------------------
   STATS
--------------------------------- */

export const calculateCounterStats = (
  counter = {},
  actions = [],
  period = TimePeriodEnum.SEVEN_DAYS,
) => {
  const days = getPeriodDays(period);
  const cutoff = Date.now() - days * DAY_MS;

  const filteredActions = actions.filter(
    (a) => Date.parse(a?.timestamp ?? '') >= cutoff,
  );

  const totalChanges = filteredActions.reduce(
    (sum, action) => sum + Math.abs(action?.step ?? 0),
    0,
  );

  const avgDaily = days > 0 ? (totalChanges / days).toFixed(2) : '0';

  return {
    currentValue: counter?.value ?? 0,
    totalChanges,
    avgDaily,
  };
};

/* ---------------------------------
   CHART DATA (kept for compatibility)
--------------------------------- */

export const getChartDataPoints = (
  actions = [],
  period = TimePeriodEnum.SEVEN_DAYS,
) => {
  const days = getPeriodDays(period);
  const now = Date.now();

  return Array.from({ length: days }).map((_, index) => {
    const dayStart = now - (days - index) * DAY_MS;
    const dayEnd   = dayStart + DAY_MS;

    const value = actions.filter((a) => {
      const ts = Date.parse(a?.timestamp ?? '');
      return ts >= dayStart && ts < dayEnd;
    }).length;

    return { date: `${index + 1}`, value };
  });
};

/* ---------------------------------
   STREAK
--------------------------------- */

export const calculateStreakStats = (actions = []) => {
  if (!actions.length) {
    return { currentStreak: 0, bestStreak: 0, totalActiveDays: 0 };
  }

  // Build a Set of unique active day keys
  const activeDaySet = new Set(
    actions.map((a) => getDayKey(Date.parse(a?.timestamp ?? '')))
  );

  const totalActiveDays = activeDaySet.size;

  // Sort days descending
  const sortedDays = Array.from(activeDaySet).sort((a, b) =>
    b > a ? 1 : -1
  );

  // Current streak — walk back from today
  let currentStreak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = getDayKey(cursor.getTime());
    if (activeDaySet.has(key)) {
      currentStreak++;
      cursor = new Date(cursor.getTime() - DAY_MS);
    } else {
      break;
    }
  }

  // Best streak — walk through all sorted days
  let bestStreak = 0;
  let streak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    // check if consecutive (1 day apart)
    const diff = Math.round(
      (new Date(prev.split ? prev : sortedDays[i - 1]) - new Date(sortedDays[i])) / DAY_MS
    );
    if (diff === 1) {
      streak++;
    } else {
      bestStreak = Math.max(bestStreak, streak);
      streak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, streak);

  return { currentStreak, bestStreak, totalActiveDays };
};

/* ---------------------------------
   HEATMAP (last 10 weeks = 70 days)
--------------------------------- */

export const buildHeatmapData = (actions = []) => {
  const DAYS = 70;
  const now = Date.now();

  // Count actions per day
  const countByDay = {};
  actions.forEach((a) => {
    const ts = Date.parse(a?.timestamp ?? '');
    if (!ts) return;
    const key = getDayKey(ts);
    countByDay[key] = (countByDay[key] ?? 0) + 1;
  });

  // Build array of last 70 days
  return Array.from({ length: DAYS }).map((_, i) => {
    const ts = now - (DAYS - 1 - i) * DAY_MS;
    const key = getDayKey(ts);
    const count = countByDay[key] ?? 0;
    const isToday = key === getTodayKey();

    // intensity 0-4
    const intensity =
      count === 0 ? 0 :
      count <= 2  ? 1 :
      count <= 5  ? 2 :
      count <= 10 ? 3 : 4;

    return { key, count, intensity, isToday };
  });
};

/* ---------------------------------
   SNAPSHOT (for goal evaluator)
--------------------------------- */

export const getAnalyticsSnapshot = ({ actions = [] } = {}) => ({
  total: actions.reduce((sum, a) => sum + Math.abs(a?.step ?? 0), 0),
});