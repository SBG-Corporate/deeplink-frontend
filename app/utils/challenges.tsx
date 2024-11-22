import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddchartIcon from '@mui/icons-material/Addchart';

export const getIconFromChallenge = (type: string, fontSize = 50) => {
  let icon = <AddchartIcon style={{ fontSize }} />;
  if (type === "likesInPostsGiven" || type === "likesInArticlesGiven" || type === "likesInCommentsGiven" || type === "totalLikesGiven") {
    icon = <FavoriteIcon style={{ fontSize }} />;
  }
  if (type === "likesInPostsReceived" || type === "likesInArticlesReceived" || type === "likesInCommentsReceived" || type === "totalLikesReceived") {
    icon = <FavoriteBorderIcon style={{ fontSize }} />;
  }
  if (type === "commentsInPostsGiven" || type === "commentsInArticlesGiven" || type === "totalCommentsGiven") {
    icon = <AddCommentIcon style={{ fontSize }} />;
  }
  if (type === "commentsInPostsReceived" || type === "commentsInArticlesReceived" || type === "totalCommentsReceived") {
    icon = <ChatBubbleOutlineIcon style={{ fontSize }} />;
  }
  if (type === "viewsInPosts" || type === "viewsInArticles") {
    icon = <VisibilityIcon style={{ fontSize }} />;
  }
  if (type === "following" || type === "followers") {
    icon = <PersonAddAlt1Icon style={{ fontSize }} />;
  }
  if (type === "totalPosts" || type === "totalArticles") {
    icon = <DriveFileRenameOutlineIcon style={{ fontSize }} />;
  }
  return icon
};