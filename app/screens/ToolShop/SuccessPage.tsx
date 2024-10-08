import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SuccessPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.successMessage}>Success! The tools have been removed from your cart.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  successMessage: {
    fontSize: 20,
    color: '#4CAF50',
  },
});

export default SuccessPage;
