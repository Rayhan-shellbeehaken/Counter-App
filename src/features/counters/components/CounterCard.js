import { View, Text, TouchableOpacity } from 'react-native';
import { useCounterStore } from '@/store/counterStore';

export default function CounterCard({ counter }) {
  const { increment, decrement } = useCounterStore();

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
