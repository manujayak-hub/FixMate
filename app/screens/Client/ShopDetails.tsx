import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Shop_Client'; // Make sure the path is correct
import { useNavigation } from '@react-navigation/native';

type ShopDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ShopDetails'>;
type ShopDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ShopDetails'>;

const ShopDetails = ({ route }: ShopDetailsScreenProps) => {
  const { shop } = route.params;
  const navigation = useNavigation();

  const handleBookNowPress = () => {
    navigation.navigate('Appointment', { shop });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: shop.ImageUrl }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.shopName}>{shop.shopName}</Text>
          <Text style={styles.category}>{shop.category}</Text>
          <Text style={styles.description}>{shop.Shop_Des}</Text>
          <Text style={styles.owner}>Owner: {shop.OwnerName}</Text>
          <Text style={styles.rph}>Rate: {shop.Rph} Per Hour</Text>
          <Text style={styles.tag}>Tag: {shop.shopTag}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.inquireButton}>
              <Text style={styles.inquireButtonText}>Inquire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNowPress}>
              <Text style={styles.bookNowButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 10,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 18,
    color: '#888',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  owner: {
    fontSize: 16,
  },
  rph: {
    fontSize: 16,
    marginVertical: 5,
  },
  tag: {
    fontSize: 16,
    color: '#F96D2B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inquireButton: {
    backgroundColor: '#C7C3C3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inquireButtonText: {
    color: '#F96D2B',
    fontSize: 16,
  },
  bookNowButton: {
    backgroundColor: '#F96D2B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ShopDetails;
