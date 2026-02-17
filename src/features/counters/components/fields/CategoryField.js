import { View, Text } from "react-native";
import { Controller } from "react-hook-form";

import { CounterCategoryEnum } from "@/enums/CounterEnums";
import CategoryOption from "@/features/counters/components/fields/CategoryOption";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
};

const DEFAULT_CATEGORIES = Object.values(CounterCategoryEnum);

export default function CategoryField({ control = defaultProps.control } = {}) {
  const theme = useTheme();

  return renderCategoryField({
    control,
    theme,
  });
}

const renderCategoryField = ({ control, theme }) => (
  <Controller
    control={control}
    name="category"
    render={({ field }) =>
      renderFieldContent({
        value: field.value,
        onChange: field.onChange,
        theme,
      })
    }
  />
);

const renderFieldContent = ({ value, onChange, theme }) => (
  <View style={getContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Category</Text>

    <View style={getRowStyle()}>
      <CategoryList
        items={DEFAULT_CATEGORIES}
        selected={value}
        onSelect={onChange}
        theme={theme}
      />
    </View>
  </View>
);

const CategoryList = ({
  items = [],
  selected = "",
  onSelect = () => {},
  theme,
}) =>
  items.map((category) =>
    renderCategoryOption(category, selected, onSelect, theme),
  );

const renderCategoryOption = (category, selected, onSelect, theme) => (
  <CategoryOption
    key={category}
    label={category}
    active={category === selected}
    onPress={onSelect}
    theme={theme}
  />
);

const getContainerStyle = () => ({
  marginBottom: 6,
});

const getLabelStyle = (theme) => ({
  fontWeight: "bold",
  marginBottom: 6,
  color: theme.text,
});

const getRowStyle = () => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
});
