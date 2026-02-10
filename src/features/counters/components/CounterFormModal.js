import {
  View,
  ScrollView,
  Modal,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";

import {
  CounterIconEnum,
  CounterCategoryEnum,
  CounterColorEnum,
} from "@/enums/CounterEnums";

import NameField from "@/features/counters/components/fields/NameField";
import IconField from "@/features/counters/components/fields/IconField";
import CategoryField from "@/features/counters/components/fields/CategoryField";
import StepField from "@/features/counters/components/fields/StepField";
import MinValueField from "@/features/counters/components/fields/MinValueField";
import MaxValueField from "@/features/counters/components/fields/MaxValueField";

const noop = () => {};

const AVAILABLE_COLORS = Object.values(CounterColorEnum);

export default function CounterFormModal({
  visible = false,
  onClose = noop,
  onSubmit = noop,
}) {
  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      icon: CounterIconEnum.GENERIC,
      category: CounterCategoryEnum.GENERAL,
      step: "1",
      minValue: "",
      maxValue: "",
    },
  });

  const submit = (data) => {
    const min = data.minValue ? parseInt(data.minValue, 10) : null;
    const max = data.maxValue ? parseInt(data.maxValue, 10) : null;

    if (min !== null && max !== null && min > max) {
      Alert.alert("Error", "Min value cannot be greater than max value");
      return;
    }

    const color =
      AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];

    onSubmit({
      name: data.name.trim(),
      icon: data.icon,
      category: data.category,
      step: parseInt(data.step, 10) || 1,
      minValue: min,
      maxValue: max,
      color,
    });

    reset();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <ScrollView style={{ paddingTop: 50, paddingHorizontal: 16 }}>
          <NameField control={control} error={formState.errors.name?.message} />
          <IconField control={control} />
          <CategoryField control={control} />
          <StepField control={control} />
          <MinValueField control={control} />
          <MaxValueField control={control} />
        </ScrollView>

        <FormActions onCancel={onClose} onSubmit={handleSubmit(submit)} />
      </View>
    </Modal>
  );
}

function FormActions({ onCancel = noop, onSubmit = noop }) {
  return (
    <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: "#ddd" }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <ActionButton title="Cancel" onPress={onCancel} />
        <ActionButton title="Create Counter" onPress={onSubmit} primary />
      </View>
    </View>
  );
}

function ActionButton({ title = "", onPress = noop, primary = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: primary ? "#000" : "#e8e8e8",
      }}
    >
      <Text style={{ color: primary ? "#fff" : "#000", fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
