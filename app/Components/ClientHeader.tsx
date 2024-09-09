import React, { useEffect } from 'react';
import { StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigation, StackActions } from '@react-navigation/native';
import useUserStore from '../Store/userStore'; // Import Zustand store

const ClientHeader: React.FC = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const { user: storedUser, setUser, clearUser } = useUserStore(); // Zustand functions

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const refDoc = doc(FIREBASE_DB, 'users', user.uid);
          const userDoc = await getDoc(refDoc);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              name: userData.name,
              email: user.email,
            });
          } else {
            console.log('No document found');
          }
        } catch (error) {
          console.error('Error fetching user details: ', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const logout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        clearUser(); // Clear the user data on logout
        navigation.dispatch(StackActions.replace('Login'));
      })
      .catch((error) => {
        console.error('Error during sign out: ', error);
      });
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20, backgroundColor: '#F96D2B' }}>
        <Text style={{ fontSize: 8, color: '#ffffff' }}>{'Hello ' + (storedUser?.name || '')}</Text>
        <Text style={{ fontSize: 8, color: '#ffffff' }}>{storedUser?.email || ''}</Text>
        <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />

        <TouchableOpacity onPress={logout}>
          <Text style={{ fontSize: 8, color: '#ffffff' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClientHeader;
