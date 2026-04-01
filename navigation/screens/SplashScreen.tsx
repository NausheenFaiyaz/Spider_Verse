import React, { useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEventListener } from "expo";
import { RootStackParamList } from "../AppNavigator";
import { useVideoPlayer, VideoView } from "expo-video";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const localVideo = require("../../assets/splash.mp4");

export default function SplashScreen({ navigation }: Props) {
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const hasNavigated = useRef(false);

  const player = useVideoPlayer(localVideo, (player) => {
    player.loop = false;
    player.play();
  });
  
  useEventListener(player, "playToEnd", () => {
    if (hasNavigated.current) {
      return;
    }

    hasNavigated.current = true;

    Animated.timing(splashOpacity, {
      toValue: 0,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("MainTabs");
    });
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.videoWrap, { opacity: splashOpacity }]}>
        <VideoView player={player} style={styles.video} nativeControls={false} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoWrap: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
