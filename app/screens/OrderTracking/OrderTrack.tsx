import React, { useState } from 'react';
import { Modal, TouchableOpacity,TouchableWithoutFeedback, View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons'; // For star icons
import { FIREBASE_DB } from '../../../Firebase_Config'; // Import Firebase config
import { collection, addDoc } from 'firebase/firestore';

// Define your stack parameter list
type RootStackParamList = {
  shopfeedbacklist: undefined; // For navigating to the feedback screen
  addcomplaint: undefined;
};

// Type for navigation prop
type OrderTrackNavigationProp = StackNavigationProp<RootStackParamList, 'shopfeedbacklist','addcomplaint'>;

const OrderTrack: React.FC = () => {
  const [isRatingVisible, setRatingVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation<OrderTrackNavigationProp>();

  const showRatingModal = () => {
    setRatingVisible(true);
  };

  const handleStarPress = (rating: number) => {
    setSelectedStars(rating);
  };

  const submitRating = () => {
    setRatingVisible(false);
    setFeedbackVisible(true); // Show the feedback form after submitting rating
  };

  const submitFeedback = async () => {
    try {
      if (name && description && selectedStars > 0) {
        await addDoc(collection(FIREBASE_DB, 'shopfeedback'), {
          name: name,
          description: description,
          rating: selectedStars,
          createdAt: new Date(),
        });
        Alert.alert('Success', 'Feedback submitted!');
        setFeedbackVisible(false);
        navigation.navigate('shopfeedbacklist'); // Navigate after feedback submission
      } else {
        Alert.alert('Error', 'Please fill all fields and select a rating.');
      }
    } catch (error) {
      console.error('Error submitting feedback: ', error);
    }
  };

  const yourcomplain = async () => {
    navigation.navigate('addcomplaint')
  }

  const closeModal = () => {
    setRatingVisible(false);
    setFeedbackVisible(false);
    setSelectedStars(0);
    setName('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showRatingModal}>
        <Text style={styles.text}>Shop Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={yourcomplain}>
        <Text style={styles.text}>Add Complain</Text>
      </TouchableOpacity>

      {/* Star Rating Modal */}
      <Modal visible={isRatingVisible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalContainer}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How was your experience at Toolmart?</Text>
            
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
            <Text style={styles.modalTitle}>How was your experience at Toolmart?</Text>
            
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

export default OrderTrack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5733',
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
