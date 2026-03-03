import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  visible: false,
  currentName: '',
  onClose: () => {},
  onSave: () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function EditCounterNameModal({
  visible = defaultProps.visible,
  currentName = defaultProps.currentName,
  onClose = defaultProps.onClose,
  onSave = defaultProps.onSave,
} = defaultProps) {
  const theme = useTheme();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(currentName);
    setError('');
  }, [currentName, visible]);

  const handleSave = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Counter name cannot be empty');
      return;
    }

    onSave(trimmedName);
    onClose();
  };

  return renderModal({
    theme,
    visible,
    name,
    error,
    onNameChange: setName,
    onSave: handleSave,
    onClose,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderModal = ({
  theme = {},
  visible = false,
  name = '',
  error = '',
  onNameChange = () => {},
  onSave = () => {},
  onClose = () => {},
} = {}) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity
      style={getOverlayStyle()}
      activeOpacity={1}
      onPress={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={getKeyboardAvoidStyle()}
      >
        <TouchableOpacity activeOpacity={1}>
          {renderModalContent({
            theme,
            name,
            error,
            onNameChange,
            onSave,
            onClose,
          })}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  </Modal>
);

const renderModalContent = ({
  theme = {},
  name = '',
  error = '',
  onNameChange = () => {},
  onSave = () => {},
  onClose = () => {},
} = {}) => (
  <View style={getModalContainerStyle(theme)}>
    {renderHeader({ theme })}
    {renderInput({ theme, name, error, onNameChange })}
    {renderButtons({ theme, onSave, onClose })}
  </View>
);

const renderHeader = ({ theme = {} } = {}) => (
  <View style={getHeaderStyle()}>
    <Text style={getTitleStyle(theme)}>✏️ Edit Counter Name</Text>
  </View>
);

const renderInput = ({
  theme = {},
  name = '',
  error = '',
  onNameChange = () => {},
} = {}) => (
  <View style={getInputContainerStyle()}>
    <TextInput
      value={name}
      onChangeText={onNameChange}
      placeholder="Counter name"
      placeholderTextColor={theme.mutedText ?? '#888'}
      style={getInputStyle(theme, !!error)}
      autoFocus
      maxLength={30}
    />
    {error ? renderError({ error }) : null}
  </View>
);

const renderError = ({ error = '' } = {}) => (
  <Text style={getErrorTextStyle()}>{error}</Text>
);

const renderButtons = ({
  theme = {},
  onSave = () => {},
  onClose = () => {},
} = {}) => (
  <View style={getButtonRowStyle()}>
    {renderCancelButton({ theme, onClose })}
    {renderSaveButton({ theme, onSave })}
  </View>
);

const renderCancelButton = ({
  theme = {},
  onClose = () => {},
} = {}) => (
  <TouchableOpacity
    onPress={onClose}
    style={getCancelButtonStyle(theme)}
  >
    <Text style={getCancelButtonTextStyle(theme)}>Cancel</Text>
  </TouchableOpacity>
);

const renderSaveButton = ({
  theme = {},
  onSave = () => {},
} = {}) => (
  <TouchableOpacity
    onPress={onSave}
    style={getSaveButtonStyle(theme)}
  >
    <Text style={getSaveButtonTextStyle()}>Save</Text>
  </TouchableOpacity>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getOverlayStyle = () => ({
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
});

const getKeyboardAvoidStyle = () => ({
  width: '100%',
  alignItems: 'center',
});

const getModalContainerStyle = (theme = {}) => ({
  width: '85%',
  backgroundColor: theme.card,
  borderRadius: 20,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
});

const getHeaderStyle = () => ({
  marginBottom: 20,
  alignItems: 'center',
});

const getTitleStyle = (theme = {}) => ({
  fontSize: 20,
  fontWeight: 'bold',
  color: theme.text,
});

const getInputContainerStyle = () => ({
  marginBottom: 20,
});

const getInputStyle = (theme = {}, hasError = false) => ({
  borderWidth: 2,
  borderColor: hasError ? '#ff4444' : (theme.border ?? '#ddd'),
  borderRadius: 12,
  padding: 14,
  fontSize: 16,
  color: theme.text,
  backgroundColor: theme.background,
});

const getErrorTextStyle = () => ({
  color: '#ff4444',
  fontSize: 12,
  marginTop: 6,
  marginLeft: 4,
});

const getButtonRowStyle = () => ({
  flexDirection: 'row',
  gap: 12,
});

const getCancelButtonStyle = (theme = {}) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  backgroundColor: theme.background,
  borderWidth: 1,
  borderColor: theme.border ?? '#ddd',
});

const getCancelButtonTextStyle = (theme = {}) => ({
  fontSize: 16,
  fontWeight: '600',
  color: theme.text,
});

const getSaveButtonStyle = (theme = {}) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  backgroundColor: theme.primary ?? '#007AFF',
});

const getSaveButtonTextStyle = () => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: '#fff',
});