import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import jwtService from "../../../../services/auth/jwtService";
import OTPInput from "react-otp-input";
import { errorAnchor, successAnchor } from "../../../../constants/confirm";
import { showMessage } from "../../../../components/FuseMessage/fuseMessageSlice";

const validationSchema = () =>
  yup.object({
    otp: yup
      .string()
      .required("Mã OTP là bắt buộc")
      .matches(/^[0-9]{6}$/, "OTP phải có đủ 6 số"),
  });

const OtpInput = ({ email, setStep }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); // Bắt đầu với 60 giây
  const isEmail = !isEmpty(email);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isResend, setIsResend] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema()),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
      setIsButtonDisabled(true);
      setIsResend(true);
    } else {
      setIsButtonDisabled(false);
      setIsResend(false);
    }

    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  const onSubmit = (data: any) => {
    setLoading(true);
    jwtService
      .validatePin({ email, otp: data.otp })
      .then((res: any) => {
        setLoading(false);
        console.log({ res });
        if (!res?.error) {
          dispatch(
            showMessage({
              message: "Xác nhận OTP thành công",
              ...successAnchor,
            })
          );
          setStep(3); // Chỉ chuyển bước khi không có lỗi
        } else {
          dispatch(
            showMessage({
              message: res?.message || "OTP không hợp lệ hoặc đã hết hạn",
              ...errorAnchor,
            })
          );
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.log({ error });
        dispatch(
          showMessage({
            message: "Lỗi khi xác nhận OTP",
            ...errorAnchor,
          })
        );
      });
  };

  const resentPin = () => {
    setTimer(60); // Đặt lại timer khi gửi lại OTP
    setIsResend(true);
    setIsButtonDisabled(true);
    jwtService
      .requestPin({ email })
      .then((res: any) => {
        if (!res?.error) {
          dispatch(
            showMessage({
              message: "Gửi lại OTP thành công",
              ...successAnchor,
            })
          );
        } else {
          dispatch(
            showMessage({
              message: "Lỗi khi gửi lại OTP",
              ...errorAnchor,
            })
          );
        }
      })
      .catch((error: any) => {
        console.error("Error resending pin:", error);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="flex flex-col gap-y-4">
      <Typography variant="h6">Nhập mã OTP</Typography>
      <Box className="">
        <form
          className="flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <OTPInput
                {...field}
                numInputs={6}
                inputStyle={{
                  width: "2.5rem",
                  height: "auto",
                  margin: "0 7px",
                  fontSize: "24px",
                  borderBottom: "5px solid rgba(0,0,0,0.3)",
                }}
                shouldAutoFocus
                value={field.value}
                onChange={(otp: any) => field.onChange(otp)}
                renderInput={(props: any) => <input {...props} />}
              />
            )}
          />
          {errors.otp && (
            <Typography className="ml-36 mt-28" color="error">
              {errors.otp.message}
            </Typography>
          )}
          <Button
            size="large"
            variant="contained"
            color="secondary"
            disabled={!isValid}
            loading={loading}
            type="submit"
            sx={{ textTransform: "none" }}
          >
            Tiếp tục
          </Button>
          <div className="flex items-center justify-between">
            <Typography>
              Nếu bạn không nhận được OTP
              <Button
                color="secondary"
                className="hover:underline"
                onClick={resentPin}
                disabled={isButtonDisabled}
                sx={{ textTransform: "none" }}
              >
                {isResend ? `Gửi lại sau ${timer}s` : "Gửi lại"}
              </Button>
            </Typography>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default OtpInput;
