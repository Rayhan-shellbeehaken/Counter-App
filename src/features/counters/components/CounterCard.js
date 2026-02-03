import { View, Text, TouchableOpacity } from 'react-native';
import { useCounterStore } from '@/store/counterStore';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { v4 as uuid } from 'uuid';
export default function CounterCard({ counter }) {
  const { increment, decrement } = useCounterStore();
const { init, registerAction, undo, redo } = useUndoRedo(counterId, setValue);

useEffect(() => {
  init();
}, []);

const onIncrement = () => {
  const prev = value;
  const next = value + step;

  setValue(next);

  registerAction({
    id: uuid(),
    counterId,
    type: 'INCREMENT',
    payload: {
      prevValue: prev,
      nextValue: next,
      delta: step
    },
    timestamp: Date.now()
  });
};
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
