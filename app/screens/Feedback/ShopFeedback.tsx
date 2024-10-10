import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Import Firebase config
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import ClientHeader from '../../Components/ClientHeader';
import Navigation from '../../Components/Navigation';

interface Feedback {
  id: string;
  name: string;
  description: string;
  shopN: string;
  rating: number;
}

const ShopFeedback: React.FC<{ route: any }> = ({ route }) => {
  const { shop } = route.params;
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch feedback from Firebase for the specific shop
  useEffect(() => {
    const feedbackQuery = query(collection(FIREBASE_DB, 'shopfeedback'), where('shopName', '==', shop.shopName));

    const unsubscribe = onSnapshot(feedbackQuery, (snapshot) => {
      const feedbackData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Feedback[];
      setFeedbackList(feedbackData);

      const total = feedbackData.length;
      const avgRating = total > 0 
        ? feedbackData.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / total 
        : 0;

      setTotalReviews(total);
      setAverageRating(avgRating);
    });

    return () => unsubscribe();
  }, [shop]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>{shop.shopName} Reviews</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.totalReviews}>Total Reviews: {totalReviews}</Text>
          <Text style={styles.averageRating}>Average Rating: {averageRating.toFixed(1)}</Text>
        </View>

        <Text style={styles.recentReviewsTitle}>Recent Reviews:</Text>

        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={20} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={false}
        />
        
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
};

export default ShopFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalReviews: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  recentReviewsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 15
  },
  reviewContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
  },
});
