import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import withReducer from "../../store/withReducer";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddStudentDialog,
  selectAddStudentDialog,
} from "../../store/slices/globalSlice";
import { type AppDispatch } from "../../store/store";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useDeepCompareEffect, useThemeMediaQuery } from "../../hooks";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
// import CourseClassModel from "../../models/CourseClassModel";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import CircularLoading from "../../components/CircularLoading";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../constants/confirm";
import reducer from "./store";
import {
  addStudent,
  getStudent,
  selectStudent,
  updateStudent,
} from "../../store/slices/studentSlice";
import UserModel from "../../models/UserModel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema: any = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phoneNumber: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "valid-phone",
      "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và đủ 10 chữ số)",
      (value) => {
        if (!value) return true; // Nếu trống thì hợp lệ
        return /^0\d{9}$/.test(value); // Nếu có giá trị thì phải hợp lệ
      }
    ),

  fullName: yup.string().required("Họ tên là bắt buộc"),
  gender: yup.string(),
  birthday: yup.date().nullable(),
});

const AddSubjectDialog = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm")); // < 600px
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const dispatch = useDispatch<AppDispatch>();
  const [initialValues, setInitialValues] = useState(UserModel({}));
  const [loading, setLoading] = useState(true);
  const routeParams = useParams();
  const navigate = useNavigate();
  const student = useSelector(selectStudent);
  const addStudentDialog = useSelector(selectAddStudentDialog);
  const [buttonLoading, setButtonLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { dirtyFields, errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  console.log({ form: watch() });

  useDeepCompareEffect(() => {
    if (!routeParams?.id) {
      setLoading(false);
    }

    if (routeParams?.id && addStudentDialog?.isOpen) {
      dispatch(getStudent(routeParams?.id))
        .unwrap()
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, routeParams?.id, addStudentDialog?.isOpen]);

  useEffect(() => {
    if (routeParams?.id && !_.isEmpty(student)) {
      const transformedUser = {
        ...UserModel(student),
        gender: student.gender ? "MALE" : "FEMALE",
        birthday: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
      };
      reset(transformedUser);
    } else {
      reset({
        ...UserModel({}),
        birthday: null,
      });
    }
  }, [routeParams?.id, student]);

  useEffect(() => {
    if (!addStudentDialog?.isOpen) {
      reset(UserModel({}));
    }
  }, [addStudentDialog?.isOpen]);

  const handleClose = () => {
    navigate("/workspace/student/list");
    dispatch(closeAddStudentDialog());
  };

  const onSubmit = (data: any) => {
    setButtonLoading(true);
    const payload = {
      gender: data.gender === "MALE" ? true : false,
      dateOfBirth: new Date(data.birthday),
      fullName: data?.fullName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
    };

    const action = routeParams?.id
      ? updateStudent({ id: student?.id, form: payload })
      : addStudent({ form: payload });

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "Lưu thành công",
            ...successAnchor,
          })
        );
      })
      .finally(() => {
        setButtonLoading(false);
      });
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={addStudentDialog?.isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            margin: isMobile ? 0 : isTablet ? "1.5vh auto" : "2vh auto",
            width: isMobile ? "100vw" : isTablet ? "50%" : "40%",
            height: "80%",
            maxWidth: isMobile ? "100vw" : isTablet ? "50%" : "40%",
            maxHeight: isMobile ? "100vh" : "auto",
            borderRadius: isMobile ? 0 : 2,
            boxSizing: "border-box",
            overflow: isMobile ? "hidden" : "hidden",
            padding: isMobile
              ? "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)"
              : 0,
          },
          "& .MuiDialog-container": {
            alignItems: isMobile ? "flex-start" : "center",
          },
        }}
      >
        <DialogTitle
          className="flex items-center justify-between bg-blue-50"
          sx={{ paddingY: 1.5 }}
        >
          <Typography>
            {" "}
            {routeParams?.id
              ? "Cập nhập thông tin sinh viên"
              : "Thêm sinh viên"}
          </Typography>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading && addStudentDialog?.isOpen ? (
            <CircularLoading />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-4"
            >
              <Controller
                name="email"
                control={control}
                render={({ field }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        email <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Số điện thoại"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />

              <Controller
                name="fullName"
                control={control}
                render={({ field }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Họ tên <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="gender-label">
                      Giới tính <span className="text-red-500">*</span>
                    </InputLabel>
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
              <Button
                type="submit"
                variant="contained"
                disabled={_.isEmpty(dirtyFields) || !isValid || buttonLoading}
              >
                Lưu
              </Button>
            </form>
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
};

export default withReducer("students", reducer)(AddSubjectDialog);
