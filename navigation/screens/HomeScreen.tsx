import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import SpiderVerseHeader from "../../components/SpiderVerseHeader";
import { useTheme } from "../../context/ThemeContext";

type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Saved: undefined;
};

const milesMorales = require("../../assets/spidercomic.jpg");

const HELLO_TEXT = "HELLO";
const INTRO_TEXT = "MY NAME IS MILES MORALES";
const HALFTONE_DOTS = Array.from({ length: 120 }, (_, index) => index);

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [typedHello, setTypedHello] = useState("");
  const [typedIntro, setTypedIntro] = useState("");
  const { colors } = useTheme();
  const helloTranslateX = useRef(new Animated.Value(-180)).current;
  const helloScale = useRef(new Animated.Value(0.92)).current;
  const nameTranslateX = useRef(new Animated.Value(-220)).current;
  const nameScale = useRef(new Animated.Value(0.92)).current;
  const ctaTranslateX = useRef(new Animated.Value(-220)).current;
  const ctaScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    let helloIndex = 0;
    let introIndex = 0;
    let introTimer: ReturnType<typeof setInterval> | undefined;

    const helloTimer = setInterval(() => {
      helloIndex += 1;
      setTypedHello(HELLO_TEXT.slice(0, helloIndex));

      if (helloIndex >= HELLO_TEXT.length) {
        clearInterval(helloTimer);

        introTimer = setInterval(() => {
          introIndex += 1;
          setTypedIntro(INTRO_TEXT.slice(0, introIndex));

          if (introIndex >= INTRO_TEXT.length) {
            clearInterval(introTimer);
          }
        }, 78);
      }
    }, 145);

    return () => {
      clearInterval(helloTimer);
      if (introTimer) {
        clearInterval(introTimer);
      }
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(helloTranslateX, {
        toValue: 0,
        velocity: 14,
        tension: 85,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(helloScale, {
        toValue: 1,
        velocity: 10,
        tension: 105,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const nameDelay = setTimeout(() => {
      Animated.parallel([
        Animated.spring(nameTranslateX, {
          toValue: 0,
          velocity: 14,
          tension: 85,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(nameScale, {
          toValue: 1,
          velocity: 10,
          tension: 105,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 240);

    const animationDelay = setTimeout(() => {
      Animated.parallel([
        Animated.spring(ctaTranslateX, {
          toValue: 0,
          velocity: 16,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(ctaScale, {
          toValue: 1,
          velocity: 10,
          tension: 110,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 850);

    return () => {
      clearTimeout(nameDelay);
      clearTimeout(animationDelay);
    };
  }, [
    ctaScale,
    ctaTranslateX,
    helloScale,
    helloTranslateX,
    nameScale,
    nameTranslateX,
  ]);

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SpiderVerseHeader
          brandColor={colors.text}
          subtitleColor={colors.subtext}
          spiderColor={colors.spider}
        />

        <View style={styles.heroArea}>
          <Animated.View
            style={[
              styles.quoteCard,
              styles.helloCard,
              { shadowColor: colors.shadow },
              {
                transform: [
                  { translateX: helloTranslateX },
                  { scale: helloScale },
                ],
              },
            ]}
          >
            <View style={styles.halftoneFill} pointerEvents="none">
              {HALFTONE_DOTS.map((dot) => (
                <View key={`hello-${dot}`} style={styles.halftoneDot} />
              ))}
            </View>
            <Text style={styles.quoteText}>{typedHello || " "}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.quoteCard,
              styles.nameCard,
              { shadowColor: colors.shadow },
              {
                transform: [
                  { translateX: nameTranslateX },
                  { scale: nameScale },
                ],
              },
            ]}
          >
            <View style={styles.halftoneFill} pointerEvents="none">
              {HALFTONE_DOTS.map((dot) => (
                <View key={`name-${dot}`} style={styles.halftoneDot} />
              ))}
            </View>
            <Text style={[styles.quoteText, styles.nameText]}>
              {typedIntro || " "}
            </Text>
          </Animated.View>

          <Image
            source={milesMorales}
            resizeMode="cover"
            style={styles.heroImage}
          />
        </View>

        <View style={styles.footerArea}>
          <Animated.View
            style={[
              styles.ctaMotion,
              {
                transform: [
                  { translateX: ctaTranslateX },
                  { scale: ctaScale },
                ],
              },
            ]}
          >
            <Pressable
              onPress={() => navigation.navigate("Explore")}
              style={[
                styles.ctaButton,
                { backgroundColor: colors.accent, shadowColor: colors.shadow },
              ]}
            >
              <View style={styles.halftoneFill} pointerEvents="none">
                {HALFTONE_DOTS.map((dot) => (
                  <View key={`cta-${dot}`} style={styles.halftoneDot} />
                ))}
              </View>
              <Text style={[styles.ctaText, { color: colors.buttonText }]}>
                Explore SpiderVerse
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroArea: {
    flex: 1,
    position: "relative",
    paddingTop: 18,
    zIndex: 2,
  },
  quoteCard: {
    position: "absolute",
    backgroundColor: "#ffd22e",
    borderWidth: 2,
    borderColor: "#1d1600",
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.85,
    shadowRadius: 0,
    elevation: 8,
    overflow: "hidden",
  },
  helloCard: {
    top: 8,
    left: 6,
    alignSelf: "flex-start",
  },
  nameCard: {
    top: 72,
    left: 48,
    maxWidth: 230,
  },
  quoteText: {
    color: "#181200",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.6,
    zIndex: 10,
  },
  nameText: {
    fontSize: 17,
    lineHeight: 24,
  },
  halftoneFill: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 6,
    opacity: 0.34,
    zIndex: 1,
  },
  halftoneDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#5b3c00",
    marginRight: 8,
    marginBottom: 8,
  },
  heroImage: {
    position: "absolute",
    width: 420,
    height: 760,
    zIndex: -1,
  },
  footerArea: {
    gap: 14,
    marginTop: 30,
    zIndex: 2,
  },
  ctaMotion: {
    alignSelf: "flex-start",
  },
  ctaButton: {
    alignSelf: "flex-start",
    marginLeft: -10,
    marginBottom: -10,
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#1d1600",
    borderRadius: 6,
    shadowOffset: { width: 12, height: 12 },
    elevation: 8,
    overflow: "hidden",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
