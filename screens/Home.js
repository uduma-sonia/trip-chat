import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const [allRooms, setAllRooms] = useState();
  const [roomName, setRoomName] = useState("");

  const onSignOut = () => signOut(auth).catch((error) => console.log(error));

  useLayoutEffect(() => {
    const collectionRef = collection(database, "allRooms");
    const q = query(collectionRef, (ref) => orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllRooms(
        snapshot.docs.map((doc) => ({
          query: doc.data().query,
          label: doc.data().label,
        }))
      );
    });

    return unsubscribe;
  }, []);

  const handleCreateRoom = useCallback(async () => {
    try {
      setModalVisible(!modalVisible);
      if (roomName !== "") {
        setIsSubmitting(true);
        addDoc(collection(database, "allRooms"), {
          query: roomName,
          label: roomName,
        });
      }
      setRoomName("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [roomName]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                padding: 10,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <FontAwesome name="close" color="#fff" size={20} />
            </TouchableOpacity>

            <View style={{ width: "100%", marginTop: 30 }}>
              <Text style={styles.formLabel}>Room name</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter room name"
                autoFocus={true}
                autoCapitalize="none"
                keyboardType="default"
                value={roomName}
                onChangeText={(e) => setRoomName(e)}
                placeholderTextColor="#757678"
              />

              <TouchableOpacity
                style={[styles.createButton, { width: "100%" }]}
                onPress={handleCreateRoom}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" colors="#fff" />
                ) : (
                  <Text
                    style={{ fontSize: 18, fontWeight: "500", color: "#222" }}
                  >
                    Create
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SafeAreaView>
        <ScrollView>
          <View style={styles.navContainer}>
            <Text style={styles.headerText}>Trip</Text>

            <Text style={{ color: "#ffffff", fontSize: 16 }}>Chat Rooms</Text>

            <TouchableOpacity onPress={() => onSignOut()}>
              <Text style={{ color: "#ffffff", fontWeight: "600" }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ fontSize: 16, fontWeight: "400", color: "#222" }}>
                Create chat room
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {allRooms?.map((item) => {
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
    fontSize: 24,
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
  modalView: {
    margin: 20,
    backgroundColor: "#000000",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: 200,
    position: "relative",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  formLabel: {
    color: "#afb0ae",
    marginBottom: 10,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#7d7c7c",
    borderRadius: 8,
    height: 55,
    color: "#ffffff",
    marginBottom: 10,
    fontSize: 18,
    paddingHorizontal: 10,
    backgroundColor: "#4a4949",
  },
  createButton: {
    borderRadius: 8,
    height: 45,
    backgroundColor: "#48c72c",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 150,
  },
});
