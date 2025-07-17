import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useThemeMediaQuery } from "../../../../../hooks";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../store/store";
import {
  changePassword,
  selectUser,
} from "../../../../../store/slices/userSlice";
import { showMessage } from "../../../../../components/FuseMessage/fuseMessageSlice";
import { errorAnchor, successAnchor } from "../../../../../constants/confirm";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const schema: any = yup.object().shape({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
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

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const {
    handleSubmit,
    reset,
    formState,
    watch,
    control,
    setValue,
    getValues,
  }: any = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, errors, dirtyFields } = formState;

  const onSubmit = (data: any) => {
    setLoading(true);
    dispatch(changePassword({ userId: user?.id, form: data }))
      .unwrap()
      .then((res) => {
        reset(defaultValues);
        dispatch(
          showMessage({
            message: "Đổi mật khẩu thành công",
            ...successAnchor,
          })
        );
      })
      .catch((error) => {
        const errorMessage =
          error?.data?.message || "Mật khẩu cũ không đúng, vui lòng thử lại";

        dispatch(
          showMessage({
            message: errorMessage,
            ...errorAnchor,
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="md:col-span-5 col-span-7 bg-white rounded-md flex flex-col gap-y-4 shadow md:px-6 px-4 py-4">
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-6">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Mật khẩu hiện tại
            </Typography>
          </div>
          <div className="col-span-6">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className=""
                  type={showCurrentPassword ? "text" : "password"}
                  error={!!errors.currentPassword}
                  helperText={errors?.currentPassword?.message}
                  variant="outlined"
                  disabled={loading}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {showCurrentPassword ? (
                            <VisibilityIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowCurrentPassword(false)}
                            />
                          ) : (
                            <VisibilityOffIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowCurrentPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-6">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Mật khẩu mới
            </Typography>
          </div>
          <div className="col-span-6">
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className=""
                  type={showNewPassword ? "text" : "password"}
                  error={!!errors.newPassword}
                  helperText={errors?.newPassword?.message}
                  variant="outlined"
                  disabled={loading}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {showNewPassword ? (
                            <VisibilityIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowNewPassword(false)}
                            />
                          ) : (
                            <VisibilityOffIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowNewPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 py-4 gap-4">
          <div className="col-span-6">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Xác nhận mật khẩu
            </Typography>
          </div>
          <div className="col-span-6">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className=""
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors?.confirmPassword?.message}
                  variant="outlined"
                  disabled={loading}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {showConfirmPassword ? (
                            <VisibilityIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowConfirmPassword(false)}
                            />
                          ) : (
                            <VisibilityOffIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowConfirmPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
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
