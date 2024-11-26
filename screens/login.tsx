import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { useAppContext } from "@/app/AppProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { auth } from "../utils/firebase/firebase";

import Layout from "@/components/Layout";
import LoginForm from "@/components/LoginForm";
import Icons from "@/constants/Icons";
import { RootStackParamList } from "@/types/routes";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
});

const backgroundImage = require("../assets/images/health.png");

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useAppContext();

  const openRegisterScreen = () => {
    navigation.navigate("Register");
  };

  const signIn = () => {
    if (!email || !password) {
      alert("Please provide all required information!");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const email = userCredential.user.email;
        const displayName = userCredential.user.displayName;

        if (email === null || displayName === null) {
          throw new Error("Missing email or display name");
        }

        setUser({
          id: userCredential.user.uid,
          email,
          displayName,
        });

        navigation.navigate("Conversations");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Layout style={styles.container} imageSrc={backgroundImage}>
      <LoginForm
        fields={[
          {
            placeholder: "Enter your email",
            label: "Email",
            icon: Icons.email,
            value: email,
            onChange: setEmail,
            onSubmit: signIn,
          },
          {
            placeholder: "Enter your password",
            label: "Password",
            icon: Icons.password,
            value: password,
            onChange: setPassword,
            onSubmit: signIn,
            secured: true,
          },
        ]}
        primaryCta={{ text: "Sign in", onPress: signIn }}
        secondaryCta={{ text: "Register", onPress: openRegisterScreen }}
      />
    </Layout>
  );
}
