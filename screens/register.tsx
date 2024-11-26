import React, { useState } from "react";
import { StyleSheet } from "react-native";

import userStore from "@/utils/firebase/userStore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { auth } from "../utils/firebase/firebase";

import Layout from "@/components/Layout";
import LoginForm from "@/components/LoginForm";
import Icons from "@/constants/Icons";
import { RootStackParamList } from "@/types/routes";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
});

const backgroundImage = require("../assets/images/hearth-beat.png");

export default function Register({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const store = userStore();

  const register = () => {
    if (!name || !email || !password) {
      alert("Please provide all required information!"); // instead of an alert -> validate field and highlight invalid field in UI
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return store
          .registerUser({
            id: user.uid,
            displayName: name,
            email,
          })
          .then(() =>
            updateProfile(user, {
              displayName: name,
            })
          );
      })
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Layout style={styles.container} imageSrc={backgroundImage}>
      <LoginForm
        fields={[
          {
            placeholder: "Enter your name",
            label: "Name",
            icon: Icons.person,
            value: name,
            onChange: setName,
            onSubmit: register,
          },
          {
            placeholder: "Enter your email",
            label: "Email",
            icon: Icons.email,
            value: email,
            onChange: setEmail,
            onSubmit: register,
          },
          {
            placeholder: "Enter your password",
            label: "Password",
            icon: Icons.password,
            value: password,
            onChange: setPassword,
            onSubmit: register,
            secured: true,
          },
        ]}
        primaryCta={{ text: "Register", onPress: register }}
      />
    </Layout>
  );
}
