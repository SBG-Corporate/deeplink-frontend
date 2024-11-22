import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, Card, CardContent, Box, Container } from '@mui/material';
import { WebOutlined, PersonOutlineOutlined, LoginOutlined, PostAdd, ContactPageOutlined, PersonAddOutlined, LastPage } from '@mui/icons-material';
import { MainLayout } from '/app/components/layouts';
import { User } from '/app/interfaces';
import { setLogout } from '/app/store/slices/user/userSlice';
import { FullScreenOverlayLoading } from '/app/components/ui/FullScreenOverlayLoading';
import { FullScreenLoading } from '/app/components/common/FullScreenLoading';
import { CheckTokenExpiresLayout } from '/app/components/common/CheckTokenExpiresLayout';
import { ShowUsersPopup } from '/app/components/account/ShowUsersPopup';
import { setLogOutMessages } from '/app/store/slices/messages/messagesSlice';
import { AccountItems } from '/app/components/account/AccountItems';
import { AccountDashboard } from '/app/components/account/AccountDashboard';
import { AccountInfo } from '/app/components/account/AccountInfo';
import { AccountAvatarCreation } from '/app/components/account/AccountAvatarCreation';


const AccountPage = () => {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: any) => state.persisted?.themeMode);
    const user: User = useSelector((state: any) => state.persisted.user);

    const [pageState, setPageState] = useState("dashboard");
    const [isLoading, setIsLoading] = useState(false);
    const [showUsersPopup, setShowUsersPopup] = useState(false);
    const [textUsersPopup, setTextUsersPopup] = useState("");
    const [usersIdsPopup, setUsersIdsPopup] = useState<string[]>([]);

    const onLogout = () => {
        dispatch(setLogout());
        dispatch(setLogOutMessages());
    }

    const openShowUsersPopup = (text: string) => {
        setShowUsersPopup(true)
        setTextUsersPopup(text)
        if (text === "Following") { setUsersIdsPopup(user.friendsIds) }
        if (text === "Followers") { setUsersIdsPopup(user.followers) }
        if (text === "Viewers") { setUsersIdsPopup(user.views) }
    };

    if (!user) {
        return (<FullScreenLoading />)
    }

    return (
        <MainLayout
            title={'DeepLink my account'}
            pageDescription={'DeepLink my account page'}
        >
            <CheckTokenExpiresLayout />

            {isLoading && <FullScreenOverlayLoading />}
            <Container maxWidth="lg" sx={{ padding: "30px", margin: "70px 50px 50px 130px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", borderRadius: "30px" }}>

                <Box>
                    <Typography
                        margin={"-100px 0 20px 20px"}
                        fontFamily={"Montserrat"}
                        fontWeight={"600"}
                        fontSize={"50px"}
                        color={themeMode === "light" ? "#dedede" : "#202223"}
                        sx={{ zIndex: "90" }}
                    >
                        My account <LastPage sx={{ marginLeft: "-15px", fontSize: "34px" }} />
                    </Typography>
                </Box>

                <Grid container maxWidth={1200}>
                    <Grid item sm={12} md={3} marginBottom={"20px"}>
                        <Card className='summary-card' sx={{ borderRadius: "30px", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                            <CardContent>
                                <AccountItems text={"Dashboard"} icon={<WebOutlined />} pageState='dashboard' setPageState={setPageState} setIsLoading={setIsLoading} />
                                <AccountItems text={"My profile"} icon={<PersonOutlineOutlined />} href={`/profile/${user!._id}`} setIsLoading={setIsLoading} />
                                <AccountItems text={"Create an avatar"} icon={<PersonAddOutlined />} pageState='avatarCreation' setPageState={setPageState} setIsLoading={setIsLoading} />
                                <AccountItems text={"Account information"} icon={<ContactPageOutlined />} pageState='accountInfo' setPageState={setPageState} setIsLoading={setIsLoading} />
                                <AccountItems text={"My articles"} icon={<PostAdd />} href={`/user/myarticles`} setIsLoading={setIsLoading} />
                                <AccountItems text={"Log out"} icon={<LoginOutlined />} onClick={onLogout} setIsLoading={setIsLoading} />
                            </CardContent>
                        </Card>
                        <Box sx={{ marginTop: "20px", padding: "20px", borderRadius: "30px", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                            <Typography onClick={() => openShowUsersPopup("Viewers")} sx={{ ":hover": { fontWeight: 600, cursor: "pointer", textDecoration: "underline" } }}>{"Who's viewed your profile"}: {user.views && user.views.length}</Typography>
                            <Typography onClick={() => openShowUsersPopup("Following")} marginTop={"10px"} sx={{ ":hover": { fontWeight: 600, cursor: "pointer", textDecoration: "underline" } }}>{"Following"}: {user.friendsIds && user.friendsIds.length}</Typography>
                            <Typography onClick={() => openShowUsersPopup("Followers")} marginTop={"10px"} sx={{ ":hover": { fontWeight: 600, cursor: "pointer", textDecoration: "underline" } }}>{"Followers"}: {user.followers && user.followers.length}</Typography>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={9}>
                        {pageState === "dashboard" && <AccountDashboard />}
                        {pageState === "accountInfo" && <AccountInfo />}
                        {pageState === "avatarCreation" && <AccountAvatarCreation />}
                    </Grid>

                </Grid>

                {showUsersPopup &&
                    <ShowUsersPopup
                        showUsersPopup={showUsersPopup}
                        onClose={() => setShowUsersPopup(false)}
                        title={textUsersPopup}
                        usersIds={usersIdsPopup}
                    />
                }
            </Container>
        </MainLayout>
    )
}


export default AccountPage