import React from "react";
import {createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeStack, FavoriteStack, CaptainStack } from "./StackNavigation";
import { enableScreens } from 'react-native-screens';
import CustomTabBar from '../components/CustomTabBar.js'; 

enableScreens();

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  return (
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
          unmountOnBlur: true,
          swipeEnabled: true,
        }}
        tabBarPosition="bottom"
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,  
            tabBarIconName: "home",
          }}
        />
        <Tab.Screen
          name="Captain"
          component={CaptainStack}
          options={{
            headerShown: false,
            tabBarIconName: "bookmark",
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={FavoriteStack}
          options={{
            headerShown: false,
            tabBarIconName: "favorite",
          }}
        />
      </Tab.Navigator>
  );
};

export default TabNavigation;