import { Friend, User } from "/app/interfaces";

export interface UserState {
  isLogged: boolean;
  pageType: string;
  themeMode: string;
  user: User | null;
  token: string | null;
  tokenExpire: number | null;
  friendsListInfo: Friend[];
  selectedUser: User | null;
}
