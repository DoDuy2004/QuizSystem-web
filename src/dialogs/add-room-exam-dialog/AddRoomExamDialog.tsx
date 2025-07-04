import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import withReducer from "../../store/withReducer";
import reducer from "./store";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddClassDialog,
  closeAddRoomExamDialog,
  selectAddClassDialog,
  selectAddRoomExamDialog,
} from "../../store/slices/globalSlice";
import { type AppDispatch } from "../../store/store";
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useDeepCompareEffect, useThemeMediaQuery } from "../../hooks";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
// import { addClass, selectClass } from "../../store/slices/classSlice"; // Giả định action
import CircularLoading from "../../components/CircularLoading";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../constants/confirm";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { addRoomExam } from "../../store/slices/roomExamSlice"; // Giả định action

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const currentDate = new Date();

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Tên phòng thi là bắt buộc"),
  status: yup.boolean().required("Trạng thái là bắt buộc"),
  startDate: yup
    .date()
    .required("Ngày bắt đầu là bắt buộc")
    .min(currentDate, "Ngày bắt đầu không được nhỏ hơn ngày hiện tại"),
  endDate: yup
    .date()
    .required("Ngày kết thúc là bắt buộc")
    .min(yup.ref("startDate"), "Ngày kết thúc không được nhỏ hơn ngày bắt đầu"),
});

const AddRoomExamDialog = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm")); // < 600px
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  // const courseClass = useSelector(selectClass);
  const addRoomExamDialog = useSelector(selectAddRoomExamDialog);
  const navigate = useNavigate();

  const {
    handleSubmit,
    watch,
    formState: { isValid, dirtyFields, errors },
    control,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      status: true,
      startDate: undefined,
      endDate: undefined,
    },
    resolver: yupResolver(schema),
  });

  useDeepCompareEffect(() => {
    if (addRoomExamDialog?.isOpen) {
      setLoading(false); // Không cần load dữ liệu ban đầu cho room exam
    }
  }, [dispatch, addRoomExamDialog?.isOpen]);

  const handleClose = () => {
    navigate("/workspace/room-exam/list"); // Giả định route
    dispatch(closeAddRoomExamDialog());
  };

  const onSubmit = (data: any) => {
    const payload = {
      name: data.name,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    setLoading(true);
    // dispatch(addRoomExam(payload))
    //   .then((res) => {
    //     reset({
    //       name: "",
    //       status: true,
    //       startDate: null,
    //       endDate: null,
    //     });
    //     dispatch(showMessage({ message: "Lưu phòng thi thành công", ...successAnchor }));
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     if (!loading) {
    //       dispatch(closeAddClassDialog());
    //     }
    //   });
  };

  return (
    <React.Fragment>
      <Dialog
        open={addRoomExamDialog?.isOpen}
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
          <Typography>Thêm phòng thi</Typography>
          <IconButton onClick={() => dispatch(closeAddRoomExamDialog())}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading && addRoomExamDialog?.isOpen ? (
            <CircularLoading />
          ) : (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <form
                action=""
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-6 mt-4"
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="name"
                      label={
                        <>
                          Tên phòng thi <span className="text-red-500">*</span>
                        </>
                      }
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      control={<Switch checked={field.value} />}
                      label="Hoạt động"
                    />
                  )}
                />
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }: any) => (
                    <DateTimePicker
                      {...field}
                      label={
                        <>
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </>
                      }
                      value={field.value || null}
                      onChange={(newValue) => field.onChange(newValue)}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          error={!!errors.startDate}
                          helperText={errors.startDate?.message}
                          fullWidth
                        />
                      )}
                      minDateTime={currentDate}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }: any) => (
                    <DateTimePicker
                      {...field}
                      label={
                        <>
                          Ngày kết thúc <span className="text-red-500">*</span>
                        </>
                      }
                      value={field.value || null}
                      onChange={(newValue) => field.onChange(newValue)}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          error={!!errors.endDate}
                          helperText={errors.endDate?.message}
                          fullWidth
                        />
                      )}
                      minDateTime={watch("startDate") || currentDate}
                    />
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={_.isEmpty(dirtyFields) || !isValid || loading}
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      background:
                        !isValid || _.isEmpty(dirtyFields) || loading
                          ? "gray"
                          : "linear-gradient(to right, #3b82f6, #a855f7)",
                      color: "white",
                      px: 3,
                      py: 1,
                    }}
                  >
                    Lưu phòng thi
                  </Button>
                </div>
              </form>
            </LocalizationProvider>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default withReducer("courseClass", reducer)(AddRoomExamDialog);
