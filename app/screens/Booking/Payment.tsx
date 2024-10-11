import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const paymentMethods = [
  { id: '1', name: 'Visa', icon: require('../../../assets/visa.png') },
  { id: '2', name: 'MasterCard', icon: require('../../../assets/mastercard.png') },
  { id: '3', name: 'American Express', icon: require('../../../assets/amex.png') },
  { id: '4', name: 'Fixmate Points', icon: require('../../../assets/cash.png') },
];

const Payment = ({ route }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const { amount, tax, total } = route.params; 
  const navigation = useNavigation();

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Payment Successful",
        "Your payment was processed successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(true); // Show the modal after the alert
            },
          },
        ]
      );
    }, 2000); // Keep this delay if you want to simulate processing time
  };

  const handleViewAppointments = () => {
    setModalVisible(false); // Hide the modal
    navigation.navigate('MyAppointments'); // Navigate to the View All Appointments screen
  };

  return (
    <View style={styles.container}>
      {/* Payment Methods */}
      <Text style={styles.title}>Choose a Payment Method</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === item.id && styles.selectedMethod,
            ]}
            onPress={() => setSelectedMethod(item.id)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.methodText}>{item.name}</Text>
            <View style={selectedMethod === item.id ? styles.radioSelected : styles.radio} />
          </TouchableOpacity>
        )}
      />

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <Text style={styles.summaryText}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub Total</Text>
          <Text style={styles.summaryValue}>LKR {amount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>LKR {tax}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.totalValue}>LKR {total}</Text>
        </View>
      </View>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.payButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>

      {/* Modal for Loyalty Points */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={require('../../../assets/loyalty.png')} style={styles.modalImage} />
            <Text style={styles.modalText}>🎉 Congratulations!</Text>
            <Text style={styles.modalSubText}>You've earned <Text style={styles.boldText}>3 loyalty points!</Text> Thank you for being a loyal customer!</Text>
            <TouchableOpacity
              style={styles.viewAppointmentsButton}
              onPress={handleViewAppointments}
            >
              <Text style={styles.buttonText}>View All Appointments</Text>
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
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedMethod: {
    borderColor: '#40AE4F',
    borderWidth: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#40AE4F',
  },
  orderSummary: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  payButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    color: '#40AE4F',
  },
  modalSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#40AE4F',
  },
  viewAppointmentsButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Payment;
