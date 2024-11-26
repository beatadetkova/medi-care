import { darkOrange, darkPink, mediumPink, pink } from "@/constants/Colors";
import { Message } from "@/types/entities";
import formatDate from "@/utils/formatDate";
import isMobile from "@/utils/isMobile";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  baseItem: {
    ...(!isMobile() && {
      maxWidth: `100%`,
    }),
    borderRadius: 25,
    padding: 20,
    marginVertical: 8,
  },
  senderItem: {
    backgroundColor: pink,
    borderWidth: 1,
    borderColor: mediumPink,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  receiverItem: {
    backgroundColor: mediumPink,
    borderWidth: 1,
    borderColor: darkPink,
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  senderText: {
    color: darkOrange,
    marginBottom: 2,
    fontSize: 14,
  },
  text: {
    ...(!isMobile() && {
      maxWidth: `100%`,
    }),
    fontSize: 20,
  },
  date: {
    fontSize: 11,
  },
});

type Props = {
  content: Message["content"];
  sender: string;
  timestamp: Message["timestamp"];
  isSender: boolean;
};

export default function ConversationMessage({
  content,
  sender,
  timestamp,
  isSender,
}: Props) {
  return (
    <View
      style={{
        ...styles.baseItem,
        ...(isSender ? styles.senderItem : styles.receiverItem),
      }}
    >
      <Text style={styles.senderText}>{sender}</Text>
      <Text style={styles.text}>{content}</Text>
      <Text style={styles.date}>{formatDate(timestamp)}</Text>
    </View>
  );
}
