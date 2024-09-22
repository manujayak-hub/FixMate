import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../Firebase_Config';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import Shop_Header from '../../Components/Shop_Header';

const EditShopDetails: React.FC = () => {
  const [shopData, setShopData] = useState<any>(null);
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [Shop_Des, setShop_Des] = useState('');
  const [OwnerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (user) {
        const q = query(collection(FIREBASE_DB, 'repairShops'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const shop = querySnapshot.docs[0].data();
          setShopData(shop);
          setShopName(shop.shopName);
          setCategory(shop.category);
          setShop_Des(shop.Shop_Des);
          setOwnerName(shop.OwnerName);
          setContact(shop.contact);
        }
      }
    };
    fetchShopDetails();
  }, [user]);

  const handleUpdate = async () => {
    if (user && shopData) {
      const q = query(collection(FIREBASE_DB, 'repairShops'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { shopName, category, Shop_Des, OwnerName, contact });
      alert('Shop details updated successfully!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
      <ScrollView style={{ flex: 1, margin: 20 }}>
        <Text style={styles.label}>Owner Name</Text>
        <TextInput style={styles.input} value={OwnerName} onChangeText={setOwnerName} placeholder="Enter Owner's Name" />
        <Text style={styles.label}>Shop Name</Text>
        <TextInput style={styles.input} value={shopName} onChangeText={setShopName} placeholder="Enter Shop Name" />
        <Text style={styles.label}>Category</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Enter Category" />
        <Text style={styles.label}>Shop Description</Text>
        <TextInput style={styles.input} value={Shop_Des} onChangeText={setShop_Des} placeholder="Enter Description" />
        <Text style={styles.label}>Contact</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Enter Contact Number" keyboardType="phone-pad" />
        <Button title="Update Details" onPress={handleUpdate} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 18, marginBottom: 10 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
});

export default EditShopDetails;
