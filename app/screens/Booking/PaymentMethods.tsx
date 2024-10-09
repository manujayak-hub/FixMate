import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, DocumentData, DocumentReference, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Firebase configuration
import { getAuth } from "firebase/auth"; // Firebase Auth for user management

// Define the PaymentMethod interface
interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  nickname?: string;
}

// Payment method icons mapping
const paymentIcons = {
  Visa: require('../../../assets/visa.png'),
  Mastercard: require('../../../assets/mastercard.png'),
  Amex: require('../../../assets/amex.png'),
};

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expMonth: '', expYear: '', cvv: '', nickname: '', type: 'Visa' });
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch the payment methods from Firebase when the component mounts
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
        methods.push({ id: doc.id, ...doc.data() } as PaymentMethod);
      });
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setNewCard({ 
      number: method.last4, 
      expMonth: '', // Retrieve from your data if available
      expYear: '', // Retrieve from your data if available
      cvv: '', // CVV should not be stored for security reasons
      nickname: method.nickname || '',
      type: method.type 
    });
    setModalVisible(true);
  };

  const handleAddPayment = async () => {
    if (!newCard.number || newCard.number.length < 16 || !newCard.expMonth || !newCard.expYear || !newCard.cvv) {
      Alert.alert('Error', 'Please fill in all required fields with valid data.');
      return;
    }

    // Check expiration date validity
    const expDate = new Date(`${newCard.expYear}-${newCard.expMonth}-01`);
    if (expDate < new Date()) {
      Alert.alert('Error', 'The card expiration date is invalid.');
      return;
    }

    if (user) {
      const newPaymentMethod: PaymentMethod = {
        id: Math.random().toString(),
        type: newCard.type,
        last4: newCard.number.slice(-4),
        nickname: newCard.nickname || '',
      };

      try {
        // Save to Firebase
        await addDoc(collection(FIREBASE_DB, 'paymentMethods'), {
          userId: user.uid, // Associate with the logged-in user
          ...newPaymentMethod,
        });

        // Update local state
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
        setModalVisible(false);
        Alert.alert('Success', 'Payment method added successfully!');
        setNewCard({ number: '', expMonth: '', expYear: '', cvv: '', nickname: '', type: 'Visa' });
      } catch (error) {
        console.error('Error adding payment method: ', error);
        Alert.alert('Error', 'There was an issue adding the payment method. Please try again.');
      }
    } else {
      Alert.alert('Error', 'No user is logged in.');
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedMethod) return;

    try {
      const paymentRef = doc(FIREBASE_DB, 'paymentMethods', selectedMethod.id);
      await updateDoc(paymentRef, {
        nickname: newCard.nickname,
        // Update other necessary fields
      });

      setPaymentMethods(paymentMethods.map(method => method.id === selectedMethod.id ? { ...selectedMethod, nickname: newCard.nickname } : method));
      setModalVisible(false);
      Alert.alert('Success', 'Payment method updated successfully!');
    } catch (error) {
      console.error('Error updating payment method: ', error);
      Alert.alert('Error', 'There was an issue updating the payment method. Please try again.');
    }
  };

  const handleDeletePayment = async () => {
    if (!selectedMethod) {
      console.log('No payment method selected');
      return;
    }
  
    Alert.alert('Delete Payment Method', 'Are you sure you want to delete this payment method?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            console.log('Attempting to delete payment method:', selectedMethod.id);
            await deleteDoc(doc(FIREBASE_DB, 'paymentMethods', selectedMethod.id));
            
            // Ensure that paymentMethods state is updated correctly
            setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== selectedMethod.id));
            setModalVisible(false);
            Alert.alert('Success', 'Payment method deleted successfully!');
          } catch (error) {
            console.error('Error deleting payment method: ', error);
            Alert.alert('Error', 'There was an issue deleting the payment method. Please try again.');
          }
        },
      },
    ]);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment </Text>
      <TouchableOpacity onPress={() => { setSelectedMethod(null); setModalVisible(true); }} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add payment method</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.methodContainer, selectedMethod?.id === item.id && styles.selectedMethod]}
              onPress={() => handleSelect(item)}
            >
              {/* Display the relevant payment icon */}
              {paymentIcons[item.type] && (
                <Image
                  source={paymentIcons[item.type]}
                  style={styles.icon}
                />
              )}
              <View>
                <Text style={styles.methodType}>{item.type}</Text>
                <Text style={styles.methodLast4}>Ending in {item.last4}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for adding/updating a payment method */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMethod ? 'Edit Payment Details' : 'Add Payment Method'}</Text>
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
            <Picker
              selectedValue={newCard.type}
              style={styles.picker}
              onValueChange={(itemValue) => setNewCard({ ...newCard, type: itemValue })}
            >
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="Mastercard" value="Mastercard" />
              <Picker.Item label="Amex" value="Amex" />
            </Picker>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={selectedMethod ? handleUpdatePayment : handleAddPayment}>
                <Text style={styles.buttonText}>{selectedMethod ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
              {selectedMethod && (
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeletePayment}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedMethod: {
    backgroundColor: '#E8F5E9',
  },
  methodType: {
    fontSize: 18,
    marginLeft: 10,
  },
  methodLast4: {
    fontSize: 14,
    color: '#888',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF', // Primary button color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5, // Adds spacing between buttons
  },
  buttonText: {
    color: '#fff', // Button text color
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red', // Color for delete button
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'blue', // Close button text color
    fontWeight: 'bold',
  },
});

export default PaymentMethods;