import React from 'react';
import { TabBar } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native'; // Import Text component

const Navigation: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TabBar >
      <TabBar.Item
        title="Home"
        icon={<Text>🏠</Text>}
        onPress={() => navigation.navigate('Home' as never)}
      />
      <TabBar.Item
        title="Profile"
        icon={<Text>👤</Text>}
        onPress={() => navigation.navigate('Profile' as never)}
      />
      <TabBar.Item
        title="Settings"
        icon={<Text>⚙️</Text>}
        onPress={() => navigation.navigate('Settings' as never)}
      />
    </TabBar>
  );
};

export default Navigation;
