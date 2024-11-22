import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Typography, useTheme, Box, Grid, IconButton, useMediaQuery } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FlexBetween from "app/components/common/FlexBetween";
import ChallengeBox from "../challenges/ChallengeBox";
import { MyPalette } from '/app/themes/types';
import { apiCall } from "/app/utils/api/apiUtils";
import { User } from "/app/interfaces";
import { IChallenge } from "/app/interfaces/Challenges";
import { setUserChallengesCompleted } from "/app/store/slices/user/userSlice";

interface Props {
  setShowConfetti: (value: boolean) => void;
}

const LatestChallengesInHome: React.FC<Props> = ({ setShowConfetti }) => {
  const isNonMobileScreen = useMediaQuery("(min-width: 1650px)");
  const isNonMobileScreenSm = useMediaQuery("(min-width: 700px)");
  const dispatch = useDispatch();
  const router = useRouter()
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;
  const token = useSelector((state: any) => state.persisted.token);
  const user: User = useSelector((state: any) => state.persisted?.user);

  const [allChallenges, setAllChallenges] = useState<IChallenge[]>([]);
  const [areChallengesClaimeables, setAreChallengesClaimeables] = useState<{ tipoDeChallenge: string, isClaimeable: boolean, PuntosDeChallenge: number }[]>([]);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isFetchingChallenges, setIsFetchingChallenges] = useState(false);

  const handleArrowClick = (direction: 'left' | 'right') => {
    const newAllChallenges = [...allChallenges];
    const newAreChallengesClaimeables = [...areChallengesClaimeables];
    if (direction === 'left') {
      newAllChallenges.unshift(newAllChallenges.pop()!);
      newAreChallengesClaimeables.unshift(newAreChallengesClaimeables.pop()!);
    } else {
      newAllChallenges.push(newAllChallenges.shift()!);
      newAreChallengesClaimeables.push(newAreChallengesClaimeables.shift()!);
    }
    setAllChallenges(newAllChallenges);
    setAreChallengesClaimeables(newAreChallengesClaimeables);
  };

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(0);
  };

  const onClickClaim = async (challege: IChallenge, index: number) => {
    if (user.estado === 0) {
      toast.error("You must be registered to claim a challenge")
      return
    }

    if (areChallengesClaimeables.length !== 0 && !areChallengesClaimeables[index].isClaimeable) {
      toast.error("You dont meet the requirements")
      return
    }

    const { status, data } = await apiCall({ type: "post", url: `/challenges/validate/${challege._id}`, token });
    if (status === 200) {
      dispatch(setUserChallengesCompleted({ challengesCompleted: data.challengesCompletados }));
      toast.success(`You have earned ${challege.recompensa} $LINKS`)
      setShowConfetti(true);
      return;
    }
    else {
      toast.error("Server error, please contact with the admin")
    }
  };

  useEffect(() => {
    const getAllChallenges = async () => {
      setIsFetchingChallenges(true)
      const { status, data } = await apiCall({ type: "get", url: "/challenges/getAllChallenges", token });
      if (status === 200) {
        // const allEnabledChallenges = data.filter((challenge: any) => challenge.isEnabled === true)
        setAllChallenges(data)
      }
      setIsFetchingChallenges(false)
    };

    const getCompletedChallenges = async () => {
      const { status, data } = await apiCall({ type: "get", url: "/challenges/checkAllChallenges", token });
      if (status === 200) {
        setAreChallengesClaimeables(data)
      }
    };

    getAllChallenges()
    if (user.estado === 1) {
      getCompletedChallenges()
    }
  }, [])

  return (
    <Box
      sx={{
        borderRadius: "50px",
      }}
    >
      <FlexBetween sx={{ margin: "20px", gridColumn: "span  3" }}>
        <Typography color={dark} variant="h5" fontWeight="500" fontSize={"20px"}>
          Latest challenges
        </Typography>
        <IconButton onClick={() => router.push("/user/challenges")}>
          <ExitToAppIcon />
        </IconButton>
      </FlexBetween >

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          <IconButton onClick={() => handleArrowClick('left')}>
            <ArrowBackIos />
          </IconButton>
        </Grid>

        <Grid item xs={10}>
          <Box sx={{ display: "flex", justifyContent: "flex", position: 'relative', height: "350px" }}>
            {allChallenges.length !== 0 && allChallenges.slice(0, isNonMobileScreen ? 3 : isNonMobileScreenSm ? 2 : 1).map((challenge, index) => {

              const isChallengeCompleted = user.challengesCompleted.some((challengeCompleted) => challengeCompleted === challenge._id)
              const isChallengeClaimeable = areChallengesClaimeables.length !== 0 ? areChallengesClaimeables[index].isClaimeable : false
              const puntosDeChallenge = areChallengesClaimeables.length !== 0 ? areChallengesClaimeables[index].PuntosDeChallenge : 0
              return (
                <Box
                  key={index}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    position: "absolute",
                    left: index * 210,
                    transition: 'all 0.2s ease-in-out',
                    opacity: hoverIndex === index ? 1 : 0.6,
                    zIndex: hoverIndex === index ? 4 : 3 - index,
                    '&:hover': {
                      zIndex: 4,
                      opacity: 1,
                    },
                  }}
                >
                  <ChallengeBox
                    height={"350px"}
                    width={"250px"}
                    title={challenge.nombre}
                    description={challenge.descripcion}
                    type={challenge.tipoDeChallenge}
                    complete={isChallengeCompleted}
                    isChallengeClaimeable={isChallengeClaimeable}
                    puntosDeChallengeConseguidos={puntosDeChallenge}
                    puntosDeChallengeNecesarios={challenge.objetivoDeChallenge}
                    buttonText={`Claim ${challenge.recompensa} $LINKS`}
                    onClick={() => onClickClaim(challenge, index)}
                  />
                </Box>
              )
            })}
          </Box>
        </Grid>

        <Grid item xs={1}>
          <IconButton onClick={() => handleArrowClick('right')} >
            <ArrowForwardIos />
          </IconButton>
        </Grid>
      </Grid>
    </Box >
  );
};

export default LatestChallengesInHome;
