import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";

import { useCounterStore } from "@/store/counterStore";
import { createSwipeGesture } from "@/gestures/swipeHandler";
export default function CounterCard({ counter = {}}) {
  const { increment, decrement } = useCounterStore();
  const { id = "", name = "", value = 0, step = 1, color = "#ddd" } = counter;
  const gesture = createSwipeGesture({
    onSwipeRight: () => increment(id, step),
    onSwipeLeft: () => decrement(id, step),
    threshold: 40,
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{
          backgroundColor: color,
          padding: 16,
          margin: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
        <Text style={{ fontSize: 32 }}>{value}</Text>
        <Text style={{ fontSize: 12, opacity: 0.6 }}>
          Swipe → increment | Swipe ← decrement
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}
