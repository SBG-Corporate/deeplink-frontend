import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import { useDispatch, useSelector } from "react-redux";
import { Typography, useTheme, Box, Grid } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import { MyPalette } from "/app/themes/types";
import { IChallenge } from "/app/interfaces/Challenges";
import { apiCall } from "/app/utils/api/apiUtils";
import ChallengeBox from "./ChallengeBox";
import { User } from "/app/interfaces";
import { setUserChallengesCompleted } from "/app/store/slices/user/userSlice";
import RoundedButton from "../common/RoundedButton";


interface Props {
  openPopupCreateNovaWallet: boolean
  setopenPopupCreateNovaWallet: (value: boolean) => void;
  setopenPopupCreateThoughtsOnTrezor: (value: boolean) => void;
}

const LatestChallenges: React.FC<Props> = ({ openPopupCreateNovaWallet, setopenPopupCreateNovaWallet, setopenPopupCreateThoughtsOnTrezor }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.persisted.token) || {};
  const user: User = useSelector((state: any) => state.persisted?.user);
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  const [allChallenges, setAllChallenges] = useState<IChallenge[]>([]);
  const [areChallengesClaimeables, setAreChallengesClaimeables] = useState<{ tipoDeChallenge: string, isClaimeable: boolean, PuntosDeChallenge: number }[]>([]);
  const [showItems, setShowItems] = useState(6);
  const [showConfetti, setShowConfetti] = useState(false);

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
      dispatch(setUserChallengesCompleted({ challengesCompleted: data.challengesCompletados, earnedLinks: Number(challege.recompensa) }));
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
      const { status, data } = await apiCall({ type: "get", url: "/challenges/getAllChallenges", token });
      if (status === 200) {
        const allEnabledChallenges = data.filter((challenge: any) => challenge.isEnabled === true)
        setAllChallenges(allEnabledChallenges)
      }
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
      rowGap={"20px"}
      columnGap={"40px"}
      sx={{
        padding: "50px 20px 20px 20px",
      }}
    >
      {showConfetti && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 6999,
            pointerEvents: 'none',
          }}
        >
          <Confetti numberOfPieces={1000} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />
        </Box>
      )}
      <FlexBetween sx={{ margin: "0 0 20px 20px" }}>
        <Typography color={dark} variant="h5" fontWeight="500">
          Latest challenges
        </Typography>
      </FlexBetween >
      <Grid container spacing={2}>
        {allChallenges?.map((challenge, index) => {
          if (index <= showItems - 1) {
            const isChallengeCompleted = user.challengesCompleted.some((challengeCompleted) => challengeCompleted === challenge._id)
            const isChallengeClaimeable = areChallengesClaimeables.length !== 0 ? areChallengesClaimeables[index].isClaimeable : false
            const puntosDeChallenge = areChallengesClaimeables.length !== 0 ? areChallengesClaimeables[index].PuntosDeChallenge : 0
            return (
              <Grid key={challenge._id} item md={12} lg={6} xl={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <ChallengeBox
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
              </Grid>
            )
          }
        })}
        {allChallenges.length > 6 && <Grid item xs={12}>
          <Box display="flex" justifyContent={"center"} alignItems="center" p="1rem" onClick={() => setShowItems(prev => prev === 6 ? allChallenges.length : 6)}>
            <RoundedButton onClick={() => { }} text={showItems === 6 ? "See all" : "Hide challenges"} color={dark} />
          </Box>
        </Grid>
        }
      </Grid>
    </Box >
  );
};

export default LatestChallenges;
