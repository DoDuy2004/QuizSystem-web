import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
  Autocomplete,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  // ListItemText,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import React, { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeepCompareEffect, useThemeMediaQuery } from "../../hooks";
import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
import type { AppDispatch } from "../../store/store";
import {
  closeAddQuestionToExamDialog,
  selectAddQuestionToExamDialog,
} from "../../store/slices/globalSlice";
import {
  // getQuestionBanks,
  getQuestionsByQuestionBank,
  selectQuestionBanks,
} from "../../store/slices/questionBankSlice";
import _ from "lodash";
import {
  addQuestionToExam,
  getQuestionsByExam,
  selectExam,
} from "../../store/slices/examSlice";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../constants/confirm";
import { useParams } from "react-router-dom";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
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
  const [selectedQuestions, setSelectedQuestions] = useState<any>([]);
  const routeParams = useParams();
  // const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const exam = useSelector(selectExam);
  const addQuestionToExamDialog = useSelector(selectAddQuestionToExamDialog);
  const questionBanks = useSelector(selectQuestionBanks);

  useDeepCompareEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (addQuestionToExamDialog?.isOpen && !_.isEmpty(selectedBank)) {
          const bankRes = await dispatch(
            getQuestionsByQuestionBank({ id: selectedBank?.id })
          ).unwrap();

          if (routeParams?.id) {
            dispatch(getQuestionsByExam(routeParams.id)).unwrap();
          }

          setQuestions(bankRes?.data || []);

          // const existingQuestionIds = exam?.questions?.map((q: any) => q.id);
          // setSelectedQuestions(existingQuestionIds);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (!addQuestionToExamDialog?.isOpen) {
        // setSelectedBank(null); 
        setQuestions([]);
        setSelectedQuestions([]);
      }
    };
  }, [
    dispatch,
    selectedBank,
    routeParams?.id,
    addQuestionToExamDialog?.isOpen,
  ]);

  const handleBankChange = (event: any, newValue: any) => {
    setSelectedBank(newValue);
    setSelectedQuestions([]);
  };

  const handleQuestionToggle = (questionId: any) => () => {
    if (!exam?.questions?.some((q: any) => q.id === questionId)) {
      setSelectedQuestions((prev: any) =>
        prev.includes(questionId)
          ? prev.filter((id: any) => id !== questionId)
          : [...prev, questionId]
      );
    }
  };

  const handleSelectAll = () => {
    const availableQuestions = questions.filter(
      (q: any) => !exam?.questions?.some((eq: any) => eq.id === q.id)
    );

    console.log({ availableQuestions });

    if (selectedQuestions.length === availableQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(availableQuestions.map((q: any) => q.id));
    }
  };

  const handleAddQuestions = async () => {
    setLoading(true);
    try {
      const payload = {
        questionScores: selectedQuestions.map((questionId: string) => {
          const question: any = questions.find((q: any) => q.id === questionId);
          return {
            question: {
              id: question.id,
              topic: question.topic,
              type: question.type,
              content: question.content.trim(),
              status: question.status || 0,
              difficulty: question.difficulty,
              image: question.image,
              chapterId: question.chapterId,
              answers: question.answers,
              questionBankId: question.questionBankId,
              createdBy: question.createdBy,
            },
            score: 0,
          };
        }),
        examId: exam?.data?.id,
      };

      await dispatch(
        addQuestionToExam({ id: exam?.data?.id, form: payload })
      ).unwrap();

      dispatch(
        showMessage({
          message: `Đã thêm ${selectedQuestions.length} câu hỏi vào đề thi`,
          ...successAnchor,
        })
      );

      dispatch(closeAddQuestionToExamDialog());

      // setSelectedQuestions([]);

      dispatch(closeAddQuestionToExamDialog());
    } catch (error) {
      dispatch(
        showMessage({
          message: "Có lỗi xảy ra khi thêm câu hỏi",
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "error",
        })
      );

      console.error("Error adding questions to exam:", error);
    } finally {
      setLoading(false);
    }
  };

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

      <DialogContent className="p-0 flex flex-col">
        <div className="p-4">
          <Autocomplete
            options={questionBanks}
            getOptionLabel={(option) => option.name}
            value={selectedBank}
            onChange={handleBankChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn ngân hàng câu hỏi"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </div>
        <Divider />

        {selectedBank && (
          <>
            <div className="p-4 flex justify-between items-center">
              <Typography variant="subtitle1">
                {questions?.length} câu hỏi
              </Typography>
              <Button
                size="small"
                onClick={handleSelectAll}
                sx={{ textTransform: "none" }}
                className="text-blue-600"
              >
                {selectedQuestions.length ===
                questions.filter(
                  (q: any) =>
                    !exam?.questions?.some((eq: any) => eq.id === q.id)
                ).length
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </Button>
            </div>
            <Divider />
            <div className="flex-1 overflow-y-auto">
              <List dense className="w-full">
                {questions?.map((question: any) => {
                  const isInExam = exam?.questions?.some(
                    (q: any) => q.id === question.id
                  );
                  const isSelected =
                    selectedQuestions.includes(question.id) || isInExam;

                  return (
                    <ListItem
                      key={question.id}
                      disablePadding
                      secondaryAction={
                        <Chip
                          label={question.difficulty}
                          size="small"
                          sx={{ fontSize: 12 }}
                          color={
                            question.difficulty === "HARD"
                              ? "error"
                              : question.difficulty === "MEDIUM"
                              ? "warning"
                              : "success"
                          }
                        />
                      }
                    >
                      <ListItemButton
                        role={undefined}
                        onClick={handleQuestionToggle(question.id)}
                        dense
                        disabled={isInExam}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={isSelected}
                            tabIndex={-1}
                            disableRipple
                            disabled={isInExam}
                          />
                        </ListItemIcon>
                        <Typography
                          fontSize={14}
                          fontWeight={500}
                          component="div"
                          dangerouslySetInnerHTML={{
                            __html: question?.content || "",
                          }}
                          sx={{
                            opacity: isInExam ? 0.7 : 1,
                            fontStyle: isInExam ? "italic" : "normal",
                          }}
                        />
                        {isInExam && (
                          <Chip
                            label="Đã có trong đề"
                            size="small"
                            color="info"
                            sx={{ ml: 1, fontSize: 11 }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </>
        )}
      </DialogContent>
      <Divider />
      <div className="p-4 flex justify-end gap-x-2">
        <Button
          onClick={() => dispatch(closeAddQuestionToExamDialog())}
          className="mr-2"
          sx={{ textTransform: "none" }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          disabled={selectedQuestions.length === 0 || loading}
          onClick={handleAddQuestions}
          sx={{ textTransform: "none" }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Thêm ${selectedQuestions.length} câu hỏi`
          )}
        </Button>
      </div>
    </Dialog>
  );
};

export default AddQuestionToExamDialog;
