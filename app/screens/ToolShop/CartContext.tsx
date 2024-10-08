import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust the path according to your project structure
import { Alert } from 'react-native'; // Import Alert for displaying messages

interface Tool {
  id: string;
  title: string;
  price?: string;
  imageUrl?: string;
  quantity?: number; // Add quantity to the Tool interface
}

interface CartContextType {
  cart: Tool[];
  addToCart: (tool: Tool) => Promise<void>; // Updated to return a promise
  updateCart: (updatedCart: Tool[]) => void; // Method to update the cart
  removeTools: (toolIds: string[]) => void; // New method for removing tools
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart'); // Use a common document for the cart
        const cartDoc = await getDoc(cartDocRef);

        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          setCart(cartData?.tools || []); // Initialize cart from Firestore
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (tool: Tool) => {
    const isToolInCart = cart.some((item) => item.id === tool.id);
    if (isToolInCart) {
      Alert.alert('Item Already Exists', 'This is already in your cart.');
      return;
    }

    const updatedCart = [...cart, { ...tool, quantity: 1 }]; // Initialize quantity to 1
    setCart(updatedCart);

    const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
    try {
      await setDoc(cartDocRef, { tools: updatedCart }, { merge: true });
      Alert.alert('Success', 'Tool added to cart in database.');
    } catch (error) {
      console.error('Error adding tool to Firestore cart:', error);
      Alert.alert('Error', 'Failed to add tool to cart in database.');
    }
  };

  const updateCart = (updatedCart: Tool[]) => {
    setCart(updatedCart);
    
    const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
    updateDoc(cartDocRef, { tools: updatedCart })
      .then(() => {
        console.log('Cart updated in Firestore');
      })
      .catch((error) => {
        console.error('Error updating Firestore cart:', error);
        Alert.alert('Error', 'Failed to update cart in database.');
      });
  };

  const removeTools = async (toolIds: string[]) => {
    // Get a reference to the Firestore shared cart document
    const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');

    try {
      // Loop through each toolId to remove them
      for (const toolId of toolIds) {
        // Find the tool to remove from the local cart state
        const toolToRemove = cart.find(tool => tool.id === toolId);
        if (toolToRemove) {
          // Remove the tool from the local cart state
          setCart((prevCart) => prevCart.filter(tool => tool.id !== toolId));
          
          // Remove the tool from the Firestore shared cart
          await updateDoc(cartDocRef, {
            tools: arrayRemove(toolToRemove) // Remove from Firestore
          });
        }
      }
      console.log('Tools removed from Firestore cart');
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
