import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // Ensure you have installed @expo/vector-icons
import { Rating } from "react-native-ratings";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlayerCard = ({ item }) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const favoritesList = JSON.parse(favorites);
        setIsFavorite(favoritesList.some((favItem) => favItem.id === item.id));
      }
    };
    checkFavoriteStatus();
  }, [item.id]);

  const handleFavoritePress = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    let favoritesList = favorites ? JSON.parse(favorites) : [];
    if (isFavorite) {
      favoritesList = favoritesList.filter((favItem) => favItem.id !== item.id);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesList));
    } else {
      favoritesList.push(item);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesList));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Detail Player", {
          playerTypeId: item.id,
        })
      }
      style={{ boxShadow: "10px 10px rgba(0, 0, 0, 0.1)" }}
      className="w-[160px] h-[280px] m-[8px] flex flex-col rounded-md overflow-hidden"
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
              Captain
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
          onPress={handleFavoritePress}
        >
          <AntDesign
            name="heart"
            size={24}
            color={isFavorite ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          height: "40%",
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: "white",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Text
          style={{ fontWeight: "bold", fontSize: 16 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.playerName}
        </Text>
        <View className="flex flex-row items-center my-2">
          <Text className="text-gray-500">
            Played: {item.minutesPlayed}m
          </Text>
        </View>
        <View>
          <Text>{item.position}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlayerCard;
