import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import _, { set } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import * as yup from "yup";
import QuestionModel from "../../../../../../../models/QuestionModel";
import RichTextEditor from "../../../../../../../components/RichTextEditor/RichTextEditor";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import AddIcon from "@mui/icons-material/Add";
// import { useDeepCompareEffect } from "../../../../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  getChapters,
  getSubjects,
  selectSubjects,
  // selectSubjects,
} from "../../../../../../../store/slices/subjectSlice";
import {
  addQuestionToQuestionBank,
  editQuestion,
  selectQuestionBank,
  setImportStatus,
} from "../../../../../../../store/slices/questionBankSlice";
import { selectUser } from "../../../../../../../store/slices/userSlice";
import { showMessage } from "../../../../../../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../../../../../../constants/confirm";
import CircularLoading from "../../../../../../../components/CircularLoading";

const difficultyOptions = [
  { label: "Dễ", value: "EASY" },
  { label: "Trung bình", value: "MEDIUM" },
  { label: "Khó", value: "HARD" },
];

const schema = yup.object().shape({
  type: yup.string().required("Loại câu hỏi là bắt buộc"),
  content: yup.string().required("Nội dung câu hỏi là bắt buộc"),
  topic: yup.string().optional(),
  image: yup.string().optional(),
  difficulty: yup.string().required("Độ khó là bắt buộc"),
  chapterId: yup.string().required("Chương là bắt buộc"),
  subjectId: yup.string().required("Môn học là bắt buộc"),
  answers: yup
    .array()
    .of(
      yup.object().shape({
        isCorrect: yup.bool(),
        content: yup.string().required("Nội dung câu trả lời là bắt buộc"),
        answerOrder: yup.number(),
      })
    )
    .min(2, "Phải có ít nhất 2 câu trả lời"),
});

