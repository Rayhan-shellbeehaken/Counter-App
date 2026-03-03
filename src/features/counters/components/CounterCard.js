import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useCounterStore } from '@/store/counterStore';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import EditCounterNameModal from '@/features/counters/components/EditCounterNameModal';
import EditCounterNoteModal from '@/features/counters/components/EditCounterNoteModal';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  counter: {
    id: null,
    name: '',
    icon: '📊',
    color: '#4cc9f0',
    value: 0,
    step: 1,
    minValue: null,
    maxValue: null,
    category: 'General',
    note: '', // ✅ added
  },
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function CounterCard({
  counter = defaultProps.counter,
} = defaultProps) {
  const { increment, decrement, updateCounter, updateCounterNote } =
    useCounterStore();

  const { init, undo, redo } = useUndoRedo(counter.id);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    init();
  }, [counter.id]);

  /* ---------- handlers ---------- */

  const handleIncrement = () => {
    increment(counter.id, counter.step);
  };

  const handleDecrement = () => {
    decrement(counter.id, counter.step);
  };

  const handleEditName = () => {
    setShowEditModal(true);
  };

  const handleSaveName = (newName = '') => {
    if (newName.trim()) {
      updateCounter(counter.id, { name: newName });
    }
  };

  const handleEditNote = () => {
    setShowNoteModal(true);
  };

  const handleSaveNote = (newNote = '') => {
    updateCounterNote(counter.id, newNote);
  };

  return renderCard({
    counter,
    showEditModal,
    showNoteModal,
    onIncrement: handleIncrement,
    onDecrement: handleDecrement,
    onUndo: undo,
    onRedo: redo,
    onEditName: handleEditName,
    onSaveName: handleSaveName,
    onEditNote: handleEditNote,
    onSaveNote: handleSaveNote,
    onCloseNameModal: () => setShowEditModal(false),
    onCloseNoteModal: () => setShowNoteModal(false),
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderCard = ({
  counter = {},
  showEditModal = false,
  showNoteModal = false,
  onIncrement = () => {},
  onDecrement = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onEditName = () => {},
  onSaveName = () => {},
  onEditNote = () => {},
  onSaveNote = () => {},
  onCloseNameModal = () => {},
  onCloseNoteModal = () => {},
} = {}) => (
  <>
    <View style={getCardContainerStyle(counter.color)}>
      {renderCardHeader({ counter, onEditName })}
      {renderNotePreview({ counter, onEditNote })}
      {renderCardValue({ counter })}
      {renderMinMaxSection({ counter })}
      {renderActionButtons({ onIncrement, onDecrement, onUndo, onRedo })}
    </View>

    <EditCounterNameModal
      visible={showEditModal}
      currentName={counter.name}
      onSave={onSaveName}
      onClose={onCloseNameModal}
    />

    <EditCounterNoteModal
      visible={showNoteModal}
      currentNote={counter.note}
      onSave={onSaveNote}
      onClose={onCloseNoteModal}
    />
  </>
);

/* ---------------------------------
   NOTE PREVIEW
--------------------------------- */

const renderNotePreview = ({
  counter = {},
  onEditNote = () => {},
} = {}) => {
  const note = typeof counter?.note === 'string' ? counter.note : '';

  if (!note.trim()) {
    return renderAddNoteButton({ onEditNote });
  }

  return (
    <TouchableOpacity
      onPress={onEditNote}
      activeOpacity={0.8}
      style={getNotePreviewContainerStyle()}
    >
      <Text style={getNotePreviewTextStyle()} numberOfLines={2}>
        📝 {note}
      </Text>
    </TouchableOpacity>
  );
};

const renderAddNoteButton = ({ onEditNote = () => {} } = {}) => (
  <TouchableOpacity
    onPress={onEditNote}
    style={getAddNoteButtonStyle()}
    activeOpacity={0.8}
  >
    <Text style={getAddNoteTextStyle()}>+ Add Note</Text>
  </TouchableOpacity>
);

/* ---------------------------------
   EXISTING RENDERERS
--------------------------------- */

const renderCardHeader = ({ counter = {}, onEditName = () => {} } = {}) => (
  <View style={getHeaderContainerStyle()}>
    <View style={getHeaderLeftStyle()}>
      <Text style={getIconStyle()}>{counter.icon}</Text>
      <Text style={getNameStyle()}>{counter.name || 'Unnamed'}</Text>
    </View>
    {renderEditButton({ onEditName })}
  </View>
);

const renderEditButton = ({ onEditName = () => {} } = {}) => (
  <TouchableOpacity
    onPress={onEditName}
    style={getEditButtonStyle()}
    activeOpacity={0.7}
  >
    <Text style={getEditIconStyle()}>✏️</Text>
  </TouchableOpacity>
);

const renderCardValue = ({ counter = {} } = {}) => (
  <View style={getValueContainerStyle()}>
    <Text style={getValueStyle()}>{counter.value ?? 0}</Text>
  </View>
);

const renderMinMaxSection = ({ counter = {} } = {}) => {
  const text = buildMinMaxText(counter.minValue, counter.maxValue);
  if (!text) return null;

  return (
    <View style={getMinMaxContainerStyle()}>
      <Text style={getMinMaxTextStyle()}>{text}</Text>
    </View>
  );
};

const renderActionButtons = ({
  onIncrement = () => {},
  onDecrement = () => {},
  onUndo = () => {},
  onRedo = () => {},
} = {}) => (
  <View style={getButtonRowStyle()}>
    {renderPrimaryButton({ label: '+', onPress: onIncrement })}
    {renderPrimaryButton({ label: '-', onPress: onDecrement })}
    {renderSecondaryButton({ icon: '↶', onPress: onUndo })}
    {renderSecondaryButton({ icon: '↷', onPress: onRedo })}
  </View>
);

const renderPrimaryButton = ({ label = '', onPress = () => {} } = {}) => (
  <TouchableOpacity
    onPress={onPress}
    style={getPrimaryButtonStyle()}
    activeOpacity={0.85}
  >
    <Text style={getPrimaryButtonTextStyle()}>{label}</Text>
  </TouchableOpacity>
);

const renderSecondaryButton = ({ icon = '', onPress = () => {} } = {}) => (
  <TouchableOpacity
    onPress={onPress}
    style={getSecondaryButtonStyle()}
    activeOpacity={0.85}
  >
    <Text style={getSecondaryButtonTextStyle()}>{icon}</Text>
  </TouchableOpacity>
);

/* ---------------------------------
   LOGIC
--------------------------------- */

const buildMinMaxText = (minValue = null, maxValue = null) => {
  const hasMin = minValue !== null && minValue !== undefined;
  const hasMax = maxValue !== null && maxValue !== undefined;

  if (!hasMin && !hasMax) return null;

  const parts = [];
  if (hasMin) parts.push(`Min: ${minValue}`);
  if (hasMax) parts.push(`Max: ${maxValue}`);

  return parts.join(' • ');
};

/* ---------------------------------
   STYLES
--------------------------------- */

const getNotePreviewContainerStyle = () => ({
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: 10,
  borderRadius: 12,
  marginBottom: 12,
});

const getNotePreviewTextStyle = () => ({
  color: '#ffffff',
  fontSize: 14,
  fontWeight: '500',
});

const getAddNoteButtonStyle = () => ({
  backgroundColor: 'rgba(255,255,255,0.15)',
  paddingVertical: 8,
  borderRadius: 12,
  marginBottom: 12,
  alignItems: 'center',
});

const getAddNoteTextStyle = () => ({
  color: '#ffffff',
  fontWeight: '600',
  fontSize: 14,
});
/* ---------------------------------
   STYLES (PROPORTION FIXED)
--------------------------------- */

const getCardContainerStyle = (backgroundColor = '#4cc9f0') => ({
  backgroundColor,
  padding: 16,
  marginHorizontal: 12,
  marginVertical: 8,
  borderRadius: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 6,
});

const getHeaderContainerStyle = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 14,
});

