import { User } from "./entities";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Conversations: undefined;
  Chat: ChatStackParamList;
};

export type ChatStackParamList = {
  conversationId: string;
  participants: User[];
};
