import React, { useEffect, useState } from 'react';
import { TouchableOpacity,View, Text, Image, StyleSheet, ActivityIndicator, Alert, Button, TextInput, FlatList, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { DocumentSnapshot, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../Firebase_Config';
import { useCart } from './CartContext';
import { AntDesign } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useUserStore from '../../Store/userStore';
import ClientHeader from "../../Components/ClientHeader";
import Navigation from "../../Components/Navigation";

type URToolShopRouteProp = RouteProp<{ URToolShop: { toolId: string } }, 'URToolShop'>;

interface Tool {
  id: string;
  title: string;
  name:string;
  imageUrl?: string;
  description?: string;
  price?: string;
  timeDuration?: string;
  userId: string; 
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

const URToolShop: React.FC = () => {
  const route = useRoute<URToolShopRouteProp>();
  const { toolId } = route.params;
  const navigation = useNavigation();
  const { user: storedUser, setUser } = useUserStore(); // Adjusted to use userStore

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart, cart } = useCart();
  const [isInFirestoreCart, setIsInFirestoreCart] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<string>(''); 
  const [userName, setUserName] = useState<string>(''); // State to hold the user name

  // Get the currently logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || 'Anonymous', // Use displayName or default to 'Anonymous'
          email: currentUser.email || '',
        });
        fetchUserName(currentUser.uid); // Fetch the user name when user logs in
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  // Fetch the user name from Firestore
  const fetchUserName = async (uid: string) => {
    try {
      const userDocRef = doc(FIREBASE_DB, 'users', uid); // Assuming your user data is stored under 'Users' collection
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserName(userDoc.data()?.name || 'Anonymous'); // Use name from Firestore
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

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
    if (tool && storedUser) {
      const cartDocRef = doc(FIREBASE_DB, 'Cart', 'shared_cart');
      try {
        const cartDoc = await getDoc(cartDocRef);
        let updatedTools = [];
  
        if (cartDoc.exists()) {
          updatedTools = cartDoc.data()?.tools || [];
        }
  
        // Check if the tool already exists in the cart for the current user
        const userToolExists = updatedTools.some(
          (item: Tool) => item.id === tool.id && item.userId === storedUser.uid
        );
  
        if (userToolExists) {
          Alert.alert('Item Already Exists', 'This item is already in your cart.');
          return;
        }
  
        // If the tool does not exist for the user, proceed to add it
        const cartItem = { ...tool, userId: storedUser.uid };
        await addToCart(cartItem); // Add to local cart state
        Alert.alert('Success', 'Tool added to cart');
  
        // Update Firestore cart
        await setDoc(cartDocRef, { tools: [...updatedTools, cartItem] }, { merge: true });
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
      userId: storedUser?.uid || 'anonymous',
      userName: userName || 'Anonymous', // Use fetched user name
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
    <SafeAreaView style={styles.safeArea}>
      <ClientHeader />
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={[tool]} // Pass tool as an array to display it
        keyExtractor={(item) => item.id}
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{tool.name}</Text>
              <AntDesign name="shoppingcart" size={24} color="#FF6100" onPress={handleGoToCart} />
            </View>
            {tool.imageUrl ? (
              <Image source={{ uri: tool.imageUrl }} style={styles.toolImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>No Image Available</Text>
              </View>
            )}
            
            <Text style={styles.toolPrice}>Rs. {tool.price || 'N/A'}</Text>
            <Text style={styles.reviewHeader}>Description</Text>
           
            <Text style={styles.toolDescription}>{tool.description || 'No description available'}</Text>
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
            
            
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewHeader}>Reviews</Text>
              <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewUser}>{item.userName}: </Text>
                    <Text style={styles.reviewContent}>{item.content}</Text>
                  </View>
                )}
              />
              <TextInput
                style={styles.reviewInput}
                placeholder="Write a review..."
                value={newReview}
                onChangeText={setNewReview}
              />

            <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
              <Text style={styles.addButtonText}>Add Review</Text>
            </TouchableOpacity>

              
            </View>
          </View>
        )}
      />
       <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    padding: 16,
  },
  container: {
    padding: 16,
    borderRadius: 8,

    backgroundColor: '#F9F9F9',

  

    elevation: 1,
  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  toolImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  imagePlaceholderText: {
    color: '#999',
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  toolPrice: {
    fontSize: 16,
    marginBottom: 4,
  },
  toolDuration: {
    fontSize: 16,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  reviewsContainer: {
    marginTop: 16,
    padding:10,
    backgroundColor: '#F3F3F3',
    shadowColor: '#000', // Required for iOS
    shadowOffset: { width: -20, height: -20 },
    shadowOpacity: 0.5,
    
    elevation: 2, // Required for Android
    borderRadius: 5,
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewItem: {
    marginBottom: 8,
    padding:10,
    backgroundColor: '#F3F3F3',
    shadowColor: '#000', // Required for iOS
    shadowOffset: { width: -20, height: -20 },
    shadowOpacity: 0.5,
    flexDirection: 'row',
    elevation: 10, // Required for Android
    borderRadius: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  reviewContent: {
    color: '#555',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  addButton: {
    width:'50%',
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignSelf:'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft:15,
  },
});

export default URToolShop;
