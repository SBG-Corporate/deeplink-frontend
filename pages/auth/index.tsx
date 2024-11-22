import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Box, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import { setLogin, setToken, setPageType } from "app/store/slices/user/userSlice";
import { apiAuth } from "app/utils/api/apiUsuarios";
import { parseUser } from "/app/utils/api/parseApiData";


const HomePage = () => {
  const isLogged = useSelector((state: any) => state.persisted?.isLogged);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isLogged) {
      dispatch(
        setPageType({
          pageType: "home",
        })
      );
    }
  }, []);

  const doAuthentication = async () => {
    const { query } = router;
    const response = await apiAuth(query.email, query.token)
    if (response.status === 200 || response.status === 201) {
      dispatch(
        setToken({
          token: response.data.token,
          tokenExpire: response.data.expire
        })
      );
      const parsedUser = parseUser(response.data.account)

      dispatch(
        setLogin({
          user: parsedUser,
          token: response.data.token,
          tokenExpire: response.data.expire,
        })
      );

      if (response.data.account.estado === 0) router.push("/user")
      if (response.data.account.estado === 1) router.push("/user")

    }
    else if (response.status === 401) {
      toast("Your email link has expired, please login again")
      router.push("/newregister")
    }
    else if (response.status === 500) { router.push("/404/server-error") }
    else { router.push("/404") }
  }

  useEffect(() => {
    if (!router.isReady) return
    doAuthentication();
  }, [router.isReady])


  if (!isLogged) return

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // This makes it centered vertically, adjust as needed
        }}
      >
        <CircularProgress />
        <Typography mt={2}>Checking the user...</Typography>
      </Box>
    </>

  );
};

export default HomePage;
