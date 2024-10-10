import React, { useEffect, useState } from 'react';
import { TouchableOpacity,View, Text, Image, StyleSheet, ActivityIndicator, Alert, Button, TextInput, FlatList, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { DocumentSnapshot, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase_Config';

import { AntDesign } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type URToolShopRouteProp = RouteProp<{ URToolShop: { toolId: string } }, 'URToolShop'>;

interface Tool {
  id: string;
  title: string;
  name:string;
  imageUrl?: string;
  description?: string;
  price?: string;
  timeDuration?: string;
  userId: string; 
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

const Cart: React.FC = () => {
  
  const navigation = useNavigation();
  

 

  const handleGoToCart = () => {
    navigation.navigate('CartPage' as never);
  };

 

  return (
  
            <View style={styles.header}>
              
              <AntDesign name="shoppingcart" size={24} color="#FF6100" onPress={handleGoToCart} />
            </View>
          
  );
};

const styles = StyleSheet.create({
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft:260,
    marginTop:10,
  },
  
});

export default Cart;
