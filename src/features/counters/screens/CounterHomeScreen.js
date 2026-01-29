import { View, FlatList, Button } from 'react-native';
import { createCounter } from '@/features/counters/model';

import { useCounterStore } from '@/store/counterStore';
import CounterCard from '@/features/counters/components/CounterCard';


export default function CounterHomeScreen() {
  const { counters, createCounter: addCounter } = useCounterStore();

  const handleAdd = () => {
    const counter = createCounter({
      name: 'Water Intake',
      color: '#4cc9f0',
      step: 1,
    });
    addCounter(counter);
  };

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Button title="Add Counter" onPress={handleAdd} />

      <FlatList
        data={counters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CounterCard counter={item} />}
      />
    </View>
  );
}
