import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "../context/ThemeContext";

type Props = {
  brandColor?: string;
  subtitleColor?: string;
  spiderColor?: string;
  onToggle?: () => void;
};

export default function SpiderVerseHeader({
  brandColor,
  subtitleColor,
  spiderColor,
  onToggle,
}: Props) {
  const { colors, toggleTheme } = useTheme();

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.brand, { color: brandColor ?? colors.text }]}>
          SpiderVerse
        </Text>
        <Text
          style={[styles.subtitle, { color: subtitleColor ?? colors.subtext }]}
        >
          Miles Morales Edition
        </Text>
      </View>

      <Pressable onPress={onToggle ?? toggleTheme} style={styles.toggleButton}>
        <FontAwesome6
          name="spider"
          size={30}
          color={spiderColor ?? colors.spider}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    zIndex: 2,
  },
  brand: {
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  toggleButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
