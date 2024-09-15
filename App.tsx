import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import Shop_User_Home from "./app/screens/Shop/Shop_User_Home";
import AddRepairShop from "./app/screens/Shop/AddRepaiShop"
import Tut from "./app/screens/Tutorial/Tut";
import Shop_Client from "./app/screens/Client/Shop_Client"
import Client_MapView from "./app/screens/Client/Client_MapView";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="Shop_User_Home" component={Shop_User_Home} options={{headerShown:false}}/>
        <Stack.Screen name="AddRepairShop" component={AddRepairShop} options={{headerShown:false}} />
        <Stack.Screen name="Tut" component={Tut} options={{headerShown:false}} />
        <Stack.Screen name="Shop_Client" component={Shop_Client} options={{headerShown:false}} />
        <Stack.Screen name="Client_MapView" component={Client_MapView} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


