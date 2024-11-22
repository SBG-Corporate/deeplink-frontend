import { FC } from "react";
import Dropzone, { DropzoneState, DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "app/components/common/FlexBetween";
interface DropzoneComponentProps {
  setFieldValue: (field: string, value: any) => void;
  values: any;
  palette: { primary: { main: string } };
}

export const DropzoneComponent: FC<DropzoneComponentProps> = ({
  setFieldValue,
  values,
  palette,
}) => {
  return (
    <Dropzone
      acceptedFiles=".jpg,.jpeg,.png"
      multiple={false}
      onDrop={(acceptedFiles) =>
        setFieldValue("picture", acceptedFiles[0]) // assigns acceptedFiles[0] to values.picture
      }
    >
      {({ getRootProps, getInputProps }: DropzoneState) => (
        <Box
          {...(getRootProps() as DropzoneRootProps)}
          border={`2px dashed ${palette.primary.main}`}
          p="1rem"
          sx={{ "&:hover": { cursor: "pointer" } }}
        >
          <input {...(getInputProps() as DropzoneInputProps)} />
          {!values.picture ? (
            <p>Add Picture Here</p>
          ) : (
            <FlexBetween>
              <Typography>{values.picture.name}</Typography>
              <EditOutlinedIcon />
            </FlexBetween>
          )}
        </Box>
      )}
    </Dropzone>
  );
};