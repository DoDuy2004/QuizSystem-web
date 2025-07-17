import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

const User = () => {
  const [isActive, setIsActive] = useState("account");
  const navigate = useNavigate();

  return (
    <div className="md:px-8 px-4 py-4 flex flex-col gap-y-6 h-screen overflow-y-auto">
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Cài đặt tài khoản
      </Typography>
      <div className="grid md:grid-cols-7 grid-cols-1 md:gap-8 gap-4">
        <List
          className="md:col-span-2 col-span-7 rounded-md shadow h-fit"
          sx={{ backgroundColor: "white", padding: 2 }}
        >
          <ListItem
            className={`${
              isActive === "account" ? "bg-[#f0f3ff]" : "bg-transparent"
            } hover:bg-[#f5f5f5]`}
            onClick={() => {
              setIsActive("account");
              navigate("/my-account/profile");
            }}
          >
            <ListItemText>Thông tin tài khoản</ListItemText>
          </ListItem>
          <ListItem
            className={`${
              isActive === "password" ? "bg-[#f0f3ff]" : "bg-transparent"
            } hover:bg-[#f5f5f5]`}
            onClick={() => {
              setIsActive("password");
              navigate("/my-account/change-password");
            }}
          >
            <ListItemText>Đổi mật khẩu</ListItemText>
          </ListItem>
        </List>
        <Outlet />
      </div>
    </div>
  );
};

export default User;
