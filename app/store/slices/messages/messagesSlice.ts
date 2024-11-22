import { createSlice } from '@reduxjs/toolkit';
import { MessagesState } from './types';

const initialState: MessagesState = {
  allChats: [],
  selectedChat: { friendId: "", participants: [], messages: [], created: 0 },
  receiver: null,
  allGroups: [],
  selectedGroup: null,
  filteredGroups: [],
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setAllChats: (state, action) => {
      state.allChats = action.payload.allChats;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload.selectedChat;
    },
    setReceiver: (state, action) => {
      state.receiver = action.payload.receiver;
    },
    setAllGroups: (state, action) => {
      state.allGroups = action.payload.allGroups;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload.selectedGroup;
    },
    setFilteredGroups: (state, action) => {
      state.filteredGroups = action.payload.filteredGroups;
    },
    setLogOutMessages: (state) => {
      state.allChats = [];
      state.selectedChat = { friendId: "", participants: [], messages: [], created: 0 };
      state.receiver = null;
      state.allGroups = [];
      state.selectedGroup = null;
    },
  }
});

export const {
  setAllChats,
  setSelectedChat,
  setReceiver,
  setAllGroups,
  setSelectedGroup,
  setLogOutMessages,
  setFilteredGroups,
} = messagesSlice.actions;