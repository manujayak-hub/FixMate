import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, Modal, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  
      console.log("New Card Data:", newPaymentMethod); // Log new card data
  
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
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.docId} // Updated to use docId
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.methodContainer, selectedMethod === item.docId && styles.selectedMethod]} // Updated to use docId
              onPress={() => handlePaymentMethodClick(item)} // Navigate on click
            >
              {paymentIcons[item.type] && <Image source={paymentIcons[item.type]} style={styles.icon} />}
              <View>
                <Text style={styles.methodType}>{item.type}</Text>
                <Text style={styles.methodLast4}>Ending in {item.last4}</Text>
              </View>
            </TouchableOpacity>
          )}
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
              <Picker.Item label="Mastercard" value="Mastercard" />
              <Picker.Item label="Amex" value="Amex" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddPayment}>
              <Text style={styles.saveButtonText}>Save Payment Method</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  addButton: { backgroundColor: '#4CAF50', padding: 10, alignItems: 'center', borderRadius: 5 },
  addButtonText: { color: '#fff', fontSize: 18 },
  methodContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectedMethod: { backgroundColor: '#e0f7fa' },
  icon: { width: 40, height: 40, marginRight: 10 },
  methodType: { fontSize: 18 },
  methodLast4: { fontSize: 16, color: '#777' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, alignItems: 'center', borderRadius: 5 },
  saveButtonText: { color: '#fff', fontSize: 18 },
  cancelButton: { backgroundColor: '#f44336', padding: 10, alignItems: 'center', borderRadius: 5, marginTop: 10 },
  cancelButtonText: { color: '#fff', fontSize: 18 },
});

export default PaymentMethods;
