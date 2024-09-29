import React, { useState } from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [userType, setUserType] = useState('Customer');
  const navigation:any = useNavigation();

  const handleSignUp = async () => {
    if (!email || !password || !name || !mobile) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(FIREBASE_DB, 'users', user.uid), {
        name,
        mobile,
        email,
        type: userType,
        photo,
      });

      // Clear form fields
      setName('');
      setMobile('');
      setEmail('');
      setPassword('');
      setUserType('Customer');

      // Display success alert
      Alert.alert('Success', 'Account created successfully!', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (error:any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity style={styles.radioButton} onPress={() => setUserType('Customer')}>
          <Text style={userType === 'Customer' ? styles.radioButtonTextSelected : styles.radioButtonText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioButton} onPress={() => setUserType('Business')}>
          <Text style={userType === 'Business' ? styles.radioButtonTextSelected : styles.radioButtonText}>Business</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioButton: {
    padding: 10,
  },
  radioButtonText: {
    fontSize: 16,
  },
  radioButtonTextSelected: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUpScreen;
