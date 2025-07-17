import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDeepCompareEffect, useThemeMediaQuery } from "../../../../../hooks";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UserModel from "../../../../../models/UserModel";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "../../../../../store/slices/userSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import _ from "lodash";
import { errorAnchor, successAnchor } from "../../../../../constants/confirm";
import { showMessage } from "../../../../../components/FuseMessage/fuseMessageSlice";
import type { AppDispatch } from "../../../../../store/store";

const schema: any = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(
      /^0\d{9}$/,
      "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và đủ 10 chữ số)"
    ),
  fullName: yup.string().required("Họ tên là bắt buộc"),
  gender: yup.string(),
  birthday: yup.date().nullable(),
});

const Profile = () => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(UserModel({}));
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (user) {
      const transformedUser = {
        ...UserModel(user),
        gender: user.gender ? "MALE" : "FEMALE",
        birthday: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
      };

      reset(transformedUser);
    }
  }, [user, reset]);

  const onSubmit = (data: any) => {
    setLoading(true);
    const payload = {
      gender: data.gender === "MALE" ? true : false,
      dateOfBirth: new Date(data.birthday),
      fullName: data?.fullName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
    };

    try {
      dispatch(updateUser({ userId: user?.id, form: payload }))
        .unwrap()
        .then((res: any) => {
          console.log({ res });

          const newUser = {
            ...UserModel(res.data),
            gender: res.data.gender ? "MALE" : "FEMALE",
            birthday: res.data.dateOfBirth
              ? new Date(res.data.dateOfBirth)
              : null,
          };

          reset(newUser);

          dispatch(
            showMessage({
              message: "Cập nhập thông tin cá nhân thành công",
              ...successAnchor,
            })
          );
          setLoading(false);
        });
    } catch (error: any) {
      dispatch(
        showMessage({
          message: "Có lỗi xảy ra, vui lòng thử lại",
          ...errorAnchor,
        })
      );
    }
  };

  return (
    <div className="md:col-span-5 col-span-7 bg-white rounded-md flex flex-col gap-y-4 shadow md:px-6 px-4 py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar */}
        {/* <div className="grid grid-cols-6 border-b-1 border-[#e4e3e3] py-6 gap-4">
          <div className="col-span-2">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Ảnh đại diện
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
              Chọn ảnh đại diện cho hồ sơ của bạn
            </Typography>
          </div>
          <div className="col-span-4">
            <img
              className="w-32 h-32 rounded-full mx-auto object-cover"
              src="/assets/images/avatars/mrs.fresh.jpg"
              alt="avatar"
            />
          </div>
        </div> */}

        {/* Email */}
        <div className="grid grid-cols-6 py-4 pt-8 gap-4">
          {!isMobile && (
            <div className="md:col-span-2 col-span-6 flex flex-col">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Email
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                Nhập email của bạn
              </Typography>
            </div>
          )}
          <div className="md:col-span-4 col-span-6">
            <Controller
              name="email"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email *"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="grid grid-cols-6 py-4 gap-4">
          {!isMobile && (
            <div className="md:col-span-2 col-span-6">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Số điện thoại
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                Nhập số điện thoại của bạn
              </Typography>
            </div>
          )}
          <div className="md:col-span-4 col-span-6">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Số điện thoại *"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Full name */}
        <div className="grid grid-cols-6 py-4 gap-4">
          {!isMobile && (
            <div className="col-span-2">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Họ tên
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                Nhập họ tên của bạn
              </Typography>
            </div>
          )}
          <div className="md:col-span-4 col-span-6">
            <Controller
              name="fullName"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Họ tên *"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="grid grid-cols-6 py-4 gap-4">
          {!isMobile && (
            <div className="col-span-2">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Giới tính
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                Chọn giới tính của bạn
              </Typography>
            </div>
          )}
          <div className="md:col-span-4 col-span-6">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="gender-label">Giới tính *</InputLabel>
                  <Select
                    {...field}
                    labelId="gender-label"
                    label="Giới tính *"
                    error={!!errors.gender}
                  >
                    <MenuItem value="MALE">Nam</MenuItem>
                    <MenuItem value="FEMALE">Nữ</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </div>

        {/* Birthday */}
        <div className="grid grid-cols-6 py-4 gap-4">
          {!isMobile && (
            <div className="col-span-2">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Ngày sinh
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                Nhập ngày sinh của bạn
              </Typography>
            </div>
          )}
          <div className="md:col-span-4 col-span-6">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="birthday"
                control={control}
                defaultValue={null}
                render={({ field }: any) => (
                  <DatePicker
                    {...field}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.birthday,
                        helperText: errors.birthday?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>

        {/* Submit */}
        <div className="w-full flex justify-end pb-4">
          <Button
            variant="contained"
            disabled={_.isEmpty(dirtyFields) || !isValid || loading}
            type="submit"
            sx={{
              background:
                !isValid || loading || _.isEmpty(dirtyFields)
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
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
