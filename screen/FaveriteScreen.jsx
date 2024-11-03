import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { AntDesign } from "@expo/vector-icons"; // Ensure you have installed @expo/vector-icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";

function FaveriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const handlePlayerClick = (player) => {
    console.log("navigate to detail player", player.id);
    navigation.navigate("Home", {
      screen: "Detail Player",
      params: { playerTypeId: player.id },
    });
  };

  const fetchFavorites = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      setFavorites(JSON.parse(favorites));
    }
  };

  useEffect(() => {
    const filterFavorites = () => {
      if (search) {
        const filtered = favorites.filter((player) =>
          player.playerName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredPlayers(filtered);
      } else {
        setFilteredPlayers(favorites);
      }
    };

    filterFavorites();
  }, [search, favorites]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const handleRemoveFavorite = (item) => {
    // Show an alert to confirm removal
    Alert.alert(
      "Remove Favorite", // Title of the alert
      `Are you sure you want to remove ${item.playerName} from your favorites?`, // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel", // Styling for the Cancel button
        },
        {
          text: "Remove",
          onPress: async () => {
            // Proceed to remove the item from favorites
            let favoritesList = favorites.filter((favItem) => favItem.id !== item.id);
            await AsyncStorage.setItem("favorites", JSON.stringify(favoritesList));
            setFavorites(favoritesList);
          },
          style: "destructive", // Optionally add a 'destructive' style to indicate a critical action
        },
      ],
      { cancelable: true } // Allow the user to dismiss the alert by tapping outside of it
    );
  };

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {

    return (
      <TouchableOpacity
        onPress={() => handlePlayerClick(item)}
        className="w-[160px] h-[250px] m-[15px] flex flex-col"
      >
        <View style={{ position: "relative", width: "100%", height: "66%" }}>
          <Image
            source={{ uri: item.image }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 3,
              backgroundColor: "#E4E4E4",
            }}
            resizeMode="cover"
          />
          {item.isCaptain && (
            <View
              style={{
                position: "absolute",
                top: 5,
                left: 5,
                backgroundColor: "#e91e63",
                padding: 5,
                borderRadius: 3,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                CAPTAIN
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            width: "100%",
            height: "40%",
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: "white",
          }}
          className="shadow-inner"
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 16 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.playerName}
          </Text>
          <Text className="my-2">
            {item.team}
          </Text>
          <View className="flex flex-row items-center justify-between my-2">
            <Text className="text-gray-500">
              Played: {item.minutesPlayed}m
            </Text>
            <TouchableOpacity onPress={() => handleRemoveFavorite(item)}>
              <AntDesign name="delete" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
  );

  const renderEmptyComponent = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 300 }}>
      <Text className="font-bold text-2xl">No items added to list yet.</Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Search bar */}
      <View className="flex-row justify-between items-center px-3 pb-2 pt-4">
        <View className="flex-row items-center px-2 border border-gray-300 rounded-md w-full bg-white mb-2 shadow">
          <TextInput
            placeholder="Search something..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 p-1 h-[45px]"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Icon name="closecircle" size={20} className="ml-1" />
            </TouchableOpacity>
          ) : (
            <Icon name="search1" size={20} className="ml-1" />
          )}
        </View>
      </View>
      <FlatList
        data={filteredPlayers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={true}
        bounces={true}
        initialNumToRender={10}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

export default FaveriteScreen;