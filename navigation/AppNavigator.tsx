import { Ionicons } from "@expo/vector-icons";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/HomeScreen";
import SavedScreen from "./screens/SavedScreen";
import SplashScreen from "./screens/SplashScreen";
import ExploreScreen from "./screens/ExploreScreen";
import DetailScreen from "./screens/DetailScreen";
import type { SpiderHero } from "../types/spider";

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  Detail: { hero: SpiderHero };
};

export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Saved: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: "transparent",
        },
        tabBarStyle: {
          backgroundColor: "#f11309",
          borderTopWidth: 1,
          borderColor: "#ffd22e",
          paddingTop: 5,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "#111111",
        tabBarInactiveTintColor: "#ffd22e",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ animation: "fade" }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
