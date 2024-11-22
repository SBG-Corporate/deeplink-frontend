import { FC } from "react";
import { Typography, useTheme, Box } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import WidgetWrapper from "app/components/common/WidgetWrapper";
import { MyPalette } from '/app/themes/types';

interface Props {
  isConnected: boolean;
  balance: string;
  stakedBalance: string;
  pendingRewardsPool: number;
}
const VaultsWidget: FC<Props> = ({ isConnected, balance, stakedBalance, pendingRewardsPool }) => {
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper >
      <FlexBetween sx={{ alignItems: "start" }} >
        <Box >
          <Typography color={medium} variant="h3" fontWeight="500">
            Vault
          </Typography>
        </Box>
        {/* <FlexBetween>
          <Box>
            <FlexBetween sx={{ justifyContent: "right" }}>
              <Switch
                checked={restakingSwitch}
                onChange={handleChangeRestakingSwitch}
              />
              <Typography color={medium}>Restaking</Typography>
            </FlexBetween>
            {!restakingSwitch &&
              <FlexBetween>
                <Typography></Typography>
                <Button>
                  <PriceCheckIcon color={main} />
                  <Typography color={medium}>Claim</Typography>
                </Button>
                <Button>
                  <CurrencyExchangeIcon color={main} />
                  <Typography color={medium}>&nbsp;Restake</Typography>
                </Button>
              </FlexBetween>
            }
          </Box>
        </FlexBetween> */}
      </FlexBetween>
      <Typography></Typography>

      <FlexBetween>
        <Typography></Typography>
        <Typography color={dark} variant="h1" fontWeight="500">
          {isConnected ? (balance) : <>---</>}
          <img
            width="32px"
            // height="auto"
            alt="advert"
            src="/assets/img/wallet/AlephZero_logo.png"
            style={{ borderRadius: "0.75rem", margin: "-10px 0 -3px 5px" }}
          />
        </Typography>
      </FlexBetween>

      <FlexBetween>
        <Typography></Typography>
        <FlexBetween width="50%">
          <Typography color={medium}>Staked</Typography>
          <Typography color={dark} fontWeight="500">
            {isConnected ? (stakedBalance) : <>---</>}
            <img
              width="16px"
              // height="auto"
              alt="advert"
              src="/assets/img/wallet/AlephZero_logo.png"
              style={{ borderRadius: "0.75rem", margin: "-10px 0 -3px 5px" }}
            />
          </Typography>
        </FlexBetween>
      </FlexBetween>

      <FlexBetween>
        <Typography></Typography>
        <FlexBetween width="50%">
          <Typography color={medium}>Claimable</Typography>
          <Typography color={dark} fontWeight="500">{pendingRewardsPool}
            <img
              width="16px"
              // height="auto"
              alt="advert"
              src="/assets/img/wallet/AlephZero_logo.png"
              style={{ borderRadius: "0.75rem", margin: "-10px 0 -3px 5px" }}
            />
          </Typography>
        </FlexBetween>
      </FlexBetween>

      {/* <FlexBetween>
        <Typography></Typography>
        <FlexBetween width="50%">
          <Typography color={medium}>Generated</Typography>
          <Typography color={dark} fontWeight="500">---
            <img
              width="16px"
              // height="auto"
              alt="advert"
              src="/assets/img/wallet/AlephZero_logo.png"
              style={{ borderRadius: "0.75rem", margin: "-10px 0 -3px 5px" }}
            />
          </Typography>
        </FlexBetween>
      </FlexBetween> */}
    </WidgetWrapper>
  );
};

export default VaultsWidget;
