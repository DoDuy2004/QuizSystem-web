"use client";

import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
  Button,
  Alert,
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Quiz } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch } from "../../../../../../store/store";
import {
  getRoomExambyId,
  selectRoomExam,
} from "../../../../../../store/slices/roomExamSlice";
import _ from "lodash";
import {
  getExambyId,
  getQuestionsByExam,
  selectExamDetail,
} from "../../../../../../store/slices/examSlice";
import { selectUser } from "../../../../../../store/slices/userSlice";
import Student from "../../student/Student";
import {
  isSubmitted,
  submitExam,
} from "../../../../../../store/slices/studentSlice";
import CircularLoading from "../../../../../../components/CircularLoading";

// Types
interface Question {
  id: string;
  questionText: string;
  type: "single" | "multiple";
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
}

interface SubmissionAnswer {
  questionId: string;
  answerIds: string[];
}

const RoomExamDetail = () => {
  const [answers, setAnswers] = useState<{
    [questionId: string]: string | string[];
  }>({});
  const [submitting, setSubmitting] = useState(false);
  // const [submissionResult, setSubmissionResult] = useState<SubmissionAnswer[]>([])

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const roomExam = useSelector(selectRoomExam);
  const [questionsData, setQuestionsData] = useState([]);
  const [examInfo, setExamInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  // const exam = useSelector(selectExamDetail);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const user = useSelector(selectUser);
  const [submitted, setSubmitted] = useState(false);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (examInfo?.durationMinutes) {
      setTimeLeft(examInfo.durationMinutes * 60); // convert phút => giây
    }
  }, [examInfo]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Tự động nộp bài khi hết giờ
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  useEffect(() => {
    dispatch(isSubmitted({ roomId: id, studentId: user.id }))
      .unwrap()
      .then((res: any) => {
        console.log({ res });
        setSubmitted(res.submitted);
      });
  }, [id]);

  useEffect(() => {
    const fetchRoomExam = async () => {
      if (id) {
        setLoading(true);
        try {
          await dispatch(getRoomExambyId({ id })).unwrap();
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRoomExam();
  }, [id]);

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      const examId = roomExam?.data?.exams?.[0]?.id;
      if (examId) {
        setLoading(true);
        try {
          await Promise.all([
            dispatch(getExambyId({ id: examId }))
              .unwrap()
              .then((res) => {
                console.log({ res });
                setExamInfo(res.data);
              }),
            dispatch(getQuestionsByExam(examId))
              .unwrap()
              .then((res) => {
                console.log({ res });
                setQuestionsData(res.data);
              }),
          ]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!_.isEmpty(roomExam?.data?.exams)) {
      fetchExamAndQuestions();
    }
  }, [dispatch, roomExam]);

  // Xử lý chọn đáp án cho single choice
  const handleSingleChoice = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  // Xử lý chọn đáp án cho multiple choice
  const handleMultipleChoice = (
    questionId: string,
    answerId: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || [];
      const newAnswers = checked
        ? [...currentAnswers, answerId]
        : currentAnswers.filter((id) => id !== answerId);

      return {
        ...prev,
        [questionId]: newAnswers,
      };
    });
  };

  // Chuyển đổi answers thành format submit
  const convertToSubmissionFormat = (): SubmissionAnswer[] => {
    const submissionData: SubmissionAnswer[] = [];

    Object.entries(answers).forEach(([questionId, answerValue]) => {
      if (Array.isArray(answerValue)) {
        // Multiple choice: tạo một object với array answerIds
        if (answerValue.length > 0) {
          submissionData.push({
            questionId,
            answerIds: answerValue.filter((id) => id), // Lọc bỏ các giá trị empty
          });
        }
      } else {
        // Single choice: tạo một object với array chứa một answerId
        if (answerValue) {
          submissionData.push({
            questionId,
            answerIds: [answerValue],
          });
        }
      }
    });

    return submissionData;
  };

  // Tính toán tiến độ
  const calculateProgress = (): number => {
    const answeredQuestions = Object.values(answers).filter((answer) => {
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return answer !== "";
    }).length;

    return (answeredQuestions / questionsData?.length) * 100;
  };

  const getAnsweredCount = (): number => {
    return Object.values(answers).filter((answer) => {
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return answer !== "";
    }).length;
  };

  // Xử lý submit
  const handleSubmit = async () => {
    const submissionData = convertToSubmissionFormat();

    const payload = {
      examId: examInfo?.id,
      studentId: user?.id,
      roomId: id,
      answers: submissionData,
    };

    // if (submissionData.length === 0) {
    //   alert("Vui lòng trả lời ít nhất một câu hỏi!");
    //   return;
    // }

    console.log({ payload });

    setSubmitting(true);

    try {
      // Mock API call
      // await new Promise((resolve) => setTimeout(resolve, 1500))
      dispatch(submitExam({ form: payload }));
      // setSubmissionResult(submissionData)
      setSubmitted(true);
      // console.log("Dữ liệu đã submit:", submissionData);
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert("Có lỗi xảy ra khi nộp bài!");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = calculateProgress();
  const answeredCount = getAnsweredCount();

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 1 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ textAlign: "center", p: 2 }}>
            <CheckCircle sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              Nộp bài thành công (Bạn đã hoàn thành bài thi)! 🎉
            </Typography>
            {/* <Typography variant="body2" color="text.secondary" gutterBottom>
              Bạn đã trả lời {answeredCount}/{questionsData?.length} câu hỏi
            </Typography> */}
          </CardContent>
        </Card>
        {/* <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dữ liệu đã submit (Format API):
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
              <Typography component="pre" sx={{ fontSize: "14px", overflow: "auto" }}>
                {JSON.stringify(submissionResult, null, 2)}
              </Typography>
            </Paper>
          </CardContent>
        </Card> */}
      </Box>
    );
  }

  if (loading) return <CircularLoading />;

  return (
    <div className="grid grid-cols-6 gap-3">
      {/* Header */}
      <div className="col-span-2 h-fit">
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <div className="flex flex-col gap-y-1.5 h-fit">
              <div className="flex items-center gap-x-2">
                <Quiz sx={{ fontSize: 24, color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {examInfo?.name}
                </Typography>
              </div>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Môn: {examInfo?.subject?.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Thời gian: {examInfo?.durationMinutes} phút
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: timeLeft <= 60 ? "error.main" : "text.primary",
                  mt: 1,
                }}
              >
                ⏳ Thời gian còn lại: {formatTime(timeLeft)}
              </Typography>
            </div>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.5 }}
            >
              <Typography variant="body2">
                Tiến độ: {Math.round(progress)}% ({answeredCount}/
                {questionsData?.length} câu)
              </Typography>
              <Chip
                label={`${answeredCount}/${questionsData?.length}`}
                color={
                  answeredCount === questionsData?.length
                    ? "success"
                    : "primary"
                }
                size="small"
                sx={{ fontSize: "11px", height: "20px" }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Alert severity="info" sx={{ mt: 1.5, p: 1 }}>
              <Typography variant="body2" sx={{ fontSize: "12px" }}>
                <strong>Hướng dẫn:</strong> Chọn đáp án phù hợp cho mỗi câu hỏi.
                Câu hỏi có thể chọn một hoặc nhiều đáp án sẽ được đánh dấu rõ
                ràng.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Sẵn sàng nộp bài?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "12px" }}
                >
                  Đã trả lời: {answeredCount}/{questionsData?.length} câu hỏi
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{
                    minWidth: 120,
                    textTransform: "none",
                    fontSize: "13px",
                  }}
                >
                  {submitting ? (
                    <>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid #fff",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          mr: 1,
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                      Đang nộp...
                    </>
                  ) : (
                    "Nộp bài"
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Questions */}
      <div className="col-span-4 h-screen overflow-y-scroll">
        {questionsData?.map((question: any, index: number) => (
          <Card key={question.id} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ flex: 1, fontSize: "14px", fontWeight: 500 }}
                >
                  Câu {index + 1}: {question?.content}
                </Typography>
                <Chip
                  icon={
                    question?.type === "MultipleChoice" ? (
                      <CheckCircle sx={{ fontSize: 14 }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ fontSize: 14 }} />
                    )
                  }
                  label={
                    question.type === "MultipleChoice"
                      ? "Nhiều lựa chọn"
                      : "Một lựa chọn"
                  }
                  size="small"
                  color={
                    question.type === "MultipleChoice" ? "secondary" : "primary"
                  }
                  variant="outlined"
                  sx={{ fontSize: "10px", height: "22px" }}
                />
              </Box>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                {question.type === "SingleChoice" ? (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleSingleChoice(question.id, e.target.value)
                    }
                  >
                    {question?.answers?.map((answer: any) => (
                      <FormControlLabel
                        key={answer.id}
                        value={answer.id}
                        control={<Radio size="small" />}
                        label={
                          <Typography variant="body2" sx={{ fontSize: "13px" }}>
                            {answer.content}
                          </Typography>
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                          p: 0.5,
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                          border:
                            answers[question.id] === answer.id
                              ? "2px solid #1976d2"
                              : "1px solid transparent",
                        }}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <Box>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ mb: 1, fontWeight: "bold", fontSize: "12px" }}
                    >
                      💡 Có thể chọn nhiều đáp án
                    </Typography>
                    {question.answers.map((answer: any) => (
                      <FormControlLabel
                        key={answer.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={
                              Array.isArray(answers[question.id]) &&
                              (answers[question.id] as string[]).includes(
                                answer.id
                              )
                            }
                            onChange={(e) =>
                              handleMultipleChoice(
                                question.id,
                                answer.id,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: "13px" }}>
                            {answer.content}
                          </Typography>
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                          p: 0.5,
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                          border:
                            Array.isArray(answers[question.id]) &&
                            (answers[question.id] as string[]).includes(
                              answer.id
                            )
                              ? "2px solid #9c27b0"
                              : "1px solid transparent",
                        }}
                      />
                    ))}
                  </Box>
                )}
              </FormControl>

              {/* Hiển thị đáp án đã chọn */}
              <Box
                sx={{
                  mt: 1.5,
                  p: 1,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  border: "1px solid #e9ecef",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "12px" }}
                >
                  <strong>Đáp án đã chọn:</strong>{" "}
                  {Array.isArray(answers[question.id]) ? (
                    (answers[question.id] as string[]).length > 0 ? (
                      <Chip
                        label={`${
                          (answers[question.id] as string[]).length
                        } đáp án`}
                        size="small"
                        color="secondary"
                        sx={{ fontSize: "10px", height: "18px" }}
                      />
                    ) : (
                      <em>Chưa chọn</em>
                    )
                  ) : answers[question.id] ? (
                    <Chip
                      label="Đã chọn"
                      size="small"
                      color="primary"
                      sx={{ fontSize: "10px", height: "18px" }}
                    />
                  ) : (
                    <em>Chưa chọn</em>
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomExamDetail;
