import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

import { getSpiderHeroes } from "../../api/spiderApi";
import type { SpiderHero } from "../../types/spider";
import SpiderVerseHeader from "../../components/SpiderVerseHeader";
import type { RootStackParamList } from "../AppNavigator";
import { useSpiderVerse } from "../../context/SpiderVerseContext";
import { useTheme } from "../../context/ThemeContext";

const HALFTONE_DOTS = Array.from({ length: 1000 }, (_, index) => index);
const comicBackground = require("../../assets/comic_background.jpg");

export default function ExploreScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [heroes, setHeroes] = useState<SpiderHero[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const { isSaved, toggleSavedHero } = useSpiderVerse();
  const { colors } = useTheme();

  useEffect(() => {
    let isActive = true;

    const loadHeroes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSpiderHeroes();

        if (isActive) {
          setHeroes(data);
        }
      } catch {
        if (isActive) {
          setError("Could not load Spider-Verse variants right now.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadHeroes();

    return () => {
      isActive = false;
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredHeroes = useMemo(
    () =>
      heroes.filter((hero) => {
        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [
          hero.name,
          hero.earth,
          hero.universe,
          hero.description,
          hero.fullName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      }),
    [heroes, normalizedQuery],
  );

  useEffect(() => {
    setVisibleCount(20);
  }, [normalizedQuery]);

  const visibleHeroes = filteredHeroes.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredHeroes.length;

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
          data={visibleHeroes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
                  placeholder="Search Spider variants"
                  placeholderTextColor="#7d6700"
                  style={styles.searchInput}
                />
              </View>

              {loading ? (
                <View style={styles.statusCard}>
                  <ActivityIndicator size="small" color="#ffd84f" />
                  <Text style={styles.statusText}>
                    Loading multiverse variants...
                  </Text>
                </View>
              ) : null}

              {!loading && error ? (
                <View style={styles.statusCard}>
                  <Text style={styles.statusText}>{error}</Text>
                  <Pressable
                    onPress={async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const data = await getSpiderHeroes();
                        setHeroes(data);
                        setVisibleCount(20);
                      } catch {
                        setError("Could not load Spider-Verse variants right now.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <Text style={styles.retryText}>Try Again</Text>
                  </Pressable>
                </View>
              ) : null}

              {!loading && !error && filteredHeroes.length === 0 ? (
                <View style={styles.statusCard}>
                  <Text style={styles.statusText}>
                    No variants matched your search.
                  </Text>
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item }) => {
            const earthLabel = item.earth || item.universe || "Unknown Earth";
            const description =
              item.description ||
              item.fullName ||
              "Spider-powered hero navigating the multiverse.";
            const saved = isSaved(item.id);

            return (
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
                  <View style={styles.imageOverlay} />
                  <Pressable
                    onPress={() => toggleSavedHero(item)}
                    style={styles.bookmarkButton}
                  >
                    <Ionicons
                      name={saved ? "bookmark" : "bookmark-outline"}
                      size={18}
                      color="#111111"
                    />
                  </Pressable>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.halftoneFill} pointerEvents="none">
                    {HALFTONE_DOTS.map((dot) => (
                      <View key={`${item.id}-${dot}`} style={styles.halftoneDot} />
                    ))}
                  </View>

                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardMeta}>{earthLabel}</Text>
                  <Text style={styles.cardDescription} numberOfLines={4}>
                    {description}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          ListFooterComponent={
            !loading && !error && canLoadMore ? (
              <Pressable
                onPress={() =>
                  setVisibleCount((current) =>
                    Math.min(current + 20, filteredHeroes.length),
                  )
                }
                style={styles.loadMoreButton}
              >
                <Text style={styles.loadMoreText}>Load More Variants</Text>
              </Pressable>
            ) : (
              <View style={styles.bottomSpacer} />
            )
          }
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
  listContent: {
    paddingHorizontal: 12,
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerBlock: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  searchBar: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 6,
    marginTop: 18,
    marginBottom: 14,
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
  statusCard: {
    marginHorizontal: 6,
    marginBottom: 14,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffd22e",
    backgroundColor: "rgba(13, 13, 13, 0.82)",
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    color: "#f8f7f3",
    fontSize: 14,
    textAlign: "center",
  },
  retryText: {
    color: "#ffd22e",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  card: {
    // marginHorizontal: 15,
    marginTop: 15,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#ffd22e",
    overflow: "hidden",
  },
  imageBlock: {
    height: 315,
    borderRadius: 12,
    backgroundColor: "#ff5860",
    // overflow: "hidden",
  },
  cardImage: {
    borderRadius: 12,
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 76, 86, 0.18)",
  },
  bookmarkButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffd22e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#181300",
  },
  cardBody: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 18,
    overflow: "hidden",
  },
  halftoneFill: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    paddingHorizontal: 6,
    paddingTop: 6,
    opacity: 0.2,
  },
  halftoneDot: {
    width: 3,
    height: 3,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 99,
    backgroundColor: "#5f4200",
  },
  cardTitle: {
    color: "#f11309",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 4,
  },
  cardMeta: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  cardDescription: {
    color: "#141414",
    fontSize: 14,
    lineHeight: 22,
    paddingRight: 10,
  },
  loadMoreButton: {
    marginHorizontal: 28,
    marginTop: 18,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#ffd22e",
    borderWidth: 2,
    borderColor: "#1b1500",
    alignItems: "center",
  },
  loadMoreText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bottomSpacer: {
    height: 24,
  },
});
