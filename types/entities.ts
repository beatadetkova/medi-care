type ID = { id: string };

export type Message = ID & {
  senderId: string;
  conversationId: string;
  content: string;
  timestamp: number;
};
export type User = ID & {
  email: string;
  displayName: string;
};
export type Conversation = ID & {
  participants: User[];
};
