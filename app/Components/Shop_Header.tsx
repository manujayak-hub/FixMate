import React, { useEffect } from 'react';
import { StatusBar, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, StackActions } from '@react-navigation/native';
import useUserStore from '../Store/userStore'; // Import Zustand store

const shopdash = require('../../assets/shopdash.png');

const Shop_Header: React.FC = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const { user: storedUser, setUser, clearUser } = useUserStore(); // Zustand functions

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const refDoc = doc(FIREBASE_DB, 'users', user.uid); // Use user's uid to reference the doc
          const userDoc = await getDoc(refDoc);
          if (userDoc.exists()) {
            const userData = userDoc.data(); // Get the data from the doc
            setUser({
              name: userData.name,
              email: user.email, // Use email from current authenticated user
              uid: user.uid
            });
          } else {
            console.log('No document found for this user');
          }
        } catch (error) {
          console.error('Error fetching user details: ', error);
        }
      }
    };

    fetchUserData(); // Fetch user data on component mount
  }, [user]);

  const logout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        clearUser(); // Clear the user data from Zustand store on logout
        navigation.dispatch(StackActions.replace('Login'));
      })
      .catch((error) => {
        console.error('Error during sign out: ', error);
      });
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
      <View style={styles.headerContainer}>
        {/* Left Side: Shop Dashboard Icon */}
        <View style={styles.leftSection}>
          <Image style={styles.shopIcon} source={shopdash} />
          <Text style={styles.shopText}>Shop Owner DashBoard</Text>
        </View>

        {/* Center: Welcome Text */}
        <View style={styles.centerSection}>
          <Text style={styles.welcomeText}>Hello, {storedUser?.name || 'User'}</Text> 
          {/* Fallback to 'User' if name is not available */}
        </View>

        {/* Right Side: Logout Button */}
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#F96D2B',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  shopIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  shopText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  centerSection: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  logoutText: {
    color: '#F96D2B',
    fontWeight: 'bold',
  },
});

export default Shop_Header;
