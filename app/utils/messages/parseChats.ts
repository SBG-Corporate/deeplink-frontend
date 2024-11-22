import { AllAlias, IChat, IMessage, IMessageParsed, IParticipant, IProfilePictures } from "/app/interfaces";

export const getUserChats = ({ userId, allChats }: { userId: string, allChats: IChat[] }) => {
  const userChats: IChat[] = allChats.filter(chat =>
    chat.participants.some(participant => participant._id === userId)
  );
  return userChats
};

export const getFriendsIdsWithChats = ({ userId, userChats }: { userId: string, userChats: IChat[] }) => {
  let friendsWithChat: string[] = [];
  userChats.forEach(chat => {
    chat.participants.forEach(participant => {
      if (participant._id !== userId) {
        friendsWithChat.push(participant._id);
      }
    });
  });
  friendsWithChat = Array.from(new Set(friendsWithChat));
  return friendsWithChat
}

export const createAllChatsParsed = (allMessagesParsed: IMessageParsed[], allAlias: AllAlias, allProfilePictures: IProfilePictures, userId: string): IChat[] => {
  const chatsMap: { [chatId: string]: IMessage[] } = {};
  allMessagesParsed.forEach(messageParsed => {
    const senderId = messageParsed.id_user;
    const receiverId = messageParsed.destinatario || 'unknown';
    let friendId = ""
    if (messageParsed.id_user === userId) { friendId = messageParsed.destinatario! }
    else { friendId = messageParsed.id_user }

    if (!chatsMap[friendId]) {
      chatsMap[friendId] = [];
    }

    const message: IMessage = {
      _id: messageParsed._id,
      sender: {
        _id: senderId,
        alias: allAlias[senderId],
        profilePicture: allProfilePictures[senderId],
      },
      receiver: {
        _id: receiverId,
        alias: allAlias[receiverId] || '',
        profilePicture: allProfilePictures[receiverId] || '',
      },
      message: messageParsed.msg,
      father: messageParsed.padre,
      created: messageParsed.created,
      edited: messageParsed.edited
    };

    chatsMap[friendId].push(message);
  });

  // Convert chatsMap to array of IChat
  const allChatsParsed: IChat[] = Object.entries(chatsMap).map(([friendId, messages]) => {
    return {
      friendId: friendId,
      participants: [
        {
          _id: userId,
          alias: allAlias[userId],
          profilePicture: allProfilePictures[userId],
          type: "user",
        },
        {
          _id: friendId,
          alias: allAlias[friendId] || '',
          profilePicture: allProfilePictures[friendId] || '',
          type: "friend",
        },
      ],
      messages: messages,
      created: messages[0].created,
    };
  });
  return allChatsParsed;
};


export const createAllMessagesParsed = (allChatsRaw: IMessageParsed[], allAlias: AllAlias, allProfilePictures: IProfilePictures): IMessageParsed[] => {
  const allMessagesParsed = allChatsRaw.map((message: IMessageParsed) => {

    const participantSender: IParticipant = {
      _id: message.id_user,
      alias: allAlias[message.id_user],
      profilePicture: allProfilePictures[message.id_user],
      type: "user"
    }

    let participantReceiver: IParticipant;
    if (message.destinatario) {
      participantReceiver = {
        _id: message.destinatario,
        alias: allAlias[message.destinatario],
        profilePicture: allProfilePictures[message.destinatario],
        type: "friend"
      }
    } else {
      participantReceiver = {
        _id: "",
        alias: "",
        profilePicture: "",
        type: "friend"
      }
    }

    const messageParsed: IMessageParsed = {
      ...message,
      participants: [participantSender, participantReceiver]
    }
    return messageParsed;
  });
  return allMessagesParsed
}