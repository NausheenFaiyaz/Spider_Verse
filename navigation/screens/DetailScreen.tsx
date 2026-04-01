import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../AppNavigator";
import { useSpiderVerse } from "../../context/SpiderVerseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ navigation, route }: Props) {
  const { hero } = route.params;
  const { isSaved, toggleSavedHero } = useSpiderVerse();
  const { colors, theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const infoRows = [
    ["Earth", hero.earth],
    ["Universe", hero.universe],
    ["Full Name", hero.fullName],
    ["Status", hero.status],
    ["Gender", hero.gender],
    ["Species", hero.species],
    ["Identity", hero.identity],
    ["Occupation", hero.occupation?.join(", ")],
    ["Affiliations", hero.affiliation?.join(", ")],
    ["Aliases", hero.aliases?.join(", ")],
    ["Nicknames", hero.nicknames?.join(", ")],
    ["Location", hero.location ?? undefined],
    ["Nationality", hero.nationality ?? undefined],
    ["Voice Actor", hero.voiceActor ?? undefined],
  ].filter(([, value]) => Boolean(value));

  const abilities = hero.abilities?.filter(Boolean) ?? [];
  const specCards = abilities.slice(0, 4);
  const perkRows = abilities.slice(0, 3);
  const saved = isSaved(hero.id);
  const rarityLabel = hero.status || "Legendary";
  const rankValue = Math.min(10, Math.max(3, specCards.length + 3));
  const energyValue = Math.min(20, Math.max(8, infoRows.length));
  const progressWidth = `${(rankValue / 10) * 100}%` as const;
  const isLight = theme === "neon";

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: theme === "dark" ? "#000000" : colors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleBand}>
          <Animated.Text
            style={[
              styles.titleText,
              {
                color: isLight ? "#111111" : "#fff7ec",
                textShadowColor: isLight ? "#ffffff" : "#39220f",
              },
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {hero.name}
          </Animated.Text>
          <Text
            style={[
              styles.rarityText,
              {
                color: isLight ? "#111111" : "#fff7ec",
                textShadowColor: isLight ? "#ffffff" : "#39220f",
              },
            ]}
          >
            {rarityLabel}
          </Text>
        </View>

        <View style={styles.heroStage}>
          <Animated.View
            style={[
              styles.powerPanel,
              {
                backgroundColor: isLight
                  ? "rgba(255, 255, 255, 0.72)"
                  : "rgba(17, 23, 34, 0.6)",
              },
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text
              style={[
                styles.powerHeading,
                { color: isLight ? "#111111" : "#ffffff" },
              ]}
            >
              Power Of Spidey
            </Text>
            <Text
              style={[
                styles.rankLabel,
                { color: isLight ? "#111111" : "#ffffff" },
              ]}
            >
              Rank
            </Text>
            <View style={styles.starRow}>
              {Array.from({ length: 8 }, (_, index) => (
                <Text key={index} style={styles.starIcon}>
                  {index < rankValue ? "*" : "-"}
                </Text>
              ))}
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
              <Text
                style={[
                  styles.progressText,
                  { color: isLight ? "#111111" : "#ffffff" },
                ]}
              >
                {rankValue}/10
              </Text>
            </View>
            <View style={styles.energyRow}>
              <Text style={styles.energyBolt}>+</Text>
              <Text
                style={[
                  styles.energyText,
                  { color: isLight ? "#111111" : "#ffffff" },
                ]}
              >
                {energyValue}/20
              </Text>
            </View>
          </Animated.View>

          {hero.imageUrl ? (
            <Image
              source={{ uri: hero.imageUrl }}
              resizeMode="cover"
              style={styles.heroImage}
            />
          ) : null}

          <Pressable
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              {
                backgroundColor: isLight ? "#ffb7b7" : "#e439229d",
                borderColor: isLight ? "#7d1406" : "#7d1406",
              },
            ]}
          >
            <FontAwesome6 name="arrow-left" size={16} color="#111111" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.earthBadge}>
            <Text style={[styles.earthBadgeText, { color: "#111111" }]}>
              {hero.earth || hero.universe || "Spider-Verse"}
            </Text>
          </View>

          <Pressable
            onPress={() => toggleSavedHero(hero)}
            style={styles.bookmarkButton}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={18}
              color="#111111"
            />
          </Pressable>
        </View>

        {perkRows.length > 0 ? (
          <>
            <View style={styles.sectionHeading}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isLight ? "#111111" : "#f4f3f8" },
                ]}
              >
                Web Arsenal
              </Text>
              <View
                style={[
                  styles.sectionLine,
                  { backgroundColor: isLight ? "#111111" : "#ff6e75" },
                ]}
              />
            </View>

            {perkRows.map((ability, index) => (
              <Animated.View
                key={`${ability}-${index}`}
                style={[
                  styles.perkRow,
                  { backgroundColor: isLight ? "#f1efe8" : "#000000" },
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.perkIconWrap}>
                  <FontAwesome6 name="bolt" size={18} color="#ffd22e" />
                </View>
                <Text
                  style={[
                    styles.perkText,
                    { color: isLight ? "#111111" : "#f7f7f8" },
                  ]}
                >
                  {ability}
                </Text>
              </Animated.View>
            ))}
          </>
        ) : null}

        {hero.description ? (
          <>
            <View style={styles.sectionHeading}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isLight ? "#111111" : "#f4f3f8" },
                ]}
              >
                Spider Profile
              </Text>
              <View
                style={[
                  styles.sectionLine,
                  { backgroundColor: isLight ? "#111111" : "#ff6e75" },
                ]}
              />
            </View>

            <Animated.View
              style={[
                styles.copyPanel,
                { backgroundColor: isLight ? "#f7f4eb" : "#000000" },
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text
                style={[
                  styles.copyText,
                  { color: isLight ? "#111111" : "#f1f3ff" },
                ]}
              >
                {hero.description}
              </Text>
            </Animated.View>
          </>
        ) : null}

        {specCards.length > 0 ? (
          <>
            <View style={styles.sectionHeading}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isLight ? "#111111" : "#f4f3f8" },
                ]}
              >
                Ability Grid
              </Text>
              <View
                style={[
                  styles.sectionLine,
                  { backgroundColor: isLight ? "#111111" : "#ff6e75" },
                ]}
              />
            </View>

            <View style={styles.specGrid}>
              {specCards.map((ability) => (
                <Animated.View
                  key={ability}
                  style={[
                    styles.specCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  {/* <Text style={styles.specIcon}>+</Text> */}
                  <Text style={styles.specText}>{ability}</Text>
                </Animated.View>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isLight ? "#111111" : "#f4f3f8" },
            ]}
          >
            Reality Signature
          </Text>
          <View
            style={[
              styles.sectionLine,
              { backgroundColor: isLight ? "#111111" : "#ff6e75" },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.dataPanel,
            { backgroundColor: isLight ? "#f7f4eb" : "#000000" },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {infoRows.map(([label, value]) => (
            <View key={label} style={styles.dataRow}>
              <Text
                style={[
                  styles.dataLabel,
                  { color: isLight ? "#595d73" : "#8b8fa5" },
                ]}
              >
                {label}
              </Text>
              <Text
                style={[
                  styles.dataValue,
                  { color: isLight ? "#111111" : "#f4f5fb" },
                ]}
              >
                {value}
              </Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 40,
    flexGrow: 1,
  },
  titleBand: {
    alignItems: "center",
    paddingVertical: 18,
    backgroundColor: "#efb82a",
    borderBottomWidth: 3,
    borderBottomColor: "#7f5600",
  },
  titleText: {
    color: "#fff7ec",
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    textShadowColor: "#39220f",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  rarityText: {
    marginTop: 5,
    color: "#fff7ec",
    fontSize: 15,
    padding:15,
    fontWeight: "900",
    textTransform: "uppercase",
    textShadowColor: "#39220f",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  heroStage: {
    height: 520,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#dfb12a",
    overflow: "hidden",
    // backgroundColor: "#9fd3ff",
    position: "relative",
  },

  powerPanel: {
    position: "absolute",
    top: 96,
    left: 5,
    width: 150,
    padding: 10,
    backgroundColor: "rgba(17, 23, 34, 0.6)",
    borderWidth: 2,
    borderColor: "#f0b72b",
    zIndex: 3,
  },
  powerHeading: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  rankLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  starIcon: {
    color: "#ffcd2f",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 2,
  },
  progressTrack: {
    height: 28,
    borderWidth: 2,
    borderColor: "#ffb545",
    backgroundColor: "#ffe5247a",
    justifyContent: "center",
    marginBottom: 14,
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#e43922da",
  },
  progressText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    zIndex: 2,
  },
  energyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  energyBolt: {
    color: "#84ff2ddc",
    fontSize: 18,
    fontWeight: "900",
    marginRight: 6,
  },
  energyText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  heroImage: {
    width: 420,
    height: 520,
    zIndex: 2,
  },
  backButton: {
    position: "absolute",
    left: 12,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#e439229d",
    borderWidth: 2,
    borderColor: "#7d1406",
    zIndex: 4,
  },
  backText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  earthBadge: {
    position: "absolute",
    right: 12,
    bottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffe5247a",
    borderWidth: 2,
    borderColor: "#16242a",
    zIndex: 4,
  },
  earthBadgeText: {
    color: "#111111",
    fontWeight: "900",
  },
  bookmarkButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ffd22e",
    borderWidth: 2,
    borderColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#f4f3f8",
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#ff6e75",
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#f0b72b",
    backgroundColor: "#000000",
    padding: 10,
  },
  perkIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ff5858ba",
    borderWidth: 2,
    borderColor: "#f0b72b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  perkText: {
    flex: 1,
    color: "#f7f7f8",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    textTransform: "uppercase",
  },
  copyPanel: {
    borderWidth: 2,
    borderColor: "#f0b72b",
    backgroundColor: "#000000",
    padding: 18,
  },
  copyText: {
    color: "#f1f3ff",
    fontSize: 17,
    lineHeight: 28,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  specCard: {
    width: "48%",
    minHeight: 138,
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: "#ff5050",
    backgroundColor: "#fff23d",
    alignItems: "center",
    justifyContent: "center",
  },
  specIcon: {
    color: "#ff8087",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
  },
  specText: {
    color: "#202020",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center",
    textTransform: "uppercase",
  },
  dataPanel: {
    borderWidth: 2,
    borderColor: "#f0b72b",
    backgroundColor: "#000000",
    paddingHorizontal: 18,
  },
  dataRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe4fb",
  },
  dataLabel: {
    color: "#8b8fa5",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  dataValue: {
    color: "#f4f5fb",
    fontSize: 15,
    lineHeight: 22,
  },
});
