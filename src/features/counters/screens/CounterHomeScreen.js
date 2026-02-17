import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { createCounter, CounterCategoryEnum } from '@/features/counters/model';
import { useCounterStore } from '@/store/counterStore';
import CounterCard from '@/features/counters/components/CounterCard';
import CounterFormModal from '@/features/counters/components/CounterFormModal';

const defaultProps = {
  counters: [],
  selectedCategory: null,
};

 
export default function CounterHomeScreen() {
  const { 
    counters = defaultProps.counters,
    selectedCategory = defaultProps.selectedCategory,
    setSelectedCategory, 
    getCategories, 
    deleteCounter 
  } = useCounterStore();

  const [showForm, setShowForm] = useState(false);

  const categories = getCategories();
  const currentCategory = selectedCategory || categories[0] || CounterCategoryEnum.GENERAL;
  const filteredCounters = counters.filter((c) => c.category === currentCategory);

  const handleCreateCounter = (formData) => {
    const counter = createCounter(formData);
    useCounterStore.getState().createCounter(counter);
    setShowForm(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
  };

  const handleDeleteCounter = (id) => {
    deleteCounter(id);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      {renderAddCounterButton(handleShowForm)}
      {renderCategoryFilter(categories, currentCategory, handleSelectCategory)}
      {renderCountersList(filteredCounters, handleDeleteCounter)}
      <CounterFormModal
        visible={showForm}
        onClose={handleHideForm}
        onSubmit={handleCreateCounter}
      />
    </View>
  );
}

 
const renderAddCounterButton = (onPress) => (
  <View style={{ paddingHorizontal: 10, marginBottom: 10 , marginTop:50}}>
    <TouchableOpacity
      onPress={onPress}
      style={getAddButtonStyle()}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
        + Add New Counter
      </Text>
    </TouchableOpacity>
  </View>
);
 
const renderCategoryFilter = (categories, selected, onSelect) => {
  if (categories.length === 0) return null;

  return ( 
    <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#666' }}>
        CATEGORIES
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={getCategoryTabStyle(selected === category)}
          >
            <Text style={getCategoryTabTextStyle(selected === category)}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

 
const renderCountersList = (counters, onDelete) => {
  if (counters.length === 0) {
    return renderEmptyState();
  }

  return (
    <FlatList
      data={counters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <CounterCard counter={item} />
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={getDeleteButtonStyle()}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

 
const renderEmptyState = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 16, color: '#999', marginBottom: 16 }}>
      No counters yet
    </Text>
    <TouchableOpacity style={getEmptyStateButtonStyle()}>
      <Text style={{ fontWeight: 'bold' }}>Create one now</Text>
    </TouchableOpacity>
  </View>
);

 
const getAddButtonStyle = () => ({
  paddingVertical: 12,
  backgroundColor: '#000',
  borderRadius: 8,
  alignItems: 'center',
});

 
const getCategoryTabStyle = (isSelected) => ({
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 16,
  backgroundColor: isSelected ? '#000' : '#e8e8e8',
});

 
const getCategoryTabTextStyle = (isSelected) => ({
  color: isSelected ? '#fff' : '#000',
  fontWeight: 'bold',
  fontSize: 12,
});

 
const getDeleteButtonStyle = () => ({
  marginHorizontal: 10,
  marginBottom: 5,
  padding: 8,
  backgroundColor: '#ff6b6b',
  borderRadius: 5,
  alignItems: 'center',
});

 
const getEmptyStateButtonStyle = () => ({
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#e8e8e8',
  borderRadius: 6,
});
