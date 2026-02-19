import { useForm } from "react-hook-form";
import {
  CounterIconEnum,
  CounterCategoryEnum,
  CounterColorEnum,
  CounterFieldEnum,
} from "@/enums/CounterEnums";

const noop = () => {};
const COLORS = Object.values(CounterColorEnum);

const getRandomColor = () =>
  COLORS[Math.floor(Math.random() * COLORS.length)];

const validationRules = Object.freeze({
  [CounterFieldEnum.NAME]: {
    required: "Counter name is required",
    validate: (value = "") =>
      value.trim().length > 0 || "Name cannot be empty",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    maxLength: {
      value: 20,
      message: "Name must be under 20 characters",
    },
    
  },

[CounterFieldEnum.STEP]: {
  required: "Step is required",
  validate: (value) => {
    if (value === "" || value === null || value === undefined) {
      return "Step is required";
    }

    const num = Number(value);

    if (!Number.isFinite(num)) {
      return "Step must be a valid number";
    }

    if (num < 1) {
      return "Step must be at least 1";
    }

    if (num > 1000) {
      return "Step is too large";
    }

    return true;
  },
},

});

export function useCounterForm({ onSubmit = noop } = {}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      icon: CounterIconEnum.GENERIC,
      category: CounterCategoryEnum.GENERAL,
      step: 2,
    },
    mode: "onChange", // better UX validation
  });

  const submit = handleSubmit((data = {}) => {
    const safeName = (data.name ?? "").trim();

    const color = getRandomColor();

    onSubmit({
      ...data,
      name: safeName,
      color,
    });

    reset();
  });

  return {
    control,
    submit,
    validationRules,
  };
}
