import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { showMessage } from "../../../components/FuseMessage/fuseMessageSlice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store/store";
import { errorAnchor, successAnchor } from "../../../constants/confirm";
import jwtService from "../../../services/auth/jwtService";
import { Link, useNavigate } from "react-router-dom";

const schema: any = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc")
    .max(100, "Email không thể lớn hơn 100 ký tự"),
});

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { handleSubmit, formState, watch, control, setValue, getValues } =
    useForm({
      mode: "onChange",
      defaultValues: {
        email: "",
      },
      resolver: yupResolver(schema),
    });

  const { isValid, errors } = formState;

  const onSubmit = (data: any) => {
    const { username, password } = data;

    setLoading(true);
    jwtService
      .signInWithUsernameAndPassword(username, password)
      .then((user: any) => {
        // if (form?.remember) {
        //   localStorage.setItem("username", username);
        // } else {
        //   localStorage.setItem("username", "");
        // }
        // console.log({ user })
        if (user?.data && user?.data?.role !== "ADMIN") {
          navigate("/workspace/class");
        } else {
          navigate("/workspace/teacher");
        }

        dispatch(
          showMessage({ message: "Đăng nhập thành công", ...successAnchor })
        );
        setLoading(false);
      })
      .catch((err: any) => {
        if (err) {
          dispatch(
            showMessage({
              message:
                "Tên đăng nhập hoặc mật khẩu không đúng, vui lòng thử lại",
              ...errorAnchor,
            })
          );
        }
        setLoading(false);
      });
  };

  return (
    <div className="lg:w-1/4 sm:w-1/2 w-full rounded-xl m-auto sm:h-fit h-full shodow bg-white px-8 py-16 flex flex-col gap-y-6">
      <img src="/assets/images/logo_1.png" className="w-1/2" alt="" />
      <div>
        <Typography sx={{ fontSize: 24 }}>Quên mật khẩu</Typography>
        <Typography sx={{ fontSize: 14 }}>
          Hãy thực hiện các bước bên dưới để đặt lại mật khẩu
        </Typography>
      </div>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-y-6"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label="Nhập email của bạn"
              autoFocus
              type="text"
              error={!!errors.email}
              disabled={loading}
              helperText={errors?.email?.message}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                required: true,
                classes: {
                  asterisk: "text-red-500",
                },
              }}
            />
          )}
        />
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
            width: "100%",
            px: 3,
            py: 1,
          }}
        >
          Gửi OTP
        </Button>
      </form>
      <div className="flex items-center gap-x-2">
        <Typography fontSize={16}>Trở lại</Typography>
        <Link to="/auth/login" className="text-blue-500 underline">
          <Typography fontSize={16}>Đăng nhập</Typography>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
