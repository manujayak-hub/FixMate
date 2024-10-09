import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';

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
        navigation.navigate('shopfeedbacklist');
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
    <View style={styles.container}>
      <Text style={styles.heading}>Order Tracking</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.details}>Shop Name: <Text style={styles.highlight}>{appointment.shopName}</Text></Text>
        <Text style={styles.details}>Date: <Text style={styles.highlight}>{appointment.date}</Text></Text>
        <Text style={styles.details}>Rate: <Text style={styles.highlight}>LKR {appointment.rate}</Text></Text>
        <Text style={styles.status}>Status: <Text style={styles.highlight}>{orderStatus}</Text></Text>
        <Text style={styles.estimatedTime}>Estimated Time: <Text style={styles.highlight}>{estimatedTime}</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={showRatingModal}>
        <Text style={styles.buttonText}>Shop Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={yourComplaint}>
        <Text style={styles.buttonText}>Add Complaint</Text>
      </TouchableOpacity>

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
                        color={star <= selectedStars ? '#FFD700' : '#ccc'}
                      />
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Provide your feedback for {appointment.shopName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.textArea}
              placeholder="Description..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.addButton} onPress={submitFeedback}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#37474F',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FF5733',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7043',
    marginBottom: 10,
  },
  estimatedTime: {
    fontSize: 16,
    color: '#FF6F00',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    height: 100,
  },
});

export default TrackOrders;
