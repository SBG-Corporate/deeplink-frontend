import type { NextPage } from 'next';
import { MainLayout } from 'app/components/layouts';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { LastPage } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { MyPalette } from '/app/themes/types';
import { FC, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import BouncingLetters from '/app/components/landing/BouncingLetters';


const Home: NextPage = () => {

  const router = useRouter()
  const user = useSelector((state: any) => state.persisted?.user);
  const { palette } = useTheme<MyPalette>();
  const neutralLight = palette.neutral.light;
  const dark = palette.neutral.dark;

  const [pageType, setPageType] = useState("landing");

  const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

  const handleLogin = () => {
    if (user === null) {
      router.push("/newregister")
      return
    } if (user.estado === 0 || user.estado === 1) {
      router.push("/user")
      return
    }
  };

  return (
    <MainLayout title={'DeepLink'} pageDescription={'Landing page'} showNavbars={false}>
      <Box
        minHeight={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >

        {pageType === "landing" &&
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{
              "&:hover": {
                color: neutralLight,
                cursor: "pointer",
                opacity: "0.7",
                "& span": {
                  animation: `${bounce} 0.5s ease infinite`,
                },
              },
            }}
            onClick={() => setPageType("landingBells")}
          >
            <BouncingLetters letters={['D', 'e', 'e', 'p']} isBold />
            <BouncingLetters letters={['L', 'i', 'n', 'k']} />
            <LastPage sx={{ marginLeft: "10px", fontSize: "34px" }} />

          </Box>
        }

        {pageType === "landingBells" &&
          <Box maxWidth={"1000px"} margin={"0 50px 50px 50px"}>

            <Box width={"100%"} display={"flex"} justifyContent={"center"}>
              <Button variant={"outlined"} sx={{ margin: "50px", textTransform: "none", fontSize: "24px" }}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  sx={{
                    "&:hover": {
                      color: neutralLight,
                      cursor: "pointer",
                      opacity: "0.7",
                      "& span": {
                        animation: `${bounce} 0.5s ease infinite`,
                      },
                    },
                  }}
                  onClick={handleLogin}
                >
                  <BouncingLetters letters={['G', 'o']} />
                  <Box margin={"0 5px"} />
                  <BouncingLetters letters={['t', 'o']} />
                  <Box margin={"0 5px"} />

                  <BouncingLetters letters={['D', 'e', 'e', 'p']} isBold />
                  <BouncingLetters letters={['L', 'i', 'n', 'k']} />
                  <LastPage sx={{ marginLeft: "10px", fontSize: "34px" }} />

                </Box>
              </Button>
            </Box>


            <Typography fontSize={"24px"} fontWeight={600}>
              🛠️ Development Update
            </Typography>
            <Typography>
              We are excited to announce that the PC version of DeepLink&apos;s web app is now ready for testing! Our dedicated team has been working tirelessly to bring you a seamless and engaging experience. While the mobile version is not yet available, we are currently developing a new backend with enhanced performance, security, and user experience. Stay tuned for more updates!
            </Typography>

            <Typography marginTop={"20px"} fontSize={"24px"} fontWeight={600}>
              🚀 About DeepLink
            </Typography>
            <Typography>
              DeepLink is an open source, gamified social network that leverages blockchain technology to transform online interaction and socialization. Designed with a focus on providing an accessible, fast, and secure user experience, DeepLink caters to users from all backgrounds. The platform supports three types of accounts: <span style={{ fontWeight: 600 }}>users</span>, <span style={{ fontWeight: 600 }}>moderators</span>, and <span style={{ fontWeight: 600 }}>business</span> accounts.
            </Typography>
            <Typography marginTop={"10px"}>
              <CircleIcon style={{ fontSize: "8px", margin: "0 8px 0 10px" }} /><span style={{ fontWeight: 600 }}>User Accounts</span>: These are the core of the platform. Users enjoy unique features such as rewards for sharing quality content and active community participation. They can complete daily and special missions, earn badges, and advance through ranks. Additionally, users can redeem accumulated tokens for a wide variety of physical and digital products.
            </Typography>
            <Typography>
              <CircleIcon style={{ fontSize: "8px", margin: "0 8px 0 10px" }} /><span style={{ fontWeight: 600 }}>Moderator Accounts</span>: Moderators review the content of articles and groups to guarantee the best quality. They ensure that the platform maintains high standards for content and community engagement, fostering a positive environment for all users.
            </Typography>
            <Typography>
              <CircleIcon style={{ fontSize: "8px", margin: "0 8px 0 10px" }} /><span style={{ fontWeight: 600 }}>Business Accounts</span>: Businesses have their own accounts to create sponsored ads and challenges. This allows companies to engage with the DeepLink community by promoting their products or services and offering unique challenges that users can participate in for additional rewards.
            </Typography>

            <Typography marginTop={"20px"} fontSize={"24px"} fontWeight={600}>
              🤝 Community
            </Typography>
            <Typography>
              You can connect with us on
              &nbsp;<a href="https://XXX" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>Twitter</a>&nbsp;
              and
              &nbsp;<a href="https://XXX" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>Telegram</a>&nbsp;
              for updates and discussions! Don&apos;t forget to check out our
              &nbsp;<a href="https://github.com/SBG-Corporate/deeplink-frontend" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>GitHub repository</a>
              , where you can explore the code behind our project.
              GitHub is the heart of our development—join us and contribute!
            </Typography>

            <Typography marginTop={"20px"} fontSize={"24px"} fontWeight={600}>
              ❤️ Contribute
            </Typography>
            <Typography>
              We appreciate your interest in contributing to DeepLink! Here are some friendly ways you can support us:
            </Typography>
            <Typography marginTop={"10px"}>
              <CircleIcon style={{ fontSize: "8px", margin: "0 8px 0 10px" }} />Donate with crypto:
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />Bells Segwit Address: <span style={{ fontWeight: 600 }}>bel1qwdvy6h8hjxlxxpgj9cts7wv2mqa8hsjqaaf70v</span>
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />Bells Taproot Address: <span style={{ fontWeight: 600 }}>bel1p96863zqa73rjgnw4astdwekf2vmf3qqgyg3k8m2g2a0g5h2q5zkq5mfvs9</span>
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />Bells Legacy Address: <span style={{ fontWeight: 600 }}>BExy77wHqQx1vMAs2JTQ484jeT9TbCSko4</span>
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />Ethereum, Polygon, and BSC Address: <span style={{ fontWeight: 600 }}></span>
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />Solana Address: <span style={{ fontWeight: 600 }}></span>
            </Typography>

            <Typography marginTop={"10px"}>
              <CircleIcon style={{ fontSize: "8px", margin: "0 8px 0 10px" }} />Get Involved:
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />
              <span style={{ fontWeight: 600 }}>Report Issues or Request Features:</span> Help us improve by submitting
              &nbsp;<a href="https://github.com/SBG-Corporate/deeplink-frontend/issues/new?assignees=srinivaspendem%2Cpushya22&labels=%F0%9F%90%9Bbug&projects=&template=--bug-report.yaml&title=%5Bbug%5D%3A+" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>bugs</a> and
              &nbsp;<a href="https://github.com/SBG-Corporate/deeplink-frontend/issues/new?assignees=srinivaspendem%2Cpushya22&labels=%E2%9C%A8feature&projects=&template=--feature-request.yaml&title=%5Bfeature%5D%3A+" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>feature requests</a>.
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />
              <span style={{ fontWeight: 600 }}>Spread the Word:</span> Share your experiences with DeepLink by speaking or writing about us—and don&apos;t forget to
              &nbsp;<a href="https://telegram.com/XXX" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>let us know</a>!
            </Typography>
            <Typography>
              <PanoramaFishEyeIcon style={{ fontSize: "8px", margin: "0 8px 0 25px" }} />
              <span style={{ fontWeight: 600 }}>Show Your Support:</span> Upvote
              &nbsp;<a href="https://github.com/SBG-Corporate/deeplink-frontend/issues" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>popular feature requests</a> to help prioritize what matters most to you.
            </Typography>

          </Box>
        }



      </Box>
    </MainLayout>
  )
}

export default Home
