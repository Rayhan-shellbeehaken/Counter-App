/**
 * Analytics Service
 * Utility functions for analytics calculations
 */

import { TimePeriodEnum } from '@/enums/AnalyticsEnums';

/**
 * Get days count for a given time period
 * @param {string} period - Time period enum value
 * @returns {number} - Number of days
 */
export const getDaysForPeriod = (period) => {
  switch (period) {
    case TimePeriodEnum.SEVEN_DAYS:
      return 7;
    case TimePeriodEnum.THIRTY_DAYS:
      return 30;
    case TimePeriodEnum.NINETY_DAYS:
      return 90;
    default:
      return 7;
  }
};

/**
 * Get label for a given time period
 * @param {string} period - Time period enum value
 * @returns {string} - Label text
 */
export const getPeriodLabel = (period) => {
  switch (period) {
    case TimePeriodEnum.SEVEN_DAYS:
      return '7 Days';
    case TimePeriodEnum.THIRTY_DAYS:
      return '30 Days';
    case TimePeriodEnum.NINETY_DAYS:
      return '90 Days';
    default:
      return '7 Days';
  }
};

/**
 * Calculate counter statistics for a given time period
 * @param {Object} counter - Counter object
 * @param {Array} actions - History actions array
 * @param {string} period - Time period enum value
 * @returns {Object} - Statistics object { totalChanges, avgDaily, currentValue, name }
 */
export const calculateCounterStats = (counter, actions = [], period) => {
  const days = getDaysForPeriod(period);
  const daysInMs = days * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - daysInMs);

  if (!Array.isArray(actions)) {
    return {
      totalChanges: 0,
      avgDaily: 0,
      currentValue: counter?.value || 0,
      name: counter?.name || 'Unknown',
    };
  }

  const relevantActions = actions.filter((action) => {
    const actionDate = new Date(action?.timestamp || Date.now());
    return actionDate >= cutoffDate;
  });

  const totalChanges = relevantActions.length;
  const avgDaily = days > 0 ? (totalChanges / days).toFixed(2) : 0;

  return {
    totalChanges,
    avgDaily: parseFloat(avgDaily),
    currentValue: counter?.value || 0,
    name: counter?.name || 'Unknown',
  };
};

/**
 * Get chart data points for a counter
 * @param {Array} actions - History actions array
 * @param {string} period - Time period enum value
 * @returns {Array} - Array of { date, value } for chart
 */
export const getChartDataPoints = (actions = [], period) => {
  const days = getDaysForPeriod(period);
  const daysInMs = days * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - daysInMs);

  if (!Array.isArray(actions)) {
    return [];
  }

  const relevantActions = actions.filter((action) => {
    const actionDate = new Date(action?.timestamp || Date.now());
    return actionDate >= cutoffDate;
  });

  // Group by day
  const dailyData = {};
  let currentValue = 0;

  relevantActions.forEach((action) => {
    const date = new Date(action?.timestamp || Date.now());
    const dateKey = date.toISOString().split('T')[0];
    if (action?.nextValue !== undefined) {
      currentValue = action.nextValue;
    }
    dailyData[dateKey] = currentValue;
  });

  // Convert to array format
  const dataPoints = Object.entries(dailyData).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: value || 0,
  }));

  return dataPoints.length > 0 ? dataPoints : [];
};
