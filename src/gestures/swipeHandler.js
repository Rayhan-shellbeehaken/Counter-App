import { runOnJS } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

import { resolveSwipeDirection, SwipeDirection } from "@/gestures/swipeLogic";

export function createSwipeGesture({
  onSwipeRight = () => {},
  onSwipeLeft = () => {},
  threshold = 50,
}){
  return Gesture.Pan().onEnd((event = {}) => {
    const translationX = event?.translationX ?? 0;

    const direction = resolveSwipeDirection({
      translationX,
      threshold,
    });

    switch (direction) {
      case SwipeDirection.RIGHT:
        runOnJS(onSwipeRight)();
        break;

      case SwipeDirection.LEFT:
        runOnJS(onSwipeLeft)();
        break;

      case SwipeDirection.NONE:
      default:
        break;
    }
  });
}
