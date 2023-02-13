import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Home() {
  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  const chatRoutes = [
    {
      query: "crm-one",
      label: "chat room one",
    },
    {
      query: "crm-two",
      label: "chat room tow",
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.navContainer}>
            <Text style={styles.headerText}>Trip - Chat rooms</Text>

            <TouchableOpacity onPress={() => onSignOut()}>
              <Text style={{ color: "#ffffff" }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View>
            {chatRoutes.map((item) => {
              return (
                <TouchableOpacity
                  key={item.query}
                  onPress={() =>
                    navigation.navigate("Chat", {
                      roomName: item.query,
                    })
                  }
                >
                  <View style={styles.itemsContainer}>
                    <Text style={{ color: "#d7d7d7", fontSize: 18 }}>
                      {item.label}
                    </Text>

                    <FontAwesome
                      name="chevron-right"
                      size={13}
                      color="#d5d5d5"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  navContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#4a4949",
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "600",
  },
  itemsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#4a494990",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1919",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