const QuestionForm = ({ questionData, questionLoading }: any) => {
  const [selectedValue, setSelectedValue] = useState("SingleChoice"); // Mặc định là "Một đáp án"
  const [loading, setLoading] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  // const subjects = useSelector(selectSubjects);
  // const [subjects, setSubjects] = useState([]);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isChapterOpen, setIsChapterOpen] = useState(false);
  const questionBank = useSelector(selectQuestionBank);
  const [question, setQuestion] = useState(questionData || {});
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const subjects = useSelector(selectSubjects);
  const {
    handleSubmit,
    formState: { isValid, dirtyFields, errors },
    watch,
    control,
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: QuestionModel({}),
    resolver: yupResolver(schema),
  });
  const form = watch();

  const normalizedData = useMemo(() => {
    if (_.isEmpty(questionData)) return QuestionModel({});
    return QuestionModel({
      ...questionData,
      chapterId: questionData?.chapter?.id,
      subjectId: questionBank?.data?.subjectId,
    });
  }, [questionData]);

  const isFormUnchanged = useMemo(() => {
    return _.isEqual(form, normalizedData);
  }, [form, normalizedData]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  // Theo dõi giá trị type để điều chỉnh logic
  const watchType = watch("type");

  const handleAddAnswer = () => {
    append({
      isCorrect: false,
      content: "",
      answerOrder: watch(`answers`).length + 1,
    });
  };

  const handleRemoveAnswer = (index: number) => {
    setValue(`answers.${0}.isCorrect`, true);
    remove(index);
  };

  // console.log({ questionBank });

  useEffect(() => {
    // setLoading(true);
    if (_.isEmpty(questionData)) {
      const defaultAnswers = Array.from({ length: 4 }, (_, index) => ({
        isCorrect: index === 0,
        content: "",
        answerOrder: index,
      }));

      reset({
        ...QuestionModel({}),
        answers: defaultAnswers,
        type: selectedValue,
      });
      setValue("subjectId", questionBank?.data?.subjectId, {
        shouldDirty: false,
        shouldValidate: true,
      });
      // setLoading(false);
    } else {
      setQuestion(questionData);
      const transformedData = {
        ...questionData,
        chapterId: questionData?.chapter?.id,
        // subjectId: questionData?.chapter?.subject?.id,
        difficulty: questionData.difficulty,
      };
      reset(QuestionModel(transformedData), {
        keepDirty: false, // This ensures dirtyFields is cleared
        keepErrors: false, // This clears any validation errors
      });
      setValue("subjectId", questionData?.chapter?.subject?.id, {
        shouldDirty: false,
        shouldValidate: true,
      });
      // setLoading(false);
    }
  }, [reset, questionData]);

  useEffect(() => {
    if (isSubjectOpen && subjects?.length === 0) {
      setSubjectLoading(true);
      dispatch(getSubjects())
        .unwrap()
        .then((res) => {
          console.log({ res });
          // setSubjects(res.data);
        })
        .finally(() => setSubjectLoading(false));
    }
  }, [isSubjectOpen, dispatch]);

  useEffect(() => {
    const subjectId = watch("subjectId");
    if (isChapterOpen && subjectId) {
      dispatch(getChapters(subjectId))
        .unwrap()
        .then((res: any) => {
          console.log({ res });
          setChapters(res.data);
        });
    }
  }, [isChapterOpen, watch("subjectId"), dispatch]);

  // console.log({ subjects });

  const handleAnswerChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (watchType === "SingleChoice") {
        const newAnswers = fields.map((_, i) => ({
          ...watch(`answers.${i}`),
          isCorrect: i === index,
        }));
        // console.log({ newAnswers });
        setValue("answers", newAnswers, { shouldValidate: true });
      } else {
        setValue(`answers.${index}.isCorrect`, event.target.checked);
      }
    };

  // schema
  //   .validate(form, { abortEarly: false })
  //   .then(() => {
  //     console.log("VALID");
  //   })
  //   .catch((err) => {
  //     console.log("INVALID", err.errors);
  //   });

  const onSubmit = (data: any) => {
    // console.log({ data });
    setLoading(true);

    const payload = {
      topic: data.topic,
      type: data.type,
      content: data.content,
      status: 0,
      difficulty: difficultyOptions.findIndex(
        (item) => item.value == data.difficulty
      ),
      image: data.image,
      chapterId: data.chapterId,
      answers: data.answers,
      createdBy: user?.id,
      questionBankId: questionBank?.data?.id,
    };

    const action = !_.isEmpty(questionData)
      ? editQuestion({
          id: question.id,
          form: { id: question.id, ...payload },
        })
      : addQuestionToQuestionBank({ form: payload });
    // console.log({ payload });
    dispatch(action)
      .then((res) => {
        setQuestion(res.payload.data);
        reset(QuestionModel(res.payload?.data));
        setValue("subjectId", res.payload?.data?.chapter?.subject?.id, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("chapterId", res.payload?.data?.chapter?.id, {
          shouldDirty: true,
          shouldValidate: true,
        });
        // dispatch(setImportStatus("succeeded"));
        dispatch(showMessage({ message: "Lưu thành công", ...successAnchor }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // if (questionLoading) return <CircularLoading />;

  return (
    <div className="flex flex-col gap-y-4">
      <Typography>Chỉnh sửa câu hỏi</Typography>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-2">
          <Typography>Loại câu hỏi</Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl sx={{ width: "fit-content" }} size="small">
                <Select
                  {...field}
                  labelId="select-type-label"
                  id="select-type"
                  value={field.value || ""} // đảm bảo không bị undefined
                >
                  <MenuItem value="SingleChoice">
                    <div className="flex items-center gap-x-2">
                      <RadioButtonCheckedOutlinedIcon
                        fontSize="small"
                        color="success"
                      />
                      <span>Một đáp án</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="MultipleChoice">
                    <div className="flex items-center gap-x-2">
                      <ChecklistOutlinedIcon fontSize="small" color="success" />
                      <span>Nhiều đáp án</span>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </div>
        <Typography>Soạn câu hỏi</Typography>
        <Controller
          name="content"
          control={control}
          rules={{ required: "Bạn chưa nhập nội dung câu hỏi" }}
          render={({ field }) => (
            <div>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                label="Soạn câu hỏi tại đây..."
              />
            </div>
          )}
        />
        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              open={isSubjectOpen}
              onOpen={() => setIsSubjectOpen(true)}
              onClose={() => setIsSubjectOpen(false)}
              options={subjects}
              disabled
              getOptionLabel={(option: any) =>
                typeof option === "string" ? option : option?.name || ""
              }
              isOptionEqualToValue={(option, value: any) =>
                typeof option === "object" && typeof value === "string"
                  ? option.id === value
                  : option?.name === value
              }
              value={
                subjects?.find((c: any) => c.id === field.value) ||
                questionData?.chapter?.subject?.name ||
                null
              }
              onChange={(event, newValue: any) => {
                field.onChange(newValue?.id || "");
                setValue("chapterId", ""); // reset chapter khi đổi môn
                setChapters([]);
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
        <Controller
          name="chapterId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              disabled={!question || !watch("subjectId")}
              open={isChapterOpen}
              onOpen={() => setIsChapterOpen(true)}
              onClose={() => setIsChapterOpen(false)}
              options={chapters}
              getOptionLabel={(option: any) =>
                typeof option === "string" ? option : option?.name || ""
              }
              isOptionEqualToValue={(option, value: any) =>
                typeof option === "object" && typeof value === "string"
                  ? option.id === value
                  : option?.name === value
              }
              value={
                chapters?.find((c: any) => c.id === field.value) ||
                questionData?.chapter?.name ||
                null
              }
              onChange={(event, newValue: any) => {
                field.onChange(newValue?.id || "");
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  fullWidth
                  label={
                    <>
                      Chương <span className="text-red-500">*</span>
                    </>
                  }
                  variant="outlined"
                  error={!!errors.chapterId}
                  helperText={errors.chapterId?.message}
                />
              )}
            />
          )}
        />

        <div className="flex gap-x-4">
          <Controller
            control={control}
            name="topic"
            render={({ field }: any) => (
              <TextField
                {...field}
                id="topic"
                label={<>Chủ đề</>}
                error={!!errors.topic}
                helperText={errors?.topic?.message}
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="difficulty"
            render={({ field }: any) => (
              <Autocomplete
                disablePortal
                options={difficultyOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option: any, value) =>
                  option.value === value
                }
                value={
                  difficultyOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(event, newValue) => {
                  field.onChange(newValue?.value || "");
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label="Độ khó"
                    error={!!errors.difficulty}
                    helperText={errors?.difficulty?.message}
                  />
                )}
                sx={{ width: 300 }}
              />
            )}
          />
        </div>
        <Typography>Câu trả lời</Typography>
        <div className="flex flex-col gap-y-3">
          {fields &&
            fields.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                  <Controller
                    name={`answers.${index}.isCorrect`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          watch("type") === "SingleChoice" ? (
                            <Radio
                              checked={watch(`answers.${index}.isCorrect`)}
                              onChange={handleAnswerChange(index)}
                            />
                          ) : (
                            <Checkbox
                              checked={watch(`answers.${index}.isCorrect`)}
                              onChange={handleAnswerChange(index)}
                            />
                          )
                        }
                        label={`Đáp án ${index + 1}`}
                      />
                    )}
                  />
                  <Button
                    sx={{ textTransform: "none" }}
                    color="error"
                    disabled={watch("answers").length < 2}
                    startIcon={<DeleteForeverOutlinedIcon />}
                    onClick={() => handleRemoveAnswer(index)}
                  >
                    Xóa đáp án
                  </Button>
                </div>
                <Controller
                  control={control}
                  name={`answers.${index}.content`}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      id="content"
                      label={
                        <>
                          Nội dung <span className="text-red-500">*</span>
                        </>
                      }
                      // error={!!answerErrors?.[index]?.content}
                      // helperText={answerErrors?.[index]?.content?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`answers.${index}.answerOrder`}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      hidden
                      value={index || 0}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            ))}
          {watch("answers").length < 2 && (
            <p className="text-red-500 text-sm">Cần có ít nhất 2 câu trả lời</p>
          )}
          <Button
            sx={{ textTransform: "none", width: "fit-content" }}
            startIcon={<AddIcon />}
            variant="contained"
            color="warning"
            onClick={handleAddAnswer}
          >
            Thêm câu trả lời
          </Button>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            loading={loading}
            type="submit"
            variant="contained"
            disabled={
              !isValid || _.isEmpty(dirtyFields) || isFormUnchanged || loading
            }
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
            Lưu câu hỏi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
