import { useAppContext } from "@/app/AppProvider";
import { Conversation, User } from "@/types/entities";
import conversationStore, {
  toConversation,
} from "@/utils/firebase/conversationStore";
import userStore, { toUser } from "@/utils/firebase/userStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

import IconButton from "@/components/IconButton";
import Layout from "@/components/Layout";
import UserCard from "@/components/UserCard";
import UsersModal from "@/components/UsersModal";
import useSubscribe from "@/hooks/useSubscribe";
import { FSConversation, FSUser } from "@/types/firestore";
import { RootStackParamList } from "@/types/routes";
import handleError from "@/utils/handleError";
import { darkOrange, lightPink } from "../constants/Colors";

const styles = StyleSheet.create({
  iconButton: { alignSelf: "flex-end" },
});

type Props = NativeStackScreenProps<RootStackParamList, "Conversations">;

export default function Conversations({ navigation }: Props) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAppContext();

  if (!user) {
    return <Text>No user!</Text>;
  }

  const convStore = conversationStore(user.id);
  const usrStore = userStore();

  const [users, setUsers] = useSubscribe<User, FSUser>(usrStore, toUser);
  const [conversations, setConversations] = useSubscribe<
    Conversation,
    FSConversation
  >(convStore, toConversation, users);

  const addConversation = (userId: string) => {
    const participant = users.find((u) => u.id === userId);

    // this should in practice not happen
    if (!participant) {
      alert("No user found!");
      return;
    }

    const participants = [user, participant];

    setIsLoading(true);

    convStore
      .createConversation({
        participants,
      })
      .then((conv) =>
        navigation.navigate("Chat", {
          conversationId: conv.id,
          participants,
        })
      )
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };

  // load all users & conversations
  useEffect(() => {
    setIsLoading(true);

    usrStore
      .getUsers()
      .then((users) => users.docs.map(toUser))
      .then((users) => {
        setUsers(users);

        return convStore
          .getConversations()
          .then((convs) => convs.docs.map((c) => toConversation(c, users)));
      })
      .then((convs) => setConversations(convs))
      .catch(handleError)
      .finally(() => setIsLoading(false));
  }, []);

  // set available users for new conversations
  useEffect(() => {
    setAvailableUsers(
      users.filter(
        (u) =>
          u.id != user.id &&
          ![
            ...new Set(
              conversations.map((c) => c.participants.map((p) => p.id)).flat()
            ),
          ].includes(u.id)
      )
    );
  }, [users, conversations]);

  return (
    <Layout style={{ maxWidth: undefined }}>
      <UsersModal
        isVisible={modalVisible}
        isLoading={isLoading}
        users={availableUsers}
        onClick={addConversation}
        onClose={() => setModalVisible(false)}
      />
      <View
        style={{ backgroundColor: lightPink, flex: 1, flexDirection: "column" }}
      >
        {isLoading && <ActivityIndicator size="large" color={darkOrange} />}
        <FlatList
          data={conversations}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", {
                    conversationId: item.id,
                    participants: item.participants,
                  })
                }
              >
                <UserCard
                  name={item.participants
                    .filter((p) => p.id !== user.id)
                    .map((p) => p.displayName)
                    .join(", ")}
                />
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.iconButton}>
          <IconButton name="plus" onPress={() => setModalVisible(true)} />
        </View>
      </View>
    </Layout>
  );
}
