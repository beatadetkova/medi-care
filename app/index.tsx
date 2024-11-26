import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { RootStackParamList } from "@/types/routes";
import Chat from "../screens/chat";
import Conversations from "../screens/conversations";
import Login from "../screens/login";
import Register from "../screens/register";
import { AppProvider } from "./AppProvider";

const Stack = createStackNavigator<RootStackParamList>();

export default function Index() {
  return (
    <AppProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Conversations"
          component={Conversations}
          options={{ title: "Conversations" }}
        />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </AppProvider>
  );
}
