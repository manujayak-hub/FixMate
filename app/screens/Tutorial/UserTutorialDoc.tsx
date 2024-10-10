import React, { useState, useEffect } from 'react';

import { Image, StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

import { useRoute, RouteProp } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, onSnapshot, query, where,serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { Video, ResizeMode } from 'expo-av';

import ClientHeader from "../../Components/ClientHeader";
import Navigation from "../../Components/Navigation";




type RootStackParamList = {
    UserTutorialDoc: { tutorialId: string };
};

type TutorialDocRouteProp = RouteProp<RootStackParamList, 'UserTutorialDoc'>;

interface TutorialData {

    tutorialId:String;

    imageUrl: string;
    title: string;
    tools: string;
    description: string;
    videoUrl?: string;
}

interface Review {
    id: string;
    username: string;
    reviewText: string;
    timestamp: { toDate: () => Date }; // Add this for timestamp conversion
}

const UserTutorialDoc: React.FC = () => {
    const [tutorial, setTutorial] = useState<TutorialData | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewText, setReviewText] = useState<string>('');
    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
    const route = useRoute<TutorialDocRouteProp>();
    const { tutorialId } = route.params;

    const auth = getAuth();
    const loggedInUser = auth.currentUser;

    useEffect(() => {
        const fetchUsername = async () => {
            if (loggedInUser) {
                try {
                    const userDocRef = doc(FIREBASE_DB, 'users', loggedInUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setLoggedInUsername(userData.name);
                    } else {
                        console.log('No such user document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUsername();
    }, [loggedInUser]);

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                const docRef = doc(FIREBASE_DB, 'Tutorial', tutorialId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTutorial(docSnap.data() as TutorialData);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {

                console.error('Error fetching tutorial:', error);

            }
        };

        
        fetchTutorial();
        const unsubscribeFromReviews = fetchReviews();

        return () => {
            unsubscribeFromReviews();
        };
    }, [tutorialId]);

    const handleAddReview = async () => {
        if (reviewText.trim() && loggedInUsername) {
            try {
                await addDoc(collection(FIREBASE_DB, 'TReview'), {
                    tutorialId,
                    username: loggedInUsername,
                    reviewText: reviewText.trim(),
                    timestamp: serverTimestamp(), // Use Firestore's server timestamp
                });
                setReviewText('');
            } catch (error) {
                console.error('Error adding review:', error);
            }
        } else {
            alert('Please enter a review or ensure you are logged in');
        }
    };
    
    const fetchReviews = () => {
        const reviewsCollection = collection(FIREBASE_DB, 'TReview');
        const reviewsQuery = query(reviewsCollection, where('tutorialId', '==', tutorialId));
    
        const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
            const fetchedReviews = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Review[];
    
            const filteredReviews = fetchedReviews.filter((review) => {
                // Check if timestamp exists before calling toDate
                if (review.timestamp) {
                    const reviewTimestamp = review.timestamp.toDate(); // Convert Firestore timestamp to JS date

                    return (new Date().getTime() - reviewTimestamp.getTime()) <= 72 * 60 * 60 * 1000; // 24 hours in milliseconds

                    return (new Date().getTime() - reviewTimestamp.getTime()) <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds

                }
                return false; // If there's no timestamp, exclude this review
            });
    
            setReviews(filteredReviews);
        });
    
        return unsubscribe;
    };
    if (!tutorial) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>

             <ClientHeader />
            <ScrollView style={{padding:15}}>

            <ScrollView>

                <Text style={styles.title}>{tutorial.title}</Text>
                <Image
                    source={{ uri: tutorial.imageUrl }}
                    style={styles.image}
                />

                <Text style={styles.txt}>How to do:</Text>
                <Text style={styles.description}>{tutorial.description}</Text>

                <Text style={styles.txt}>Recommended Tools:</Text>
                <Text style={styles.description}>{tutorial.tools}</Text>

                <Text style={styles.txt}>Watch this:</Text>
                {tutorial.videoUrl && (
                    <Video
                        source={{ uri: tutorial.videoUrl }}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                    />
                )}

                <Text style={styles.txt}>Reviews:</Text>

                <View style={styles.reviewContainer}>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        
                            <View key={review.id} style={styles.reviewItem}>

                            <Text style={styles.reviewUsername}>{review.username}</Text>
                            <Text style={styles.reviewText}>{review.reviewText}</Text>
                        </View>
                    ))


                ) : (
                    <Text>No reviews yet.</Text>
                )}
                </View>

                

                <TextInput
                    style={styles.reviewInput}
                    placeholder="Write a review..."
                    value={reviewText}
                    onChangeText={setReviewText}
                />

                <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
              <Text style={styles.addButtonText}>Submit Review</Text>
      </TouchableOpacity>

                
            </ScrollView>
            <Navigation/>

                
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {

        padding: 20,

        backgroundColor: '#fff3e6',
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
    },
    video: {
        marginTop: 20,
        width: '100%',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    txt: {
        fontWeight: '700',
        fontSize: 16,
        marginTop: 20,
        color: '#FF6100',
    },
    reviewContainer: {

        marginTop: 16,
        padding:10,
        backgroundColor: '#F3F3F3',
        shadowColor: '#000', // Required for iOS
        shadowOffset: { width: -20, height: -20 },
        shadowOpacity: 0.5,
        marginBottom:5,
        elevation: 2, // Required for Android

        marginVertical: 10,
        

        borderRadius: 5,
    },
    reviewUsername: {
        fontWeight: 'bold',
    },
    reviewText: {

        color: '#555',
    },
    reviewInput: {
        borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    },
    addButton: {
        width:'50%',
        backgroundColor: '#FF6F00',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:10,
        marginBottom:40,
      },
      addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft:15,
      },
      reviewItem: {
        marginBottom: 8,
        padding:10,
        backgroundColor: '#F3F3F3',
        shadowColor: '#000', // Required for iOS
        shadowOffset: { width: -20, height: -20 },
        shadowOpacity: 0.5,
        flexDirection: 'row',
        elevation: 10, // Required for Android
        borderRadius: 10,
      },

        
    

});

export default UserTutorialDoc;
