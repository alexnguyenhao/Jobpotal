import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  loading: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      if (!Array.isArray(state.messages)) {
        state.messages = [];
      }
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetConversationState: (state) => {
      state.selectedConversation = null;
      state.messages = [];
      state.conversations = [];
    },
    updateSidebarOnNewMessage: (state, action) => {
      const { newMessage, currentUserId, isViewed } = action.payload;

      const index = state.conversations.findIndex(
        (c) =>
          (c.conversationId &&
            c.conversationId === newMessage.conversationId) ||
          (c.jobId && c.jobId === newMessage.job) ||
          (c.applicationId && c.applicationId === newMessage.application) ||
          c._id === newMessage.senderId ||
          c._id === newMessage.receiverId
      );

      if (index !== -1) {
        const updatedConv = { ...state.conversations[index] };

        if (!isViewed && newMessage.senderId !== currentUserId) {
          updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
        }
        if (isViewed) {
          updatedConv.unreadCount = 0;
        }

        updatedConv.lastMessage = newMessage.message;
        updatedConv.updatedAt =
          newMessage.createdAt || new Date().toISOString();

        state.conversations.splice(index, 1);
        state.conversations.unshift(updatedConv);
      }
    },

    markMessagesAsReadInStore: (state, action) => {
      const targetId = action.payload;
      const index = state.conversations.findIndex(
        (c) => c.conversationId === targetId || c._id === targetId
      );
      if (index !== -1) {
        state.conversations[index].unreadCount = 0;
      }
    },
  },
});

export const {
  setConversations,
  setSelectedConversation,
  setMessages,
  addMessage,
  setLoading,
  resetConversationState,
  updateSidebarOnNewMessage,
  markMessagesAsReadInStore,
} = conversationSlice.actions;

export default conversationSlice.reducer;
