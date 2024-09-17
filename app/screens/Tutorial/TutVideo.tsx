import React from 'react';
import { StyleSheet, View, SafeAreaView, Button } from 'react-native';
import { Video,ResizeMode } from 'expo-av';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


// Define your route and navigation types directly here
type RootStackParamList = {
  TutVideo: { videoSource: { uri: string } }; // Adjust the type based on your actual params
  // Define other routes here if necessary
}; // Adjust the import according to your file structure

// Define types for the route and navigation props
type TutVideoRouteProp = RouteProp<RootStackParamList, 'TutVideo'>;
type TutVideoNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  NativeStackNavigationProp<any>
>;

interface Props {
  route: TutVideoRouteProp;
  navigation: TutVideoNavigationProp;
}

const TutVideo: React.FC<Props> = ({ route, navigation }) => {
  const { videoSource } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={videoSource} // Local video asset
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={styles.video}
        />
      </View>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default TutVideo;
