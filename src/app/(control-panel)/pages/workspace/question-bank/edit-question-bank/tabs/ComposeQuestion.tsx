import { Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  getQuestionById,
  getQuestionsByQuestionBank,
  selectQuestionBank,
} from "../../../../../../../store/slices/questionBankSlice";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import CircularLoading from "../../../../../../../components/CircularLoading";
import QuestionForm from "../components/QuestionForm";

const ComposeQuestion = ({ questions, questionBankId }: any) => {
  const [isActive, setIsActive] = useState<number | null>(null); // Sử dụng null khi chưa chọn
  const routeParams = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const questionBank = useSelector(selectQuestionBank);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [question, setQuestion] = useState<any>({}); // Dữ liệu câu hỏi
  const [noOfQuestions, setNoOfQuestions] = useState(questions?.length || 0);
  const [questionsData, setQuestionsData] = useState(questions || []);
  const hasFetched = useRef(false);

  useDeepCompareEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current || !routeParams.id) return;

      hasFetched.current = true;
      setLoading(true);

      try {
        const res = await dispatch(
          getQuestionsByQuestionBank({ id: routeParams.id || questionBankId })
        ).unwrap();

        console.log({ res });

        const data = Array.isArray(res?.data) ? res.data : [];
        setNoOfQuestions(data.length);
        setQuestionsData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setNoOfQuestions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, routeParams?.id, questionBankId]);

  useDeepCompareEffect(() => {
    if (routeParams.id && questionsData?.length > 0) {
      console.log("hrere");
      setQuestionLoading(true);
      dispatch(getQuestionById(questions[0]?.id))
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
    }
  }, [dispatch, routeParams?.id, questionsData]);

  const handleGetQuestion = (index: number) => {
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
    }
  };

  console.log({ questionsData });

  const handleAddQuestion = () => {
    const newIndex = noOfQuestions;
    setIsActive(newIndex); // Chọn index mới
    setQuestion({}); // Làm mới form
    setNoOfQuestions((prev: any) => prev + 1); // Tăng số lượng câu hỏi
  };

  console.log({ noOfQuestions });

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
                startIcon={<DeleteIcon />}
                color="error"
                size="small"
                variant="contained"
                sx={{ textTransform: "none" }}
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
