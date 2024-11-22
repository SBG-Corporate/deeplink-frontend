import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { messagesReducer, MessagesContext } from './';
import { AllAlias, AllAliasApi, AllProfilePictures, IMessageParsed, IMessageParsedWithSeen } from '/app/interfaces';
import { getAllMessagesApi } from '/app/utils/api/apiMessages';
import { useSelector } from 'react-redux';
import { getAllAlias } from '/app/utils/api/apiUsuarios';
import { parseAllAliasAndProfilePictures } from '/app/utils/api/usuariosUtils';
import { User } from '/app/interfaces';

export interface MessagesState {
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
}

const MESSAGES_INITIAL_STATE: MessagesState = {
    isLoadingMessages: false,
    messagesRaw: [],
    messagesDirect: [],
    messagesPosts: [],
    messagesPostsTrending: [],
    messagesNews: [],
    messagesNewsWithNotValidated: [],
    messagesShort: [],
    messagesNotifications: [],
    messagesNotificationsWithNotEnabled: [],
    messagesNotificationWithSeen: [],
    notViewsInMessagesDirect: [],
    allAlias: {},
    allProfilePictures: {},
}

interface Props {
    children: React.ReactNode;
}

export const MessagesProvider: FC<Props> = ({ children }) => {
    const token = useSelector((state: any) => state.persisted?.token) || null;
    const user: User = useSelector((state: any) => state.persisted?.user);
    const [updatePosts, setUpdatePosts] = useState(false);
    const [state, dispatch] = useReducer(messagesReducer, MESSAGES_INITIAL_STATE);

    // const filterMessagesBy = (category: string) => {
    //     const filtered = state.messages.filter(message => message.category === category);
    //     dispatch({ type: '[MESSAGES] - SetFilteredMessages', payload: filtered });
    // };

    // const setSelectedFilter = (category: string) => {
    //     dispatch({ type: '[MESSAGES] - setSelectedFilter', payload: category });
    // }

    // const setSelectedMessage = (message: IMessageParsed) => {
    //     dispatch({ type: '[MESSAGES] - SetSelectedMessage', payload: message });
    // }

    const SetMessagesDirect = (messages: IMessageParsed[]) => {
        dispatch({ type: '[MESSAGES] - SetMessagesDirect', payload: messages });
    }

    const getAndParseMessages = useCallback(async () => {
        if (token === null) return;
        dispatch({ type: '[MESSAGES] - SetLoading', payload: true });

        try {
            const { status: statusGetAllMessages, data: dataGetAllMessages } = await getAllMessagesApi(token);
            if (statusGetAllMessages !== 200) {
                console.log("error in api when getAllMessagesApi")
                return
            }
            // Order from newer to older
            dataGetAllMessages.sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime());
            const messagesRaw: IMessageParsed[] = dataGetAllMessages;
            const messagesDirect = messagesRaw
                .filter((message) => message.tipo === "directo")
                .sort((a: any, b: any) => new Date(a.created).getTime() - new Date(b.created).getTime());
            const messagesPosts = messagesRaw.filter((message) => message.tipo === "post");
            const messagesNews = messagesRaw.filter((message) => message.tipo === "noticia" && (message.articleData.isValidated ? true : message.id_user === user._id ? true : false));
            const messagesNewsWithNotValidated = messagesRaw.filter((message) => message.tipo === "noticia");
            const messagesShort = messagesRaw.filter((message) => message.tipo === "corto");
            const messagesNotifications = messagesRaw.filter((message) => message.tipo === "notificacion" && message.notificationsData.isEnabled);
            const messagesNotificationsWithNotEnabled = messagesRaw.filter((message) => message.tipo === "notificacion");
            const messagesNotificationWithSeen = messagesNotifications.map((notification) => {
                return (
                    { ...notification, isSeen: notification.notificationsData.openedBy.includes(user._id) }
                )
            })

            dispatch({
                type: '[MESSAGES] - SetAllMessages',
                payload: { messagesRaw, messagesDirect, messagesPosts, messagesNews, messagesShort, messagesNewsWithNotValidated, messagesNotifications, messagesNotificationsWithNotEnabled, messagesNotificationWithSeen },
            });
            const { status: statusGetAllAlias, data: dataAllAliasApi } = await getAllAlias({ token })
            const { allAlias, allProfilePictures } = parseAllAliasAndProfilePictures(dataAllAliasApi)

            if (statusGetAllAlias !== 200) {
                console.log("error in api when getAllAlias")
                return
            }
            dispatch({ type: '[ALIAS] - SetAllAlias', payload: allAlias });
            dispatch({ type: '[ALIAS] - SetAllProfilePictures', payload: allProfilePictures });

            const messagesPostsWithAlias = messagesPosts.map((post: any) => {
                const alias = (allAlias as any)[post.id_user]
                return { ...post, alias };
            })
            dispatch({ type: '[MESSAGES] - SetMessagesPosts', payload: messagesPostsWithAlias });

            const messagesPostsWithAliasTrending = [...messagesPostsWithAlias]
            messagesPostsWithAliasTrending.sort((a, b) => b.likes.length - a.likes.length);
            dispatch({ type: '[MESSAGES] - SetMessagesPostsTrending', payload: messagesPostsWithAliasTrending });

            const notViewsInMessagesDirect: string[] = []
            messagesDirect.forEach((message) => {
                if (!message.views.includes(user._id)) {
                    notViewsInMessagesDirect.push(message.destinatario === user._id ? message.id_user : message.destinatario ? message.destinatario : "")
                }
            })
            dispatch({ type: '[MESSAGES] - SetNotViewsInMessagesDirect', payload: notViewsInMessagesDirect });
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            dispatch({ type: '[MESSAGES] - SetLoading', payload: false });
        }
    }, [token]);

    useEffect(() => {
        getAndParseMessages();
    }, [getAndParseMessages, updatePosts]);

    const toggleUpdateMessages = () => {
        setUpdatePosts(prev => !prev);
    };

    // useEffect(() => {

    //     if (state.selectedFilter === "news") {
    //         dispatch({ type: '[MESSAGES] - SetFilteredMessages', payload: state.messages });
    //         return
    //     }

    //     const filterMessages = messages.filter(message => message.category === state.selectedFilter);

    //     dispatch({ type: '[MESSAGES] - SetFilteredMessages', payload: filterMessages });
    // }, [state.messages, state.selectedFilter]);

    return (
        <MessagesContext.Provider value={{
            ...state,
            SetMessagesDirect,
            toggleUpdateMessages
        }}>
            {children}
        </MessagesContext.Provider>
    )
};
