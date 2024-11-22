import { FC } from 'react'
import { Box } from '@mui/material'
import ButtonTypography from '../common/ButtonTypography'

interface Props {
  newsFilter: string;
  setNewsFilter: (value: string) => void,
}

const NewsFiltersNavbar: FC<Props> = ({ newsFilter, setNewsFilter }) => {
  return (
    <Box marginTop={"60px"} display={"flex"} width={"100%"} zIndex={10} position={"relative"}>
      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setNewsFilter("latestNews")}
          text={"Latest news"}
          bold={newsFilter === "latestNews"}
          fontSize={"12px"}
        />
      </Box>

      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setNewsFilter("market")}
          text={"Market"}
          bold={newsFilter === "market"}
          fontSize={"12px"}
        />
      </Box>

      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setNewsFilter("blockchain")}
          text={"Blockchain"}
          bold={newsFilter === "blockchain"}
          fontSize={"12px"}
        />
      </Box>

      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setNewsFilter("nft")}
          text={"NFT"}
          bold={newsFilter === "nft"}
          fontSize={"12px"}
        />
      </Box>

      <Box marginLeft={"50px"}>
        <ButtonTypography
          onClick={() => setNewsFilter("defi")}
          text={"DeFi"}
          bold={newsFilter === "defi"}
          fontSize={"12px"}
        />
      </Box>
    </Box >
  )
}
export default NewsFiltersNavbar