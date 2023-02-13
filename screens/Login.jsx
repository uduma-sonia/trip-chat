import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      Keyboard.dismiss();
      setIsSubmitting(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((arg) => console.log("SUCCESSFUL"))
        .catch((err) => {
          Alert.alert("Login error", err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.headerText}>Welcome Back!</Text>
          <Text style={styles.descText}>
            Please sign in to your{" "}
            <Text style={{ fontWeight: "700", color: "#d7d7d7" }}>Trip</Text>{" "}
            account
          </Text>

          <View style={{ marginTop: 70 }}>
            <Text style={styles.formLabel}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="sam@gmail.com"
              autoFocus={true}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(e) => setEmail(e)}
              placeholderTextColor="#757678"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.formLabel}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="* * * * * * *"
              secureTextEntry={true}
              autoCorrect={false}
              textContentType="password"
              value={password}
              onChangeText={(e) => setPassword(e)}
              placeholderTextColor="#757678"
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={onHandleLogin}>
            {isSubmitting ? (
              <ActivityIndicator size="small" colors="#fff" />
            ) : (
              <Text style={{ fontSize: 18, fontWeight: "500", color: "#222" }}>
                Sign in
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={{ color: "#afb0ae", fontSize: 18 }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text
                style={{
                  color: "#48c72c",
                  fontSize: 18,
                  textDecorationLine: "underline",
                }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#222",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 30,
    marginTop: 100,
    fontWeight: "500",
    textAlign: "center",
  },
  descText: {
    color: "#b6b6b8",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
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
  loginButton: {
    borderRadius: 8,
    height: 55,
    backgroundColor: "#48c72c",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  signupContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
