import { MessagesState } from './';
import { AllAlias, AllProfilePictures, IMessageParsed, IMessageParsedWithSeen } from '/app/interfaces';

type MessagesActionType =
   { type: '[MESSAGES] - SetLoading', payload: boolean }
   | { type: '[MESSAGES] - SetAllMessages', payload: { messagesRaw: IMessageParsed[], messagesDirect: IMessageParsed[], messagesPosts: IMessageParsed[], messagesNews: IMessageParsed[], messagesShort: IMessageParsed[], messagesNewsWithNotValidated: IMessageParsed[], messagesNotifications: IMessageParsed[], messagesNotificationsWithNotEnabled: IMessageParsed[], messagesNotificationWithSeen: IMessageParsedWithSeen[] } }
   | { type: '[MESSAGES] - SetMessagesRaw', payload: IMessageParsed[] }
   | { type: '[MESSAGES] - SetMessagesDirect', payload: IMessageParsed[] }
   | { type: '[MESSAGES] - SetMessagesPosts', payload: IMessageParsed[] }
   | { type: '[MESSAGES] - SetMessagesPostsTrending', payload: IMessageParsed[] }
   | { type: '[MESSAGES] - SetNotViewsInMessagesDirect', payload: string[] }
   // | { type: '[MESSAGES] - SetFilteredPosts', payload: IMessageParsed[] }
   // | { type: '[MESSAGES] - setSelectedFilter', payload: string }
   // | { type: '[MESSAGES] - SetSelectedMessage', payload: IMessageParsed }
   | { type: '[ALIAS] - SetAllAlias', payload: AllAlias }
   | { type: '[ALIAS] - SetAllProfilePictures', payload: AllProfilePictures }

export const messagesReducer = (state: MessagesState, action: MessagesActionType): MessagesState => {

   switch (action.type) {
      case '[MESSAGES] - SetAllMessages':
         return {
            ...state,
            messagesRaw: action.payload.messagesRaw,
            messagesDirect: action.payload.messagesDirect,
            messagesPosts: action.payload.messagesPosts,
            messagesNews: action.payload.messagesNews,
            messagesNewsWithNotValidated: action.payload.messagesNewsWithNotValidated,
            messagesShort: action.payload.messagesShort,
            messagesNotifications: action.payload.messagesNotifications,
            messagesNotificationsWithNotEnabled: action.payload.messagesNotificationsWithNotEnabled,
            messagesNotificationWithSeen: action.payload.messagesNotificationWithSeen,
         };

      case '[MESSAGES] - SetMessagesRaw':
         return {
            ...state,
            messagesRaw: action.payload,
         };

      case '[MESSAGES] - SetMessagesDirect':
         return {
            ...state,
            messagesDirect: action.payload,
         };

      case '[MESSAGES] - SetMessagesPosts':
         return {
            ...state,
            messagesPosts: action.payload,
         };

      case '[MESSAGES] - SetMessagesPostsTrending':
         return {
            ...state,
            messagesPostsTrending: action.payload,
         };

      case '[MESSAGES] - SetNotViewsInMessagesDirect':
         return {
            ...state,
            notViewsInMessagesDirect: action.payload,
         };

      case '[MESSAGES] - SetLoading':
         return {
            ...state,
            isLoadingMessages: action.payload,
         };

      case '[ALIAS] - SetAllAlias':
         return {
            ...state,
            allAlias: action.payload,
         };
      case '[ALIAS] - SetAllProfilePictures':
         return {
            ...state,
            allProfilePictures: action.payload,
         };

      // case '[MESSAGES] - SetFilteredMessages':
      //    return {
      //       ...state,
      //       filteredMessages: action.payload,
      //    };

      // case '[MESSAGES] - setSelectedFilter':
      //    return {
      //       ...state,
      //       selectedFilter: action.payload,
      //    };

      // case '[MESSAGES] - SetSelectedMessage':
      //    return {
      //       ...state,
      //       selectedMessage: action.payload,
      //    };
      //? save comments from newer to older
      // const updatedPost = { ...action.payload };
      // if (updatedPost.comments) { updatedPost.comments = [...updatedPost.comments].reverse(); }
      // return {
      //    ...state,
      //    selectedPost: updatedPost,
      // };

      default:
         return state;
   }

}