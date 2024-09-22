import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../Components/NavigationFor_Business';
import Shop_Header from '../../Components/Shop_Header';

const hero = require('../../../assets/hero.png')
const au = require('../../../assets/au.png')
const ayrs = require('../../../assets/ayrs.png')
const eysd = require('../../../assets/eysd.png')
const uos = require('../../../assets/uos.png')

const Shop_User_Home: React.FC = () => {

  const navigation:any = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
      <View style={{ flex: 1, margin: 20 }}>
        {/* Image at the top */}
        <Image
          source={hero} // Replace with your image URL
          style={styles.topImage}
        />
        
        {/* 2x2 Grid of buttons */}
        <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('AddRepairShop')}>
            <Image
              source={ayrs} // Replace with your image URL
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Add Your </Text>
            <Text style={styles.buttonText}>Repair Shop</Text>
            
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('EditShopDetails')}>
            <Image
              source={eysd} // Replace with your image URL
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Edit Your</Text>
            <Text style={styles.buttonText}>Shop Details </Text>
            
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridItem}>
            <Image
              source={au} // Replace with your image URL
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Availability </Text>
            <Text style={styles.buttonText}>Update </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Image
              source={uos} // Replace with your image URL
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Update Order  </Text>
            <Text style={styles.buttonText}>Status</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topImage: {
    width: '100%',
    height: 320, // Adjust height as needed
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Two items per row
    aspectRatio: 1, // Makes the button square
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  buttonImage: {
    width: 60,
    height: 60, // Adjust size as needed
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#F96D2B'
  },
});

export default Shop_User_Home;
