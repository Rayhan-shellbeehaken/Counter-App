import { useForm } from "react-hook-form";
import {
  CounterIconEnum,
  CounterCategoryEnum,
  CounterColorEnum,
} from "@/enums/CounterEnums";
import { CounterFieldEnum } from "@/enums/CounterEnums";
const noop = () => {};
const COLORS = Object.values(CounterColorEnum);

export function useCounterForm({ onSubmit = noop }) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      icon: CounterIconEnum.GENERIC,
      category: CounterCategoryEnum.GENERAL,
      step: 1,
      minValue: null,
      maxValue: null,
    },
  });

  const submit = handleSubmit((data) => {
    const { minValue, maxValue } = data;

    // Cross-field validation
    if (
      minValue !== null &&
      maxValue !== null &&
      minValue > maxValue
    ) {
    setError(CounterFieldEnum.MAX_VALUE, {
  type: "validate",
  message: "Max value must be greater than Min value",
});
      return;
    }

    const color =
      COLORS[Math.floor(Math.random() * COLORS.length)];

    onSubmit({
      ...data,
      name: data.name.trim(),
      color,
    });

    reset();
  });

  return {
    control,
    submit,
  };
}
