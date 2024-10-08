import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface CustomAlertProps {
    visible: boolean;
    message: string;
    onClose: () => void;
    type: 'error' | 'success';  // Add type prop
}
  
const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, onClose, type }) => {
    // Set the background color based on the type prop
    const backgroundColor = type === 'error' ? '#f44336' : '#F96D2B'; // Red for error, green for success
  
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.alertContainer, { backgroundColor }]}>
                    <View style={styles.header}>
                        <Text style={styles.alertTitle}>{type === 'error' ? 'ERROR !!!' : 'SUCCESS !!!'}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="closecircle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.alertMessage}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dim background
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: 320,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    alertTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    alertMessage: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});
