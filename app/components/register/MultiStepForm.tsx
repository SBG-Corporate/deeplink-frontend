import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import SendIcon from '@mui/icons-material/Send';
import { Button } from '@mui/material';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import FlexBetween from "app/components/common/FlexBetween";
import Center from "app/components/common/Center";
import { OldRegisterUser } from "/app/interfaces";
import { apiPatch, checkIfAliasExist, apiAddTokens } from "../../utils/api/apiUsuarios";
import PopupEmailSent from "app/components/register/PopupEmailSent";
import { setRegister } from "/app/store/slices/user/userSlice";

function MultiStepForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { _id } = useSelector((state: any) => state.persisted?.user);
  const token = useSelector((state: any) => state.persisted?.token);

  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<OldRegisterUser>({
    firstName: "",
    lastName: "",
    userType: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
  });
  const [openPopup, setOpenPopup] = useState(false);

  const handlePopupClose = () => { setOpenPopup(false); };

  const register = async (formDataInput: OldRegisterUser) => {
    const response = await apiPatch({ alias: formDataInput.firstName, nombre: formDataInput.lastName, token: token })
    const { status, data } = await apiAddTokens({ saldo: 10, userId: _id, token })
    if (response.status === 200) {
      dispatch(
        setRegister({
          alias: response.data.alias,
          nombre: response.data.nombre,
          estado: response.data.estado,
          profilePicture: response.data.fotoPerfil,
          saldo: 10,
        })
      );
      toast.success("You have earned 10 LINKS for successfully finishing the registration")
      router.push("/user").then(() => router.reload());
    }
    else if (response.status === 401) {
      toast("Your session has expired, please login again")
      router.push("/login")
    }
    else if (response.status === 500) { router.push("/404/server-error") }
    else { router.push("/404") }
  }


  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return <FirstStep formData={formData} setFormData={setFormData} />;
      case 1:
        return <SecondStep formData={formData} setFormData={setFormData} />;
      // case 2:
      // <NextLink href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }} prefetch={false}></NextLink>
      // return true;
      default:
        return <FirstStep formData={formData} setFormData={setFormData} />;
    }
  };

  async function handleSubmit() {
    if (page === 0) {
      const aliasExist = await checkIfAliasExist(formData.firstName, token);
      if (aliasExist) return toast.error('Your chosen alias is already taken, please write a different one');

      if (formData.firstName === undefined) {
        return toast.error('Please enter your alias');
      } else if (formData.firstName.length <= 2) {
        return toast.error('Please enter an alias with at least 3 characters');
      } else if (formData.lastName === undefined) {
        return toast.error('Please enter your name');
      } else if (formData.lastName.length <= 2) {
        return toast.error('Please enter a name with at least 3 characters');
      } else {
        setPage(page + 1);
      }
    } else if (page === 1) {
      if (formData.userType === undefined || formData.userType === "") {
        return toast.error("Please select a user type")
      }
      formData.password = "testpass"
      await register(formData);
      // setPage(0);
      setFormData({
        firstName: "",
        lastName: "",
        userType: "",
        email: "",
        password: "",
        location: "",
        occupation: "",
        picture: "",
      });
    } else setPage(page + 1);
  }

  return (
    <>
      {conditionalComponent()}
      <Center width="20%" marginLeft={"auto"} marginRight={"auto"}>
        <FlexBetween>
          {
            page > 0 && <Button
              variant="contained"
              sx={{ marginRight: "20px" }}
              onClick={() => setPage(page - 1)}>Back</Button>
          }
          <Button
            endIcon={page === 1 && <SendIcon />}
            variant="contained"
            onClick={handleSubmit}
            sx={{ marginLeft: "20px" }}
          >
            {page === 0 ? "Next" : "Submit"}
          </Button>
        </FlexBetween>
      </Center>

      <PopupEmailSent
        openPopup={openPopup}
        popupMessage={""}
        link={""}
        handlePopupClose={handlePopupClose}
      />
    </>
  );
}
export default MultiStepForm;