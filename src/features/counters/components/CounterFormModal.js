import { View, ScrollView, Modal } from "react-native";

import NameField from "@/features/counters/components/fields/NameField";
import IconField from "@/features/counters/components/fields/IconField";
import CategoryField from "@/features/counters/components/fields/CategoryField";
import StepField from "@/features/counters/components/fields/StepField";
import MinValueField from "@/features/counters/components/fields/MinValueField";
import MaxValueField from "@/features/counters/components/fields/MaxValueField";
import CounterFormFooter from "@/features/counters/components/CounterFormFooter";

import { useCounterForm } from "@/hooks/useCounterForm";

const noop = () => {};

export default function CounterFormModal({
  visible = false,
  onClose = noop,
  onSubmit = noop,
}) {
  /* ---------------------------------
     FORM BRAIN COMES FROM HOOK
     --------------------------------- */
  const { control, submit } = useCounterForm({ onSubmit });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <ScrollView style={{ paddingTop: 50, paddingHorizontal: 16 }}>
          <NameField control={control} />
          <IconField control={control} />
          <CategoryField control={control} />
          <StepField control={control} />
          <MinValueField control={control} />
          <MaxValueField control={control} />
        </ScrollView>

        <CounterFormFooter
          onCancel={onClose}
          onSubmit={submit}
        />
      </View>
    </Modal>
  );
}
