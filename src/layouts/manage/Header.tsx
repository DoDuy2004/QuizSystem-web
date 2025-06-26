import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import QueueIcon from "@mui/icons-material/Queue";
import PersonIcon from "@mui/icons-material/Person";
import SearchInput from "../../components/SearchInput";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useThemeMediaQuery } from "../../hooks";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import jwtService from "../../services/auth/jwtService";
import { successAnchor } from "../../constants/confirm";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { type AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import FullscreenLoader from "../../components/FullscreenLoader";

const Header = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // console.log({ userData });
  const handleLogout = () => {
    handleClose();
    setLoading(true);
    jwtService.logout().then((res) => {
      console.log({ res });
      dispatch(
        showMessage({ message: "Đăng xuất thành công", ...successAnchor })
      );
      const timeoutId = setTimeout(() => {
        navigate("/auth/login");
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    });
  };

  if (loading) {
    return <FullscreenLoader open={loading} />;
  }

  return (
    <div>
      <div className="lg:px-6 px-3 py-3 flex justify-between items-center gap-x-3 border-b-1 border-[#f3f1f1] sticky top-0 bg-white z-50">
        {isMobile && <MenuIcon />}
        <div className="flex items-center gap-x-3">
          {!isMobile && (
            <>
              <Avatar alt="Duy Do" src="" />
              <div className="w-1/2">
                <Typography
                  sx={{ fontSize: 14, color: "#3E65FE", width: "fit-content" }}
                >
                  {userData?.fullName}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  {userData?.role === "TEACHER"
                    ? "Giảng viên"
                    : userData?.role === "STUDENT"
                    ? "Sinh viên"
                    : ""}
                </Typography>
              </div>
            </>
          )}

          <SearchInput />
        </div>
        <div className="flex items-center gap-x-4">
          {!isMobile && (
            <Button
              startIcon={<QueueIcon />}
              sx={{
                padding: "10px 16px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #3b82f6, #a855f7)",
                borderRadius: "6px",
                textTransform: "none",
                color: "white",
              }}
            >
              Tạo đề thi
            </Button>
          )}
          <IconButton onClick={(e) => handleClick(e)}>
            <PersonIcon sx={{ fontSize: 26 }} />
          </IconButton>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
        PaperProps={{
          sx: {
            px: 1.5,
            boxShadow: 1,
          },
        }}
      >
        <MenuItem sx={{ paddingY: 0.5 }} onClick={handleClose}>
          <ListItemText>Hồ sơ</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ paddingY: 0.5 }} onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon sx={{ color: "orange" }} />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Header;
