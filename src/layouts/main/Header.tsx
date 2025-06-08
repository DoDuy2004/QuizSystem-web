import React, { useState } from "react";
import { useThemeMediaQuery } from "../../hooks";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Button, Drawer, Toolbar, Typography } from "@mui/material";

const Header = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [activeItem, setActiveItem] = React.useState("Tính năng");
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full px-4 flex justify-between items-center border-b-1 border-gray-100">
      <img
        className="w-40 h-auto py-4"
        src="/assets/images/logo_1.png"
        alt=""
      />

      <div>
        {isMobile ? (
          <>
            <MenuIcon onClick={() => setOpen(true)} />
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
              <div className="w-64 flex flex-col p-6">
                {[
                  "Tính năng",
                  "Khám phá đề thi",
                  "Tổ chức thi",
                  "Luyện thi THPT Quốc Gia",
                  "Bảng giá",
                  "Tin tức",
                  "Liên hệ",
                ].map((item) => {
                  const isActive = activeItem === item;
                  return (
                    <Typography
                      key={item}
                      onClick={() => setActiveItem(item)}
                      sx={{
                        position: "relative",
                        padding: "1rem 0",
                        borderBottom: "1px solid #f3f4f6",
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: "16px",
                        color: isActive ? "transparent" : "black",
                        backgroundImage: isActive
                          ? "linear-gradient(90deg, #3e65fe, #d23cff)"
                          : "none",
                        backgroundClip: isActive ? "text" : "none",
                        WebkitBackgroundClip: isActive ? "text" : "none",
                        textTransform: "none",
                        transition: "all 0.4s ease",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: "-2px",
                          width: 0,
                          height: "2px",
                          background:
                            "linear-gradient(90deg, #3e65fe, #d23cff)",
                          transition: "width 0.4s ease",
                        },
                        "&:hover": {
                          color: "transparent",
                          backgroundImage:
                            "linear-gradient(90deg, #3e65fe, #d23cff) !important",
                          backgroundClip: "text !important",
                          WebkitBackgroundClip: "text !important",
                        },
                        "&:hover::after": {
                          width: "100%",
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  );
                })}
                <div className="py-8 w-full">
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to right, #3b82f6, #a855f7)",
                      borderRadius: "999px",
                      textTransform: "none",
                        color: "white",
                      width: "100%",
                      px: 3,
                      py: 1,
                    }}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </Drawer>
          </>
        ) : (
          <div>
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar sx={{ justifyContent: "center" }}>
                <div className="flex gap-x-4 items-center">
                  {[
                    "Tính năng",
                    "Khám phá đề thi",
                    "Tổ chức thi",
                    "Luyện thi THPT Quốc Gia",
                    "Bảng giá",
                    "Tin tức",
                    "Liên hệ",
                  ].map((item) => {
                    const isActive = activeItem === item;
                    return (
                      <Typography
                        key={item}
                        onClick={() => setActiveItem(item)}
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: isActive ? "transparent" : "black",
                          backgroundImage: isActive
                            ? "linear-gradient(90deg, #3e65fe, #d23cff)"
                            : "none",
                          backgroundClip: isActive ? "text" : "none",
                          WebkitBackgroundClip: isActive ? "text" : "none",
                          textTransform: "none",
                          transition: "all 0.4s ease",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            bottom: "-2px",
                            width: 0,
                            height: "2px",
                            background:
                              "linear-gradient(90deg, #3e65fe, #d23cff)",
                            transition: "width 0.4s ease",
                          },
                          "&:hover": {
                            color: "transparent",
                            backgroundImage:
                              "linear-gradient(90deg, #3e65fe, #d23cff) !important",
                            backgroundClip: "text !important",
                            WebkitBackgroundClip: "text !important",
                          },
                          "&:hover::after": {
                            width: "100%",
                          },
                        }}
                      >
                        {item}
                      </Typography>
                    );
                  })}
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to right, #3b82f6, #a855f7)",
                      borderRadius: "999px",
                      textTransform: "none",
                      color: "white",
                      px: 3,
                      py: 1,
                      ml: 2,
                    }}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </Toolbar>
            </AppBar>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
