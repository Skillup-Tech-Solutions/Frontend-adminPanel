import { Button } from "@mui/material";
import type { customButton } from "../Interface/interface";

export const customBtnStyle ={
    width: "100%",
    marginTop:"10px",
    fontWeight:"500",
    backgroundColor:"var(--primary)",
    fontFamily:"Regular_M",
    fontSize:"12px"
}


const CustomButton = ({
  label,
  variant = "contained",
  type,
  btnSx,
  startIcon,
  onClick,
  disabled,
}: customButton) => {
  return (
    <Button
      variant={variant ? variant : "contained"}
      type={type}
      sx={{
        ...customBtnStyle,
        ...btnSx,
        ...(variant === "outlined" && { backgroundColor: "transparent" }),
      }}
      startIcon={startIcon}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
