import React, { useState } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from './CartContext'; // Adjust the path accordingly
import { Checkbox } from 'expo-checkbox'; // You can use any checkbox component
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Import your Firestore instance
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import ClientHeader from "../../Components/ClientHeader";
import Navigation from "../../Components/Navigation";
import { SafeAreaView } from 'react-native-safe-area-context';

const bag = require("../../../assets/shopping-bag.png");

// Define your root stack param list here as well
type RootStackParamList = {
  CartPage: undefined;
  CartPayment: { total: number; selectedTools: any[] }; // Include selectedTools in parameters
};

// Define the navigation prop type for CartPage
type CartPageNavigationProp = StackNavigationProp<RootStackParamList, 'CartPage'>;

const CartPage: React.FC = () => {
  const { cart, updateCart } = useCart();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const navigation = useNavigation<CartPageNavigationProp>(); // Use the typed navigation prop

  // Get the logged-in user's ID
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  // Filter the cart to only include items for the logged-in user
  const userCart = cart.filter(tool => tool.userId === userId); // Assuming each cart item has a userId field

  const handleCheckboxChange = (toolId: string) => {
    setSelectedTools(prevSelected => 
      prevSelected.includes(toolId) ? prevSelected.filter(id => id !== toolId) : [...prevSelected, toolId]
    ); // Toggle selection
  };

  const handleQuantityChange = async (toolId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;

    if (newQuantity >= 1 && newQuantity <= 5) {
      try {
        // Update the quantity in local state
        const updatedCart = userCart.map(tool =>
          tool.id === toolId ? { ...tool, quantity: newQuantity } : tool
        );

        // Update Firestore with the new quantity
        const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart'); // Assuming a shared cart document
        await updateDoc(cartDocRef, { tools: updatedCart });

        // Update the local cart state in context if necessary
        updateCart(updatedCart); // Ensure context is updated if you're using context

        console.log('Quantity updated in Firestore and local state');
      } catch (error) {
        console.error('Error updating quantity in Firestore:', error);
      }
    }
  };

  const handleProceedToPay = () => {
    const finalTools = userCart.filter(tool => selectedTools.includes(tool.id));
    const total = finalTools.reduce((sum, tool) => sum + (parseFloat(tool.price || '0') * (tool.quantity || 1)), 0);

    // Check if total is greater than zero before navigating
    if (total > 0) {
      navigation.navigate('CartPayment', { total, selectedTools: finalTools });
    } else {
      Alert.alert('No Items Selected', 'Please select at least one tool to proceed with payment.'); // Optional: Alert user
    }
  };

  // Calculate subtotal and total for selected tools
  const calculateTotals = () => {
    let subtotal = 0;

    selectedTools.forEach(toolId => {
      const tool = userCart.find(item => item.id === toolId);
      if (tool && tool.price && tool.quantity) {
        const itemSubtotal = parseFloat(tool.price) * tool.quantity; // Multiply price by quantity
        subtotal += itemSubtotal; // Add this item's total to the subtotal
      }
    });

    return { subtotal }; // You can adjust total to include tax or other fees if needed
  };

  const { subtotal } = calculateTotals(); // Get totals for rendering

  const renderItem = ({ item }) => (
    <View style={styles.toolContainer}>
      <Checkbox
        value={selectedTools.includes(item.id)}
        onValueChange={() => handleCheckboxChange(item.id)}
        style={styles.checkbox}
      />
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.toolImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image Available</Text>
        </View>
      )}
      <View style={styles.toolDetails}>
        <Text style={styles.toolTitle}>{item.name}</Text>
        <Text style={styles.toolPrice}>Price: {item.price || 'N/A'}.00</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity || 1, -1)}
            disabled={item.quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity || 1, +1)}
            disabled={item.quantity >= 5}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (userCart.length === 0) { // Check against userCart
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ClientHeader />
        <View style={styles.emptyContainer}>
          <Image source={bag} style={styles.bagIcon} />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
        <Navigation />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <View style={styles.container}>
        <FlatList
          data={userCart} // Use userCart instead of cart
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        <View style={styles.totalsContainer}>
          <Text style={styles.totalText}>Total: Rs. {subtotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleProceedToPay}>
          <Text style={styles.addButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: -20, height: -20 },
    shadowOpacity: 0.01,
    shadowRadius: 10,
    elevation: 2,
    borderRadius: 15,
    margin: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  toolImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  toolDetails: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  toolPrice: {
    fontSize: 16,
    color: '#FF6100',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 336,
    height: 10,
    left: '50%',
    marginLeft: -170,
    top: 183,
    backgroundColor: '#F9F9F9',
    padding: 40,
    borderRadius: 12,
    flexDirection: 'column',
    marginBottom: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 50 },
    shadowOpacity: 0.03,
    shadowRadius: 100,
    elevation: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
    bottom: 20,
  },
  totalsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'left',
    
  },
  addButton: {
    backgroundColor: '#FF6100',
    paddingVertical: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bagIcon: {
    width: 80,
    height: 80,
    left: 0,
    top: -10,
    marginBottom:40,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    marginRight: 20,
  },
  imagePlaceholderText: {
    color: '#fff',
  },
});

export default CartPage;
