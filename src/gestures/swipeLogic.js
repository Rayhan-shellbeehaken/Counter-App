export const SwipeDirection = Object.freeze({
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  NONE: "NONE",
});
export function resolveSwipeDirection({
  translationX = 0,
  threshold = 50,
} ) {
  switch (true) {
    case translationX > threshold:
      return SwipeDirection.RIGHT;

    case translationX < -threshold:
      return SwipeDirection.LEFT;

    default:
      return SwipeDirection.NONE;
  }
}
