import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { getAuth } from 'firebase/auth';

// Define interfaces for Appointment and User
interface Appointment {
  id: string;
  status: string;
  estimatedTime: string;
  shopName: string; // Ensure this matches your Firestore structure
}

interface User {
  shopName: string; // Adjust according to your user structure
}

const AdminPanel: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Store all appointments
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]); // Store filtered appointments
  const [status, setStatus] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null); // Track selected appointment
  const [shopName, setShopName] = useState<string>(''); // Store the shopName of the logged-in user

  // Function to fetch all appointments
  const fetchAppointments = async () => {
    try {
      const appointmentsCollection = collection(FIREBASE_DB, 'appointments');
      const appointmentSnapshot = await getDocs(appointmentsCollection);
      const appointmentList = appointmentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[]; // Cast to Appointment type

      // Filter appointments based on the user's shopName
      const filteredList = appointmentList.filter(appointment => appointment.shopName === shopName);
      setFilteredAppointments(filteredList); // Set filtered appointments in state
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch appointments data.');
    }
  };

  // Fetch user and appointments when component mounts
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Fetch user details from the users collection
      const userRef = doc(FIREBASE_DB, 'users', user.uid); // Assuming user ID is used as the document ID
      const unsubscribeUser = onSnapshot(userRef, (doc) => {
        const userData = doc.data() as User; // Cast to User type
        if (userData) {
          setShopName(userData.shopName); // Set the shop name from user data
          fetchAppointments(); // Call fetchAppointments after setting shopName
        }
      });

      return () => {
        unsubscribeUser(); // Cleanup on unmount
      };
    }
  }, []); // Empty dependency array to run once when component mounts

  // Update appointment status
  const updateOrderStatus = async () => {
    if (!selectedAppointmentId || !status || !estimatedTime) {
      Alert.alert('Error', 'Please select an appointment and enter both status and estimated time.');
      return;
    }

    try {
      const orderRef = doc(FIREBASE_DB, 'appointments', selectedAppointmentId);
      await updateDoc(orderRef, {
        status: status,
        estimatedTime: estimatedTime,
      });
      Alert.alert('Success', 'Order status updated successfully.');
      // Refresh appointments list after update
      setStatus('');
      setEstimatedTime('');
      setSelectedAppointmentId(null);
      fetchAppointments(); // Re-fetch appointments after update
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  // Handle selecting an appointment
  const selectAppointment = (appointment: Appointment) => {
    setSelectedAppointmentId(appointment.id);
    setStatus(appointment.status); // Set status for the selected appointment
    setEstimatedTime(appointment.estimatedTime); // Set estimated time for the selected appointment
  };

  // Render appointment item
  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>ID: {item.id}</Text>
      <Text style={styles.appointmentText}>Status: {item.status}</Text>
      <Text style={styles.appointmentText}>Estimated Time: {item.estimatedTime}</Text>
      <Button title="Select" onPress={() => selectAppointment(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Appointments</Text>

      <FlatList
        data={filteredAppointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.label}>Update Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="e.g., Processing, Ready"
      />

      <Text style={styles.label}>Estimated Time</Text>
      <TextInput
        style={styles.input}
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        placeholder="e.g., 30 minutes"
      />

      <Button title="Update Status" onPress={updateOrderStatus} />
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
  },
  label: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#FF7043',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  appointmentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  appointmentText: {
    fontSize: 16,
  },
});

export default AdminPanel;
