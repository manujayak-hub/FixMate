import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebase_Config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import CustomAlert from "../Components/CustomAlert";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [userType, setUserType] = useState("Customer");
  const [alertVisible, setAlertVisible] = useState(false);

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | undefined>(undefined);
  const navigation:any = useNavigation();
  const [shopName, setShopName] = useState('');

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | undefined>(
    undefined
  );
  const navigation: any = useNavigation();


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile); // Assumes a 10-digit mobile number
  };

  const handleSignUp = async () => {
    if (!name) {
      setAlertMessage("Name is required!");
      setAlertVisible(true);
      setAlertType("error");
      return;
    }

    if (!mobile || !validateMobile(mobile)) {
      setAlertMessage("Enter a valid 10-digit mobile number!");
      setAlertVisible(true);
      setAlertType("error");
      return;
    }

    if (!email || !validateEmail(email)) {
      setAlertMessage("Enter a valid email address!");
      setAlertVisible(true);
      setAlertType("error");
      return;
    }

    if (!password || password.length < 6) {
      setAlertMessage("Password must be at least 6 characters long!");
      setAlertVisible(true);
      setAlertType("error");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(FIREBASE_DB, "users", user.uid), {
        name,
        mobile,
        email,
        type: userType,
        photo,
        shopName: userType === 'Business' ? shopName : null 
      });

      // Clear form fields

      setName('');
      setMobile('');
      setEmail('');
      setPassword('');
      setUserType('Customer');
      setShopName('');

      setName("");
      setMobile("");
      setEmail("");
      setPassword("");
      setUserType("Customer");


      // Display success alert

      setAlertMessage("Account created successfully!");
      setAlertVisible(true);
      setAlertType("success");
    } catch (error: any) {
      setAlertMessage("Error" + error.message);
      setAlertVisible(true);
      setAlertType("error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Create an account so you can explore trusted repair experts
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setUserType("Customer")}
        >
          <Text
            style={
              userType === "Customer"
                ? styles.radioButtonTextSelected
                : styles.radioButtonText
            }
          >
            Customer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setUserType("Business")}
        >
          <Text
            style={
              userType === "Business"
                ? styles.radioButtonTextSelected
                : styles.radioButtonText
            }
          >
            Business
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>

    {userType === 'Business' && (
        <TextInput
          style={styles.input}
          placeholder="Shop Name"
          value={shopName}
          onChangeText={setShopName}
        />
      )}

    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#F96D2B",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  radioButton: {
    padding: 10,
  },
  radioButtonText: {
    fontSize: 16,
  },
  radioButtonTextSelected: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6A00",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A7A7A",
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#F96D2B",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default SignUpScreen;
