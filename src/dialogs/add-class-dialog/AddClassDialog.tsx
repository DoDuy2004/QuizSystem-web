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
  selectAddClassDialog,
} from "../../store/slices/globalSlice";
import { type AppDispatch } from "../../store/store";
import {
  Autocomplete,
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
import CourseClassModel from "../../models/CourseClassModel";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import {
  addClass,
  editClass,
  getClassById,
  selectClass,
} from "../../store/slices/classSlice";
import CircularLoading from "../../components/CircularLoading";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../constants/confirm";
import { selectUser } from "../../store/slices/userSlice";
import { getSubjects } from "../../store/slices/subjectSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = yup.object().shape({
  name: yup.string().required("Tên lớp là bắt buộc"),
  description: yup.string().optional(),
  subjectId: yup.string().required("Môn học là bắt buộc"),
  credit: yup.number().optional().typeError("Tín chỉ phải là số"),
});

const AddClassDialog = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm")); // < 600px
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const dispatch = useDispatch<AppDispatch>();
  const addClassDialog = useSelector(selectAddClassDialog);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const routeParams = useParams();
  const courseClass = useSelector(selectClass);
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const {
    handleSubmit,
    formState: { isValid, dirtyFields, errors },
    watch,
    control,
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: CourseClassModel({}),
    resolver: yupResolver(schema),
  });

  useDeepCompareEffect(() => {
    if (addClassDialog?.isOpen && routeParams?.id) {
      // setLoading(true);
      if (routeParams?.id && addClassDialog?.isOpen) {
        dispatch(getClassById(routeParams?.id))
          .unwrap()
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [dispatch, routeParams?.id, addClassDialog?.isOpen]);

  useDeepCompareEffect(() => {
    if (addClassDialog?.isOpen) {
      // setLoading(true);
      setLoading(false);
      dispatch(getSubjects())
        .then((res: any) => {
          // console.log({ res });
          setSubjects(res.payload.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, addClassDialog?.isOpen]);

  const handleClose = () => {
    navigate("/workspace/class/list");
    dispatch(closeAddClassDialog());
  };

  useEffect(() => {
    if (addClassDialog?.isOpen && !routeParams?.id) {
      reset(CourseClassModel({ subjectId: "" }));
      setValue("subjectId", "", { shouldDirty: true });
    }
  }, [addClassDialog?.isOpen, routeParams?.id]);

  useEffect(() => {
    if (addClassDialog?.isOpen && routeParams?.id && courseClass?.data) {
      const transformedData = {
        ...courseClass.data,
      };
      reset(CourseClassModel(transformedData));
    }
    return () => {
      setValue("subjectId", "", { shouldDirty: true });
    };
  }, [addClassDialog?.isOpen, courseClass?.data]);

  const onSubmit = (data: any) => {
    const payload = {
      name: data.name,
      classCode: data.name,
      credit: data.credit,
      status: data.status,
      teacherId: user?.id,
      subjectId: data.subjectId,
      description: data.description,
    };

    const action = routeParams?.id
      ? editClass({
          id: routeParams?.id,
          form: { id: routeParams?.id, ...payload },
        })
      : addClass({ form: payload });
    // console.log({ payload });
    dispatch(action)
      .then((res) => {
        reset(CourseClassModel({ subjectId: "" }));
        dispatch(showMessage({ message: "Lưu thành công", ...successAnchor }));
      })
      .finally(() => {
        setLoading(false);
        if (!loading) {
          dispatch(closeAddClassDialog());
        }
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={addClassDialog?.isOpen}
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
          <Typography>Thêm lớp học</Typography>
          <IconButton onClick={() => dispatch(closeAddClassDialog())}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading && addClassDialog?.isOpen ? (
            <CircularLoading />
          ) : (
            <form
              action=""
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6 mt-4"
            >
              <div className="grid grid-cols-3 gap-x-4">
                {/* <Typography>Tên lớp học phần</Typography> */}
                <Controller
                  name="name"
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      id="name"
                      className="col-span-2"
                      label={
                        <>
                          Tên lớp học phần{" "}
                          <span className="text-red-500">*</span>
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
                  name="credit"
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      id="credit"
                      type="number"
                      label="Số tín chỉ"
                      error={!!errors.credit}
                      helperText={errors?.credit?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={subjects}
                    key={field.value || "empty"}
                    freeSolo
                    // inputValue={field.value === "" ? "" : undefined}
                    getOptionLabel={(option: any) =>
                      typeof option === "string" ? option : option?.name || ""
                    }
                    isOptionEqualToValue={(option, value: any) =>
                      typeof option === "object" && typeof value === "string"
                        ? option.id === value
                        : option?.name === value
                    }
                    value={
                      field.value
                        ? subjects.find((c: any) => {
                            return c.id === field.value;
                          })
                        : null
                    }
                    onChange={(event, newValue: any) => {
                      field.onChange(newValue?.id || "");
                    }}
                    onInputChange={(event, newInputValue) => {}}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={
                          <>
                            Môn học <span className="text-red-500">*</span>
                          </>
                        }
                        variant="outlined"
                        error={!!errors.subjectId}
                        helperText={errors.subjectId?.message}
                      />
                    )}
                  />
                )}
              />
              <div>
                {/* <Typography>Mô tả</Typography> */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      id="description"
                      label={<>Mô tả</>}
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors?.description?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              <Controller
                name="status"
                control={control}
                render={({ field }: any) => (
                  <FormControlLabel
                    {...field}
                    control={<Switch defaultChecked />}
                    label="Hoạt động"
                  />
                )}
              />
              <div className="flex justify-end pt-4">
                <Button
                  loading={loading}
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
                  Lưu lớp học
                </Button>
              </div>
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

export default withReducer("courseClass", reducer)(AddClassDialog);
