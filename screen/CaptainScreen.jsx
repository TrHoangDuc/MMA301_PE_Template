import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import axios from "axios";
import PlayerCard from "../components/PlayerCard";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

function CaptainScreen() {
  const [players, setPlayers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlayers().then(() => setRefreshing(false));
  }, []);

  const fetchFavorites = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      setFavorites(JSON.parse(favorites));
    }
  };

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://6725f369c39fedae05b664bb.mockapi.io/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlayers();
      fetchFavorites();
    }, [])
  );

  useEffect(() => {
    // Filter for captains and sort by minutesPlayed ascending
    const filtered = players
      .filter((player) => player.isCaptain)
      .sort((a, b) => a.minutesPlayed - b.minutesPlayed);
    setFilteredPlayers(filtered);
  }, [players]);

  const renderPlayerItem = ({ item }) => <PlayerCard item={item} />;

  // Loading spinner
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const handleRemoveAllFavorites = () => {
    // Show an alert to confirm removing all favorites
    if (favorites.length === 0) return;
    Alert.alert(
      "Remove All Favorites", // Title of the alert
      "Are you sure you want to remove all items from your favorites?", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel", // Cancel button
        },
        {
          text: "Remove All",
          onPress: async () => {
            // Proceed to remove all favorites
            await AsyncStorage.removeItem("favorites");
            setFavorites([]); // Clear the favorites state
            setFilteredPlayers([]); // Also clear filtered players if needed
          },
          style: "destructive", // Destructive style to indicate a critical action
        },
      ],
      { cancelable: true } // Allow dismissing the alert by tapping outside of it
    );
  };

  const renderHeader = () => (
    <View className="flex flex-row justify-between px-3 overflow-hidden py-2">
      <Text className="text-xl font-bold">You have {favorites.length} favorite item</Text>
      {favorites.length > 0 && (
        <TouchableOpacity onPress={handleRemoveAllFavorites}>
          <Text className="text-lg text-red-500">Remove all</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View className="flex-1">
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayerItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center pt-32 space-y-4">
            <Text className="text-lg">No captain found</Text>
          </View>
        }
      />
    </View>
  );
}

export default CaptainScreen;
