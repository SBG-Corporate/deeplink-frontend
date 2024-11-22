import React from "react";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import PopupEmailSent from "app/components/register/PopupEmailSent";
import { apiLogin } from "/app/utils/api/apiUsuarios";
import { MyPalette } from '/app/themes/types';


const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  // password: yup.string().required("required"),
});

interface InitalValuesLogin {
  email: string,
  password: string,
}

const initialValuesLogin: InitalValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const { palette } = useTheme<MyPalette>();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [openPopup, setOpenPopup] = React.useState(false);
  const [popupMessage, setpopupMessage] = React.useState("");
  const [link, setLink] = React.useState("");

  const handleClickPopupOpen = () => {
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };


  const login = async (
    values: InitalValuesLogin,
    onSubmitProps: FormikHelpers<InitalValuesLogin>
  ) => {

    let response;
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "develop") {
      response = await apiLogin(values.email, "es", true)
    } else {
      response = await apiLogin(values.email, "es", false)
    }

    if (response.status === 429) {
      toast.error("You have to wait 1 minute to request another login email.");
      return
    }

    else if (response.status === 200 || response.status === 201) {
      handleClickPopupOpen()
      setpopupMessage("You can access the website from the link sent to your email address.")
      toast.success("email sent")
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = response.data.data.match(urlRegex);
      setLink(match[0])
      return

    } else {
      toast.error("Error whith the server response, please try again or contact with the administrator.");
      console.log("error in response, status error: ", response);
    }
  };


  const handleFormSubmit = async (
    values: InitalValuesLogin,
    onSubmitProps: FormikHelpers<InitalValuesLogin>
  ) => {
    values.password = "testpass"
    await login(values, onSubmitProps);
  };


  return (
    <Box
      width={isNonMobileScreens ? "50%" : "93%"}
      p="2rem"
      m="2rem auto"
      borderRadius="1.5rem"
    >
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesLogin}
        validationSchema={loginSchema}
      >
        {({
          // Estos valores son los que permite usar formik
          values,
          errors,
          touched, // mira si ha sido tocado
          handleBlur,
          handleChange,
          handleSubmit, // ejecuta el onSubmit de arriba
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              {/* <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              /> */}
            </Box>
            <Box>

              <Button
                fullWidth
                type="submit" // esto va a lanzar lo que va en onSubmit del <form> que en este caso es handleFormSubmit
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.paper,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                LOGIN
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <PopupEmailSent
        openPopup={openPopup}
        popupMessage={popupMessage}
        link={link}
        handlePopupClose={handlePopupClose}
      />
    </Box>

  );
};

export default Form;
