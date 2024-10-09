import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Firebase configuration
import { useRoute, useNavigation } from '@react-navigation/native';

interface PaymentMethod {
  docId: string; // Document ID from Firestore
  pid: string; // Payment type
  type: string;
  last4: string;
  nickname?: string;
  expMonth?: string; // Optional if required
  expYear?: string;  // Optional if required
  cvv?: string;      // Optional (be cautious with CVV storage)
}

const UpdateDeletePayMethods = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { paymentMethod } = route.params as { paymentMethod: PaymentMethod }; // Get payment method details passed via navigation
  const [nickname, setNickname] = useState(paymentMethod.nickname || '');

  // Function to handle updating payment method
  const handleUpdatePaymentMethod = async () => {
    if (!nickname) {
      Alert.alert('Error', 'Please enter a nickname for the payment method.');
      return;
    }

    try {
      // Use the correct document ID from Firestore
      const paymentMethodRef = doc(FIREBASE_DB, 'paymentMethods', paymentMethod.docId); // Using docId for Firestore document ID
      
      // Update the nickname
      await updateDoc(paymentMethodRef, { nickname });
      Alert.alert('Success', 'Payment method updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating payment method: ', error);
      Alert.alert('Error', 'There was an issue updating the payment method. Please try again.');
    }
  };

  // Function to handle deleting payment method
  const handleDeletePaymentMethod = async () => {
    try {
      // Use the correct document ID for deletion
      const paymentMethodRef = doc(FIREBASE_DB, 'paymentMethods', paymentMethod.docId); // Using docId for Firestore document ID

      // Delete the payment method
      await deleteDoc(paymentMethodRef);
      Alert.alert('Success', 'Payment method deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting payment method: ', error);
      Alert.alert('Error', 'There was an issue deleting the payment method. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update/Delete Payment Method</Text>

      <View style={styles.paymentInfo}>
        <Text style={styles.paymentType}>{paymentMethod.type}</Text>
        <Text style={styles.paymentLast4}>Ending in {paymentMethod.last4}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePaymentMethod}>
        <Text style={styles.updateButtonText}>Update Payment Method</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePaymentMethod}>
        <Text style={styles.deleteButtonText}>Delete Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  paymentType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentLast4: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateDeletePayMethods;
