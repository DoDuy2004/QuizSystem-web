import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useThemeMediaQuery } from "../../../../../hooks";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const isValid = false;
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div className="col-span-5 bg-white rounded-md flex flex-col gap-y-4 shadow px-6 py-4">
      <form action="">
        <div className="grid grid-cols-6 border-b-1 border-[#e4e3e3] py-6 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Ảnh đại diện
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}
            >
              Chọn ản đại diện cho hồ sơ của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <img
              className="w-32 h-32 rounded-full mx-auto object-cover"
              src="/assets/images/avatars/mrs.fresh.jpg"
              alt="Duy Do"
            />
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 pt-8 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Email
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}
            >
              Nhập email của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <TextField
              fullWidth
              label={
                <>
                  Email <span className="text-red-500">*</span>
                </>
              }
            ></TextField>
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Số điện thoại
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}
            >
              Nhập số điện thoại của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <TextField
              fullWidth
              variant="outlined"
              label={
                <>
                  Số điện thoại <span className="text-red-500">*</span>
                </>
              }
            ></TextField>
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Họ tên
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}
            >
              Nhập họ tên của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <TextField
              fullWidth
              variant="outlined"
              label={
                <>
                  Họ tên <span className="text-red-500">*</span>
                </>
              }
            ></TextField>
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Giới tính
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}
            >
              Chọn Giới tính của bạn của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="gender-label">
                Giới tính <span className="text-red-500">*</span>
              </InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                // value={gender}
                // onChange={handleChange}
                label={
                  <>
                    Giới tính <span>*</span>
                  </>
                } // phải có label trùng với InputLabel
              >
                <MenuItem value={"MALE"}>Nam</MenuItem>
                <MenuItem value={"FEMALE"}>Nữ</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Ngày sinh
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}
            >
              Nhập ngày sinh của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                className="w-full"
                // value={value}
                // onChange={(newValue) => setValue(newValue)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
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
            Cập nhập
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

