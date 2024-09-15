import React from 'react';
import { StyleSheet, View, SafeAreaView, Button } from 'react-native';
import { Video } from 'expo-av';

const TutVideo = ({ route, navigation }) => {
  const { videoSource } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={videoSource} // Local video asset
          useNativeControls
          resizeMode="contain"
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
