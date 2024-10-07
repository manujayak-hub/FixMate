import React, { useEffect } from 'react';
import { StatusBar, View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigation, StackActions } from '@react-navigation/native';
import useUserStore from '../Store/userStore'; // Import Zustand store
//tis is how use the store

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
              uid: user.uid
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
    <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
    <View style={styles.headerContainer}>
      

      {/* Center: Welcome Text */}
      <View style={styles.centerSection}>
        <Text style={styles.welcomeText}>Hello, {storedUser?.name || 'User'}</Text> 
        <Text style={styles.welcomeText2}>What Do You Want to Fix?</Text>
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
  welcomeText2: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
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

export default ClientHeader;
