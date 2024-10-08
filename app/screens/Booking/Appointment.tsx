import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../Client/Shop_Client";
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // Import the icon library

import { getAuth } from "firebase/auth"; // Import Firebase Auth

type AppointmentScreenProps = NativeStackScreenProps<RootStackParamList, 'Appointment'>;

const Appointment: React.FC<AppointmentScreenProps> = ({ route, navigation }) => {
  const { shop } = route.params;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const times = {
    morning: ['10:00 AM', '10:45 AM', '11:30 AM'],
    afternoon: ['12:15 PM', '01:00 PM', '01:45 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:45 PM', '05:30 PM', '06:15 PM', '07:00 PM', '07:45 PM'],
  };

  const handleProceed = () => {
    if (selectedDate && selectedTime) {
      setConfirmationVisible(true);
    } else {
      Alert.alert('Error', 'Please select both a date and a time.');
    }
  };

  const confirmAppointment = async () => {
    setLoading(true);
    setConfirmationVisible(false);
  
    // Get the logged-in user's ID
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      setLoading(false);
      return;
    }
  
    try {
      // Add the appointment to Firestore, including the userId
      const appointmentDoc = await addDoc(collection(FIREBASE_DB, 'appointments'), {
        userId: user.uid, // Add the userId field
        shopId: shop.id,
        shopName: shop.shopName,
        date: selectedDate?.toLocaleDateString(),
        time: selectedTime,
        shopCategory: shop.category,
        rate: shop.Rph,
      });
  
      // Navigate to the Payment screen after appointment is successfully booked
      navigation.navigate('Payment', {
        shopName: shop.shopName,
        amount: shop.Rph,
        date: selectedDate?.toLocaleDateString(),
        time: selectedTime,
        appointmentId: appointmentDoc.id,
      });
    } catch (error) {
      console.error('Error booking appointment: ', error);
      Alert.alert('Error', 'There was an issue booking the appointment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, newDate: Date | undefined) => {
    setDatePickerVisible(false);
    if (newDate) {
      const today = new Date();
      if (newDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        Alert.alert('Invalid Date', 'You cannot select a past date.');
      } else {
        setSelectedDate(newDate);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{shop.shopName}</Text>
        <Text style={styles.subtitle}>{shop.category}</Text>
        <Text style={styles.price}>LKR {shop.Rph}</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <TouchableOpacity
        style={[styles.dateButton, selectedDate && styles.selectedButton]}
        onPress={() => setDatePickerVisible(true)}
      >
        <Ionicons name="calendar" size={20} color={selectedDate ? '#ffffff' : '#757575'} style={styles.icon} />
        <Text style={[styles.dateText, selectedDate && styles.selectedText]}>
          {selectedDate ? selectedDate.toLocaleDateString() : 'Pick a Date'}
        </Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          mode="date"
          value={selectedDate || new Date()}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>Select Time</Text>

        <Text style={styles.timePeriod}>Morning</Text>
        <View style={styles.timeRow}>
          {times.morning.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.timePeriod}>Afternoon</Text>
        <View style={styles.timeRow}>
          {times.afternoon.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>

      <Modal
        visible={confirmationVisible || loading}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (!loading) {
            setConfirmationVisible(false);
          }
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF6F00" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Confirmation</Text>
                <Text style={styles.modalText}>
                  {shop.shopName}{"\n"}
                  {selectedDate?.toLocaleDateString()}{"\n"}
                  {selectedTime}
                </Text>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmAppointment}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmationVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  subtitle: {
    fontSize: 20,
    color: '#757575',
    marginVertical: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#212121',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    marginBottom: 20,
    elevation: 3,
  },
  selectedButton: {
    backgroundColor: '#FF6F00',
    borderWidth: 2,
    borderColor: '#FFD54F', // Optional border color when selected
  },
  dateText: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 10, // Space between icon and text
  },
  selectedText: {
    color: '#ffffff',
  },
  icon: {
    marginRight: 10,
  },
  timeSection: {
    marginBottom: 20,
  },
  timePeriod: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    marginRight: 10,
    marginBottom: 10,
    elevation: 3,
  },
  timeText: {
    fontSize: 16,
    color: '#757575',
  },
  proceedButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#FF6F00',
    borderWidth: 1,
  },
  cancelButtonText: {
    color: '#FF6F00',
    fontSize: 18,
  },
});

export default Appointment;
