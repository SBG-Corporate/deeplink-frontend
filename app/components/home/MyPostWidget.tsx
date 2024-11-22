import React, { useCallback, useContext } from "react";
import { EditOutlined, DeleteOutlined, ImageOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "app/components/common/UserImage";
import WidgetWrapper from "app/components/common/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyPalette } from "/app/themes/types"
import { toast } from "react-hot-toast";
import { apiUploadImage } from "/app/utils/api/apiUtils";
import { apiCreatePost } from "/app/utils/api/apiMessages";
import { MessagesContext } from "/app/context/messages";
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { ApiFile } from "/app/interfaces";

interface Props {
  profilePicture?: string;
}

const MyPostWidget: React.FC<Props> = ({ profilePicture = "" }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme<MyPalette>();
  const { estado, alias } = useSelector((state: any) => state.persisted.user) || {};
  const token = useSelector((state: any) => state.persisted.token) || {};
  const { toggleUpdateMessages } = useContext(MessagesContext);
  const themeMode = useSelector((state: any) => state.persisted.themeMode);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const dark = palette.neutral.dark;
  const background = palette.background.default;
  const lightDark = palette.background.lightDark;

  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [postText, setPostText] = useState("");
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
  const [uploadedImageData, setUploadedImageData] = useState<ApiFile>({
    fileId: "",
    userId: "",
    originalName: "",
    mimeType: "",
    url: "",
    created: 0,
    lastModified: "",
    size: 0,
  });

  function handleEmojiClick(emojiData: any, event: any) {
    setPostText(prev => prev + emojiData.emoji);
    setEmojiMenuVisible(false);
  }
  const handleOpenEmoji = (event: any) => {
    setEmojiMenuVisible(!emojiMenuVisible)
    const { clientX, clientY } = event;
    setBoxPosition({ x: clientX, y: clientY });
    setEmojiMenuVisible(!emojiMenuVisible);
  };

  const handlePost = useCallback(async () => {
    if (estado === 0) {
      toast.error("You must be registered to publish");
      return;
    }
    if (postText.length > 1000) {
      toast.error("The message can only include a maximum of 1000 characters.")
      return
    }
    const files = image !== null ? [uploadedImageData.fileId] : [];
    const { status, data } = await apiCreatePost({ message: postText, token, files });

    if (status !== 200 && status !== 201) {
      toast.error("Error when uploading post, please contact with the admin");
      return;
    }
    setImage(null);
    setPostText("");
    toggleUpdateMessages();
  }, [estado, image, uploadedImageData, postText, alias, token, dispatch, toggleUpdateMessages]);

  const uploadImage = async (image: File) => {
    if (estado === 0) {
      toast.error("You must be registered to publish")
      return
    }
    toast("Please wait, uploading image...")
    const fileName = `/postImages/${uuidv4()}`
    const { status, data } = await apiUploadImage(image, token, fileName)
    if (status === 200 || status === 201) {
      toast.success("Image uploaded")
      setUploadedImageData(data)
      return;
    }
    if (status === 413) { toast.error("The image size is too large"); return }
    if (status !== 200 && status !== 201 && status !== 413) { toast.error("Error when uploading the image, please contact with the admin"); return }
  }

  return (
    <WidgetWrapper>
      <FlexBetween >
        <UserImage image={profilePicture} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPostText(e.target.value)}
          value={postText}
          multiline
          maxRows={20}
          sx={{
            width: "85%",
            backgroundColor: palette.greyscale.ultraLight,
            borderRadius: "30px",
            padding: "15px 30px",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              uploadImage(acceptedFiles[0])
              setImage(acceptedFiles[0])
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Choose or drag an image here.</p>
                  ) : (
                    <FlexBetween>

                      {uploadedImageData.url === "" ?
                        <Typography>{image.name}</Typography>
                        :
                        <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                          <img src={uploadedImageData.url} width={200} />
                        </Box>
                      }
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <Box marginLeft={"20px"} display={"flex"} gap="0.25rem"  >
          <Box display={"flex"} onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </Box>
          <Box display={"flex"} onClick={(event: any) => handleOpenEmoji(event)} sx={{ marginLeft: "30px", ":hover": { cursor: 'pointer' } }}>
            <SentimentVerySatisfiedIcon
              sx={{ color: '#707277', }}
            />
            <Typography marginLeft={"6px"} color={"#707277"}>Emoji</Typography>
          </Box>
        </Box>

        <Box marginRight={"20px"} display={"flex"}>
          {postText.length !== 0 &&
            <Box marginRight={"10px"} position="relative" display="flex" flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
              <CircularProgress
                variant="determinate"
                value={(postText.length / 1000) * 100}
                size={16}
                thickness={5}
                sx={{
                  color: palette.primary.main,
                }}
              />
              <Typography
                variant="caption"
                component="div"
                color="textSecondary"
              >
                <span style={{ color: postText.length > 1000 ? "red" : dark }}>{postText.length}</span>/1000
              </Typography>
            </Box>
          }

          <Button
            onClick={handlePost}
            sx={{
              padding: "5px 20px",
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              borderRadius: "20px",
              color: dark,
              bgcolor: background,
              "&:hover": {
                bgcolor: lightDark,
              },
            }}
          >
            POST
          </Button>

          {emojiMenuVisible &&
            <Box
              sx={{
                position: 'fixed',
                top: `calc(${boxPosition.y}px + 10px) `,
                right: `calc(100vw - ${boxPosition.x}px - 20px)`,
                zIndex: 40,
              }}
            >
              <EmojiPicker
                onEmojiClick={(emojiData: any, event: any) => handleEmojiClick(emojiData, event)}
                theme={themeMode === "dark" ? Theme.DARK : Theme.LIGHT}
                emojiStyle={EmojiStyle.GOOGLE}
              />
            </Box>
          }
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
