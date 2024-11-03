import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/HomeScreen";
import FaveriteScreen from "../screen/FaveriteScreen";
import DetailScreen from "../screen/DetailScreen";
import CaptainScreen from "../screen/CaptainScreen";

const Stack = createStackNavigator();

// Stack for home page
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: true,
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="Detail Player"
      component={DetailScreen}
      options={{
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

// Stack for favorite list player
const FavoriteStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Favorites"
        component={FaveriteScreen}
        options={{
          headerTitleAlign: "center",
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const CaptainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Captains"
        component={CaptainScreen}
        options={{
          headerTitleAlign: "center",
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

export { HomeStack, FavoriteStack, CaptainStack };
