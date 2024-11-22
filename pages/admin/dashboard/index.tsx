import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GroupOutlined, AccessTimeOutlined, LastPage } from '@mui/icons-material';
import { Backdrop, Box, CircularProgress, Grid, Typography } from '@mui/material'
import { MainLayout } from '/app/components/layouts';
import { SummaryTile } from '/app/components/admin/SummaryTile';
import { apiCall } from '/app/utils/api/apiUtils';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArticleIcon from '@mui/icons-material/Article';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';


export interface DashboardSummary {
    numberOfPosts: number;
    numberOfArticles: number;
    numberOfDirect: number;
    numberOfNotifications: number;
    numberOfUsers: number;
    numberOfChallenges: number;
}

const DashboardPage = () => {

    const themeMode = useSelector((state: any) => state.persisted?.themeMode);
    const token = useSelector((state: any) => state.persisted?.token);
    const [refreshIn, setRefreshIn] = useState(30);
    const [dashboardData, setDashboardData] = useState<DashboardSummary>({
        numberOfUsers: 0,
        numberOfArticles: 0,
        numberOfPosts: 0,
        numberOfDirect: 0,
        numberOfNotifications: 0,
        numberOfChallenges: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);

        return () => clearInterval(interval) // esto hay que hacerlo para terminar el interval
    }, []);

    useEffect(() => {
        const getDashboardData = async () => {
            const { status, data } = await apiCall({ type: "get", url: "/gestion/getDashboardData", token });
            if (status === 200) {
                setDashboardData(data)
                return;
            }
        };
        getDashboardData()
    }, [refreshIn])

    return (
        <MainLayout
            title={'DeepLink admin dashboard'}
            pageDescription={'DeepLink admin dashboard'}
        >
            <Box marginLeft={"100px"} padding={{ xs: "20px", md: "20px 50px" }}>

                <Box
                    margin={"60px 0"}
                    padding={"20px"}
                    display={"flex"}
                    flexDirection={"column"}
                    width={"100%"}
                    maxWidth="1200px"
                    height={"100%"}
                    boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
                    borderRadius={"30px"}
                >

                    <Box width={"100%"} display={"flex"} justifyContent={"start"}>
                        <Typography
                            margin={"-85px 0  0px 0px"}
                            // marginTop={"-10px"}
                            fontFamily={"Montserrat"}
                            fontWeight={"600"}
                            fontSize={"50px"}
                            color={themeMode === "light" ? "#dedede" : "#202223"}
                            sx={{ zIndex: "90" }}
                        >
                            Dashboard<LastPage sx={{ fontSize: "34px" }} />
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <SummaryTile
                                title={refreshIn}
                                subTitle="Update data in:"
                                icon={<AccessTimeOutlined color="error" sx={{ fontSize: 40 }} />}
                            />
                        </Grid>


                        <SummaryTile
                            title={dashboardData.numberOfUsers}
                            subTitle="Total users"
                            icon={<GroupOutlined color="secondary" sx={{ fontSize: 40 }} />}
                        />

                        <SummaryTile
                            title={dashboardData.numberOfArticles}
                            subTitle="Total articles"
                            icon={<NewspaperIcon color="success" sx={{ fontSize: 40 }} />}
                        />

                        <SummaryTile
                            title={dashboardData.numberOfPosts}
                            subTitle="Total posts"
                            icon={<ArticleIcon color="error" sx={{ fontSize: 40 }} />}
                        />

                        <SummaryTile
                            title={dashboardData.numberOfDirect}
                            subTitle="Total direct messages"
                            icon={<ForwardToInboxIcon color="primary" sx={{ fontSize: 40 }} />}
                        />

                        <SummaryTile
                            title={dashboardData.numberOfNotifications}
                            subTitle="Total notifications"
                            icon={<NotificationsIcon color="warning" sx={{ fontSize: 40 }} />}
                        />

                        <SummaryTile
                            title={dashboardData.numberOfChallenges}
                            subTitle="Total challenges"
                            icon={<LocalAtmIcon color="secondary" sx={{ fontSize: 40 }} />}
                        />

                    </Grid>


                </Box>
            </Box>
        </MainLayout>
    )
}

export default DashboardPage