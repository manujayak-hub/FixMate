import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCart } from './CartContext'; // Import your CartContext
import { Picker } from '@react-native-picker/picker'; // Correct import for Picker
import { SafeAreaView } from 'react-native-safe-area-context';
import ClientHeader from "../../Components/ClientHeader";
import Navigation from "../../Components/Navigation";

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
  SuccessPage: undefined;
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
    
    const toolIds = selectedTools.map(tool => tool.id);
    removeTools(toolIds); 
    
    navigation.navigate('SuccessPage');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader/>
    <View style={styles.container}>
      <Text style={styles.text}>Total: Rs.{total.toFixed(2)}</Text>
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

      <Text style={styles.label}>Delivery Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your delivery address"
      />


<TouchableOpacity style={styles.addButton} onPress={handlePayment}>
              <Text style={styles.addButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
      
    </View>
    <Navigation/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop:50,
    justifyContent: 'center',
    alignItems: 'center',
    
    padding: 15,
    alignSelf:'center',
    width: 340,
    height: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom:100,
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
  addButton: {
    flexDirection: 'row', // Aligns children horizontally
    justifyContent: 'center', // Centers content horizontally
    alignSelf:'center',
    padding:15,
    width: 200,
    height: 60,
    backgroundColor: '#FF6F00',
    borderRadius: 22,
    marginTop:20,
    
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft:15,
  },
});

export default CartPayment;