import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useThemeMediaQuery } from "../../../../../hooks";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const isValid = false;
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div className="col-span-5 bg-white rounded-md flex flex-col gap-y-4 shadow px-6 py-4">
      <form action="">
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-6">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Mật khẩu hiện tại
            </Typography>
          </div>
          <div className="col-span-6">
            <TextField
              fullWidth
              variant="outlined"
              // label={
              //   <>
              //     Mật khẩu hiện tại <span className="text-red-500">*</span>
              //   </>
              // }
            ></TextField>
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-6">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Mật khẩu mới
            </Typography>
          </div>
          <div className="col-span-6">
            <TextField
              fullWidth
              variant="outlined"
              // label={
              //   <>
              //     Mật khẩu mới <span className="text-red-500">*</span>
              //   </>
              // }
            ></TextField>
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-6">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Xác nhận mật khẩu 
            </Typography>
          </div>
          <div className="col-span-6">
            <TextField
              fullWidth
              variant="outlined"
              // label={
              //   <>
              //     Xác nhận mật khẩu <span className="text-red-500">*</span>
              //   </>
              // }
            ></TextField>
          </div>
        </div>
        <div className="w-full flex justify-end pb-4">
          <Button
            variant="contained"
            disabled={!isValid || loading}
            type="submit"
            sx={{
              background: !isValid
                ? "gray"
                : "linear-gradient(to right, #3b82f6, #a855f7)",
              borderRadius: "999px",
              textTransform: "none",
              color: "white",
              width: !isMobile ? "fit-content" : "100%",
              px: 3,
              py: 1,
              marginLeft: "auto",
            }}
          >
            Thay đổi mật khẩu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
