import React from 'react';
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
      onPress={() => navigation.navigate('Tut' as never)}>
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
    height: 60, 
    backgroundColor: '#ffffff', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0',
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
    justifyContent: 'center', 
  },
  icon: {
    width: 28, 
    height: 28,
    marginBottom: 5, 
  },
  iconLabel: {
    fontSize: 12, 
    color: '#333', 
  },
});

export default Navigation;
