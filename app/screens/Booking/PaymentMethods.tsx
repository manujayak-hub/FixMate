import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, Modal, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

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
  PayPal: require('../../../assets/paypal.png'),
};

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expMonth: '', expYear: '', cvv: '', nickname: '', type: 'Visa' });

  const handleSelect = (id: string) => {
    setSelectedMethod(id);
  };

  const handleAddPayment = () => {
    // Validate card inputs
    if (!newCard.number || newCard.number.length < 16 || !newCard.expMonth || !newCard.expYear || !newCard.cvv) {
      Alert.alert('Error', 'Please fill in all required fields with valid data.');
      return;
    }
    const newPaymentMethod: PaymentMethod = {
      id: Math.random().toString(),
      type: newCard.type,
      last4: newCard.number.slice(-4),
      nickname: newCard.nickname || '',
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setModalVisible(false);
    Alert.alert('Success', 'Payment method added successfully!');
    setNewCard({ number: '', expMonth: '', expYear: '', cvv: '', nickname: '', type: 'Visa' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add payment method</Text>
      </TouchableOpacity>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.paymentItem}
            onPress={() => handleSelect(item.id)}
          >
            <Ionicons
              name={selectedMethod === item.id ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={selectedMethod === item.id ? '#6200ee' : '#000'}
            />
            <View style={styles.paymentInfo}>
              {paymentIcons[item.type] && (
                <Image
                  source={paymentIcons[item.type]}
                  style={styles.icon}
                  resizeMode="contain"
                />
              )}
              <Text>{item.type} •••• {item.last4}</Text>
              {item.nickname && <Text style={styles.nickname}>{item.nickname}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for adding a new payment method */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Add Card</Text>

          {/* Card Type Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Card Type:</Text>
            <Picker
              selectedValue={newCard.type}
              onValueChange={(itemValue) => setNewCard({ ...newCard, type: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="Mastercard" value="Mastercard" />
              <Picker.Item label="Amex" value="Amex" />
              {/* Add more payment types if necessary */}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter card number"
            keyboardType="numeric"
            maxLength={16}
            value={newCard.number}
            onChangeText={(text) => setNewCard({ ...newCard, number: text })}
          />

          <View style={styles.expCvvContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="MM"
              keyboardType="numeric"
              value={newCard.expMonth}
              onChangeText={(text) => setNewCard({ ...newCard, expMonth: text })}
              maxLength={2}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="YY"
              keyboardType="numeric"
              value={newCard.expYear}
              onChangeText={(text) => setNewCard({ ...newCard, expYear: text })}
              maxLength={2}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="CVV"
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
              value={newCard.cvv}
              onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter a nickname for your card (Optional)"
            value={newCard.nickname}
            onChangeText={(text) => setNewCard({ ...newCard, nickname: text })}
          />

          <TouchableOpacity style={styles.addCardButton} onPress={handleAddPayment}>
            <Text style={styles.addCardButtonText}>Add Card</Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  paymentInfo: {
    marginLeft: 16,
  },
  nickname: {
    fontSize: 12,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  expCvvContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addCardButton: {
    backgroundColor: '#ffcc00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addCardButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
});
