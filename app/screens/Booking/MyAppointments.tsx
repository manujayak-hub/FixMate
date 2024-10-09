import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Alert,
  Modal,
} from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../../Firebase_Config';
import Navigation from '../../Components/Navigation';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [animation] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const appointmentsRef = collection(FIREBASE_DB, 'appointments');
          const q = query(appointmentsRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const appointmentList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAppointments(appointmentList);
        } else {
          console.error('No user logged in');
        }
      } catch (error) {
        console.error('Error fetching appointments: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const toggleExpandCard = (id) => {
    setExpandedCards((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));

    Animated.timing(animation, {
      toValue: expandedCards[id] ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCancelAppointment = async (id) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteDoc(doc(FIREBASE_DB, 'appointments', id));
              setAppointments((prev) => prev.filter((item) => item.id !== id));
              setModalVisible(true);
            } catch (error) {
              console.error('Error canceling appointment: ', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View style={styles.noAppointments}>
        <Text style={styles.noAppointmentsText}>No Appointments Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.shopName}>{item.shopName}</Text>
              <TouchableOpacity
                style={styles.moreDetailsButton}
                onPress={() => toggleExpandCard(item.id)}
              >
                <Text style={styles.moreDetailsText}>
                  {expandedCards[item.id] ? 'Hide' : 'Details'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.details}>Category: {item.shopCategory}</Text>
            <Text style={styles.details}>Date: {item.date}</Text>

            {expandedCards[item.id] && (
              <Animated.View style={styles.expandedDetails}>
                <Text style={styles.details}>Time: {item.time}</Text>
                <Text style={styles.details}>Rate: LKR {item.rate}</Text>
                <Text style={styles.details}>Address: {item.address}</Text>
              </Animated.View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.trackButton}>
                <Text style={styles.trackText}>Track</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelAppointment(item.id)}
              >
                <Text style={styles.cancelText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Navigation />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              We're sorry to see you go! Unfortunately, you’ve lost a loyalty point for cancelling your appointment. 
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>OK</Text>
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
    backgroundColor: '#F8F9FA', // Light background for a softer look
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  noAppointments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  noAppointmentsText: {
    fontSize: 18,
    color: '#6C757D', // Softer gray for less harshness
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16, // Slightly less padding for a more compact look
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12, // Subtle rounding for a modern feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600', // Slightly lighter weight for elegance
    color: '#343A40', // Dark gray for better readability
  },
  details: {
    fontSize: 14,
    color: '#495057', // Neutral gray for better readability without being too dark
    marginBottom: 2,
  },
  expandedDetails: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF', // Light border for separation
    paddingTop: 8,
  },
  moreDetailsButton: {
    backgroundColor: '#999999',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  moreDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row-reverse', // Reverse the row direction
    justifyContent: 'space-between',
    marginTop: 15,
  },
  trackButton: {
    backgroundColor: '#FF6200',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  trackText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  cancelText: {
    color: '#D60000',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better focus on modal
  },
  modalContainer: {
    width: '85%', // Increased width for more content space
    backgroundColor: '#FFFFFF',
    borderRadius: 25, // Softer corners
    padding: 30, // Increased padding for better spacing
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10, // Increased elevation for more depth
  },
  modalText: {
    fontSize: 18, // Increased font size for readability
    fontWeight: '600', // Slightly bolder text
    textAlign: 'center',
    marginBottom: 25, // Increased margin for better spacing
    color: '#37474F',
  },
  modalButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 12, // Increased vertical padding for a larger button
    paddingHorizontal: 25, // Increased horizontal padding for better touch area
    borderRadius: 30,
    width: '100%', // Button takes full width of modal
    alignItems: 'center', // Center text in button
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18, // Increased font size for better readability
    fontWeight: '500', // Slightly bolder for emphasis
  },
});

export default MyAppointments;
