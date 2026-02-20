import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useState } from "react";

import { createCounter, CounterCategoryEnum } from "@/features/counters/model";
import { useCounterStore } from "@/store/counterStore";
import CounterCard from "@/features/counters/components/CounterCard";
import CounterFormModal from "@/features/counters/components/CounterFormModal";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  counters: [],
  selectedCategory: null,
};

export default function CounterHomeScreen() {
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

  return renderCounterHome(
    theme,
    filteredCounters,
    categories,
    currentCategory,
    showForm,
    setShowForm,
    setSelectedCategory,
    deleteCounter,
    addCounter,
  );
}

const renderCounterHome = (
  theme,
  counters,
  categories,
  currentCategory,
  showForm,
  setShowForm,
  setSelectedCategory,
  deleteCounter,
  addCounter,
) => (
  <View style={getContainerStyle(theme)}>
    {renderAddCounterButton(theme, () => setShowForm(true))}
    {renderCategoryFilter(
      theme,
      categories,
      currentCategory,
      setSelectedCategory,
    )}
    {renderCountersList(theme, counters, deleteCounter)}
    {renderCounterForm(showForm, setShowForm, addCounter)}
  </View>
);

const renderAddCounterButton = (theme, onPress) => (
  <View style={getAddButtonContainerStyle()}>
    <TouchableOpacity onPress={onPress} style={getAddButtonStyle(theme)}>
      <Text style={getAddButtonTextStyle(theme)}>+ Add New Counter</Text>
    </TouchableOpacity>
  </View>
);

const renderCategoryFilter = (theme, categories, selected, onSelect) => {
  if (!categories.length) return null;

  return (
    <View style={getCategoryContainerStyle()}>
      <Text style={getCategoryTitleStyle(theme)}>CATEGORIES</Text>
      <View style={getCategoryRowStyle()}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={getCategoryTabStyle(theme, selected === category)}
          >
            <Text style={getCategoryTabTextStyle(theme, selected === category)}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const renderCountersList = (theme, counters, onDelete) => {
  if (!counters.length) {
    return renderEmptyState(theme);
  }

  return (
    <FlatList
      data={counters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => renderCounterItem(theme, item, onDelete)}
    />
  );
};

const renderCounterItem = (theme, counter, onDelete) => (
  <View>
    <CounterCard counter={counter} />
    <TouchableOpacity
      onPress={() => onDelete(counter.id)}
      style={getDeleteButtonStyle(theme)}
    >
      <Text style={getDeleteButtonTextStyle()}>Delete</Text>
    </TouchableOpacity>
  </View>
);

const renderCounterForm = (visible, setShowForm, addCounter) => (
  <CounterFormModal
    visible={visible}
    onClose={() => setShowForm(false)}
    onSubmit={(formData) => {
      addCounter(createCounter(formData));
      setShowForm(false);
    }}
  />
);

const renderEmptyState = (theme) => (
  <View style={getEmptyStateStyle()}>
    <Text style={getEmptyStateTextStyle(theme)}>No counters yet</Text>
    <TouchableOpacity style={getEmptyStateButtonStyle(theme)}>
      <Text style={getEmptyStateButtonTextStyle(theme)}>Create one now</Text>
    </TouchableOpacity>
  </View>
);

const getContainerStyle = (theme) => ({
  flex: 1,
  paddingTop: 50,
  backgroundColor: theme.background,
});

const getAddButtonContainerStyle = () => ({
  paddingHorizontal: 10,
  marginBottom: 10,
});

const getAddButtonStyle = (theme) => ({
  paddingVertical: 12,
  backgroundColor: theme.text,
  borderRadius: 8,
  alignItems: "center",
});

const getAddButtonTextStyle = (theme) => ({
  color: theme.background,
  fontWeight: "bold",
  fontSize: 16,
});

const getCategoryContainerStyle = () => ({
  paddingHorizontal: 10,
  marginBottom: 10,
});

const getCategoryTitleStyle = (theme) => ({
  fontSize: 12,
  fontWeight: "bold",
  marginBottom: 8,
  color: theme.text,
});

const getCategoryRowStyle = () => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 6,
});

const getCategoryTabStyle = (theme, isSelected) => ({
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 16,
  backgroundColor: isSelected ? theme.text : theme.card,
});

const getCategoryTabTextStyle = (theme, isSelected) => ({
  color: isSelected ? theme.background : theme.text,
  fontWeight: "bold",
  fontSize: 12,
});

const getDeleteButtonStyle = (theme) => ({
  marginHorizontal: 10,
  marginBottom: 5,
  padding: 8,
  backgroundColor: "#ff6b6b",
  borderRadius: 5,
  alignItems: "center",
});

const getDeleteButtonTextStyle = () => ({
  color: "#fff",
  fontWeight: "bold",
  fontSize: 12,
});

const getEmptyStateStyle = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

const getEmptyStateTextStyle = (theme) => ({
  fontSize: 16,
  color: theme.text,
  marginBottom: 16,
});

const getEmptyStateButtonStyle = (theme) => ({
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: theme.card,
  borderRadius: 6,
});

const getEmptyStateButtonTextStyle = (theme) => ({
  color: theme.text,
  fontWeight: "bold",
});
