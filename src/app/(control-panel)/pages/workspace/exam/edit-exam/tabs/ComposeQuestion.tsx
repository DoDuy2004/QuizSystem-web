import { Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  deleteQuestion,
  getQuestionById,
  getQuestionsByQuestionBank,
} from "../../../../../../../store/slices/questionBankSlice";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import CircularLoading from "../../../../../../../components/CircularLoading";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import _ from "lodash";
import { openAddMultiQuestionsDialog } from "../../../../../../../store/slices/globalSlice";
import { openConfirmationDialog } from "../../../../../../../store/slices/confirmationSlice";
import QuestionForm from "../../../question-bank/edit-question-bank/components/QuestionForm";

const ComposeQuestion = ({ questions }: any) => {
  const [isActive, setIsActive] = useState<number | null>(0); // Sử dụng null khi chưa chọn
  const routeParams = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [question, setQuestion] = useState<any>({}); // Dữ liệu câu hỏi
  const [noOfQuestions, setNoOfQuestions] = useState(questions?.length || 1);
  const [questionsData, setQuestionsData] = useState(questions || []);

  useDeepCompareEffect(() => {
    if (routeParams.id && questionsData?.length > 0) {
      dispatch(getQuestionById(questions[0]?.questionId))
        .then((res) => {
          setQuestion(res.payload.data);
        })
        .catch((error) => {
          console.error("Error fetching question:", error);
        })
        .finally(() => {
          setQuestionLoading(false);
          setIsActive(0);
        });
    } else {
      setQuestionLoading(false);
    }
  }, [dispatch, routeParams?.id, questionsData]);

  const handleGetQuestion = (index: number) => {
    if (index === isActive) {
      setQuestionLoading(false);
      return;
    }

    setIsActive(index);
    const questionId = questionsData?.[index]?.id;

    if (questionId) {
      setQuestionLoading(true);
      dispatch(getQuestionById(questionId))
        .then((res) => {
          setQuestion(res.payload.data);
        })
        .catch((error) => {
          console.error("Error fetching question:", error);
        })
        .finally(() => {
          setQuestionLoading(false);
        });
    } else {
      setQuestionLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!question?.id) return;

    try {
      await dispatch(deleteQuestion(question.id)).unwrap();

      // Cập nhật state ngay lập tức
      const newQuestionsData = questionsData.filter(
        (q: any) => q.id !== question.id
      );
      setQuestionsData(newQuestionsData);
      setNoOfQuestions(newQuestionsData.length);

      // Reset active question
      if (newQuestionsData.length > 0) {
        setIsActive(0);
        await dispatch(getQuestionById(newQuestionsData[0].id)).then((res) =>
          setQuestion(res.payload.data)
        );
      } else {
        setIsActive(null);
        setQuestion({});
      }
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);
    }
  };

  const openConfirmDialog = () => {
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            handleDeleteQuestion();
          },
          dialogContent: "Bạn có chắc muốn xóa ngân hàng câu hỏi này",
          titleContent: "Xóa ngân hàng câu hỏi",
          agreeText: "Xóa",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  const handleAddQuestion = () => {
    const newIndex = noOfQuestions;
    setIsActive(newIndex);
    setQuestion({});
    setNoOfQuestions((prev: any) => prev + 1);
  };

  // console.log({ noOfQuestions });

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="px-6 py-4 bg-white rounded-md shadow-md col-span-2 flex flex-col gap-y-5 h-fit">
        <Typography>Danh mục câu hỏi</Typography>
        {loading ? (
          <CircularLoading />
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              <Button
                startIcon={<AddIcon />}
                color="primary"
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={handleAddQuestion}
              >
                Thêm câu hỏi
              </Button>
              <Button
                startIcon={<EditNoteOutlinedIcon />}
                color="primary"
                size="small"
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Thêm bằng văn bản
              </Button>
              <Button
                startIcon={<AttachFileOutlinedIcon />}
                color="primary"
                size="small"
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => dispatch(openAddMultiQuestionsDialog())}
              >
                Thêm hàng loạt
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                size="small"
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={openConfirmDialog}
              >
                Xóa câu hỏi
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {noOfQuestions > 0 &&
                Array.from({ length: noOfQuestions }, (_, index) => (
                  <Button
                    key={index}
                    variant={isActive === index ? "contained" : "outlined"}
                    color="primary"
                    size="small"
                    sx={{
                      minWidth: "fit-content",
                      width: 40,
                      height: 40,
                      fontWeight: 500,
                    }}
                    onClick={() => handleGetQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
            </div>
          </>
        )}
      </div>
      <div className="px-6 py-4 bg-white rounded-md shadow-md col-span-4 h-fit">
        {questionLoading ? (
          <CircularLoading />
        ) : (
          <QuestionForm questionData={question} />
        )}
      </div>
    </div>
  );
};

export default ComposeQuestion;
