import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';

import { createCounter, CounterCategoryEnum } from '@/features/counters/model';
import { useCounterStore } from '@/store/counterStore';
import CounterCard from '@/features/counters/components/CounterCard';
import CounterFormModal from '@/features/counters/components/CounterFormModal';
import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  counters: [],
  selectedCategory: null,
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function CounterHomeScreen({} = defaultProps) {
  const theme = useTheme();

  const {
    counters = defaultProps.counters,
    selectedCategory = defaultProps.selectedCategory,
    setSelectedCategory,
    getCategories,
    deleteCounter,
    createCounter: addCounter,
  } = useCounterStore();

  const [showForm, setShowForm] = useState(false);

  const categories = getCategories() ?? [];
  const currentCategory =
    selectedCategory || categories[0] || CounterCategoryEnum.GENERAL;

  const filteredCounters =
    counters.filter((c) => c.category === currentCategory) ?? [];

  return renderCounterHome({
    theme,
    filteredCounters,
    categories,
    currentCategory,
    showForm,
    onShowForm: () => setShowForm(true),
    onHideForm: () => setShowForm(false),
    onSelectCategory: setSelectedCategory,
    onDeleteCounter: deleteCounter,
    onAddCounter: addCounter,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderCounterHome = ({
  theme = {},
  filteredCounters = [],
  categories = [],
  currentCategory = '',
  showForm = false,
  onShowForm = () => {},
  onHideForm = () => {},
  onSelectCategory = () => {},
  onDeleteCounter = () => {},
  onAddCounter = () => {},
} = {}) => (
  <View style={getContainerStyle(theme)}>
    {renderAddCounterButton({ theme, onPress: onShowForm })}
    {renderCategoryFilter({ theme, categories, currentCategory, onSelectCategory })}
    {renderCountersList({ theme, counters: filteredCounters, onDeleteCounter })}
    {renderCounterForm({ showForm, onHideForm, onAddCounter })}
  </View>
);

const renderAddCounterButton = ({
  theme = {},
  onPress = () => {},
} = {}) => (
  <View style={getAddButtonContainerStyle()}>
    <TouchableOpacity
      onPress={onPress}
      style={getAddButtonStyle(theme)}
      activeOpacity={0.8}
    >
      <Text style={getAddButtonTextStyle(theme)}>+ Add New Counter</Text>
    </TouchableOpacity>
  </View>
);

const renderCategoryFilter = ({
  theme = {},
  categories = [],
  currentCategory = '',
  onSelectCategory = () => {},
} = {}) => {
  if (!categories.length) return null;

  return (
    <View style={getCategoryContainerStyle()}>
      <Text style={getCategoryTitleStyle(theme)}>CATEGORIES</Text>
      <View style={getCategoryRowStyle()}>
        {categories.map((category) =>
          renderCategoryTab({
            theme,
            category,
            isSelected: currentCategory === category,
            onSelectCategory,
          })
        )}
      </View>
    </View>
  );
};

const renderCategoryTab = ({
  theme = {},
  category = '',
  isSelected = false,
  onSelectCategory = () => {},
} = {}) => (
  <TouchableOpacity
    key={category}
    onPress={() => onSelectCategory(category)}
    style={getCategoryTabStyle(theme, isSelected)}
    activeOpacity={0.7}
  >
    <Text style={getCategoryTabTextStyle(theme, isSelected)}>
      {category}
    </Text>
  </TouchableOpacity>
);

const renderCountersList = ({
  theme = {},
  counters = [],
  onDeleteCounter = () => {},
} = {}) => {
  if (!counters.length) {
    return renderEmptyState({ theme });
  }

  return (
    <FlatList
      data={counters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        renderCounterItem({ theme, counter: item, onDeleteCounter })
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const renderCounterItem = ({
  theme = {},
  counter = {},
  onDeleteCounter = () => {},
} = {}) => (
  <View>
    <CounterCard counter={counter} />
    {renderDeleteButton({ theme, counterId: counter.id, onDeleteCounter })}
  </View>
);

const renderDeleteButton = ({
  theme = {},
  counterId = '',
  onDeleteCounter = () => {},
} = {}) => (
  <TouchableOpacity
    onPress={() => onDeleteCounter(counterId)}
    style={getDeleteButtonStyle()}
    activeOpacity={0.8}
  >
    <Text style={getDeleteButtonTextStyle()}>🗑️ Delete</Text>
  </TouchableOpacity>
);

const renderCounterForm = ({
  showForm = false,
  onHideForm = () => {},
  onAddCounter = () => {},
} = {}) => (
  <CounterFormModal
    visible={showForm}
    onClose={onHideForm}
    onSubmit={(formData) => {
      onAddCounter(createCounter(formData));
      onHideForm();
    }}
  />
);

const renderEmptyState = ({ theme = {} } = {}) => (
  <View style={getEmptyStateStyle()}>
    <Text style={getEmptyStateEmojiStyle()}>📊</Text>
    <Text style={getEmptyStateTextStyle(theme)}>No counters yet</Text>
    <Text style={getEmptyStateSubtextStyle(theme)}>
      Tap "Add New Counter" to get started
    </Text>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  paddingTop: 50,
  backgroundColor: theme.background,
});

const getAddButtonContainerStyle = () => ({
  paddingHorizontal: 10,
  marginBottom: 12,
});

const getAddButtonStyle = (theme = {}) => ({
  paddingVertical: 16,
  backgroundColor: theme.text,
  borderRadius: 16,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
});

const getAddButtonTextStyle = (theme = {}) => ({
  color: theme.background,
  fontWeight: 'bold',
  fontSize: 16,
});

const getCategoryContainerStyle = () => ({
  paddingHorizontal: 10,
  marginBottom: 16,
});

const getCategoryTitleStyle = (theme = {}) => ({
  fontSize: 11,
  fontWeight: 'bold',
  marginBottom: 10,
  color: theme.mutedText ?? theme.text,
  letterSpacing: 1,
});

const getCategoryRowStyle = () => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
});

const getCategoryTabStyle = (theme = {}, isSelected = false) => ({
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  backgroundColor: isSelected ? theme.text : theme.card,
  shadowColor: isSelected ? '#000' : 'transparent',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: isSelected ? 2 : 0,
});

const getCategoryTabTextStyle = (theme = {}, isSelected = false) => ({
  color: isSelected ? theme.background : theme.text,
  fontWeight: isSelected ? 'bold' : '600',
  fontSize: 13,
});

const getDeleteButtonStyle = () => ({
  marginHorizontal: 10,
  marginBottom: 8,
  marginTop: -8,
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: '#ff6b6b',
  borderRadius: 12,
  alignItems: 'center',
  shadowColor: '#ff0000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
});

const getDeleteButtonTextStyle = () => ({
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
});

const getEmptyStateStyle = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 40,
});

const getEmptyStateEmojiStyle = () => ({
  fontSize: 64,
  marginBottom: 16,
  opacity: 0.5,
});

const getEmptyStateTextStyle = (theme = {}) => ({
  fontSize: 20,
  fontWeight: 'bold',
  color: theme.text,
  marginBottom: 8,
});

const getEmptyStateSubtextStyle = (theme = {}) => ({
  fontSize: 14,
  color: theme.mutedText ?? theme.text,
  textAlign: 'center',
});