import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, setDoc, updateDoc, arrayRemove, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the parameter list for your stack navigator
export type RootStackParamList = {
  Home: undefined; // Assuming you have a Home screen
  SuccessPage: undefined; // Define your SuccessPage route here
  // Add other routes as needed
};

// Interface for your Tool
interface Tool {
  id: string;
  title: string;
  price?: string;
  imageUrl?: string;
  quantity?: number;
  userId?: string; 
}

// Context type for Cart
interface CartContextType {
  cart: Tool[];
  addToCart: (tool: Tool) => Promise<void>;
  updateCart: (updatedCart: Tool[]) => void;
  removeTools: (toolIds: string[]) => void;
}

// Create CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Tool[]>([]);
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Use the defined type

  useEffect(() => {
    const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        const cartData = doc.data();
        setCart(cartData?.tools || []);
      } else {
        setCart([]);
      }
    }, (error) => {
      
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const addToCart = async (tool: Tool) => {
    if (!tool.userId) {
      Alert.alert('Error', 'User ID is required to add an item to the cart.');
      return;
    }

    const existingToolIndex = cart.findIndex(item => item.id === tool.id && item.userId === tool.userId);

    if (existingToolIndex !== -1) {
      const updatedTool = {
        ...cart[existingToolIndex],
        quantity: (cart[existingToolIndex].quantity || 0) + 1,
      };
      const updatedCart = [...cart.slice(0, existingToolIndex), updatedTool, ...cart.slice(existingToolIndex + 1)];
      setCart(updatedCart);

      const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
      try {
        await updateDoc(cartDocRef, { tools: updatedCart });
        Alert.alert('Success', 'Tool quantity updated in cart.');
        return;
      } catch (error) {
        console.error('Error updating tool quantity in Firestore cart:', error);
        Alert.alert('Error', 'Failed to update tool quantity in database.');
      }
    } else {
      const updatedCart = [...cart, { ...tool, quantity: 1 }];
      setCart(updatedCart);

      const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
      try {
        await setDoc(cartDocRef, { tools: updatedCart }, { merge: true });
        
      } catch (error) {
        console.error('Error adding tool to Firestore cart:', error);
        Alert.alert('Error', 'Failed to add tool to cart in database.');
      }
    }
  };

  const updateCart = async (updatedCart: Tool[]) => {
    setCart(updatedCart);
    
    const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
    try {
      await updateDoc(cartDocRef, { tools: updatedCart });
      console.log('Cart updated in Firestore');
    } catch (error) {
      console.error('Error updating Firestore cart:', error);
      Alert.alert('Error', 'Failed to update cart in database.');
    }
  };

  const removeTools = async (toolIds: string[]) => {
    const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');

    try {
      for (const toolId of toolIds) {
        const toolToRemove = cart.find(tool => tool.id === toolId);
        if (toolToRemove) {
          setCart((prevCart) => prevCart.filter(tool => tool.id !== toolId));
          await updateDoc(cartDocRef, {
            tools: arrayRemove(toolToRemove)
          });
        }
      }
      console.log('Tools removed from Firestore cart');
      
      // Navigate to SuccessPage after successful removal
      navigation.navigate('SuccessPage'); // Navigate to the success page

    } catch (error) {
      console.error('Error removing tools from Firestore cart:', error);
      Alert.alert('Error', 'Failed to remove tools from cart in database.');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeTools }}>
      {children}
    </CartContext.Provider>
  );
};