const getHeaderLeftStyle = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
});

const getIconStyle = () => ({
  fontSize: 34,
  marginRight: 12,
});

const getNameStyle = () => ({
  fontSize: 20,
  fontWeight: 'bold',
  color: '#ffffff',
  flex: 1,
});

const getEditButtonStyle = () => ({
  padding: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  borderRadius: 12,
});

const getEditIconStyle = () => ({
  fontSize: 18,
});

const getValueContainerStyle = () => ({
  alignItems: 'center',
  justifyContent: 'center',
  height: 120,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: 18,
  marginBottom: 14,
});

const getValueStyle = () => ({
  fontSize: 48,
  fontWeight: 'bold',
  color: '#ffffff',
});

const getMinMaxContainerStyle = () => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
});

const getMinMaxTextStyle = () => ({
  fontSize: 13,
  color: '#ffffff',
  fontWeight: '600',
});

const getButtonRowStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 12,
});

const getPrimaryButtonStyle = () => ({
  flex: 1.2,
  height: 64,
  marginHorizontal: 4,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.25)',
});

const getPrimaryButtonTextStyle = () => ({
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 28,
});

const getSecondaryButtonStyle = () => ({
  flex: 1,
  height: 64,
  marginHorizontal: 4,
  borderRadius: 16,
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  justifyContent: 'center',
  alignItems: 'center',
});

const getSecondaryButtonTextStyle = () => ({
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 20,
});

const getCancelButtonStyle = (theme = {}) => ({
  borderWidth: 1.5,
  borderColor: theme.border ?? "#0a0808",
  backgroundColor: theme.card,
  borderRadius: 12,
});