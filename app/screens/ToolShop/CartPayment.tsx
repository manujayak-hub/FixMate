import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCart } from './CartContext'; // Import your CartContext
import { Picker } from '@react-native-picker/picker'; // Correct import for Picker

// Define the Tool type
interface Tool {
  id: string;
  title: string;
  price: string;
  quantity: number;
  imageUrl?: string; // Optional
}

type RootStackParamList = {
  CartPage: undefined;
  CartPayment: { total: number; selectedTools: Tool[] }; // Include selectedTools
};

type CartPaymentRouteProp = RouteProp<RootStackParamList, 'CartPayment'>;
type CartPaymentNavigationProp = StackNavigationProp<RootStackParamList, 'CartPayment'>;

interface CartPaymentProps {
  route: CartPaymentRouteProp;
  navigation: CartPaymentNavigationProp;
}

const CartPayment: React.FC<CartPaymentProps> = ({ route, navigation }) => {
  const { total, selectedTools } = route.params; // Get total and selectedTools
  const { removeTools } = useCart(); // Access the removeTools function

  // State for payment method and address
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [address, setAddress] = useState<string>('');

  const handlePayment = async () => {
    

    console.log('Processing payment of $', total, 'with method:', paymentMethod);
    console.log('Shipping Address:', address);
    // Add your payment processing logic here

    // After successful payment, remove tools from the cart
    const toolIds = selectedTools.map(tool => tool.id);
    removeTools(toolIds); // Remove from context
    // Also, remove from Firestore if needed

    // Navigate back to CartPage or another page
    navigation.navigate('CartPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Total: ${total.toFixed(2)}</Text>
      <Text style={styles.instructions}>Please proceed with your payment.</Text>

      <Text style={styles.label}>Select Payment Method:</Text>
      <Picker
        selectedValue={paymentMethod}
        style={styles.picker}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
      >
        <Picker.Item label="Credit Card" value="Credit Card" />
        <Picker.Item label="PayPal" value="PayPal" />
        <Picker.Item label="Bank Transfer" value="Bank Transfer" />
      </Picker>

      <Text style={styles.label}>Shipping Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your shipping address"
      />

      <Button title="Pay Now" onPress={handlePayment} color="#FF6100" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#808080',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    alignSelf: 'flex-start',
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 20,
  },
});

export default CartPayment;