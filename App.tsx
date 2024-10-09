import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import Shop_User_Home from "./app/screens/Shop/Shop_User_Home";
import AddRepairShop from "./app/screens/Shop/AddRepaiShop"
import Shop_Client from "./app/screens/Client/Shop_Client"
import EditShopDetails from "./app/screens/Shop/EditShopDetails";
import Tut from "./app/screens/Tutorial/Tut";
import TutVideo from "./app/screens/Tutorial/TutVideo";
import TutorialDoc from "./app/screens/Tutorial/TutorialDoc";
import AddTutorial from "./app/screens/Tutorial/AddTutorial";
import TutorialList from "./app/screens/Tutorial/TutorialList";
import EditTutorial from "./app/screens/Tutorial/EditTutorial";
import CatTutorial from "./app/screens/Tutorial/CatTutorial";
import STView from "./app/screens/Tutorial/STView";

import Client_MapView from "./app/screens/Client/Client_MapView";


import UserProfile from './app/screens/UserProfile';
import EditProfile from "./app/screens/EditProfile";
import complainlist from "./app/screens/Complaint/ComplaintList";
import ordertracking from "./app/screens/OrderTracking/OrderTrack";
import Complaintmanage from "./app/screens/Complaint/ComplaintDashboard";
import addcomplaint from "./app/screens/Complaint/AddComplaint";
import AboutUs from "./app/screens/Feedback/AboutUs";
import shopfeedback from "./app/screens/Feedback/ShopFeedback";

import ShopDetails from "./app/screens/Client/ShopDetails"; 
import Appointment from "./app/screens/Booking/Appointment";
import Payment from "./app/screens/Booking/Payment";

import PaymentMethods from "./app/screens/Booking/PaymentMethods";
import MyAppointments from "./app/screens/Booking/MyAppointments";


import AddTools from "./app/screens/ToolShop/AddTools";
import ToolList from "./app/screens/ToolShop/ToolList";
import EditTool from "./app/screens/ToolShop/EditTool";
import UserToolShop from "./app/screens/ToolShop/UserToolShop";
import URToolShop from "./app/screens/ToolShop/URToolShop";
import { CartProvider } from "./app/screens/ToolShop/CartContext"; // Import CartProvider
import CartPage from "./app/screens/ToolShop/CartPage";
import CartPayment from "./app/screens/ToolShop/CartPayment";
import ToolView from "./app/screens/ToolShop/ToolView";
import SuccessPage from "./app/screens/ToolShop/SuccessPage";


import WelcomePage from "./app/screens/WelcomePage";
import TrackOrders from "./app/screens/OrderTracking/TrackOrders";
import StatusManage from "./app/screens/OrderTracking/OrderTrackDashboard";
import addappcomplaint from "./app/screens/Complaint/AddApoComplaint";




const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
    <CartProvider> 
      <Stack.Navigator >
        <Stack.Screen name="WelcomePage" component={WelcomePage} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="Shop_User_Home" component={Shop_User_Home} options={{headerShown:false}}/>
        <Stack.Screen name="AddRepairShop" component={AddRepairShop} options={{headerShown:false}} />
        <Stack.Screen name="EditShopDetails" component={EditShopDetails} options={{headerShown:false}} />
        <Stack.Screen name="Shop_Client" component={Shop_Client} options={{headerShown:false}} />
        <Stack.Screen name="Tut" component={Tut} options={{headerShown:false}} />
        <Stack.Screen name="TutVideo" component={TutVideo} options={{headerShown:false}} />
        <Stack.Screen name="TutorialDoc" component={TutorialDoc} options={{headerShown:false}} />
        <Stack.Screen name="AddTutorial" component={AddTutorial} options={{headerShown:false}} />
        <Stack.Screen name="TutorialList" component={TutorialList} options={{headerShown:false}} />
        <Stack.Screen name="EditTutorial" component={EditTutorial} options={{headerShown:false}} />
        <Stack.Screen name="CatTutorial" component={CatTutorial} options={{headerShown:false}} />
        <Stack.Screen name="STView" component={STView} options={{headerShown:false}} />
        <Stack.Screen name="Client_MapView" component={Client_MapView} options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={UserProfile} options={{headerShown:false}} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:false}} />
        <Stack.Screen name="complainlist" component={complainlist} options={{headerShown:false}} />
        <Stack.Screen name="ordertracking" component={ordertracking} options={{headerShown:false}} />
        <Stack.Screen name="TrackOrders" component={TrackOrders} options={{headerShown:false}} />
        <Stack.Screen name="Complaintmanage" component={Complaintmanage} options={{headerShown:false}} />
        <Stack.Screen name="addcomplaint" component={addcomplaint} options={{headerShown:false}} />
        <Stack.Screen name="addappcomplaint" component={addappcomplaint} options={{headerShown:false}} />
        <Stack.Screen name="aboutus" component={AboutUs} options={{headerShown:false}} />
        <Stack.Screen name="shopfeedbacklist" component={shopfeedback} options={{headerShown:false}} />
        <Stack.Screen name="StatusManage" component={StatusManage} options={{headerShown:false}} />
        <Stack.Screen name="ShopDetails" component={ShopDetails} options={{headerShown:false}} />
        <Stack.Screen name="Appointment" component={Appointment} options={{headerShown:false}} />
        <Stack.Screen name="Payment" component={Payment} options={{headerShown:false}} />



        <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={{headerShown:false}} />
        <Stack.Screen name="MyAppointments" component={MyAppointments} options={{headerShown:false}} />




        <Stack.Screen name="AddTools" component={AddTools} options={{headerShown:false}} />
        <Stack.Screen name="ToolList" component={ToolList} options={{headerShown:false}} />
        <Stack.Screen name="EditTool" component={EditTool} options={{headerShown:false}} />
        <Stack.Screen name="UserToolShop" component={UserToolShop} options={{headerShown:false}} />
        <Stack.Screen name="URToolShop" component={URToolShop} options={{headerShown:false}} />
        <Stack.Screen name="CartPage" component={CartPage} options={{headerShown:false}} />
        <Stack.Screen name="CartPayment" component={CartPayment} options={{headerShown:false}} />
        <Stack.Screen name="ToolView" component={ToolView} options={{headerShown:false}} />
        <Stack.Screen name="SuccessPage" component={SuccessPage} options={{headerShown:false}} />



      </Stack.Navigator>
    </CartProvider>
    </NavigationContainer>
  );
}


