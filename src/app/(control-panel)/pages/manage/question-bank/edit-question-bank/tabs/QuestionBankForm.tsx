import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  addQuestionBank,
  editQuestionBank,
  getQuestionBankById,
  // selectQuestionBank,
} from "../../../../../../../store/slices/questionBankSlice";
import { useParams } from "react-router-dom";
import QuestionBankModel from "../../../../../../../models/QuestionBankModel";
import _ from "lodash";
import { selectUser } from "../../../../../../../store/slices/userSlice";
import CircularLoading from "../../../../../../../components/CircularLoading";

const schema: any = yup.object().shape({
  name: yup.string().required("Tên ngân hàng là bắt buộc"),
  description: yup.string(),
});

const QuestionBankForm = ({
  data,
  setIsQuestionTabEnabled,
  setTabValue,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = useParams();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isValid, errors, dirtyFields },
    control,
  }: any = useForm({
    mode: "onChange",
    defaultValues: QuestionBankModel({}),
    resolver: yupResolver(schema),
  });

  useDeepCompareEffect(() => {
    if (hasFetched.current) return;

    if (routeParams.id) {
      hasFetched.current = true;
      setLoading(true);

      dispatch(getQuestionBankById({ id: routeParams.id })).finally(() => {
        setLoading(false);
      });
    }
  }, [dispatch, routeParams?.id]);

  useEffect(() => {
    if (data) {
      const transformedData = {
        ...data,
      };
      reset(QuestionBankModel(transformedData));
    }
  }, [data, reset]);

  // useDeepCompareEffect(() => {
  //   if (hasFetchedSubject.current) return;

  //   setLoading(true);
  //   hasFetchedSubject.current = true;
  //   dispatch(getSujects())
  //     .then((res: any) => {
  //       // console.log({ res });
  //       setSubjects(res.payload.data);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [dispatch, routeParams?.id]);

  const onSubmit = (data: any) => {
    setLoading(true);
    const payload = {
      name: data.name,
      description: data.description,
      // subject: data.subject,
      // teacherId: user?.id,
      status: 0,
    };

    const action =
      routeParams.id || data.id
        ? editQuestionBank({
            id: routeParams.id || data.id,
            form: { id: routeParams.id || data.id, ...payload },
          })
        : addQuestionBank({ form: payload });

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

  console.log({ form: watch() });

  if (loading) {
    return <CircularLoading />;
  }

  return (
    <div className="bg-white rounded-md px-6 py-4 flex flex-col gap-y-5">
      <Typography>Thông tin cơ bản</Typography>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6 px-2">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={
                  <>
                    Tên ngân hàng câu hỏi{" "}
                    <span className="text-red-500">*</span>
                  </>
                }
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Môn học
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
          /> */}

          {/* Mô tả */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Mô tả"
                variant="outlined"
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
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
              Lưu ngân hàng câu hỏi
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionBankForm;
