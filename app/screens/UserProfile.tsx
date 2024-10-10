import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Title, Caption, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navigation from '../Components/Navigation';
import Shop_Header from '../Components/UserHeder';
import { FIREBASE_DB } from '../../Firebase_Config';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  complainlist: undefined;
  ordertracking: undefined;
  aboutus: undefined;
  PaymentMethods: undefined;
  MyAppointments: undefined; // Added route for My Appointments
};

type OrderTrackNavigationProp = StackNavigationProp<
  RootStackParamList,
  'complainlist' | 'ordertracking' | 'aboutus' | 'PaymentMethods' | 'MyAppointments'
>;

export default function UserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [complaintCount, setComplaintCount] = useState<number>(0);
  const [appointmentCount, setAppointmentCount] = useState<number>(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation<OrderTrackNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchUserData(user.uid);
        fetchComplaintCount(user.uid);
        fetchAppointmentCount(user.uid);
      }
    }, [user])
  );

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchComplaintCount = async (userId: string) => {
    try {
      const q = query(collection(FIREBASE_DB, 'complaints'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      setComplaintCount(querySnapshot.size); // Get the count of complaints
    } catch (error) {
      console.error('Error fetching complaints count:', error);
    }
  };
  const fetchAppointmentCount = async (userId: string) => {
    try {
      const q = query(collection(FIREBASE_DB, 'appointments'), where('userId', '==', userId)); // Assuming 'appointments' collection exists
      const querySnapshot = await getDocs(q);
      setAppointmentCount(querySnapshot.size); // Get the count of appointments
    } catch (error) {
      console.error('Error fetching appointment count:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Shop_Header />
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Avatar.Image 
              source={{ uri: userData?.photo || 'https://api.adorable.io/avatars/80/placeholder.png' }} 
              size={80} 
            />
            <View style={{ marginLeft: 20 }}>
              <Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
                {userData?.name || 'John Doe'}
              </Title>
              <Caption style={styles.caption}>
                {userData?.email || '@j_doe'}
              </Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#777777" size={20} />
            <Text style={{ color: "#777777", marginLeft: 20 }}>
              {userData?.address || 'Address not available'}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" color="#777777" size={20} />
            <Text style={{ color: "#777777", marginLeft: 20 }}>
              {userData?.mobile || 'Mobile not available'}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color="#777777" size={20} />
            <Text style={{ color: "#777777", marginLeft: 20 }}>
              {userData?.email || 'Email not available'}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.menuWrapper}>
         
           <TouchableRipple onPress={() => navigation.navigate('MyAppointments')}>
            <View style={styles.menuItem}>
              <Icon name="calendar" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>My Appointments</Text>
              <Text style={styles.menuItemCount}>{appointmentCount}</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => navigation.navigate('complainlist')}>
            <View style={styles.menuItem}>
              <Icon name="alert-decagram-outline" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>My Complaint</Text>
              <Text style={styles.menuItemCount}>{complaintCount}</Text>
            </View>
          </TouchableRipple>
          
          <TouchableRipple onPress={() => navigation.navigate('PaymentMethods')}>
            <View style={styles.menuItem}>
              <Icon name="credit-card" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Payment</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => navigation.navigate('aboutus')}>
            <View style={styles.menuItem}>
              <Icon name="heart-outline" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>About Us</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="share-outline" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Tell Your Friends</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="cog" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableRipple>
        </View>
      </View>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
    marginVertical: 10,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    flex: 1, 
  },
  menuItemCount: {
    color: '#FF6347',
    fontWeight: '600',
    fontSize: 16,
    width: 20,
  },
});
