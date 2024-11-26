import { Conversation, User } from "@/types/entities";
import { FSConversation } from "@/types/firestore";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const converter = {
  toFirestore: (data: FSConversation) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as FSConversation,
};

const conversationCollection = collection(db, "conversations").withConverter(
  converter
);

export default function conversationStore(userId: string) {
  const conversationFilter = where("participants", "array-contains", userId);

  function createConversation(conv: Omit<Conversation, "id">) {
    const participants = conv.participants.map((p) => p.id);

    return addDoc(conversationCollection, { participants });
  }

  function getConversations() {
    return getDocs(query(conversationCollection, conversationFilter));
  }

  function subscribe(
    cb: (snap: QuerySnapshot<FSConversation, FSConversation>) => void
  ) {
    return onSnapshot(query(conversationCollection, conversationFilter), cb);
  }

  return {
    createConversation,
    getConversations,
    subscribe,
  };
}

export function toConversation(
  conv: QueryDocumentSnapshot<FSConversation, FSConversation>,
  users: User[]
) {
  const data = conv.data();

  return {
    id: conv.id,
    participants: users.filter((u) => data.participants.includes(u.id)),
  } as Conversation;
}

export function fromConversation(conv: Conversation) {
  return {
    participants: conv.participants.map((p) => p.id),
  } as FSConversation;
}
