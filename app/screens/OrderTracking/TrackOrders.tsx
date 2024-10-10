import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Import additional icons here
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import UserHeder from '../../Components/ClientHeader';
import Navigation from '../../Components/Navigation';

const TrackOrders = ({ route }) => {
  const { appointment } = route.params;
  const [orderStatus, setOrderStatus] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRatingVisible, setRatingVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const orderDoc = await getDoc(doc(FIREBASE_DB, 'appointments', appointment.id));
        if (orderDoc.exists()) {
          const data = orderDoc.data();
          setOrderStatus(data.status || 'Order Placed');
          setEstimatedTime(data.estimatedTime || 'Calculating...');
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [appointment.id]);
  

  const getCurrentStepStyle = (status: string) => {
    return status === orderStatus ? styles.currentStep : styles.statusStep;
  };

  const showRatingModal = () => {
    setRatingVisible(true);
  };

  const handleStarPress = (rating: number) => {
    setSelectedStars(rating);
  };

  const submitRating = () => {
    setRatingVisible(false);
    setFeedbackVisible(true);
  };

  const submitFeedback = async () => {
    try {
      if (name && description && selectedStars > 0) {
        await addDoc(collection(FIREBASE_DB, 'shopfeedback'), {
          name: name,
          description: description,
          rating: selectedStars,
          shopName: appointment.shopName,
          createdAt: new Date(),
        });
        Alert.alert('Success', 'Feedback submitted!');
        setFeedbackVisible(false);
        
      } else {
        Alert.alert('Error', 'Please fill all fields and select a rating.');
      }
    } catch (error) {
      console.error('Error submitting feedback: ', error);
    }
  };

  const yourComplaint = () => {
    navigation.navigate('addappcomplaint', { appointment });
  };

  const closeModal = () => {
    setRatingVisible(false);
    setFeedbackVisible(false);
    setSelectedStars(0);
    setName('');
    setDescription('');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <UserHeder /><ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Track My Repairs</Text>
      </View>

      {/* Order Information Section */}
      <View style={styles.orderInfo}>
        <Text style={styles.orderText}>{appointment.shopName}</Text>
        <Text style={styles.orderDetails}>Date : {appointment.date}</Text>
        <Text style={styles.orderDetails}>Repair ID: #{appointment.id}</Text>
        <Text style={styles.price}>Rs. {appointment.rate}</Text>
      </View>

      {/* ETA Section */}


      {/* Order Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.etaText}>ETA: {estimatedTime}</Text>
        <View style={getCurrentStepStyle('Ready to Pick Up')}>
          <MaterialIcons name="check-circle" size={24} color="#FF5733" />
          <View>
            <Text style={styles.statusText}>Ready to pick</Text>
            <Text style={styles.statusSubText}>Your item is ready to pickup.</Text>
          </View>
        </View>
        <View style={getCurrentStepStyle('In Progress')}>
          <MaterialIcons name="autorenew" size={24} color="#FF5733" />
          <View>
            <Text style={styles.statusText}>Order Processed</Text>
            <Text style={styles.statusSubText}>We have started repairing your item.</Text>
          </View>
        </View>
        <View style={getCurrentStepStyle('Order Placed')}>
          <MaterialIcons name="receipt" size={24} color="#FF5733" />
          <View>
            <Text style={styles.statusText}>Order Placed</Text>
            <Text style={styles.statusSubText}>We received your order.</Text>
          </View>
        </View>
      </View>

      {/* Feedback and Complaint Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.feedbackButton} onPress={showRatingModal}>
          <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.complaintButton} onPress={yourComplaint}>
          <Text style={styles.buttonText}>Complaint</Text>
        </TouchableOpacity>
      </View>
      {/* Star Rating Modal */}
      <Modal visible={isRatingVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>How was your experience at {appointment.shopName}?</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                      <FontAwesome
                        name={star <= selectedStars ? 'star' : 'star-o'}
                        size={40}
                        color={star <= selectedStars ? '#FFD700' : '#ccc'} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.ratingText}>
                  {selectedStars === 1 && 'Bad'}
                  {selectedStars === 2 && 'Somehow Good'}
                  {selectedStars === 3 && 'Good'}
                  {selectedStars === 4 && 'Nice'}
                  {selectedStars === 5 && 'Great'}
                </Text>

                <TouchableOpacity style={styles.addButton} onPress={submitRating}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Feedback Form Modal */}
      <Modal visible={isFeedbackVisible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalContainer}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Provide your feedback for {appointment.shopName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName} />
            <TextInput
              style={styles.textArea}
              placeholder="Description..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription} />

            <TouchableOpacity style={styles.addButton} onPress={submitFeedback}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
    <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F4F9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24, // Increased font size for the title
    fontWeight: 'bold',
    color: 'black',
  },
  orderInfo: {
    backgroundColor: '#fff',
    padding: 20, // Increased padding for better spacing
    borderRadius: 12, // Slightly more rounded corners for a modern look
    marginBottom: 20,
    shadowColor: '#000', // Added shadow for a card effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderText: {
    fontSize: 20, // Increased font size
    fontWeight: 'bold',
    marginBottom: 10, // More space below the title
    color: '#333',
  },
  orderDetails: {
    fontSize: 16, // Slightly larger text for better readability
    color: '#555',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginTop: 10, // Added more space above the price
  },
  etaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 15,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 20,
    opacity: 0.5,
  },
  currentStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the left
    marginBottom: 20,
    opacity: 1,
    backgroundColor: '#FFEFD5',
    padding: 15,
    borderRadius: 8,
    borderColor: '#FF6F00', 
    borderWidth: 1,
  },
  statusText: {
    fontSize: 18, // Increased font size for better visibility
    fontWeight: 'bold',
    marginLeft: 10, // Add space between icon and text
    color: '#333',
    padding: 3,
  },
  statusSubText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 10, // Add space between icon and subtext
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spread buttons evenly
    marginTop: 20,
  },
  feedbackButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 40, // Increased padding for more clickable area
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  complaintButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16, // Slightly larger button text
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Center modals vertically
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20, // Added margin to avoid touching edges
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 50, // Increased padding for a more significant button
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    height: 120, 
  },
});
export default TrackOrders;
