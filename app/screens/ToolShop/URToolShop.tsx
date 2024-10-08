import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, Button, TextInput, FlatList } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { DocumentSnapshot, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { useCart } from './CartContext'; // Assuming the CartContext is in a folder called context
import { AntDesign } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

type URToolShopRouteProp = RouteProp<{ URToolShop: { toolId: string } }, 'URToolShop'>;

interface Tool {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  price?: string;
  timeDuration?: string;
}

interface Review {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

const URToolShop: React.FC = () => {
  const route = useRoute<URToolShopRouteProp>();
  const { toolId } = route.params;
  const navigation = useNavigation();

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart, cart } = useCart();
  const [isInFirestoreCart, setIsInFirestoreCart] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<string>(''); // New review content
  const [user, setUser] = useState<any>(null); // State to hold the current user

  // Get the currently logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user
      } else {
        setUser(null); // User is signed out
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

  useEffect(() => {
    const fetchToolDetails = async () => {
      try {
        const toolDocRef = doc(FIREBASE_DB, 'Tools', toolId);
        const toolDoc: DocumentSnapshot = await getDoc(toolDocRef);
        if (toolDoc.exists()) {
          setTool({ id: toolDoc.id, ...toolDoc.data() } as Tool);
        } else {
          Alert.alert('Error', 'Tool not found');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch tool details');
        console.error('Error fetching tool details:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkFirestoreCart = async () => {
      try {
        const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
        const cartDoc: DocumentSnapshot = await getDoc(cartDocRef);
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          const toolExists = cartData?.tools.some((item: Tool) => item.id === toolId);
          setIsInFirestoreCart(!!toolExists);
        }
      } catch (error) {
        console.error('Error checking Firestore cart:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(collection(FIREBASE_DB, 'Reviews'), where('toolId', '==', toolId));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const fetchedReviews: Review[] = [];
        reviewsSnapshot.forEach((doc) => {
          fetchedReviews.push({ id: doc.id, ...doc.data() } as Review);
        });
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchToolDetails();
    checkFirestoreCart();
    fetchReviews();
  }, [toolId]);

  const handleAddToCart = async () => {
    if (tool) {
      const isToolInCart = cart.some((item) => item.id === tool.id);
      if (isToolInCart || isInFirestoreCart) {
        Alert.alert('Item Already Exists', 'This is already in your cart.');
        return;
      }

      await addToCart(tool);
      Alert.alert('Success', 'Tool added to cart');

      const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
      try {
        const cartDoc = await getDoc(cartDocRef);
        let updatedTools = [];

        if (cartDoc.exists()) {
          updatedTools = cartDoc.data()?.tools || [];
        }

        await setDoc(cartDocRef, { tools: [...updatedTools, tool] });
        Alert.alert('Success', 'Tool added to database cart');
      } catch (error) {
        Alert.alert('Error', 'Failed to add tool to cart in database');
        console.error('Error adding tool to cart:', error);
      }
    }
  };

  const handleGoToCart = () => {
    navigation.navigate('CartPage' as never);
  };

  const handleAddReview = async () => {
    if (!newReview.trim()) {
      Alert.alert('Error', 'Please enter a review');
      return;
    }

    const newReviewData = {
      toolId,
      userId: user?.uid || 'anonymous', // Use the logged-in user's UID
      content: newReview,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(FIREBASE_DB, 'Reviews'), newReviewData);
      setReviews((prev) => [...prev, { id: '', ...newReviewData } as Review]);
      setNewReview('');
      Alert.alert('Success', 'Review added');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
      console.error('Error adding review:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6100" />
        <Text style={styles.loadingText}>Loading tool details...</Text>
      </View>
    );
  }

  if (!tool) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Tool not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tool Shop</Text>
        <AntDesign name="shoppingcart" size={24} color="#FF6100" onPress={handleGoToCart} />
      </View>
      {tool.imageUrl ? (
        <Image source={{ uri: tool.imageUrl }} style={styles.toolImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image Available</Text>
        </View>
      )}
      <Text style={styles.toolTitle}>{tool.title}</Text>
      <Text style={styles.toolPrice}>Price: {tool.price || 'N/A'}</Text>
      <Text style={styles.toolDuration}>Duration: {tool.timeDuration || 'N/A'}</Text>
      <Text style={styles.toolDescription}>{tool.description || 'No description available'}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} color="#FF6100" />

      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewHeader}>Reviews:</Text>
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewUserId}>User: {item.userId}</Text>
              <Text style={styles.reviewContent}>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No reviews yet.</Text>}
        />
        <TextInput
          placeholder="Write a review"
          value={newReview}
          onChangeText={setNewReview}
          style={styles.input}
          multiline
        />
        <Button title="Submit Review" onPress={handleAddReview} color="#FF6100" />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  // ...existing styles
  reviewsContainer: {
    marginTop: 30,
  },
  reviewHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  reviewUserName: {
    fontWeight: 'bold',
  },
  reviewContent: {
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  toolImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imagePlaceholderText: {
    fontSize: 18,
    color: '#808080',
  },
  toolTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toolPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6100',
    marginBottom: 10,
  },
  toolDuration: {
    fontSize: 16,
    marginBottom: 10,
  },
  toolDescription: {
    fontSize: 16,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF6100',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reviewUserId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default URToolShop;