import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import SpiderVerseHeader from "../../components/SpiderVerseHeader";
import { useSpiderVerse } from "../../context/SpiderVerseContext";
import type { RootStackParamList } from "../AppNavigator";
import { useTheme } from "../../context/ThemeContext";

const comicBackground = require("../../assets/comic_background.jpg");

export default function SavedScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const { savedHeroes, isSaved, toggleSavedHero } = useSpiderVerse();
  const { colors } = useTheme();
  const filteredSavedHeroes = useMemo(
    () =>
      savedHeroes.filter((hero) =>
        [hero.name, hero.earth, hero.universe, hero.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [savedHeroes, searchQuery],
  );

  return (
    <ImageBackground
      source={comicBackground}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View
        style={[styles.backgroundOverlay, { backgroundColor: colors.overlay }]}
      />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
        <FlatList
          style={styles.list}
          data={filteredSavedHeroes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <SpiderVerseHeader
                brandColor={colors.text}
                subtitleColor={colors.subtext}
                spiderColor={colors.spider}
              />
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#2b2200" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search saved variants"
                  placeholderTextColor="#7d6700"
                  style={styles.searchInput}
                />
              </View>
              {filteredSavedHeroes.length === 0 ? (
                <Text style={[styles.placeholder, { color: colors.text }]}>
                  No saved variants yet.
                </Text>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate("Detail", { hero: item })}
              style={styles.card}
            >
              <View style={styles.imageBlock}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    resizeMode="cover"
                    style={styles.cardImage}
                  />
                ) : null}
                <Pressable
                  onPress={() => toggleSavedHero(item)}
                  style={styles.bookmarkButton}
                >
                  <Ionicons
                    name={isSaved(item.id) ? "bookmark" : "bookmark-outline"}
                    size={18}
                    color="#111111"
                  />
                </Pressable>
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                {item.earth || item.universe || "Spider-Verse"}
              </Text>
            </Pressable>
          )}
          ListFooterComponent={<View style={styles.bottomSpacer} />}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.96,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
  headerBlock: {
    paddingTop: 8,
  },
  searchBar: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 28,
    backgroundColor: "#ffd22e",
    borderWidth: 2,
    borderColor: "#1b1500",
  },
  searchInput: {
    flex: 1,
    color: "#181300",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 12,
  },
  placeholder: {
    marginTop: 40,
    fontSize: 18,
    textAlign: "center",
  },
  card: {
    marginTop: 14,
    padding: 12,
    borderRadius: 22,
    backgroundColor: "#ffd22e",
  },
  imageBlock: {
    height: 220,
    borderRadius: 16,
    backgroundColor: "#ff5860",
    overflow: "hidden",
    marginBottom: 14,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  bookmarkButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffd22e",
    borderWidth: 2,
    borderColor: "#181300",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#111111",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  cardMeta: {
    color: "#262626",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 24,
  },
});
