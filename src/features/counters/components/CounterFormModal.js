import { View, ScrollView, Modal } from "react-native";

import NameField from "@/features/counters/components/fields/NameField";
import IconField from "@/features/counters/components/fields/IconField";
import CategoryField from "@/features/counters/components/fields/CategoryField";
import StepField from "@/features/counters/components/fields/StepField";
import MinValueField from "@/features/counters/components/fields/MinValueField";
import MaxValueField from "@/features/counters/components/fields/MaxValueField";
import CounterFormFooter from "@/features/counters/components/CounterFormFooter";

import { useCounterForm } from "@/hooks/useCounterForm";
import { useTheme } from "@/hooks/useTheme";

const noop = () => {};

export default function CounterFormModal({
  visible = false,
  onClose = noop,
  onSubmit = noop,
}) {
  const { control, submit } = useCounterForm({ onSubmit });
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="slide">
      <View style={getContainerStyle(theme)}>
        <ScrollView style={getScrollStyle(theme)}>
          <NameField control={control} />
          <IconField control={control} />
          <CategoryField control={control} />
          <StepField control={control} />
          <MinValueField control={control} />
          <MaxValueField control={control} />
        </ScrollView>

        <CounterFormFooter onCancel={onClose} onSubmit={submit} />
      </View>
    </Modal>
  );
}

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  backgroundColor: theme.background,
});

const getScrollStyle = (theme = {}) => ({
  paddingTop: 45,
  paddingHorizontal: 16,
  backgroundColor: theme.background,
});
