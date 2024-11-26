import { Conversation, Message, User } from "@/types/entities";
import { FSConversation, FSMessage, FSUser } from "@/types/firestore";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type Value = Message | User | Conversation;
type FSValue = FSMessage | FSUser | FSConversation;

type ModelMapping<T> = T extends Message
  ? FSMessage
  : T extends User
  ? FSUser
  : T extends Conversation
  ? FSConversation
  : never;

type ArgMapping<T> = T extends Conversation ? User[] : never;

interface Store<T extends DocumentData = FSValue> {
  subscribe: (cb: (snap: QuerySnapshot<T, T>) => void) => Unsubscribe;
}

export default function useSubscribe<
  T extends Value = Value,
  U extends DocumentData = ModelMapping<T>,
  V extends Value[] = ArgMapping<T>
>(
  store: Store<U>,
  convert: (val: QueryDocumentSnapshot<U, U>, ...args: V[]) => T,
  ...args: V[]
) {
  const [values, setValues] = useState<T[]>([]);

  useEffect(() => {
    let isFirstSnapshot = true;

    const unsubscribe = store.subscribe((snapshot) => {
      if (isFirstSnapshot) {
        isFirstSnapshot = false;
        return;
      }

      const changes = snapshot.docChanges();
      let snapshots: T[] = [...values];

      for (const change of changes) {
        const value = convert(change.doc, ...args);

        switch (change.type) {
          case "added":
            snapshots = [...snapshots, value];
            break;
          case "modified":
            // sometimes, Firestore considers a new record modified if all the content is identical, besides one field (f.e. when sending multiple times the same message)
            // so we need to make sure that we update our existing record only if it exists, otherwise we need to add it
            const valIndex = snapshots.findIndex((s) => s.id === value.id);
            if (valIndex === -1) {
              snapshots = [...snapshots, value];
            } else {
              snapshots = [
                ...snapshots.slice(0, valIndex),
                value,
                ...snapshots.slice(valIndex + 1),
              ];
            }
            break;
          case "removed":
            snapshots = snapshots.filter((v) => v.id !== value.id);
            break;
        }
      }

      setValues(snapshots);
    });

    return () => unsubscribe();
  }, [args]);

  return [values, setValues] as const;
}
