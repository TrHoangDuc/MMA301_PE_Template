import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import axios from "axios";
import CategoryCart from "../components/CategoryCart";
import PlayerCard from "../components/PlayerCard";
import Icon from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

function HomeScreen() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlayers().then(() => setRefreshing(false));
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://6725f369c39fedae05b664bb.mockapi.io/players"
      );
      setPlayers(response.data);
      setFilteredPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlayers();
    }, [])
  );


  useEffect(() => {
    const filtered = players.filter((player) => {
      const matchesCategory = selectedCategory
        ? player.team === selectedCategory
        : true;
      const matchesSearch = search
        ? player.playerName.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
    setFilteredPlayers(filtered);
  }, [search, selectedCategory, players]);

  const handleSelectCategory = (team) => {
    setSelectedCategory(team);
  };

  const getUniqueteams = (players) => {
    const teams = players.map((player) => player.team);
    return [...new Set(teams)];
  };

  const uniqueteams = getUniqueteams(players);

  const renderCategoryItem = ({ item: team }) => (
    <TouchableOpacity onPress={() => handleSelectCategory(team)}>
      <CategoryCart title={team} selected={selectedCategory === team} />
    </TouchableOpacity>
  );

  const renderPlayerItem = ({ item }) => <PlayerCard item={item} />;

  const ListHeaderComponent = () => (
    <>
      {/* Category */}
      <View className="flex flex-row justify-between px-3 overflow-hidden">
        <Text className="text-xl font-bold">Teams</Text>
        <TouchableOpacity onPress={() => handleSelectCategory("")}>
          <Text className="text-lg text-blue-400">See all</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-2 flex flex-row justify-center">
        <FlatList
          data={uniqueteams}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCategoryItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      </View>
    </>
  );

  //loading spinner
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

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

      {/* Player list */}
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          renderItem={renderPlayerItem}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center pt-32 space-y-4">
              <Text className="text-lg">No player found</Text>
              <View className="flex-1 justify-center items-center pt-32"></View>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
  );
}

export default HomeScreen;
