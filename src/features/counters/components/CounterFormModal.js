import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { CounterIconEnum, CounterCategoryEnum, CounterColorEnum } from '@/enums/CounterEnums';

const AVAILABLE_ICONS = Object.values(CounterIconEnum);
const AVAILABLE_COLORS = Object.values(CounterColorEnum);
const AVAILABLE_CATEGORIES = Object.values(CounterCategoryEnum);

const defaultProps = {
  visible: false,
  onClose: () => {},
  onSubmit: () => {},
};

 
export default function CounterFormModal({ 
  visible = defaultProps.visible, 
  onClose = defaultProps.onClose, 
  onSubmit = defaultProps.onSubmit 
}) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(CounterIconEnum.GENERIC);
  const [selectedCategory, setSelectedCategory] = useState(CounterCategoryEnum.GENERAL);
  const [step, setStep] = useState('1');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  const handleSubmit = () => {
    if (!validateFormInput(name, minValue, maxValue)) return;

    const formData = getFormData(
      name,
      selectedIcon,
      selectedCategory,
      step,
      minValue,
      maxValue
    );

    onSubmit(formData);
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
          {renderFormHeader()}
          {renderNameInput(name, setName)}
          {renderIconSelection(selectedIcon, setSelectedIcon)}
          {renderCategorySelection(selectedCategory, setSelectedCategory)}
          {renderStepSelection(step, setStep)}
          {renderMinValueInput(minValue, setMinValue)}
          {renderMaxValueInput(maxValue, setMaxValue)}
          {renderPreview(selectedIcon, name)}
        </ScrollView>

        {renderActionButtons(onClose, handleSubmit)}
      </View>
    </Modal>
  );

  
  function resetForm() {
    setName('');
    setSelectedIcon(CounterIconEnum.GENERIC);
    setSelectedCategory(CounterCategoryEnum.GENERAL);
    setStep('1');
    setMinValue('');
    setMaxValue('');
  }
}

 
const validateFormInput = (name, minValue, maxValue) => {
  if (!name.trim()) {
    Alert.alert('Error', 'Please enter a counter name');
    return false;
  }

  const minNum = minValue ? parseInt(minValue) : null;
  const maxNum = maxValue ? parseInt(maxValue) : null;

  if (minNum !== null && maxNum !== null && minNum > maxNum) {
    Alert.alert('Error', 'Min value cannot be greater than max value');
    return false;
  }

  return true;
};

 
const getFormData = (name, icon, category, step, minValue, maxValue) => {
  const randomColor = AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
  const stepNum = parseInt(step) || 1;
  const minNum = minValue ? parseInt(minValue) : null;
  const maxNum = maxValue ? parseInt(maxValue) : null;

  return {
    name: name.trim(),
    icon,
    color: randomColor,
    category,
    step: stepNum,
    minValue: minNum,
    maxValue: maxNum,
  };
};

 
const renderFormHeader = () => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
      Create New Counter
    </Text>
  </View>
);

const renderNameInput = (value, onChange) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>
      Counter Name
    </Text>
    <TextInput
      placeholder="e.g., Water Intake, Exercise"
      value={value}
      onChangeText={onChange}
      style={getInputStyle()}
    />
  </View>
);
 
const renderIconSelection = (selected, onChange) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
      Select Icon
    </Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {AVAILABLE_ICONS.map((icon) => (
        <TouchableOpacity
          key={icon}
          onPress={() => onChange(icon)}
          style={getIconButtonStyle(selected === icon)}
        >
          <Text style={{ fontSize: 32 }}>{icon}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

 
const renderCategorySelection = (selected, onChange) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
      Category
    </Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {AVAILABLE_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onChange(category)}
          style={getCategoryButtonStyle(selected === category)}
        >
          <Text
            style={{
              color: selected === category ? '#fff' : '#000',
              fontWeight: 'bold',
              fontSize: 12,
            }}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

 
const renderStepSelection = (value, onChange) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>
      Increment/Decrement Step
    </Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {['1', '5', '10'].map((val) => (
        <TouchableOpacity
          key={val}
          onPress={() => onChange(val)}
          style={getStepButtonStyle(value === val)}
        >
          <Text
            style={{
              color: value === val ? '#fff' : '#000',
              fontWeight: 'bold',
            }}
          >
            +{val}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        placeholder="Custom"
        value={value === '1' || value === '5' || value === '10' ? '' : value}
        onChangeText={(text) => onChange(text || '1')}
        keyboardType="number-pad"
        style={getInputStyle()}
      />
    </View>
  </View>
);

 
const renderMinValueInput = (value, onChange) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>
      Min Value (Optional)
    </Text>
    <TextInput
      placeholder="e.g., 0"
      value={value}
      onChangeText={onChange}
      keyboardType="number-pad"
      style={getInputStyle()}
    />
  </View>
);

 
const renderMaxValueInput = (value, onChange) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>
      Max Value (Optional)
    </Text>
    <TextInput
      placeholder="e.g., 100"
      value={value}
      onChangeText={onChange}
      keyboardType="number-pad"
      style={getInputStyle()}
    />
  </View>
);

 
const renderPreview = (icon, name) => (
  <View style={{ marginBottom: 20, padding: 12, backgroundColor: '#4cc9f0', borderRadius: 8 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ fontSize: 32, marginRight: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {name || 'Counter Name'}
      </Text>
    </View>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>0</Text>
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <View style={{ flex: 1, backgroundColor: '#000', paddingVertical: 8, borderRadius: 4, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#000', paddingVertical: 8, borderRadius: 4, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>-</Text>
      </View>
    </View>
  </View>
);

 
const renderActionButtons = (onClose, onSubmit) => (
  <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#ddd' }}>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <TouchableOpacity
        onPress={onClose}
        style={getActionButtonStyle('#e8e8e8')}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSubmit}
        style={getActionButtonStyle('#000')}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#fff' }}>
          Create Counter
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
 
const getInputStyle = () => ({
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 10,
  fontSize: 14,
});
 
const getIconButtonStyle = (isSelected) => ({
  width: '22%',
  aspectRatio: 1,
  borderRadius: 8,
  backgroundColor: isSelected ? '#000' : '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: isSelected ? 2 : 0,
  borderColor: '#000',
});

const getCategoryButtonStyle = (isSelected) => ({
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: isSelected ? '#000' : '#e8e8e8',
});

const getStepButtonStyle = (isSelected) => ({
  flex: 1,
  paddingVertical: 10,
  borderRadius: 8,
  backgroundColor: isSelected ? '#000' : '#e8e8e8',
  alignItems: 'center',
});
 
const getActionButtonStyle = (backgroundColor) => ({
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor,
  alignItems: 'center',
});
