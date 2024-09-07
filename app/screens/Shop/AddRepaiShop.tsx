import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../Firebase_config';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import Navbar from '../../Components/NavigationFor_Business';
import Shop_Header from '../../Components/Shop_Header';

const AddRepairShop: React.FC = () => {
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [category,setcategory] = useState('');
  const [Shop_Des,setShop_Des] = useState('');
  const [OwnerName,setOwnerName] = useState('');
  const [Rph,setRph] = useState('');
  const [shopTag,setShopTag] = useState('');
  const [ImageUrl,setImageUrl] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        // Create a reference to the repairShops collection
        const shopRef = collection(FIREBASE_DB, 'repairShops');

        // Add shop details with a unique ID
        await addDoc(shopRef, {
          shopName,
          category,
          location,
          Shop_Des,
          OwnerName,
          Rph,
          shopTag,
          contact,
          ImageUrl,
          userId: user.uid,
        });

        alert('Shop details added successfully!');
        navigation.goBack();
      } catch (error: any) {
        alert('Error adding shop details: ' + error.message);
      }
    } else {
      alert('User not authenticated');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
      <View style={{ flex: 1, margin: 20 }}>
        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={styles.input}
          value={shopName}
          onChangeText={setShopName}
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Contact</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddRepairShop;
