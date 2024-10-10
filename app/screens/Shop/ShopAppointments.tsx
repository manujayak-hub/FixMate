import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../../Firebase_Config';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import vector icons

const ShopAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopAppointments = async () => {
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;

          // Fetch user's shops
          const shopsRef = collection(FIREBASE_DB, 'repairShops');
          const shopQuery = query(shopsRef, where('userId', '==', userId));
          const shopDocs = await getDocs(shopQuery);

          const shopNames = shopDocs.docs.map(doc => doc.data().shopName);

          // Fetch appointments for those shops
          const appointmentsRef = collection(FIREBASE_DB, 'appointments');
          const appointmentQuery = query(appointmentsRef, where('shopName', 'in', shopNames));
          const appointmentDocs = await getDocs(appointmentQuery);

          const appointmentList = appointmentDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAppointments(appointmentList);
        } else {
          console.error('No user logged in');
        }
      } catch (error) {
        console.error('Error fetching shop appointments: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAppointments();
  }, []);

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
      <Text style={styles.heading}>Repair Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.appointmentCard}>
            <Icon name="assignment" size={24} color="#FF7043" />
            <Text style={styles.appointmentText}>Appointment ID: {item.id}</Text>
            <View style={styles.timeContainer}>
              <Icon name="calendar-today" size={20} color="#FF7043" />
              <Text style={styles.appointmentText}>Date: {item.date}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon name="access-time" size={20} color="#FF7043" />
              <Text style={styles.appointmentText}>Time: {item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set a background color for the container
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsText: {
    fontSize: 18,
    color: '#555',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7043',
    textAlign: 'center',
    marginVertical: 16,
  },
  appointmentCard: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default ShopAppointments;
