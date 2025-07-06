import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import withReducer from "../../store/withReducer";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  closeAddSubjectDialog,
  selectAddClassDialog,
  selectAddSubjectDialog,
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
// import CourseClassModel from "../../models/CourseClassModel";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import CircularLoading from "../../components/CircularLoading";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../constants/confirm";
import { selectUser } from "../../store/slices/userSlice";
import reducer from "./store";
import {
  createSubject,
  getSubjectById,
  selectSubject,
  updateSubject,
} from "../../store/slices/subjectSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = yup.object().shape({
  name: yup.string().required("Tên môn học là bắt buộc"),
  // major: yup.string().required("Chuyên ngành là bắt buộc"),
  description: yup.string().optional(),
  // status: yup.boolean().required(),
  chapters: yup
    .array()
    .of(
      yup
        .object()
        .shape({ name: yup.string().required("Tên chương là bắt buộc") })
    )
    .min(1, "Ít nhất một chương phải được nhập"),
});
const AddSubjectDialog = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm")); // < 600px
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const dispatch = useDispatch<AppDispatch>();
  const addSubjectDialog = useSelector(selectAddSubjectDialog);
  const [loading, setLoading] = useState(true);
  const routeParams = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const subject = useSelector(selectSubject);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      // major: "",
      description: "",
      // status: false,
      chapters: [{ name: "" }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "chapters",
  });

  useDeepCompareEffect(() => {
    if (!routeParams?.id) {
      setLoading(false);
    }

    if (routeParams?.id && addSubjectDialog?.isOpen) {
      dispatch(getSubjectById(routeParams?.id))
        .unwrap()
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, routeParams?.id, addSubjectDialog?.isOpen]);

  useEffect(() => {
    if (routeParams?.id && !_.isEmpty(subject)) {
      reset({
        name: subject.name,
        // major: "",
        description: subject.description,
        // status: false,
        chapters: subject.chapters,
      });
    } else {
      reset({
        name: "",
        // major: "",
        description: "",
        // status: false,
        chapters: [{ name: "" }],
      });
    }
  }, [routeParams?.id, subject]);

  const handleClose = () => {
    navigate("/workspace/subject/list");
    dispatch(closeAddSubjectDialog());
  };

  const onSubmit = (data: any) => {
    const payload = {
      name: data?.name,
      // major: "",
      description: data?.description,
      // status: data?.,
      chapters: data?.chapters,
    };
    console.log({ payload });

    const action = routeParams?.id
      ? updateSubject({ id: subject?.id, form: payload })
      : createSubject({ form: payload });

    dispatch(action)
      .unwrap()
      .finally(() => {
        setLoading(true);
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={addSubjectDialog?.isOpen}
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
            {routeParams?.id ? "Cập nhập môn học" : "Thêm môn học"}
          </Typography>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading && addSubjectDialog?.isOpen ? (
            <CircularLoading />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-4"
            >
              <Controller
                name="name"
                control={control}
                render={({ field }: any) => (
                  <TextField
                    {...field}
                    label="Tên môn học *"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              {/* <Controller
                name="major"
                control={control}
                render={({ field }: any) => (
                  <TextField
                    {...field}
                    label="Chuyên ngành *"
                    error={!!errors.major}
                    helperText={errors.major?.message}
                    fullWidth
                  />
                )}
              /> */}
              {/* <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mô tả"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              /> */}
              {/* <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Trạng thái"
                  />
                )}
              /> */}
              <Typography variant="subtitle1">Danh sách chương</Typography>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Controller
                    name={`chapters.${index}.name`}
                    control={control}
                    render={({ field: chapterField }) => (
                      <TextField
                        {...chapterField}
                        label="Chương"
                        error={!!errors.chapters?.[index]?.name}
                        helperText={errors.chapters?.[index]?.name?.message}
                        fullWidth
                      />
                    )}
                  />
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => append({ name: "" })}
                variant="outlined"
                sx={{ textTransform: "none" }}
                className="w-fit"
              >
                Thêm chương
              </Button>
              <Button type="submit" variant="contained" disabled={!isValid}>
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

export default withReducer("subjects", reducer)(AddSubjectDialog);
