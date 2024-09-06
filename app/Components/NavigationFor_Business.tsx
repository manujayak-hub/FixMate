import React from 'react';
import { TabBar } from 'antd-mobile';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View ,TouchableOpacity,Text} from 'react-native';

const homeicon = require('../../assets/home.png');
const guideicon = require('../../assets/Guide.png');
const profileicon = require('../../assets/profile.png');
const shopicon = require('../../assets/shop.png');

const Navigation: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Shop_User_Home' as never)}>
        <Image source={homeicon} style={styles.icon}
        />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={guideicon} style={styles.icon}
        />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={profileicon} style={styles.icon}
        />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={shopicon} style={styles.icon}
        />
        
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60, // Slightly increased height for better touch area
    backgroundColor: '#ffffff', // Light background for a clean look
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1, // Add a subtle border on top
    borderTopColor: '#e0e0e0', // Light grey color for the border
    borderCurve: 'circular',
    borderTopLeftRadius: 20 ,
    borderTopRightRadius: 20 ,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center icon and text vertically
  },
  icon: {
    width: 28, // Slightly larger icons for better visibility
    height: 28,
    marginBottom: 5, // Space between the icon and the label
  },
  iconLabel: {
    fontSize: 12, // Small label text size
    color: '#333', // Darker color for contrast
  },
});

export default Navigation;
