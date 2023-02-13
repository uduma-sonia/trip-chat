import React, { useState, useLayoutEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { TouchableOpacity, Text } from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function Chat() {
  const [messages, setMessages] = useState();
  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSignOut}>
          <Text style={{ marginHorizontal: 10 }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chat");
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
    addDoc(collection(database, "chat"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
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
    />
  );
}
