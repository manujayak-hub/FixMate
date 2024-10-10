import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../Firebase_Config';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import UserHeder from '../../Components/ClientHeader';
import Navigation from '../../Components/Navigation';

const ComplaintList: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchId, setSearchId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Listen for authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUserId(user.uid); // Get the authenticated user's uid
      } else {
        Alert.alert('Error', 'User is not logged in.');
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch complaints only for the authenticated user
  useEffect(() => {
    if (userId) {
      const q = query(collection(FIREBASE_DB, 'complaints'), where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false); // Set loading to false after fetching
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const deleteComplaint = async (id: string) => {
    Alert.alert(
      'Delete Complaint',
      'Are you sure you want to delete this complaint?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(FIREBASE_DB, 'complaints', id));
              Alert.alert('Success', 'Complaint deleted successfully.');
            } catch (error) {
              console.log('Error deleting complaint:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.complaintId?.toString().includes(searchId)
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <UserHeder/>
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Complaint ID"
        value={searchId}
        onChangeText={setSearchId}
      />
      {loading ? ( // Show loading spinner while data is being fetched
        <ActivityIndicator size="large" color="#007bff" />
      ) : filteredComplaints.length > 0 ? (
        <FlatList
          data={filteredComplaints}
          renderItem={({ item }) => (
            <View style={styles.complaintCard}>
              <View style={styles.complaintHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.shoName}>{item.shopN ?? 'N/A'}</Text>
                  <Text style={styles.complaintId}>#{item.complaintId ?? 'N/A'}</Text>
                </View>
                <Text style={styles.status}>Status: {item.status}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              {item.image && (
                <TouchableOpacity onPress={() => Alert.alert('Image', item.image)}>
                  <Image
                    source={{ uri: item.image }} 
                    style={styles.complaintImage}
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              )}
              {item.reply && (
                <View style={styles.replyContainer}>
                  <Text style={styles.replyText}>Reply: {item.reply}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteComplaint(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyState}>No complaints found.</Text> // Empty state message
      )}
    </View>
    <Navigation/>
    </SafeAreaView>
  );
};

export default ComplaintList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  complaintCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 4, // Slightly increase elevation for better shadow effect
    padding: 16,
    marginBottom: 16,
  },
  shoName: {
    fontSize: 18,  // Adjust font size for better visibility
    fontWeight: 'bold',
    color: '#333',  // Color for the shop name
  },
  complaintId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',  // Different color for contrast
    marginTop: 4, // Add margin for better spacing
  },
  status: {
    fontSize: 14,
    color: '#777',
    // position: 'absolute',  // Removed absolute positioning
    marginTop: 4, // Add margin for spacing
  },
  complaintHeader: {
    flexDirection: 'row', // Keep items in a row
    justifyContent: 'space-between', // Space out items
    alignItems: 'flex-start', // Align items to the top
    marginBottom: 8, // Add spacing between header and description
  },
  headerLeft: {
    flex: 1, // Take remaining space
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  complaintImage: {
    width: '100%', // Full width of the card
    height: 200, // Set a fixed height
    borderRadius: 8,
    marginTop: 10,
  },
  replyContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#e7f3ff',
  },
  replyText: {
    fontSize: 14,
    color: '#0056b3',
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#F44336',
    borderRadius: 4,
    padding: 10,
    alignSelf: 'flex-end', // Align the delete button to the right
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
  },
});
