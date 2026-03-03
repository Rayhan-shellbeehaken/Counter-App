import {
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import NameField from "@/features/counters/components/fields/NameField";
import IconField from "@/features/counters/components/fields/IconField";
import CategoryField from "@/features/counters/components/fields/CategoryField";
import StepField from "@/features/counters/components/fields/StepField";
import CounterFormFooter from "@/features/counters/components/CounterFormFooter";

import { useCounterForm } from "@/hooks/useCounterForm";
import { useTheme } from "@/hooks/useTheme";

const noop = () => {};

export default function CounterFormModal({
  visible = false,
  onClose = noop,
  onSubmit = noop,
} = {}) {
  const { control, submit, validationRules } = useCounterForm({ onSubmit });
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        style={getContainerStyle(theme)}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={getScrollStyle(theme)}
          contentContainerStyle={getContentContainerStyle()}
          keyboardShouldPersistTaps="handled"
        >
          <NameField
            control={control}
            rules={validationRules.name}
          />

          <IconField control={control} />

          <CategoryField control={control} />

          <StepField
            control={control}
            rules={validationRules.step}
          />
        </ScrollView>

        <CounterFormFooter onCancel={onClose} onSubmit={submit} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  backgroundColor: theme.background,
});

const getScrollStyle = (theme = {}) => ({
  flex: 1,
  paddingTop: 45,
  paddingHorizontal: 16,
  backgroundColor: theme.background,
});

const getContentContainerStyle = () => ({
  paddingBottom: 120,  
});
