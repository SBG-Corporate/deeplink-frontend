import React from 'react'
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, MenuItem, Select, Typography } from '@mui/material';
import { DashboardInfoMsg, User } from '/app/interfaces';
import { BoxLoading } from '../ui/BoxLoading';
import { apiCall } from '/app/utils/api/apiUtils';
import { initialDashboardInfoMsg } from '/app/config/constants';
import InfoTextWithTooltip from './InfoTextWithTooltip';


export const AccountDashboard = ({ }) => {
  const user: User = useSelector((state: any) => state.persisted.user);
  const token = useSelector((state: any) => state.persisted.token);

  const [filter, setFilter] = useState("Last month");
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoMsg>(initialDashboardInfoMsg);

  const categories = ["Today", "Last week", "Last month", "Last year", "All the time"]

  useEffect(() => {
    const getDashboartData = async () => {
      const { status, data } = await apiCall({ type: "post", url: "/msg/getDashboardData", token, body: { dateFilter: filter } });
      if (status === 200) {
        setDashboardInfo(data);
      }
    };
    getDashboartData()
  }, [filter])


  if (!user) {
    return (<BoxLoading />)
  }

  return (
    <Card sx={{ margin: "0 20px", padding: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", borderRadius: "30px" }}>
      <CardContent>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant='h1' sx={{ marginBottom: "10px" }}>Dashboard</Typography>
          <Select
            labelId="category-label"
            id="category"
            value={filter}
            sx={{ mb: 1 }}
            onChange={({ target }) => { setFilter(target.value) }}
          >
            {
              categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))
            }
          </Select>
        </Box>
        <Typography variant='h2' sx={{ margin: "10px 0" }} fontWeight={"bold"}>Activity on your posts</Typography>
        <InfoTextWithTooltip
          text='Total views'
          tooltip='Number of visits to your posts'
          data={dashboardInfo?.viewsInPosts}
        />
        <InfoTextWithTooltip
          text='Posts created'
          tooltip='Number of all posts you have created'
          data={dashboardInfo?.totalPosts}
        />
        <InfoTextWithTooltip
          text='Received likes'
          tooltip='Likes received on all your posts and posts comments'
          data={dashboardInfo?.likesInPostsReceived}
        />
        <InfoTextWithTooltip
          text='Received comments'
          tooltip='Comments received on all your posts'
          data={dashboardInfo?.commentsInPostsReceived}
        />
        <Typography variant='h2' sx={{ margin: "10px 0" }} fontWeight={"bold"}>Activity on your articles</Typography>
        <InfoTextWithTooltip
          text='Total views'
          tooltip='Number of visits to your articles'
          data={dashboardInfo?.viewsInArticles}
        />
        <InfoTextWithTooltip
          text='Articles created'
          tooltip='Number of all articles you have created'
          data={dashboardInfo?.totalArticles}
        />
        <InfoTextWithTooltip
          text='Received likes'
          tooltip='Likes received on all your articles and articles comments'
          data={dashboardInfo?.likesInArticlesReceived}
        />
        <InfoTextWithTooltip
          text='Received comments'
          tooltip='Comments received on all your articles'
          data={dashboardInfo?.commentsInArticlesReceived}
        />
        <Typography variant='h2' sx={{ margin: "10px 0" }} fontWeight={"bold"}>Activity as user</Typography>
        <InfoTextWithTooltip
          text='Favorites articles'
          tooltip='Total articles saved in favorites.'
          data={user.favoriteArticles.length}
        />
        <InfoTextWithTooltip
          text='Likes you have given in posts'
          tooltip='Total likes you have given to posts.'
          data={dashboardInfo?.likesInPostsGiven}
        />
        <InfoTextWithTooltip
          text='Likes you have given in articles'
          tooltip='Total likes you have given to articles.'
          data={dashboardInfo?.likesInArticlesGiven}
        />
        <InfoTextWithTooltip
          text='Likes you have given in comments'
          tooltip='Total likes you have given to comments.'
          data={dashboardInfo?.likesInCommentsGiven}
        />
        <InfoTextWithTooltip
          text='Likes you have given in total'
          tooltip='Total likes you have given to articles, posts and comments.'
          data={dashboardInfo?.totalLikesGiven}
        />
        <InfoTextWithTooltip
          text='Likes you have received for comments'
          tooltip='Total likes you have given for articles, posts and comments.'
          data={dashboardInfo?.totalLikesGiven}
        />
        <InfoTextWithTooltip
          text='Likes you have received in total'
          tooltip='Total likes you have received for articles, posts and comments.'
          data={dashboardInfo?.totalLikesGiven}
        />
        <InfoTextWithTooltip
          text='Comments you have given in posts'
          tooltip='Total comments you have given to posts.'
          data={dashboardInfo?.commentsInPostsGiven}
        />
        <InfoTextWithTooltip
          text='Comments you have given in articles'
          tooltip='Total comments you have given to articles.'
          data={dashboardInfo?.commentsInArticlesGiven}
        />
        <InfoTextWithTooltip
          text='Comments you have given in total'
          tooltip='Total comments you have given to articles and posts.'
          data={dashboardInfo?.totalCommentsGiven}
        />
        <InfoTextWithTooltip
          text='Comments you have received in total'
          tooltip='Total comments you have received for articles and posts.'
          data={dashboardInfo?.totalCommentsReceived}
        />
      </CardContent>
    </Card>
  )
}

