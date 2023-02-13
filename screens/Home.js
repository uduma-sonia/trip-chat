import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  //   useEffect(() => {
  //     navigation.setOptions({
  //       headerLeft: () => <FontAwesome name="search" size={24} />,
  //       headerRight: () => {
  //         <Text>HEADER RIGHT</Text>;
  //       },
  //     });
  //   }, [navigation]);

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={{ textAlign: "center" }}>CHAT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    borderWidth: 1,
    width: 100,
    padding: 10,
  },
});
