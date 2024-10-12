import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,

} from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import Shop_Header from '../../Components/Shop_Header';
import Navigation from '../../Components/Navigation';

interface Appointment {
  userName: string;
  id: string;
  date: string;
  time: string;
  status: string; // This remains as a string to hold descriptive status
  estimatedTime: string;
  shopName: string;
}

interface User {
  shopName: string;
}

const AdminPanel: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [shopName, setShopName] = useState<string>('');
  const [status, setStatus] = useState('');

  const fetchAppointments = async (shopName: string) => {
    try {
      const appointmentsQuery = query(collection(FIREBASE_DB, 'appointments'), where('shopName', '==', shopName));
      const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
        const appointmentList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];
        setAppointments(appointmentList);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch appointments data.');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      const unsubscribeUser = onSnapshot(userRef, (doc) => {
        const userData = doc.data() as User;
        if (userData) {
          setShopName(userData.shopName);
          fetchAppointments(userData.shopName);
        }
      });
      return () => unsubscribeUser();
    }
  }, []);

  const updateOrderStatus = async () => {
    if (!selectedAppointment || !estimatedTime || !status) {
      Alert.alert('Error', 'Please select an appointment, enter estimated time, and choose a status.');
      return;
    }

    try {
      const appointmentRef = doc(FIREBASE_DB, 'appointments', selectedAppointment.id);
      await updateDoc(appointmentRef, {
        status, // This should now be the string value from the Picker
        estimatedTime,
      });
      Alert.alert('Success', 'Order status updated successfully.');
      setEstimatedTime(''); // Reset estimated time
      setStatus(''); // Reset status
      setSelectedAppointment(null); // Clear selected appointment
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const selectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEstimatedTime(appointment.estimatedTime);
    setStatus(appointment.status); // Initialize status based on selected appointment
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.appointmentItem} onPress={() => selectAppointment(item)}>
      <Text style={styles.appointmentText}>Name: {item.userName}</Text>
      <Text style={styles.appointmentText}>Booked Date: {item.date}</Text>
      <Text style={styles.appointmentText}>Time: {item.time}</Text>
      <Text style={styles.appointmentText}>Status: {item.status}</Text>
      <Text style={styles.appointmentText}>Estimated Time: {item.estimatedTime}</Text>
    </TouchableOpacity>
  );

  // Calculate counts based on descriptive status strings
  const inProgressCount = appointments.filter(app => app.status === 'In Progress').length;
  const readyToPickUpCount = appointments.filter(app => app.status === 'Ready to Pick Up').length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header/>
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Orders</Text>
      <View style={styles.orderCounts}>
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{inProgressCount}</Text>
          <Text style={styles.countLabel}>In Progress</Text>
        </View>
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{readyToPickUpCount}</Text>
          <Text style={styles.countLabel}>Ready to Pick Up</Text>
        </View>
      </View>

      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Modal
        transparent={true}
        animationType="slide"
        visible={!!selectedAppointment}
        onRequestClose={() => setSelectedAppointment(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAppointment?.userName}</Text>
            <Text style={styles.modalText}>Date: {selectedAppointment?.date}</Text>
            <Text style={styles.modalText}>Time: {selectedAppointment?.time}</Text>
            <Text style={styles.modalText}>Current Status: {selectedAppointment?.status}</Text>

            <Text style={styles.label}>Estimated Time</Text>
            <TextInput
              style={styles.input}
              value={estimatedTime}
              onChangeText={setEstimatedTime}
              placeholder="e.g., 30 minutes"
            />

            <Text style={styles.label}>Update Status</Text>
            <Picker
              selectedValue={status}
              style={styles.picker}
              onValueChange={(itemValue) => setStatus(itemValue)}
            >
              <Picker.Item label="Select Status" value="" />
              <Picker.Item label="Order Placed" value="Order Placed" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Ready to Pick Up" value="Ready to Pick Up" />
            </Picker>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setSelectedAppointment(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={updateOrderStatus}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    <Navigation/>
    </SafeAreaView>
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
  orderCounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countCard: {
    backgroundColor: '#F96D2B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  countNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  countLabel: {
    color: '#fff',
  },
  appointmentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
  },
  appointmentText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#FF7043',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#FF7043',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10, // Add border radius
    marginHorizontal: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#F96D2B', // Background color
  },
  updateButton: {
    backgroundColor: '#F96D2B', // Background color
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminPanel;
