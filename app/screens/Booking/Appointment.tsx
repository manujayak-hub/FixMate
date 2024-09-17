import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

const Appointment: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = ['01 Sat', '02 Sun', '03 Mon', '04 Tue', '05 Wed', '06 Thu', '07 Fri'];
  const times = {
    morning: ['10.00', '10.45', '11.30'],
    afternoon: ['12.15', '01.00', '01.45', '02.30', '03.15', '04.00', '04.45', '05.30', '06.15', '07.00', '07.45'],
  };

  const handleProceed = () => {
    if (selectedDate && selectedTime) {
      Alert.alert(`Appointment confirmed on ${selectedDate} at ${selectedTime}`);
    } else {
      Alert.alert('Please select both a date and a time.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>City Service Wellawatte</Text>
      <Text style={styles.subtitle}>Home Appliance Repair</Text>
      <Text style={styles.price}>LKR 1500</Text>

      {/* Date Selection */}
      <Text style={styles.sectionTitle}>Appointment</Text>
      <ScrollView horizontal style={styles.dateRow}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dateButton, selectedDate === date && styles.selectedButton]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[styles.dateText, selectedDate === date && styles.selectedText]}>{date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Selection */}
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>Morning</Text>
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

        <Text style={styles.sectionTitle}>Afternoon</Text>
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

      {/* Proceed Button */}
      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff8000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#ff8000',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
  timeSection: {
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    color: '#000',
  },
  proceedButton: {
    backgroundColor: '#ff8000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Appointment;
