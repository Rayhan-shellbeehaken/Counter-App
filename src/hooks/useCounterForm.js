import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import {
  CounterIconEnum,
  CounterCategoryEnum,
  CounterColorEnum,
} from "@/enums/CounterEnums";

const noop = () => {};
const COLORS = Object.values(CounterColorEnum);

export function useCounterForm({ onSubmit = noop }) {
  const form = useForm({
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

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    onSubmit({
      name: data.name.trim(),
      icon: data.icon,
      category: data.category,
      step: parseInt(data.step, 10) || 1,
      minValue: min,
      maxValue: max,
      color,
    });

    form.reset();
  };

  return {
    ...form,
    submit,
  };
}
