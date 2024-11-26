import { Message } from "@/types/entities";
import { FSMessage } from "@/types/firestore";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const converter = {
  toFirestore: (data: FSMessage) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as FSMessage,
};

const messageCollection = collection(db, "messages").withConverter(converter);
const messageOrder = orderBy("timestamp", "desc");
const messageLimit = limit(25);

export default function messageStore(conversationId: string) {
  const messageFilter = where("conversation_id", "==", conversationId);

  function sendMessage(message: Omit<Message, "id" | "timestamp">) {
    return addDoc(messageCollection, {
      sender_id: message.senderId,
      conversation_id: message.conversationId,
      content: message.content,
      timestamp: serverTimestamp(),
    });
  }

  function subscribe(cb: (snap: QuerySnapshot<FSMessage, FSMessage>) => void) {
    return onSnapshot(query(messageCollection, messageFilter), cb);
  }

  function getMessages(cursor: QueryDocumentSnapshot | null) {
    let messageQuery;

    if (cursor !== null) {
      messageQuery = query(
        messageCollection,
        messageFilter,
        messageOrder,
        startAfter(cursor),
        messageLimit
      );
    } else {
      messageQuery = query(
        messageCollection,
        messageFilter,
        messageOrder,
        messageLimit
      );
    }

    return getDocs(messageQuery);
  }

  return {
    sendMessage,
    getMessages,
    subscribe,
  };
}

export function toMessage(msg: QueryDocumentSnapshot<FSMessage, FSMessage>) {
  const data = msg.data();

  const { seconds, nanoseconds } = data.timestamp;

  return {
    id: msg.id,
    senderId: data.sender_id,
    conversationId: data.conversation_id,
    content: data.content,
    timestamp: seconds * 1000 + nanoseconds / 1e6,
  } as Message;
}

export function fromMessage(msg: Message) {
  return {
    sender_id: msg.senderId,
    conversation_id: msg.conversationId,
    content: msg.content,
    timestamp: {
      nanoseconds: 0,
      seconds: msg.timestamp,
    },
  } as FSMessage;
}
