import { View, Text } from "react-native";
import { Controller } from "react-hook-form";
import { CounterCategoryEnum } from "@/enums/CounterEnums";
import CategoryOption from "@/features/counters/components/fields/CategoryOption";

const CATEGORIES = Object.values(CounterCategoryEnum);
const noop = () => {};

export default function CategoryField({ control = null }) {
  const items = CATEGORIES.map((category) => ({
    key: category,
    label: category,
  }));

  return (
    <Controller
      control={control}
      name="category"
      render={({ field }) => (
        <View style={{ marginBottom: 8 }}>
          <Text style={label}>Category</Text>
          <View style={row}>
            <CategoryList
              items={items}
              selected={field.value}
              onSelect={field.onChange}
            />
          </View>
        </View>
      )}
    />
  );
}

function CategoryList({ items = [], selected = "", onSelect = noop }) {
  return (
    <>
      {items.map((item) => (
        <CategoryOption
          key={item.key}
          label={item.label}
          active={item.label === selected}
          onPress={onSelect}
        />
      ))}
    </>
  );
}
const label = {
  fontWeight: 'bold',
  marginBottom: 6,
};

const row = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
};
