import React, { FC } from 'react'
import { Typography, Link, Box } from '@mui/material';

interface Props {
  text: string;
  icon: React.ReactNode;
  href?: string;
  pageState?: string;
  setPageState?: (data: string) => void;
  onClick?: () => void | undefined;
  setIsLoading: (value: boolean) => void;
}

export const AccountItems: FC<Props> = ({ text, icon, href = "", pageState = "", setPageState = () => { }, onClick = undefined, setIsLoading }) => {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      setPageState(pageState);
      if (href) {
        setIsLoading(true)
        window.location.href = href;
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            margin: "10px 20px 10px 0",
            border: "1px solid",
            borderRadius: "50%",
            minWidth: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {icon}
        </Box>
        <Typography variant='h2' sx={{ fontSize: "16px" }}>{text}</Typography>
      </Box>
    </Link>
  )
}