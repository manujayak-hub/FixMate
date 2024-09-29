import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import AddFeedbackModal from './AddFeedbackModel';  

const AboutUs = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

 // Fetch feedbacks from Firestore
 const fetchFeedbacks = async () => {
    try {
      const feedbackCollection = collection(FIREBASE_DB, 'feedbacks');
      const feedbackSnapshot = await getDocs(feedbackCollection);
      const feedbackList = feedbackSnapshot.docs.map(doc => doc.data());
      setFeedbacks(feedbackList);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  useEffect(() => {
    fetchFeedbacks(); // Fetch feedbacks when component mounts
  }, []);

  // Toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderFeedback = ({ item }) => (
    <View style={styles.feedbackCard}>
      <Text style={styles.feedbackAuthor}>{item.name}</Text>
      <Text style={styles.feedbackText}>{item.feedback}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Who We Are.....</Text>
      <Text style={styles.descriptionText}>
        We are a mobile solutions company that grows businesses and creates a unique user
        experience by developing mobile apps...
      </Text>

      <Text style={styles.feedbackHeader}>Your Feedbacks...</Text>
      <FlatList
        data={feedbacks}
        renderItem={renderFeedback}
        keyExtractor={(_item, index) => index.toString()}
        style={styles.feedbackList}
      />

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>Add Feedback</Text>
      </TouchableOpacity>

      {/* Add Feedback Modal */}
      <AddFeedbackModal isVisible={isModalVisible} onClose={toggleModal} 
      onFeedbackAdded={fetchFeedbacks} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  descriptionText: {
    fontSize: 16,
    marginVertical: 10,
  },
  feedbackHeader: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#FF6F00'
  },
  feedbackCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  feedbackAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedbackText: {
    marginTop: 5,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackList: {
    marginTop: 10,  
  },
});

export default AboutUs;
