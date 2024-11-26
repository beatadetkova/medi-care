import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

import { useAppContext } from "@/app/AppProvider";
import { Message } from "@/types/entities";
import { FSMessage } from "@/types/firestore";
import messageStore, { toMessage } from "@/utils/firebase/messageStore";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";

import ConversationMessage from "@/components/ConversationMessage";
import Layout from "@/components/Layout";
import useSubscribe from "@/hooks/useSubscribe";
import { RootStackParamList } from "@/types/routes";
import handleError from "@/utils/handleError";
import isMobile from "@/utils/isMobile";
import { darkOrange, lightPink } from "../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: lightPink,
  },
  input: {
    width: `100%`,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: "auto",
    borderRadius: 50,
    backgroundColor: "white",
  },
  list: {
    width: `100%`,
    ...(!isMobile() && { maxHeight: Dimensions.get("window").height - 100 }),
  },
  listContent: {
    flexDirection: "column-reverse",
  },
});

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function Chat(props: Props) {
  const [isEndReached, setIsEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    FSMessage,
    FSMessage
  > | null>(null);

  const { participants, conversationId } = props.route.params;

  const { user } = useAppContext();

  if (!user) {
    return <Text>No user!</Text>;
  }

  const store = messageStore(conversationId);

  const [messages, setMessages] = useSubscribe<Message, FSMessage>(
    store,
    toMessage
  );

  // record to lookup display user name easily
  const users = useMemo(
    () => Object.fromEntries(participants.map((p) => [p.id, p.displayName])),
    []
  );

  const loadMessages = () => {
    // stop early if we already loaded all messages
    if (isEndReached) {
      return;
    }

    setIsLoading(true);

    store
      .getMessages(lastDoc)
      .then((snap) => {
        const docs = snap.docs;
        const docsCount = docs.length;

        if (docsCount === 0) {
          setIsEndReached(true);
          return;
        }

        const sortedMessages = docs.map(toMessage).reverse(); // we need to reverse this list because we are fetching with timestamp descending (so we can get the latest ones) but we want to show the message in the opposite order on the UI (oldest at the top)

        setMessages([...sortedMessages, ...messages]);
        setLastDoc(docs[docsCount - 1]);
      })
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <Layout style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color={darkOrange} />}
      {messages.length > 0 && (
        <FlatList
          style={styles.list}
          data={messages}
          inverted={true}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ConversationMessage
              content={item.content}
              sender={users[item.senderId]}
              timestamp={item.timestamp}
              isSender={item.senderId === user.id}
            />
          )}
          onEndReached={loadMessages}
          onEndReachedThreshold={0.1}
        />
      )}
      <TextInput
        placeholder="Message"
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={() => {
          setMessage("");

          store
            .sendMessage({
              senderId: user.id,
              conversationId: conversationId,
              content: message,
            })
            .catch(handleError);
        }}
      />
    </Layout>
  );
}
