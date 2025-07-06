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
import {
  getSubjects,
  selectSubjects,
} from "../../../../../../../store/slices/subjectSlice";

const schema: any = yup.object().shape({
  name: yup.string().required("Tên ngân hàng là bắt buộc"),
  subjectId: yup.string().required("Môn học là bắt buộc"),
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
  const [subjects, setSubjects] = useState([]);
  const user = useSelector(selectUser);
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

  useDeepCompareEffect(() => {
    setLoading(true);
    dispatch(getSubjects())
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
      description: data.description,
      subjectId: data.subjectId,
      userId: user?.id,
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
          {/* Môn học */}
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={subjects}
                getOptionLabel={(option: any) =>
                  typeof option === "string" ? option : option?.name || ""
                }
                isOptionEqualToValue={(option, value: any) =>
                  typeof option === "object" && typeof value === "string"
                    ? option.id === value
                    : option?.name === value
                }
                value={subjects?.find((c: any) => c.id === field.value) || null}
                onChange={(event, newValue: any) => {
                  field.onChange(newValue?.id || "");
                }}
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
