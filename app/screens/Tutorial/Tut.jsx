import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'


const Tut = () => {
  return (
    <View style={styles.layoutd}>
      
      
      <Text style={styles.categoryText}>Category</Text>
      <TouchableOpacity style={styles.rectangle3}>
        <Text style={styles.homeApplianceText}>Home and Appliance</Text>
        <Text>Repair</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Tut

const styles = StyleSheet.create({
    layoutd:{
        display: 'flex',
        flexDirection: 'column',
        width: 400,
        height:'auto',
        padding:10,
        justifyContent:'space-between',
        backgroundColor:'#EEEEEE' ,
    },
    rectangle: {
        position: 'absolute',
        width: 315,
        height: 46,
        left: '50%',
        marginLeft: -157.5, // Half of the width to center the element
        top: 94,
        backgroundColor: '#F5F5F5', // Equivalent to the color you used
        borderRadius: 10,
      },
      categoryText: {
        position: 'absolute',
        width: 71,
        height: 21.39,
        left: 35,
        top: 163.56,
       
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 10,
        lineHeight: 12,
        color: '#000000', // Hex value for black
      },
      homeApplianceText: {
        position: 'absolute',
        width: 203,
        height: 60,
        left: 11.64,
        top: 19.12,
        
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 24,
        color: '#000000', // Use standard hex color
        transform: [{ rotate: '0.61deg' }], // Rotate by 0.61 degrees
      },
      rectangle3: {
        position: 'absolute',
        width: 224,
        height: 74,
        left: 25,
        top: 188,
        backgroundColor: 'rgba(255, 97, 0, 0.7)', // Equivalent to the RGBA color with transparency
        borderRadius: 15,
        transform: [{ rotate: '0.61deg' }], // Apply rotation
      },
})