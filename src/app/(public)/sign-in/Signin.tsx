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
  username: yup.string().required("Vui lòng nhập username"),
  password: yup.string().required("Vui lòng nhập mật khẩu").min(6),
  // .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
  // .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
  // .matches(/\d/, "Mật khẩu phải có ít nhất 1 chữ số")
  // .matches(
  //   /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/,
  //   "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
  // ),
});

type FormType = {
  // remember?: boolean;
  username: string;
  password: string;
};

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const navigate = useNavigate();

  const { handleSubmit, formState, watch, control, setValue, getValues } =
    useForm<FormType>({
      mode: "onChange",
      defaultValues: {},
      resolver: yupResolver(schema),
    });

  const { isValid, errors } = formState;

  const form = watch();

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
          console.log({ err });
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
      <Typography sx={{ fontSize: 24 }}>Đăng nhập</Typography>
      {/* <div
        className="flex items-center gap-x-4 px-8 rounded-md py-2 w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
        onClick={() => console.log("Đăng nhập với Google")}
      >
        <img
          src="/assets/images/image.png"
          className="block w-9 h-auto"
          alt="Google Icon"
        />
        <span className="block text-center text-xl font-semibold w-[80%]">
          Đăng nhập bằng Google
        </span>
      </div>
      <div className="w-full flex items-center">
        <Divider sx={{ flexGrow: 1 }} />
        <span className="mx-4 text-lg">hoặc tiếp tục với</span>
        <Divider sx={{ flexGrow: 1 }} />
      </div> */}
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-y-6"
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label="Tên đăng nhập"
              autoFocus
              type="text"
              error={!!errors.username}
              disabled={loading}
              helperText={errors?.username?.message}
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

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label={
                <>
                  Mật khẩu
                  <span className="text-red-500">*</span>
                </>
              }
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors?.password?.message}
              variant="outlined"
              disabled={loading}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <VisibilityIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <VisibilityOffIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Link
          to="/auth/forgot-password"
          className="w-full text-end underline text-blue-500"
        >
          Quên mật khẩu
        </Link>
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
          Đăng nhập
        </Button>
      </form>
    </div>
  );
};

export default Signin;
