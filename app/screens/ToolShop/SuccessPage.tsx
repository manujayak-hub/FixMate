import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import ClientHeader from "../../Components/ClientHeader";
import Navigation from "../../Components/Navigation";
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

const check = require("../../../assets/check.png");


type RootStackParamList = {
  YourComponent: undefined; // No params for this screen
  CartPage: undefined; // No params for CartPage
};

// Create the Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

const SuccessPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CartPage'>>();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <TouchableOpacity onPress={() => navigation.navigate('CartPage')}>
      <View style={styles.container}>
        <Image source={check} style={styles.icon} />
        <View style={styles.modal}>
          <Text style={styles.successMessage}>Success! Continue with Tool Shopping.</Text>
        </View>
      </View>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
  },
  successMessage: {
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
    top:150,
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'absolute',
    width: 343,
    height: 296,
    left: '50%',
    marginLeft: -171.5, // To center the modal horizontally
    top: 179,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(16, 24, 40, 0.08)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    borderRadius: 12,
    zIndex: 1, // Ensure the modal is behind the image
  },
  icon: {
    width: 100,
    height: 100,
    position: 'absolute', // Use absolute positioning
    top: 230, // Adjust the top position as needed
    left: '50%',
    marginLeft: -50, // To center the icon horizontally
    zIndex: 2, // Higher zIndex to bring the image to the front
  },
});

export default SuccessPage;
