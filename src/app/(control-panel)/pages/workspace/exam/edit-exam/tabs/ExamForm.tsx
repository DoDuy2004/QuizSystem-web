import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  getSujects,
  // selectQuestionBank,
} from "../../../../../../../store/slices/questionBankSlice";
import { useParams } from "react-router-dom";
import QuestionBankModel from "../../../../../../../models/QuestionBankModel";
import _ from "lodash";
import { selectUser } from "../../../../../../../store/slices/userSlice";
import CircularLoading from "../../../../../../../components/CircularLoading";
import {
  addExam,
  editExam,
  getExambyId,
  selectExam,
} from "../../../../../../../store/slices/examSlice";
import ExamModel from "../../../../../../../models/ExamModel";

const schema: any = yup.object().shape({
  name: yup.string().required("Tên đề thi là bắt buộc"),
  durationMinutes: yup.string(),
  subject: yup.string().required("Môn học là bắt buộc"),
  examCode: yup.string().required("Mã đề là bắt buộc"),
});

const ExamForm = ({ setIsQuestionTabEnabled, setTabValue }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = useParams();
  const hasFetched = useRef(false);
  const hasFetchedSubject = useRef(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const exam = useSelector(selectExam);
  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isValid, errors, dirtyFields },
    control,
  }: any = useForm({
    mode: "onChange",
    defaultValues: ExamModel({}),
    resolver: yupResolver(schema),
  });

  useDeepCompareEffect(() => {
    if (hasFetched.current) return;

    if (routeParams.id) {
      hasFetched.current = true;
      setLoading(true);

      dispatch(getExambyId({ id: routeParams.id }))
        .unwrap()
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, routeParams?.id]);

  useEffect(() => {
    if (exam) {
      const transformedData = {
        ...exam?.data,
      };
      reset(ExamModel(transformedData));
    }
  }, [exam, reset]);

  useDeepCompareEffect(() => {
    if (hasFetchedSubject.current) return;

    setLoading(true);
    hasFetchedSubject.current = true;
    dispatch(getSujects())
      .then((res: any) => {
        // console.log({ res });
        setSubjects(res.payload.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, routeParams?.id]);

  const onSubmit = (data: any) => {
    setLoading(true);
    const payload = {
      name: data.name,
      subject: data.subject,
      durationMinutes: data?.durationMinutes,
      status: 0,
      examCode: data.examCode,
      startDate: new Date(),
      noOfQuestions: 0
    };

    const action =
      routeParams.id
        ? editExam({
            id: routeParams.id,
            form: { id: routeParams.id, ...payload },
          })
        : addExam({ form: payload });

    dispatch(action)
      .then(() => {
        setIsQuestionTabEnabled(true);
        setLoading(false);
        if (!loading) {
          setTabValue(1);
        }
      })
      .finally(() => setLoading(false));
  };

  // console.log({ form: watch() });

  if (loading) {
    return <CircularLoading />;
  }

  return (
    <div className="bg-white rounded-md px-6 py-4 flex flex-col gap-y-5">
      <Typography>Thông tin cơ bản</Typography>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6 px-2">
          <div className="grid grid-cols-4 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  className="col-span-3"
                  label={
                    <>
                      Tên đề thi <span className="text-red-500">*</span>
                    </>
                  }
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="examCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  className="col-span-1"
                  label={
                    <>
                      Mã đề thi <span className="text-red-500">*</span>
                    </>
                  }
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </div>

          {/* Môn học */}
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={subjects}
                freeSolo
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return option?.name || "";
                }}
                isOptionEqualToValue={(option, value) => {
                  if (typeof option === "object" && typeof value === "object") {
                    return option.id === value.id;
                  }
                  return option?.name === value?.name;
                }}
                value={field.value || null}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    field.onChange(newValue);
                  } else {
                    field.onChange(newValue.name);
                  }
                }}
                onInputChange={(event, newInputValue) => {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={
                      <>
                        Môn học <span className="text-red-500">*</span>
                      </>
                    }
                    variant="outlined"
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                )}
              />
            )}
          />

          {/* Mô tả */}
          <Controller
            name="durationMinutes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Thời gian làm bài"
                variant="outlined"
                type="number"
                error={!!errors.durationMinutes}
                helperText={errors.durationMinutes?.message}
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
              Lưu đề thi
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
