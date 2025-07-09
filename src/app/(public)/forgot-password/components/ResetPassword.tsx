import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, TextField, Typography } from "@mui/material";
import jwtService from "../../../../services/auth/jwtService";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../../store/store";
import { showMessage } from "../../../../components/FuseMessage/fuseMessageSlice";
import { errorAnchor, successAnchor } from "../../../../constants/confirm";
import { useNavigate } from "react-router-dom";

const defaultValues = {
  newPassword: "",
  confirmPassword: "",
};

const schema: any = yup.object().shape({
  newPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu mới phải có tối thiểu 8 ký tự")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .matches(/\d/, "Mật khẩu phải có ít nhất 1 chữ số")
    .matches(
      /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

const ResetPassword = ({ email }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, formState, watch, control, setValue, getValues } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const { isValid, errors, dirtyFields } = formState;

  const onSubmit = (data: any) => {
    setLoading(true);
    jwtService
      .resetPassword({ email, password: data.newPassword })
      .then((res: any) => {
        setLoading(false);
        if (!res?.error) {
          dispatch(
            showMessage({
              message: "Đặt lại mật khẩu thành công",
              ...successAnchor,
            })
          );
          navigate("/auth/login");
        } else {
          dispatch(
            showMessage({
              message: "Lỗi khi đặt lại mật khẩu",
              ...errorAnchor,
            })
          );
        }
      })
      .catch((error: any) => {
        console.log({ error });
      });
  };

  return (
    <>
      <Typography>Nhập mật khẩu mới của bạn</Typography>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-y-6"
      >
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label="Nhập mật khẩu mới"
              autoFocus
              type="text"
              error={!!errors.newPassword}
              disabled={loading}
              helperText={errors?.newPassword?.message}
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
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label="Xác nhận mật khẩu"
              type="text"
              error={!!errors.confirmPassword}
              disabled={loading}
              helperText={errors?.confirmPassword?.message}
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
          Đặt lại mặt khẩu
        </Button>
      </form>
    </>
  );
};

export default ResetPassword;
