import React, { FC } from 'react'
import { Box } from '@mui/material'
import ButtonTypography from '../common/ButtonTypography'

interface Props {
  groupFilter: string;
  setGroupFilter: (value: string) => void,
}

const GroupsFiltersNavbar: FC<Props> = ({ groupFilter, setGroupFilter }) => {
  return (
    <Box marginTop={"60px"} display={"flex"} width={"100%"} zIndex={10} position={"relative"}>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setGroupFilter("yourGroups")}
          text={"Your groups"}
          bold={groupFilter === "yourGroups"}
          fontSize={"12px"}
        />
      </Box>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setGroupFilter("market")}
          text={"Market"}
          bold={groupFilter === "market"}
          fontSize={"12px"}
        />
      </Box>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setGroupFilter("blockchain")}
          text={"Blockchain"}
          bold={groupFilter === "blockchain"}
          fontSize={"12px"}
        />
      </Box>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setGroupFilter("nft")}
          text={"NFT"}
          bold={groupFilter === "nft"}
          fontSize={"12px"}
        />
      </Box>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setGroupFilter("defi")}
          text={"DeFi"}
          bold={groupFilter === "defi"}
          fontSize={"12px"}
        />
      </Box>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setGroupFilter("other")}
          text={"Other"}
          bold={groupFilter === "other"}
          fontSize={"12px"}
        />
      </Box>
    </Box >
  )
}
export default GroupsFiltersNavbar