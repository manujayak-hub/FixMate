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
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={homeicon} style={styles.icon}
        />
        <Text>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={homeicon} style={styles.icon}
        />
        <Text>Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={homeicon} style={styles.icon}
        />
        <Text>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)}>
        <Image source={homeicon} style={styles.icon}
        />
        <Text>Profile</Text>
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,  
    justifyContent: 'flex-end',  
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Navigation;
