

import { createContext } from 'react';
import { AllAlias, AllProfilePictures, IMessageParsed, IMessageParsedWithSeen } from '../../interfaces';


interface ContextProps {
    isLoadingMessages: boolean;
    messagesRaw: IMessageParsed[];
    messagesDirect: IMessageParsed[];
    messagesPosts: IMessageParsed[];
    messagesPostsTrending: IMessageParsed[];
    messagesNews: IMessageParsed[];
    messagesNewsWithNotValidated: IMessageParsed[];
    messagesShort: IMessageParsed[];
    messagesNotifications: IMessageParsed[];
    messagesNotificationsWithNotEnabled: IMessageParsed[];
    messagesNotificationWithSeen: IMessageParsedWithSeen[];
    notViewsInMessagesDirect: string[];

    allAlias: AllAlias;
    allProfilePictures: AllProfilePictures;

    // setMessages: (messages: IMessageParsed[]) => void;
    // setSelectedMessage: (message: IMessageParsed) => void;
    SetMessagesDirect: (message: IMessageParsed[]) => void;
    toggleUpdateMessages: () => void;
}

export const MessagesContext = createContext({} as ContextProps);