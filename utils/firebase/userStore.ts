import { User } from "@/types/entities";
import { FSUser } from "@/types/firestore";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const converter = {
  toFirestore: (data: FSUser) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as FSUser,
};

const userCollection = collection(db, "users").withConverter(converter);

export default function userStore() {
  function registerUser(user: User) {
    const { id, email, displayName } = user;
    return setDoc(doc(db, "users", id), {
      email,
      display_name: displayName,
    });
  }

  function getUsers() {
    return getDocs(query(userCollection));
  }

  function subscribe(cb: (snap: QuerySnapshot<FSUser, FSUser>) => void) {
    return onSnapshot(userCollection, cb);
  }

  return {
    registerUser,
    getUsers,
    subscribe,
  };
}

export function toUser(user: QueryDocumentSnapshot<FSUser, FSUser>) {
  const data = user.data();

  return {
    id: user.id,
    displayName: data.display_name,
    email: data.email,
  } as User;
}

export function fromUser(user: User) {
  return {
    email: user.email,
    display_name: user.displayName,
  } as FSUser;
}
