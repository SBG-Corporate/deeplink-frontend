import { FC, useRef, useState } from "react";
import { Box, Button, Card, CardActions, CardMedia, CircularProgress, FormLabel, Grid, Typography } from "@mui/material";
import { UploadOutlined } from '@mui/icons-material';

interface Props {
  onFilesSelectedMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (img: any) => void;
  getValues: any;
  text?: string;
}

export const UploadImages: FC<Props> = ({ onFilesSelectedMainImage, onDeleteImage, getValues, text = "Upload main image (only one)" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    await onFilesSelectedMainImage(e);
    setIsUploading(false);
  };

  return (
    <Box display='flex' flexDirection="column" marginBottom={"30px"}
      sx={{
        padding: "10px",
        border: "solid #bbbbbb 1px",
        borderRadius: "5px",
        ":hover": {
          border: "solid black 1px"
        }
      }}
    >
      <FormLabel sx={{ mb: 1 }}>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography>{text}</Typography>
        </Box>
      </FormLabel>
      {isUploading &&
        <Box margin={"20px 0"} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
          <Typography sx={{ mb: 1 }} fontWeight={400} fontSize={16}>Uploading image...</Typography>
          <CircularProgress thickness={4} size={22} />
        </Box>
      }
      {getValues('mainImageUrl') === "" &&
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            color="primary"
            startIcon={<UploadOutlined />}
            sx={{ width: "200px", mb: 1, boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept='image/png, image/gif, image/jpeg, image/jpg'
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>
      }
      {getValues('mainImageUrl') !== "" &&
        <Grid container spacing={2}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Card>
              <CardMedia
                component='img'
                className='fadeIn'
                image={getValues('mainImageUrl')}
                alt={getValues('mainImageUrl')}
              />
              <CardActions>
                <Button
                  fullWidth
                  color="error"
                  onClick={() => onDeleteImage(getValues('mainImageUrl'))}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      }
    </Box>
  );
}