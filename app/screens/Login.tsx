import React, { useState } from 'react';
import { View, TextInput, ActivityIndicator, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../Firebase_Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../Firebase_Config';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation:any = useNavigation();
  

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = response.user;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.type === 'Business') {
            Alert.alert('Business');
            navigation.navigate('Shop_User_Home', { user: userData });
        } else {
            Alert.alert('customer');

          navigation.navigate('Tut', { user: userData });

        }
      } else {
        Alert.alert('Error', 'No user data found');
      }
    } catch (error:any) {
      Alert.alert('Sign in failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={email} placeholder="Email" autoCapitalize='none' onChangeText={setEmail} style={styles.input} />
      <TextInput value={password} secureTextEntry placeholder="Password" autoCapitalize='none' onChangeText={setPassword} style={styles.input} />
      {loading ? <ActivityIndicator size="large" color="#000ff"/> : (
        <>
          <Button title='Login' onPress={signIn} />
          <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
          <Button title="map" onPress={() => navigation.navigate('Client_MapView')} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  input: { width: '100%', marginBottom: 15, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 }
});

export default LoginScreen;
