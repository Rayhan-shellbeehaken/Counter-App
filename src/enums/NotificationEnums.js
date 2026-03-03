export const NotificationTypeEnum = Object.freeze({
  GOAL_REMINDER:   'GOAL_REMINDER',   // legacy (kept for safety)
  GOAL_HALF_TIME:  'GOAL_HALF_TIME',  // fires at 50% of time limit
  GOAL_DEADLINE:   'GOAL_DEADLINE',   // fires when time limit expires
  GOAL_COMPLETED:  'GOAL_COMPLETED',  // fires immediately on completion
});