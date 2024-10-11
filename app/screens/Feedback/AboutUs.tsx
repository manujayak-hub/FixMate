import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import AddFeedbackModal from './AddFeedbackModel';  
import ClientHeader from '../../Components/ClientHeader';
import Navigation from '../../Components/Navigation';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for icons

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
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader/>
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
          keyExtractor={(_, index) => index.toString()}
          style={styles.feedbackList}
        />

        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Text style={styles.addButtonText}>
            <Ionicons name="add" size={18} color="#fff" /> Add Feedback
          </Text>
        </TouchableOpacity>

        {/* Add Feedback Modal */}
        <AddFeedbackModal isVisible={isModalVisible} onClose={toggleModal} 
          onFeedbackAdded={fetchFeedbacks} />
      </View>
      <Navigation/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 24,
  },
  feedbackHeader: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
    borderBottomWidth: 1,
    borderBottomColor: '#FF6F00',
    paddingBottom: 5,
  },
  feedbackCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 1, // iOS shadow
  },
  feedbackAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  feedbackText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row', // Align icon and text
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Space between icon and text
  },
  feedbackList: {
    marginTop: 10,  
  },
});

export default AboutUs;
