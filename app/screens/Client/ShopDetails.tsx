import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Shop_Client'; // Ensure the path is correct
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import vector icons
import { useNavigation } from '@react-navigation/native';


type ShopDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ShopDetails'>;

const ShopDetails = ({ route, navigation }: ShopDetailsScreenProps) => {
  const { shop } = route.params;
  const navigate = useNavigation()

  const handleBookNowPress = () => {
    navigation.navigate('Appointment', { shop });
  };
  const handleInquirePress = () => {
    navigation.navigate('addcomplaint', {shopName:shop.shopName});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: shop.ImageUrl }} style={styles.image} />

        <View style={styles.detailsContainer}>
          <Text style={styles.shopName}>{shop.shopName}</Text>
          <Text style={styles.category}>{shop.category}</Text>

          {/* Hardcoded rating */}
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#FFCC00" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>

          <Text style={styles.description}>{shop.Shop_Des}</Text>

          {/* Display Phone Number */}
          <View style={styles.contactContainer}>
            <Icon name="phone" size={20} color="#FF6F00" />
            <Text style={styles.contactText}>{shop.contact}</Text>
          </View>

          {/* Display Location */}
          
          <TouchableOpacity  onPress={() => navigation.navigate('Client_MapView' as never)}>
            <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color="#FF6F00" />
            <Text style={styles.locationText}>{shop.OwnerName}'s Location</Text>
            
          </View>
          </TouchableOpacity>

          <Text style={styles.rph}>Rate: LKR {shop.Rph} Per Hour</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.inquireButton} onPress={handleInquirePress}>
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
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
  },
  shopName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    color: '#FF6F00',
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 15,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  rph: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inquireButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inquireButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookNowButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookNowButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopDetails;
