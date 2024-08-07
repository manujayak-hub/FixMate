import React from 'react';
import { TabBar } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';

const homeicon = require('../../assets/home.png');
const guideicon = require('../../assets/Guide.png');
const profileicon = require('../../assets/profile.png');
const shopicon = require('../../assets/shop.png');

const Navigation: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TabBar>
        <TabBar.Item
          title="Home"
          icon={<Image source={homeicon} style={styles.icon} />}
          onPress={() => navigation.navigate('Home' as never)}
        />
        <TabBar.Item
          title="Guide"
          icon={<Image source={guideicon} style={styles.icon} />}
          onPress={() => navigation.navigate('Guide' as never)}
        />
        <TabBar.Item
          title="Shop"
          icon={<Image source={shopicon} style={styles.icon} />}
          onPress={() => navigation.navigate('Shop' as never)}
        />
        <TabBar.Item
          title="Profile"
          icon={<Image source={profileicon} style={styles.icon} />}
          onPress={() => navigation.navigate('Profile' as never)}
        />
      </TabBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,  // Adjust this height as needed
    justifyContent: 'flex-end',  // Ensure it’s positioned at the bottom
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Navigation;
