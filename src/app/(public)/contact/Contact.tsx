import { Button, Divider, TextField, Typography } from "@mui/material";
// import React from "react";
import { useThemeMediaQuery } from "../../../hooks";
import { FaFacebookF } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const defaultValues = {
  fullname: "",
  email: "",
  phone: "",
  content: "",
};

const schema: any = yup.object().shape({
  fullname: yup
    .string()
    .trim()
    .required("Họ tên là bắt buộc")
    .max(100, "Họ tên không dài quá 100 ký tự"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc")
    .max(100, "Email không thể lớn hơn 100 ký tự"),
  phone: yup
    .string()
    .required("You must enter phone")
    .min(9, "Phone must be at least 9 characters")
    .max(15, "Phone cannot be longer than 15"),
  content: yup
    .string()
    .required("Nội dung cần tư vấn là bắt buộc")
    .max(400, "Nội dung tối đa 400 ký tự"),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const { handleSubmit, formState, watch, control, setValue, getValues }: any =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const { isValid, errors, dirtyFields } = formState;

  const form = watch();

  //   console.log({ form });

  const onSubmit = (data: any) => {
    console.log({ data });
  };

  return (
    <div className="xl:mx-64 mx-0 lg:mx-44 md:mb-0 mb-20">
      <div className="py-12 w-fit m-auto flex flex-col gap-y-6 text-center">
        <Typography
          sx={{
            padding: isMobile ? "0 16px" : 0,
            // width: !isMobile ? "50%" : "100%",
            margin: "0 auto",
            fontWeight: "550",
            textAlign: "center",
            background: "linear-gradient(90deg, #3e65fe, #d23cff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            width: "fit-content",
            fontSize: isMobile ? "24px" : "36px",
          }}
        >
          Liên hệ với chúng tôi
        </Typography>
        <Typography className="lg:px-0 px-7">
          Việc liên lạc với EduQuiz chưa bao giờ dễ dàng hơn thế
        </Typography>
      </div>
      <div className="w-full md:flex-row flex-col flex justify-between md:shadow-[0_0_10px_rgba(0,0,0,0.1)] gap-x-6 gap-y-6 md:rounded-lg">
        <div className="md:w-1/2 w-full">
          <div className="px-6 pt-6 flex flex-col gap-y-6">
            <Typography>
              Chúng tôi đang giúp cho 10+ khách hàng và đối tác tổ chức các kỳ
              thi đánh giá năng lực, nâng cao chất lượng đào tạo nhân sự và học
              viên.
            </Typography>
            <Typography
              sx={{
                // padding: isMobile ? "0 16px" : 0,
                // width: !isMobile ? "50%" : "100%",
                fontWeight: "550",
                background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Hãy để chúng tôi tư vấn giải pháp cho bạn
            </Typography>
            <Divider className="w-full"></Divider>
            <div className="grid grid-cols-2 grid-rows-2 gap-1">
              <Typography sx={{ fontSize: "14px", opacity: ".6" }}>
                Số điện thoại
              </Typography>
              <Typography sx={{ fontSize: "14px", opacity: ".6" }}>
                Email
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                0918557317
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                duy2004.gi@gmail.com
              </Typography>
            </div>
            <div className="flex flex-col gap-y-1">
              <Typography sx={{ fontSize: "14px", opacity: ".6" }}>
                Văn phòng
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                65 Huỳnh Thúc Kháng, Phường Bến Nghé, Quận 1
              </Typography>
            </div>
            <div className="flex flex-col gap-y-4">
              <Typography sx={{ fontSize: "14px", opacity: ".6" }}>
                Nghe cộng đồng nói về chúng tôi
              </Typography>
              <div className="flex items-center gap-x-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-lg border-1 border-gray-200">
                  <FaFacebookF className="text-[#3b82f6] text-3xl" />
                </span>
                <span className="flex items-center justify-center w-12 h-12 rounded-lg border-1 border-gray-200">
                  <FaTiktok className="text-[#3b82f6] text-3xl" />
                </span>
                <span className="flex items-center justify-center w-12 h-12 rounded-lg border-1 border-gray-200">
                  <FaYoutube className="text-[#3b82f6] text-3xl" />
                </span>
              </div>
            </div>
          </div>
          <img
            src="/assets/images/img_girl.8b761188.png"
            className="md:rounded-b-lg"
            alt=""
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="lg:w-1/2 w-full">
          <div className="flex flex-col gap-y-5 w-full  my-6 px-6 border-l-1 border-gray-200">
            <Controller
              control={control}
              name="fullname"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="name"
                    label={
                      <>
                        Họ và tên <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.fullname}
                    helperText={errors?.fullname?.message}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="name"
                    label={
                      <>
                        Email <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="phone"
                    error={!!errors.phone}
                    helperText={errors?.phone?.message}
                    variant="outlined"
                    fullWidth
                    label={
                      <>
                        Số điện thoại <span className="text-red-500">*</span>
                      </>
                    }
                    size={isMobile ? "small" : "medium"}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      setValue("phone", numericValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      field.onChange(numericValue);
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="content"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="name"
                    rows={5}
                    multiline={true}
                    label={
                      <>
                        Mong muốn cần tư vấn{" "}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.content}
                    helperText={errors?.content?.message}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  />
                );
              }}
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
                width: !isMobile ? "fit-content" : "100%",
                px: 3,
                py: 1,
              }}
            >
              Gửi liên hệ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
