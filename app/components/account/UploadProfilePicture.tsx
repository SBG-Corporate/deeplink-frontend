import React, { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop';
import { UploadOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardMedia, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import getCroppedImg from '/app/utils/api/uploadImages';

interface Props {
  openUploadProfilePicture: boolean;
  handleUploadProfilePictureClose: () => void;
  onFilesSelectedMainImage: (file: Blob) => void;
  onDeleteImage: (img: string) => void;
  profileImage: string;
}

const UploadProfilePicture: React.FC<Props> = ({ openUploadProfilePicture, handleUploadProfilePictureClose, onFilesSelectedMainImage, onDeleteImage, profileImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      setIsUploading(true)
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (typeof croppedImage === 'string') {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        onFilesSelectedMainImage(blob); // Pass the blob here
        setIsUploading(false)
        handleUploadProfilePictureClose()
      } else {
        setIsUploading(false)
        throw new Error('Cropped image URL is not a string');
      }
    } catch (e) {
      setIsUploading(false)
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onFilesSelectedMainImage]);


  return (
    <Dialog
      maxWidth="lg"
      open={openUploadProfilePicture}
      onClose={handleUploadProfilePictureClose}
      PaperProps={{ style: { borderRadius: "20px" } }}
    >
      <DialogContent sx={{ minWidth: "600px" }}>
        <Typography variant='h5' textAlign={"center"}>
          Change the profile picture
        </Typography>
        <Button color='primary' fullWidth startIcon={<UploadOutlined />} sx={{ marginTop: "15px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} onClick={() => fileInputRef.current?.click()}>
          {imageSrc ? "Upload another image" : "Upload an image"}
        </Button>
        <input ref={fileInputRef} type='file' multiple accept='image/png, image/gif, image/jpeg, image/jpg' style={{ display: 'none' }} onChange={onSelectFile} />
        {imageSrc && (
          <Box position="relative" height={400} width="100%" marginTop={2}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </Box>
        )}
        {croppedImageUrl && (
          <Grid container spacing={2}>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <Card>
                <CardMedia component='img' className='fadeIn' image={croppedImageUrl} alt='Cropped Image' />
                <CardActions>
                  <Button fullWidth color='error' onClick={() => onDeleteImage(croppedImageUrl)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: "10px", display: 'flex', justifyContent: 'center', backgroundColor: "#f7f7f7" }}>
        {imageSrc && (
          <Button
            color='primary'
            // variant={"contained"}
            onClick={showCroppedImage}
            disabled={isUploading}
            sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
          >
            Update
          </Button>
        )}
        <Button
          onClick={handleUploadProfilePictureClose}
          sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", bgcolor: "#FFDFDF", "&:hover": { backgroundColor: "#FFBFBF" }, }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UploadProfilePicture