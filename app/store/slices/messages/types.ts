import { IChat, IParticipant } from "/app/interfaces";
import { IGroup } from "/app/interfaces/Groups";

export interface MessagesState {
  allChats: IChat[];
  selectedChat: IChat | null;
  receiver: IParticipant | null;
  allGroups: IGroup[];
  selectedGroup: IGroup | null;
  filteredGroups: IGroup[];
}
