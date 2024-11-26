type FSTimestamp = {
  nanoseconds: number;
  seconds: number;
};

export type FSMessage = {
  sender_id: string;
  conversation_id: string;
  content: string;
  timestamp: FSTimestamp;
};

export type FSUser = {
  email: string;
  display_name: string;
};

export type FSConversation = {
  participants: string[];
};
