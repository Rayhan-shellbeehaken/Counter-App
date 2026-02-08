import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useCounterStore } from '@/store/counterStore';
import { useUndoRedo } from '@/hooks/useUndoRedo';

const defaultProps = {
  counter: {
    id: null,
    name: '',
    icon: '📊',
    color: '#4cc9f0',
    value: 0,
    step: 1,
    minValue: null,
    maxValue: null,
    category: 'General',
  },
};

 
export default function CounterCard({ counter = defaultProps.counter }) {
  const { increment, decrement } = useCounterStore();
  const { init, undo, redo } = useUndoRedo(counter.id);

  useEffect(() => {
    init();
  }, [counter.id]);

  const handleIncrement = () => {
    increment(counter.id, counter.step);
  };

  const handleDecrement = () => {
    decrement(counter.id, counter.step);
  };

  return (
    <View style={getCardContainerStyle(counter.color)}>
      {renderCardHeader(counter)}
      {renderCardValue(counter)}
      {renderMinMaxSection(counter.minValue, counter.maxValue)}
      {renderActionButtons(handleIncrement, handleDecrement, undo, redo)}
    </View>
  );
}

 
const getCardContainerStyle = (backgroundColor) => ({
  backgroundColor,
  padding: 16,
  margin: 10,
  borderRadius: 10,
});

 
const renderCardHeader = (counter) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
    <Text style={{ fontSize: 32, marginRight: 8 }}>{counter.icon}</Text>
    <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>
      {counter.name || 'Unnamed'}
    </Text>
  </View>
);
 
const renderCardValue = (counter) => (
  <Text style={{ fontSize: 32, marginVertical: 10, fontWeight: 'bold' }}>
    {counter.value ?? 0}
  </Text>
);

 
const renderMinMaxText = (minValue, maxValue) => {
  const hasMin = minValue !== null && minValue !== undefined;
  const hasMax = maxValue !== null && maxValue !== undefined;

  if (!hasMin && !hasMax) return null;

  let text = '';
  if (hasMin) text += `Min: ${minValue}`;
  if (hasMin && hasMax) text += ' | ';
  if (hasMax) text += `Max: ${maxValue}`;

  return text;
};

 
const renderMinMaxDisplay = (text) => (
  <Text style={{ fontSize: 11, color: '#333', marginBottom: 8 }}>
    {text}
  </Text>
);

 
const renderMinMaxSection = (minValue, maxValue) => {
  const text = renderMinMaxText(minValue, maxValue);
  if (!text) return null;
  return renderMinMaxDisplay(text);
};

 
const renderActionButtons = (onIncrement, onDecrement, onUndo, onRedo) => (
  <View style={{ flexDirection: 'row', marginTop: 10, gap: 5 }}>
    <TouchableOpacity onPress={onIncrement} style={getButtonStyle('#000')}>
      <Text style={getButtonTextStyle()}>+</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onDecrement} style={getButtonStyle('#000')}>
      <Text style={getButtonTextStyle()}>-</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onUndo} style={getButtonStyle('#666')}>
      <Text style={getButtonTextStyle(14)}>↶</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onRedo} style={getButtonStyle('#666')}>
      <Text style={getButtonTextStyle(14)}>↷</Text>
    </TouchableOpacity>
  </View>
);

 
const getButtonStyle = (backgroundColor) => ({
  flex: 1,
  backgroundColor,
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
});

 
const getButtonTextStyle = (fontSize = 16) => ({
  color: '#fff',
  fontWeight: 'bold',
  fontSize,
});