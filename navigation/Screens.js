import { Animated, Dimensions, Easing, useWindowDimensions } from "react-native";
// header for screens
import { Header, Icon } from "../components";
import { argonTheme, tabs } from "../constants";

import Articles from "../screens/Articles";
import { Block } from "galio-framework";
// drawer
import CustomDrawerContent from "./Menu";
import Elements from "../screens/Elements";
// screens
import SignBridgeMain from '../screens/SignBridgeMain';
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import React from "react";
import Register from "../screens/Register";
import LiveTrans from "../screens/LiveTrans";
import LanguageSelect from "../screens/LanguageSelect";
import TextToSign from "../screens/TextToSign";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

console.log("Rendering Screens.js");

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Simplified stack navigators
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

function LiveTransStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveTrans" component={LiveTrans} />
    </Stack.Navigator>
  );
}

function LanguageSelectStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
    </Stack.Navigator>
  );
}

function SignBridgeMainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignBridgeMain" component={SignBridgeMain} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
    </Stack.Navigator>
  );
}

function MainDrawer() {
  const { width } = useWindowDimensions();
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="SignBridgeMain"
    >
      <Drawer.Screen name="SignBridgeMain" component={SignBridgeMainStack} />
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="LiveTrans" component={LiveTransStack} />
      <Drawer.Screen name="TextToSign" component={TextToSign}/>
    </Drawer.Navigator>
  );
}

// Onboarding Stack (Root Navigator)
export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainApp" component={MainDrawer} />
    </Stack.Navigator>
  );
}