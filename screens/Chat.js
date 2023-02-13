import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { TouchableOpacity, Text } from "react-native-gesture-handler";
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
  return <GiftedChat />;
}
