import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, Modal, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { collection, addDoc, getDocs, query, where, deleteDoc, doc, DocumentData, DocumentReference, updateDoc } from 'firebase/firestore';

import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

import { FIREBASE_DB } from '../../../Firebase_Config'; // Firebase configuration
import { getAuth } from 'firebase/auth'; // Firebase Auth for user management
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface PaymentMethod {
  pid: string; // Used for identifying card type
  docId: string; // Added new property for document ID
  type: string;
  last4: string;
  nickname?: string;
  expMonth?: string; // Add expiration month
  expYear?: string;  // Add expiration year
  cvv?: string;      // Add CVV (optional, but consider the security implications)
}

const paymentIcons = {
  Visa: require('../../../assets/visa.png'),
  Mastercard: require('../../../assets/mastercard.png'),
  Amex: require('../../../assets/amex.png'),
};

const PaymentMethods = () => {
  const navigation = useNavigation<NavigationProp<any>>(); // Initialize navigation prop
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expMonth: '', expYear: '', cvv: '', nickname: '', type: 'Visa' });
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchPaymentMethods(user.uid);
    } else {
      Alert.alert('Error', 'User is not logged in.');
    }
  }, [user]);

  const fetchPaymentMethods = async (userId: string) => {
    try {
      const q = query(collection(FIREBASE_DB, 'paymentMethods'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const methods: PaymentMethod[] = [];
      querySnapshot.forEach((doc) => {
        methods.push({ pid: doc.data().pid, docId: doc.id, ...doc.data() } as PaymentMethod); // Added docId
      });
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods: ', error);
    } finally {
      setLoading(false);
    }
  };

  const validateCard = () => {
    const { number, expMonth, expYear, cvv } = newCard;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (!number || number.length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number.');
      return false;
    }
    if (!expMonth || parseInt(expMonth) < 1 || parseInt(expMonth) > 12) {
      Alert.alert('Error', 'Please enter a valid expiration month (01-12).');
      return false;
    }
    if (!expYear || parseInt(expYear) < currentYear) {
      Alert.alert('Error', 'Please enter a valid expiration year.');
      return false;
    }
    if (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth) {
      Alert.alert('Error', 'The card has already expired.');
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid 3-digit CVV.');
      return false;
    }
    return true;
  };

  const handleAddPayment = async () => {
    if (!validateCard()) return;
  
    if (user) {
      const newPaymentMethod: PaymentMethod = {
        pid: Math.random().toString(),
        docId: '',
        type: newCard.type,
        last4: newCard.number.slice(-4),
        nickname: newCard.nickname || '',
        expMonth: newCard.expMonth,
        expYear: newCard.expYear,
        cvv: newCard.cvv // Note: storing CVV is generally not recommended
      };
  
      
  
      try {
        const docRef = await addDoc(collection(FIREBASE_DB, 'paymentMethods'), {
          userId: user.uid,
          ...newPaymentMethod,
        });
        newPaymentMethod.docId = docRef.id; // Update the docId
  
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
        setModalVisible(false);
        Alert.alert('Success', 'Payment method added successfully!');
        setNewCard({ number: '', expMonth: '', expYear: '', cvv: '', nickname: '', type: 'Visa' });
      } catch (error) {
        console.error('Error adding payment method: ', error); // Log the error
        Alert.alert('Error', 'There was an issue adding the payment method. Please try again.');
      }
    } else {
      Alert.alert('Error', 'No user is logged in.');
    }
  };

  const handlePaymentMethodClick = (paymentMethod: PaymentMethod) => {
    // Navigate to UpdateDeletePayMethods screen with the selected payment method's details
    navigation.navigate('UpdateDeletePayMethods', { paymentMethod });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Methods</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.docId} // Updated to use docId
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.methodContainer, selectedMethod === item.docId && styles.selectedMethod]} // Updated to use docId
              onPress={() => handlePaymentMethodClick(item)} // Navigate on click
              activeOpacity={0.7} // Slightly reduces opacity for visual feedback
            >
              {paymentIcons[item.type] && <Image source={paymentIcons[item.type]} style={styles.icon} />}
              <View style={styles.methodDetails}>
                <Text style={styles.methodType}>{item.type}</Text>
                <Text style={styles.methodLast4}>Ending in {item.last4}</Text>
                {item.nickname ? <Text style={styles.methodNickname}>{item.nickname}</Text> : null}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="numeric"
              maxLength={16}
              value={newCard.number}
              onChangeText={(text) => setNewCard({ ...newCard, number: text })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Exp. Month"
                keyboardType="numeric"
                maxLength={2}
                value={newCard.expMonth}
                onChangeText={(text) => setNewCard({ ...newCard, expMonth: text })}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Exp. Year"
                keyboardType="numeric"
                maxLength={4}
                value={newCard.expYear}
                onChangeText={(text) => setNewCard({ ...newCard, expYear: text })}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              value={newCard.cvv}
              onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nickname (optional)"
              value={newCard.nickname}
              onChangeText={(text) => setNewCard({ ...newCard, nickname: text })}
            />
            <Picker selectedValue={newCard.type} style={styles.picker} onValueChange={(itemValue) => setNewCard({ ...newCard, type: itemValue })}>
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="MasterCard" value="Mastercard" />
              <Picker.Item label="American Express" value="Amex" />
            </Picker>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddPayment}>
              <Text style={styles.submitButtonText}>Add Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // White background for clean look
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333', // Darker text for better readability
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#F9F9F9', // Light grey for card-like effect
  },
  selectedMethod: {
    borderColor: '#4CAF50', // Green border for selected method
  },
  icon: {
    width: 40,
    height: 30,
    marginRight: 15,
  },
  methodDetails: {
    flex: 1,
  },
  methodType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  methodLast4: {
    fontSize: 14,
    color: '#666666', // Lighter color for secondary text
  },
  methodNickname: {
    fontSize: 12,
    color: '#999999',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background for modal
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FF5722', // Color for cancel button
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PaymentMethods;
