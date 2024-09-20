import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../Firebase_Config';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const ComplaintList: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchId, setSearchId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for authentication state
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
      setUserId(user.uid); // Get the authenticated user's uid
    } else {
      Alert.alert('Error', 'User is not logged in.');
    }
  });

  // Fetch complaints only for the authenticated user
  useEffect(() => {
    if (userId) {
      const q = query(collection(FIREBASE_DB, 'complaints'), where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const deleteComplaint = async (id: string) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'complaints', id));
    } catch (error) {
      console.log('Error deleting complaint:', error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.complaintId?.toString().includes(searchId)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Complaint ID"
        value={searchId}
        onChangeText={setSearchId}
      />
      <FlatList
        data={filteredComplaints}
        renderItem={({ item }) => (
          <View style={styles.complaintCard}>
            <View style={styles.complaintHeader}>
              <Text style={styles.complaintId}>#{item.complaintId ?? 'N/A'}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
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
    </View>
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
    elevation: 2,
    padding: 16,
    marginBottom: 16,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#777',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
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
});
