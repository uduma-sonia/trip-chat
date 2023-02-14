import React, { useState, useLayoutEffect, useCallback } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { FontAwesome } from "@expo/vector-icons";

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { roomName } = route.params;

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  useLayoutEffect(() => {
    const collectionRef = collection(database, roomName);
    const q = query(collectionRef, (ref) => orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((prevMsg) => GiftedChat.append(prevMsg, messages));
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, roomName), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#48c72ce0",
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.navContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <FontAwesome name="chevron-left" size={20} color="#d5d5d5" />

            <Text style={{ color: "#d8d8d8", marginLeft: 10, fontSize: 18 }}>
              Home
            </Text>
          </TouchableOpacity>

          <Text style={{ color: "#ffffff", fontSize: 16 }}>{roomName}</Text>

          <TouchableOpacity onPress={() => onSignOut()}>
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth?.currentUser?.email,
          avatar: "https://i.pravatar.cc/300",
        }}
        messagesContainerStyle={{
          backgroundColor: "#222",
        }}
        renderBubble={renderBubble}
        containerStyle={{ backgroundColor: "#222222" }}
        textInputStyle={{ color: "#ffffff" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#4a4949",
    paddingHorizontal: 20,
  },
});
