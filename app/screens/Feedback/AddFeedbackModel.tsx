import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { collection, addDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';

const AddFeedbackModal = ({ isVisible, onClose, onFeedbackAdded  }) => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');

  const submitFeedback = async () => {
    if (name && feedback) {
      try {
        await addDoc(collection(FIREBASE_DB, 'feedbacks'), {
          name,
          feedback,
          createdAt: new Date(),
        });
        Alert.alert('Success', 'Feedback Submitted');
        setName('');
        setFeedback('');
        onClose(); // Close modal after submission
        onFeedbackAdded();
      } catch (error) {
        Alert.alert('Error', 'Something went wrong.');
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>How was your experience?</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.feedbackInput]}
          placeholder="Feedback"
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
          <Text style={styles.submitButtonText}>Add Feedback</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#FF6F00',
  },
  input: {
    height: 40,
    borderColor: '#FF6F00',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  feedbackInput: {
    height: 80,
  },
  submitButton: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddFeedbackModal;
