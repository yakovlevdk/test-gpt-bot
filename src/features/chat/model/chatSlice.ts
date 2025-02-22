import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  provider: string;
  currency: string;
  meta: Record<string, unknown>;
  amount: number;
  status: string;
  type: string;
  plan_id: string;
  user_id: string;
  referral_id: string;
  external_id: string;
  created_at: string;
}

export interface Message {
  id?: string;
  role: string;
  type?: string;
  status?: string;
  tokens?: number;
  action_type?: string;
  user_id?: string;
  chat_id?: string;
  additional_content?: string;
  tg_bot_message_id?: string;
  disabled?: boolean;
  content: string;
  request_id?: string;
  transaction_id?: string;
  model_id?: string;
  created_at: string;
  transaction?: Transaction;
}

interface Chat {
  id: string;
  group_id: string;
  user_id: string;
  name: string;
  total_caps: number;
  highlight: string;
  model_id: string;
  created_at: string;
}

interface ChatState {
  chatList: {
    data: Chat[];
    pages: number;
  };
  selectedChatId: string | null; 
  currentChat: Chat | null;
  chatMessages: {
    data: Message[];
    pages: number;
  }; 
  currentModel: string | null;
}

const initialState: ChatState = {
  chatList: {
    data: [],
    pages: 0,
  },
  selectedChatId: null,
  currentChat: null,
  chatMessages: {
    data: [],
    pages: 0,
  },
  currentModel: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatList: (state, action: PayloadAction<{ data: Chat[]; pages: number }>) => {
      state.chatList = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chatList.data.push(action.payload);
    },
    clearChatList: (state) => {
      state.chatList = { data: [], pages: 0 };
      state.currentChat = null;
      state.chatMessages = { data: [], pages: 0 };
      state.selectedChatId = null; 
    },
    setSelectedChatId: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
      state.chatMessages = { data: [], pages: 0 };
    },
    setChatMessages: (state, action: PayloadAction<{ data: Message[]; pages: number }>) => {
      state.chatMessages = action.payload;
    },
    setCurrentModel: (state, action: PayloadAction<string>) => { 
      state.currentModel = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.chatMessages.data.unshift(action.payload);
    },
    clearChatMessages: (state) => {
      state.chatMessages = { data: [], pages: 0 };
    },
  },
});

export const { 
  setChatList, 
  addChat, 
  clearChatList, 
  setSelectedChatId, 
  setCurrentChat, 
  setChatMessages, 
  addMessage, 
  clearChatMessages,
  setCurrentModel
} = chatSlice.actions;

export default chatSlice.reducer;
