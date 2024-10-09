import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import CustomAlert from '../Components/CustomAlert';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | undefined>(undefined);
  const navigation: any = useNavigation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const signIn = async () => {
    if (!email || !validateEmail(email)) {
      setAlertMessage('Enter a valid email address!');
      setAlertType('error');
      setAlertVisible(true);
      return;
    }

    if (!password || !validatePassword(password)) {
      setAlertMessage('Password must be at least 6 characters long!');
      setAlertType('error');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = response.user;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.type === 'Business') {
          navigation.navigate('Shop_User_Home', { user: userData });
        } else {
          navigation.navigate('Shop_Client', { user: userData });
        }
        
      } else {
        setAlertMessage('No user data found');
        setAlertType('error');
      }
    } catch (error: any) {
      setAlertMessage('Sign in failed: ' + error.message);
      setAlertType('error');
    } finally {
      setAlertVisible(true);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back! You've been missed!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Create new account</Text>
      </TouchableOpacity>

      {/* Loading Modal */}
      <Modal transparent={true} animationType="slide" visible={loading}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#FF6A00" />
          <Text style={styles.loadingText}>Signing you in...</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6A00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7A7A7A',
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#F96D2B',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF6A00',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loadingText: {
    color: '#FF6A00',
    marginTop: 15,
    fontSize: 18,
  },
});

export default LoginScreen;
