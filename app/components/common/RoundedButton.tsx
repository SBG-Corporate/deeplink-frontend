import { Button } from "@mui/material";

interface Props {
  onClick: any;
  text: string;
  color?: string
}

const RoundedButton: React.FC<Props> = ({ onClick, text, color = "" }) => {
  return (
    <Button
      variant="text"
      onClick={onClick}
      sx={{
        boxShadow: "3",
        borderRadius: "50px",
        width: "fit-content",
        padding: "5px 20px",
        color: color,
        textTransform: 'none',
      }}
    >{text}
    </Button>
  )
}

export default RoundedButton;
