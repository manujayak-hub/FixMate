import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import Shop_User_Home from "./app/screens/Shop/Shop_User_Home";
import AddRepairShop from "./app/screens/Shop/AddRepaiShop"
import Tut from "./app/screens/Tutorial/Tut";
import Shop_Client from "./app/screens/Client/Shop_Client"
import TutVideo from "./app/screens/Tutorial/TutVideo";
import TutorialDoc from "./app/screens/Tutorial/TutorialDoc";
import AddTutorial from "./app/screens/Tutorial/AddTutorial";
import TutorialList from "./app/screens/Tutorial/TutorialList";
import EditTutorial from "./app/screens/Tutorial/EditTutorial";
import CatTutorial from "./app/screens/Tutorial/CatTutorial";

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
        <Stack.Screen name="TutVideo" component={TutVideo} options={{headerShown:false}} />
        <Stack.Screen name="TutorialDoc" component={TutorialDoc} options={{headerShown:false}} />
        <Stack.Screen name="AddTutorial" component={AddTutorial} options={{headerShown:false}} />
        <Stack.Screen name="TutorialList" component={TutorialList} options={{headerShown:false}} />
        <Stack.Screen name="EditTutorial" component={EditTutorial} options={{headerShown:false}} />
        <Stack.Screen name="CatTutorial" component={CatTutorial} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


