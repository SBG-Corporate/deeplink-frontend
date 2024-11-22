import React, { FC } from 'react'
import { Box, Tooltip, Typography } from '@mui/material'

interface Props {
  text: string,
  tooltip: string,
  data: number,
}

const InfoTextWithTooltip: FC<Props> = ({ text, tooltip, data }) => {
  return (
    <Box margin={"5px"} display={"flex"} justifyContent={"space-between"}>
      <Tooltip title={tooltip}>
        <Box display={"flex"} flexDirection={"row"}>
          <Typography variant='body1'>{text}</Typography>&nbsp;&nbsp;
          <Typography variant='body1' fontWeight={"bold"}>{data}</Typography>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default InfoTextWithTooltip