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
  const [timer, setTimer] = useState(0);
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
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    if (timer === 0) {
      setIsButtonDisabled(false);
      setIsResend(false);
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
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
          setStep(3);
        } else {
          dispatch(
            showMessage({
              message: "OTP sai",
              ...errorAnchor,
            })
          );
        }
      })
      .catch((error: any) => {
        console.log({ error });
      });
  };

  const resentPin = () => {
    jwtService
      .requestPin({
        email,
      })

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
                  width: "3rem",
                  height: "auto",
                  margin: "0 6px",
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
            size={"large"}
            variant={"contained"}
            color="secondary"
            disabled={!isValid}
            loading={loading}
            type={"submit"}
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
                {/* {isButtonDisabled && isEmail
                    ? `${t('RESEND_IN')} ${timer}s` 
                    : t('RESEND')} */}

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
