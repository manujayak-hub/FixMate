import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const hero = require('../../assets/hero.jpg')

const WelcomePage = () => {
    
    const navigation:any = useNavigation();


  return (
    <View style={styles.container}>
    <Image
      source={hero} // Replace with actual image URI
      style={styles.image}
    />
    <Text style={styles.title}>Find the Perfect Fix Today</Text>
    <Text style={styles.subtitle}>
      Explore trusted repair experts for every issue, just a tap away!
    </Text>

    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}

export default WelcomePage

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    image: {
      width: 300,
      height: 300,
      padding:50,
      paddingBottom:50
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FF6A00',
      textAlign: 'center',
      padding:30
    },
    subtitle: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      marginVertical: 10,
      padding:30
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    button: {
      backgroundColor: '#F96D2B',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonSecondary: {
      backgroundColor: '#333',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });