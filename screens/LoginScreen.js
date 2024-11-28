import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function LoginScreen() {
  return (
    <View>
      <View>
        <Image
          source={require("../assets/profile.jpg")}
          style={styles.profile}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
  },
});
