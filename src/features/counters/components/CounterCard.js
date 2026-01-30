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
    <View
      style={{
        backgroundColor: counter.color,
        padding: 16,
        margin: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{counter.name}</Text>
      <Text style={{ fontSize: 32 }}>{counter.value}</Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => increment(counter.id, counter.step)}
          style={{ marginRight: 10, backgroundColor: '#000', padding: 10 }}
        >
          <Text style={{ color: '#fff' }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => decrement(counter.id, counter.step)}
          style={{ backgroundColor: '#000', padding: 10 }}
        >
          <Text style={{ color: '#fff' }}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
