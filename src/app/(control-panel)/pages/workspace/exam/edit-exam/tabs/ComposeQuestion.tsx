import { Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  // deleteQuestion,
  getQuestionById,
} from "../../../../../../../store/slices/questionBankSlice";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import CircularLoading from "../../../../../../../components/CircularLoading";
// import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import _ from "lodash";
import {
  // openAddMultiQuestionsDialog,
  openAddQuestionToExamDialog,
} from "../../../../../../../store/slices/globalSlice";
import { openConfirmationDialog } from "../../../../../../../store/slices/confirmationSlice";
import QuestionForm from "../components/QuestionForm";
import {
  deleteQuestionFromExam,
  getQuestionsByExam,
  selectExam,
  selectImportStatus,
  setImportStatus,
} from "../../../../../../../store/slices/examSlice";

const ComposeQuestion = () => {
  const [isActive, setIsActive] = useState<number | null>(0); // Sử dụng null khi chưa chọn
  const routeParams = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(true);
  const exam = useSelector(selectExam);
  const [question, setQuestion] = useState<any>({}); // Dữ liệu câu hỏi
  const [noOfQuestions, setNoOfQuestions] = useState(
    exam?.questions.length || 1
  );
  const [questionsData, setQuestionsData] = useState(exam?.questions || []);
  const importStatus = useSelector(selectImportStatus);

  useEffect(() => {
    const fetchAfterImport = async () => {
      if (importStatus === "succeeded") {
        setLoading(true);
        try {
          const res = await dispatch(
            // getQuestionsByQuestionBank({ id: routeParams.id || questionBankId })
            getQuestionsByExam(exam?.data?.id || (routeParams?.id as string))
          ).unwrap();

          const data = Array.isArray(res?.data) ? res.data : [];
          setNoOfQuestions(data.length || 1);
          // setQuestionsData(data);
        } catch {
          setNoOfQuestions(0);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAfterImport();
  }, [importStatus]);

  useDeepCompareEffect(() => {
    const fetchData = async () => {
      if (!routeParams.id) {
        setLoading(false);
        return;
      }
      // setLoading(true);
      try {
        const res = await dispatch(
          getQuestionsByExam(routeParams?.id)
        ).unwrap();

        // console.log({ res });
        const data = Array.isArray(res?.data) ? res.data : [];
        setNoOfQuestions(data.length || 1);
        setQuestionsData(data);
      } catch (error) {
        setNoOfQuestions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, routeParams?.id]);

  useDeepCompareEffect(() => {
    if (routeParams.id && exam?.questions?.length > 0) {
      dispatch(getQuestionById(exam?.questions[0]?.id))
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
  }, [dispatch, routeParams?.id, exam?.questions]);

  const handleGetQuestion = (index: number) => {
    if (index === isActive) {
      setQuestionLoading(false);
      return;
    }

    setIsActive(index);
    const questionId = exam?.questions?.[index]?.id;

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
      setQuestion({});
      setQuestionLoading(false);
    }
  };

  const openConfirmDialog = () => {
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(
              deleteQuestionFromExam({
                examId: routeParams?.id,
                questionId: question?.id,
              })
            );
            dispatch(setImportStatus("succeeded"));
          },
          dialogContent: "Bạn có chắc muốn xóa câu hỏi này",
          titleContent: "Xóa câu hỏi",
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
                // disabled={questionsData.length >= noOfQuestions}
              >
                Thêm câu hỏi
              </Button>
              <Button
                startIcon={<EditNoteOutlinedIcon />}
                color="primary"
                size="small"
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => dispatch(openAddQuestionToExamDialog())}
              >
                Thêm từ ngân hàng
              </Button>
              {/* <Button
                startIcon={<AttachFileOutlinedIcon />}
                color="primary"
                size="small"
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => dispatch(openAddMultiQuestionsDialog())}
              >
                Thêm hàng loạt
              </Button> */}
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                size="small"
                disabled={_.isEmpty(question)}
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => openConfirmDialog()}
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
