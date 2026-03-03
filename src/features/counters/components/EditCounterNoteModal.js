import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  visible: false,
  currentNote: '',
  onSave: () => {},
  onClose: () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function EditCounterNoteModal({
  visible = defaultProps.visible,
  currentNote = defaultProps.currentNote,
  onSave = defaultProps.onSave,
  onClose = defaultProps.onClose,
} = defaultProps) {
  const [note, setNote] = useState(currentNote);

  useEffect(() => {
    setNote(typeof currentNote === 'string' ? currentNote : '');
  }, [currentNote]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return renderModal({
    visible,
    note,
    onChangeNote: setNote,
    onSave: handleSave,
    onClose,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderModal = ({
  visible = false,
  note = '',
  onChangeNote = () => {},
  onSave = () => {},
  onClose = () => {},
} = {}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={getOverlayStyle()}>
      <View style={getContainerStyle()}>
        {renderHeader()}
        {renderInput({ note, onChangeNote })}
        {renderButtons({ onSave, onClose })}
      </View>
    </View>
  </Modal>
);

const renderHeader = () => (
  <Text style={getTitleStyle()}>
    Edit Note
  </Text>
);

const renderInput = ({
  note = '',
  onChangeNote = () => {},
} = {}) => (
  <TextInput
    value={note}
    onChangeText={onChangeNote}
    multiline
    placeholder="Write your note..."
    style={getInputStyle()}
    textAlignVertical="top"
  />
);

const renderButtons = ({
  onSave = () => {},
  onClose = () => {},
} = {}) => (
  <View style={getButtonRowStyle()}>
    {renderCancelButton({ onClose })}
    {renderSaveButton({ onSave })}
  </View>
);

const renderCancelButton = ({
  onClose = () => {},
} = {}) => (
  <TouchableOpacity
    onPress={onClose}
    style={getCancelButtonStyle()}
    activeOpacity={0.8}
  >
    <Text style={getCancelTextStyle()}>Cancel</Text>
  </TouchableOpacity>
);

const renderSaveButton = ({
  onSave = () => {},
} = {}) => (
  <TouchableOpacity
    onPress={onSave}
    style={getSaveButtonStyle()}
    activeOpacity={0.8}
  >
    <Text style={getSaveTextStyle()}>Save</Text>
  </TouchableOpacity>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getOverlayStyle = () => ({
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  padding: 20,
});

const getContainerStyle = () => ({
  backgroundColor: '#ffffff',
  borderRadius: 20,
  padding: 20,
});

const getTitleStyle = () => ({
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 14,
});

const getInputStyle = () => ({
  minHeight: 120,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 14,
  padding: 12,
  marginBottom: 18,
});

const getButtonRowStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const getCancelButtonStyle = () => ({
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 12,
  backgroundColor: '#eeeeee',
});

const getCancelTextStyle = () => ({
  fontWeight: '600',
});

const getSaveButtonStyle = () => ({
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 12,
  backgroundColor: '#4cc9f0',
});

const getSaveTextStyle = () => ({
  fontWeight: '600',
  color: '#ffffff',
});