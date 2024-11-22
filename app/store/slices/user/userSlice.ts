import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { UserState } from "./types"

const initialState: UserState = {
  isLogged: false,
  pageType: '',
  themeMode: "light",
  user: null,
  token: null,
  tokenExpire: null,
  friendsListInfo: [],
  selectedUser: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setPageType: (state, action) => {
      state.pageType = action.payload.pageType;
    },
    setThemeMode: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.tokenExpire = action.payload.tokenExpire;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setUserChallengesCompleted: (state, action) => {
      if (state.user !== null) {
        state.user.challengesCompleted = action.payload.challengesCompleted;
        state.user.saldo += action.payload.earnedLinks
      }
    },
    setUserFavoriteArticles: (state, action) => {
      if (state.user !== null) {
        state.user.favoriteArticles = action.payload.favoriteArticles;
      }
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpire = action.payload.tokenExpire;
      state.isLogged = true;
    },
    setRegister: (state, action) => {
      if (state.user) {
        state.user.nombre = action.payload.nombre;
        state.user.alias = action.payload.alias;
        state.user.estado = action.payload.estado;
        state.user.profilePicture = action.payload.profilePicture;
        state.user.saldo = action.payload.saldo;
      }
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLogged = false;
      state.friendsListInfo = [];
      state.themeMode = "light"
    },
    setFriends: (state, action: PayloadAction<{ friendsIds: [] }>) => {
      if (state.user) {
        state.user.friendsIds = action.payload.friendsIds;
      } else {
        console.error("user friendsIds non-existent :(");
      }
    },
    setFriendsListInfo: (state, action) => {
      state.friendsListInfo = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload.selectedUser;
    },
  },
});

export const {
  setThemeMode,
  setPageType,
  setUser,
  setUserChallengesCompleted,
  setUserFavoriteArticles,
  setToken,
  setLogin,
  setRegister,
  setLogout,
  setFriends,
  setFriendsListInfo,
  setSelectedUser,
} =
  userSlice.actions;
