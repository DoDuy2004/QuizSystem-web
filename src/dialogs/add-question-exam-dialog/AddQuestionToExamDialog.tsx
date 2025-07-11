import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import React, { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeepCompareEffect, useThemeMediaQuery } from "../../hooks";
import CloseIcon from "@mui/icons-material/Close";
import type { AppDispatch } from "../../store/store";
import {
  closeAddQuestionToExamDialog,
  selectAddQuestionToExamDialog,
} from "../../store/slices/globalSlice";
import {
  // getQuestionsByQuestionBank,
  getQuestionBanks,
  // selectQuestionBanks,
} from "../../store/slices/questionBankSlice";
import {
  addQuestionToExam,
  createMatrix,
  selectExam,
  setImportStatus,
} from "../../store/slices/examSlice";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../constants/confirm";
import { useParams } from "react-router-dom";
import { getChapters } from "../../store/slices/subjectSlice";
import * as yup from "yup";
import { useForm, Controller, useFieldArray, type Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// type Difficulty = "EASY" | "MEDIUM" | "HARD";

type MatrixRow = {
  chapterId: string;
  difficultyMap: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
};

type FormValues = {
  numberOfQuestions: number;
  matrix: MatrixRow[];
};

// Định nghĩa schema Yup
const schema: any = yup.object().shape({
  matrix: yup
    .array()
    .of(
      yup.object().shape({
        chapterId: yup.string().required(),
        difficultyMap: yup.object().shape({
          EASY: yup
            .number()
            .integer()
            .min(0, "Số câu phải không âm")
            .required(),
          MEDIUM: yup
            .number()
            .integer()
            .min(0, "Số câu phải không âm")
            .required(),
          HARD: yup
            .number()
            .integer()
            .min(0, "Số câu phải không âm")
            .required(),
        }),
      })
    )
    .test(
      "at-least-one-nonzero",
      "Bạn phải nhập ít nhất 1 câu hỏi ở bất kỳ chương nào",
      function (matrix) {
        const total: any = matrix?.reduce((sum: number, row: any) => {
          return (
            sum +
            row.difficultyMap.EASY +
            row.difficultyMap.MEDIUM +
            row.difficultyMap.HARD
          );
        }, 0);
        return total > 0;
      }
    ),
});

const AddQuestionToExamDialog = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const routeParams = useParams();
  const exam = useSelector(selectExam);
  const addQuestionToExamDialog = useSelector(selectAddQuestionToExamDialog);
  // const questionBanks = useSelector(selectQuestionBanks);

  // Khởi tạo react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    setValue,
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      matrix: [],
    },
  });

  // Tính số lượng câu hỏi có sẵn
  // const getAvailableQuestions = () => {
  //   const available: { [chapterId: string]: { [difficulty: string]: number } } =
  //     {};

  //   questions?.forEach((q: any) => {
  //     if (!exam?.questions?.some((eq: any) => eq.id === q.id)) {
  //       if (!available[q.chapter?.id]) {
  //         available[q.chapter?.id] = { EASY: 0, MEDIUM: 0, HARD: 0 };
  //       }
  //       available[q.chapter?.id][q.difficulty] =
  //         (available[q.chapter?.id][q.difficulty] || 0) + 1;
  //     }
  //   });
  //   return available;
  // };

  useDeepCompareEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (addQuestionToExamDialog?.isOpen) {
          // Tải danh sách questionBanks
          const banksRes = await dispatch(getQuestionBanks()).unwrap();
          const banks = banksRes?.data || [];
          // Tự động chọn questionBank đầu tiên
          if (banks.length > 0 && !selectedBank) {
            setSelectedBank(banks[0]);
          }

          // Tải danh sách chương
          const chaptersRes = await dispatch(
            getChapters(exam?.data?.subjectId)
          ).unwrap();
          setChapters(chaptersRes?.data || []);

          // Tải danh sách câu hỏi nếu có selectedBank
          // if (selectedBank?.id) {
          //   const bankRes = await dispatch(
          //     getQuestionsByQuestionBank({ id: selectedBank.id })
          //   )
          //     .unwrap()
          //     .then((res) => {
          //       setQuestions(res?.data || []);
          //     });
          // }

          // Cập nhật matrix trong form
          setValue(
            "matrix",
            chaptersRes?.data.map((chapter: any) => ({
              chapterId: chapter.id,
              difficultyMap: { EASY: 0, MEDIUM: 0, HARD: 0 },
            })) || []
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (!addQuestionToExamDialog?.isOpen) {
        setQuestions([]);
        setChapters([]);
      }
    };
  }, [dispatch, routeParams?.id, addQuestionToExamDialog?.isOpen]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        examId: exam?.data?.id,
        matrix: data.matrix,
      };

      await dispatch(createMatrix({ form: payload }))
        .unwrap()
        .then((res) => {
          console.log({ res });
        });

      dispatch(setImportStatus("succeeded"));

      dispatch(
        showMessage({
          message: `Đã thêm câu hỏi vào đề thi`,
          ...successAnchor,
        })
      );

      dispatch(closeAddQuestionToExamDialog());
    } catch (error: any) {
      let errorMessage = "Không đủ câu hỏi để thêm";

      dispatch(
        showMessage({
          message: errorMessage,
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "error",
        })
      );

      reset({ matrix: [] });
    } finally {
      setLoading(false);
    }
  };

  // const totalSelectedQuestions = (matrix: any[]) =>
  //   matrix.reduce(
  //     (total, chapter) =>
  //       total +
  //       Object.values(chapter.difficultyMap).reduce(
  //         (sum: any, count) => sum + (count || 0),
  //         0
  //       ),
  //     0
  //   );

  return (
    <Dialog
      open={addQuestionToExamDialog?.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => dispatch(closeAddQuestionToExamDialog())}
      aria-describedby="add-question-dialog"
      sx={{
        "& .MuiDialog-paper": {
          margin: isMobile ? 0 : isTablet ? "1.5vh auto" : "2vh auto",
          width: isMobile ? "100vw" : isTablet ? "70%" : "60%",
          maxWidth: isMobile ? "100vw" : isTablet ? "70%" : "800px",
          height: "100%",
          borderRadius: isMobile ? 0 : 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between bg-blue-50 p-4">
        <Typography variant="h6" className="font-semibold">
          Thêm câu hỏi vào đề thi
        </Typography>
        <IconButton
          onClick={() => dispatch(closeAddQuestionToExamDialog())}
          className="text-gray-500"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="p-6">
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <CircularProgress />
              </div>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">Chương</TableCell>
                      <TableCell className="font-semibold text-center">
                        Dễ
                      </TableCell>
                      <TableCell className="font-semibold text-center">
                        Trung bình
                      </TableCell>
                      <TableCell className="font-semibold text-center">
                        Khó
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chapters.map((chapter: any, index: number) => (
                      <TableRow key={chapter.id}>
                        <TableCell>{chapter.name}</TableCell>
                        {["EASY", "MEDIUM", "HARD"].map((difficulty: any) => {
                          // const available =
                          //   getAvailableQuestions()[chapter.id]?.[difficulty] ||
                          //   0;
                          return (
                            <TableCell
                              key={difficulty}
                              className="text-center"
                              padding="none"
                            >
                              <Controller
                                name={
                                  `matrix.${index}.difficultyMap.${difficulty}` as Path<FormValues>
                                }
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    inputProps={{ min: 0 }}
                                    sx={{ width: 80 }}
                                    placeholder="0"
                                    onChange={(e) => {
                                      const value =
                                        parseInt(e.target.value) || 0;
                                      field.onChange(Math.min(value));
                                    }}
                                    error={!!error}
                                    helperText={error?.message}
                                  />
                                )}
                              />
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
            {errors.matrix && (
              <Typography color="error" variant="caption" className="mt-2">
                {errors.matrix.message}
              </Typography>
            )}
          </div>
          <Divider />
          <div className="p-4 flex justify-end gap-x-2">
            <Button
              onClick={() => dispatch(closeAddQuestionToExamDialog())}
              sx={{ textTransform: "none" }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={_.isEmpty(dirtyFields) || !isValid || loading}
              sx={{
                textTransform: "none",
                background:
                  !isValid || _.isEmpty(dirtyFields) || loading
                    ? "gray"
                    : "linear-gradient(to right, #3b82f6, #a855f7)",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 999,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Thêm câu hỏi`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionToExamDialog;
