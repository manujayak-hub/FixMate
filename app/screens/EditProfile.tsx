import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebase_Config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserHeder from '../Components/ClientHeader';

const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user]);

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || '');
        setMobile(userData.mobile || '');
        setEmail(userData.email || '');
        setAddress(userData.address || '');
        setPhoto(userData.photo || null);
      } else {
        Alert.alert('Error', 'No user data found');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSave = async () => {
    if (!name || !mobile || !email || !address) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const userRef = doc(FIREBASE_DB, 'users', user!.uid);
      await updateDoc(userRef, {
        name,
        mobile,
        email,
        address,
        photo,
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleImagePicker = async () => {
    setModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    setModalVisible(false);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
<SafeAreaView style={{ flex: 1 }}>
  <UserHeder/>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={toggleModal} style={styles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#FF6347" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={20} color="#FF6347" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#FF6347" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="home" size={20} color="#FF6347" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#ff6f00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888888',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    padding: 15,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
  },
});

export default EditProfileScreen;
