import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,Image  } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [replyMessages, setReplyMessages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, 'complaints'), (snapshot) => {
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const updateComplaint = async (id: string, status: string) => {
    await updateDoc(doc(FIREBASE_DB, 'complaints', id), { status });
  };

  const sendReply = async (id: string) => {
    const replyMessage = replyMessages[id];
    if (replyMessage?.trim()) {
      await updateDoc(doc(FIREBASE_DB, 'complaints', id), { reply: replyMessage });
      setReplyMessages((prev) => ({ ...prev, [id]: '' })); // Clear the reply for that specific complaint
    }
  };

  const deleteComplaint = async (id: string) => {
    await deleteDoc(doc(FIREBASE_DB, 'complaints', id));
  };

  const handleReplyChange = (id: string, text: string) => {
    setReplyMessages((prev) => ({ ...prev, [id]: text })); // Update the specific reply message
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
      {complaints.map((item) => (
        <View key={item.id} style={styles.complaintCard}>
          <View style={styles.complaintHeader}>
            <Text style={styles.complaintId}>Complaint ID: {item.complaintId}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          {item.image && (
              <Image
                source={{ uri: item.image }} // Adjust based on how you're storing the image URL
                style={styles.complaintImage}
                resizeMode="cover" // Use cover or contain based on your preference
              />
            )}
          {item.reply && (
            <Text style={styles.replyMessage}>You replied: {item.reply}</Text>
          )}
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Reply..."
              value={replyMessages[item.id] || ''}
              onChangeText={(text) => handleReplyChange(item.id, text)}
            />
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => sendReply(item.id)}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => updateComplaint(item.id, 'Resolved')}
            >
              <Text style={styles.buttonText}>Mark as Resolved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteComplaint(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
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
    marginBottom: 8,
  },
  complaintId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    fontSize: 14,
    color: '#777',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  complaintImage: {
    width: '100%', // Make the image responsive
    height: 200, // Adjust the height based on your preference
    borderRadius: 8,
    marginBottom: 8,
  },
  replyMessage: {
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 8,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  replyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 10,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 4,
    padding: 10,
    flex: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
