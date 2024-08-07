import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import Shop_User_Home from "./app/Components/Shop_User_Home";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="Shop_User_Home" component={Shop_User_Home} options={{headerShown:false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


