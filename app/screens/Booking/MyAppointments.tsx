import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../../Firebase_Config'; // Import Firebase Auth
import Navigation from '../../Components/Navigation'; // Your bottom navigation component
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


 export type RootStackParamList = {
  TrackOrders: { appointment: Myappointments };
  addcomplaint: { appointment: Myappointments };
};

// Define the type for the navigation prop
type MyAppointmentsScreenProp = StackNavigationProp<
  RootStackParamList,
  'TrackOrders'
>;

interface Myappointments {
  shopId: string;
  shopName: string;
  date: string;
  rate: string;
  status: string; 
  estimatedTime: string; 
}


const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded cards
  const [animation] = useState(new Animated.Value(0)); // Animation for expansion
  const navigation = useNavigation<MyAppointmentsScreenProp>();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Get the current user
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          const userId = currentUser.uid; // Get the UID of the logged-in user

          // Query Firestore for appointments where userId matches
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
      [id]: !prevExpanded[id], // Toggle the expanded state
    }));

    Animated.timing(animation, {
      toValue: expandedCards[id] ? 0 : 1, // Animate based on expanded state
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleTrackOrder = (appointment: Myappointments) => {
    // Navigate to trackorders page with the appointment details
    navigation.navigate('TrackOrders', { appointment });
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

            {/* Expanded view for more details */}
            {expandedCards[item.id] && (
              <Animated.View style={styles.expandedDetails}>
                <Text style={styles.details}>Time: {item.time}</Text>
                <Text style={styles.details}>Rate: LKR {item.rate}</Text>
                <Text style={styles.details}>Address: {item.address}</Text>
              </Animated.View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.trackButton} onPress={() => handleTrackOrder(item)}>
                <Text style={styles.trackText}>Track</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9',
  },
  noAppointments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9',
  },
  noAppointmentsText: {
    fontSize: 18,
    color: '#9E9E9E',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginVertical: 12,
    marginHorizontal: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#37474F',
  },
  details: {
    fontSize: 15,
    color: '#757575',
    marginBottom: 4,
  },
  expandedDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  moreDetailsButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  moreDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  trackButton: {
    backgroundColor: '#FF5252', // Updated to a vibrant red shade for tracking
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  trackText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default MyAppointments;
