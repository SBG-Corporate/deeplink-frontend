import { CommentApi, GroupsCommentApi, IGroupMessages, SubCommentApi } from "/app/interfaces";

export const addAliasAndProfilePicturesToCommentsAndSubComments = (comments: CommentApi[], allAlias: Record<string, string>, allProfilePictures: Record<string, string>) => {
  return comments.map((comment: CommentApi) => ({
    ...comment,
    alias: allAlias[comment.id_user],
    profilePicture: allProfilePictures[comment.id_user],
    subComments: comment.subComments.map((subComment: SubCommentApi) => ({
      ...subComment,
      alias: allAlias[subComment.id_user],
      profilePicture: allProfilePictures[subComment.id_user]
    }))
  }));
};

export const addAliasAndProfilePicturesToCommentsInGroups = (messages: IGroupMessages[], allAlias: Record<string, string>, allProfilePictures: Record<string, string>) => {
  return messages.map((message: IGroupMessages) => ({
    ...message,
    alias: allAlias[message.id_user],
    profilePicture: allProfilePictures[message.id_user],
    comments: message.comments.map((comment: GroupsCommentApi) => ({
      ...comment,
      alias: allAlias[comment.id_user],
      profilePicture: allProfilePictures[comment.id_user]
    }))
  }));
};