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
  studentEnterRoom,
} from "../../../../../../store/slices/roomExamSlice";
import _ from "lodash";
import {
  getExambyId,
  getQuestionsByExam,
} from "../../../../../../store/slices/examSlice";
import { selectUser } from "../../../../../../store/slices/userSlice";
import {
  isSubmitted,
  submitExam,
} from "../../../../../../store/slices/studentSlice";
import CircularLoading from "../../../../../../components/CircularLoading";
import { showMessage } from "../../../../../../components/FuseMessage/fuseMessageSlice";
import { errorAnchor } from "../../../../../../constants/confirm";
import { openConfirmationDialog } from "../../../../../../store/slices/confirmationSlice";
import RoomExamManagement from "./components/RoomExamManagement";

// Types
interface Question {
  id: string;
  content: string;
  type: "single" | "multiple";
  answers: Answer[];
}

interface Answer {
  id: string;
  content: string;
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
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const roomExam = useSelector(selectRoomExam);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [examInfo, setExamInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const routeParams = useParams();

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
    if (roomExam?.data?.timeRemaining !== undefined) {
      setTimeRemaining(roomExam?.data?.timeRemaining);
    }
  }, [roomExam]);

  // console.log({ roomExam });

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(roomExam?.data?.startDate);

    if (now === startDate) return;

    if (timeRemaining <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          dispatch(getRoomExambyId({ id }));
          clearInterval(timer);
          if (user?.role === "STUDENT") {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitted]);

  useEffect(() => {
    dispatch(isSubmitted({ roomId: id, studentId: user.id }))
      .unwrap()
      .then((res: any) => {
        setSubmitted(res.submitted);
      });
  }, [id]);

  useEffect(() => {
    const fetchRoomExam = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await dispatch(getRoomExambyId({ id })).unwrap();
          console.log("RoomExam response:", response); // Chỉ log khi fetch
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRoomExam();
  }, [id]);

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      const examId = roomExam?.data.exams?.[0]?.id;
      if (examId) {
        setLoading(true);
        try {
          await Promise.all([
            dispatch(getExambyId({ id: examId }))
              .unwrap()
              .then((res) => {
                setExamInfo(res.data);
              }),
            dispatch(getQuestionsByExam(examId))
              .unwrap()
              .then((res) => {
                setQuestionsData(res.data);
              }),
          ]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (roomExam?.data.id) {
      fetchExamAndQuestions();
    }

    return () => {
      setQuestionsData([]);
      setExamInfo({});
    };
  }, [dispatch, roomExam]);

  const handleSingleChoice = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

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

  const convertToSubmissionFormat = (): SubmissionAnswer[] => {
    const submissionData: SubmissionAnswer[] = [];
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      if (Array.isArray(answerValue)) {
        if (answerValue.length > 0) {
          submissionData.push({
            questionId,
            answerIds: answerValue.filter((id) => id),
          });
        }
      } else {
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

  useEffect(() => {
    if (user?.role === "STUDENT") {
      dispatch(studentEnterRoom(routeParams?.id as string));
    }
  }, [user?.id, routeParams?.id]);

  const calculateProgress = (): number => {
    const answeredQuestions = Object.values(answers).filter((answer) => {
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== "";
    }).length;
    return (answeredQuestions / questionsData.length) * 100;
  };

  const getAnsweredCount = (): number => {
    return Object.values(answers).filter((answer) => {
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== "";
    }).length;
  };

  const handleSubmit = async () => {
    const submissionData = convertToSubmissionFormat();
    const payload = {
      examId: examInfo?.id,
      studentId: user?.id,
      roomId: id,
      answers: submissionData,
    };

    if (submissionData.length === 0) {
      dispatch(showMessage({ message: "Bạn chưa làm bài", ...errorAnchor }));
      return;
    }

    // console.log({ payload });

    setSubmitting(true);

    try {
      await dispatch(submitExam({ form: payload }));
      setSubmitted(true);
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert("Có lỗi xảy ra khi nộp bài!");
    } finally {
      setSubmitting(false);
    }
  };

  const openConfirmDialog = (e: any) => {
    e.stopPropagation();
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            handleSubmit();
          },
          dialogContent: "Bạn có chắc muốn nộp bài thi",
          titleContent: "Nộp bài thi",
          agreeText: "Xác nhận",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
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
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (loading) return <CircularLoading />;

  if (user?.role === "TEACHER" && !loading) {
    return (
      <RoomExamManagement
        examInfo={examInfo}
        roomExam={roomExam}
        timeRemaining={timeRemaining}
      />
    );
  }

  return (
    <div className="grid grid-cols-6 gap-3">
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
                Thời gian: {roomExam?.data?.durationMinutes} phút
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: timeRemaining <= 60 ? "error.main" : "text.primary",
                  mt: 1,
                }}
              >
                ⏳ Thời gian còn lại: {formatTime(timeRemaining)}
              </Typography>
            </div>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.5 }}
            >
              <Typography variant="body2">
                Tiến độ: {Math.round(progress)}% ({answeredCount}/
                {questionsData.length} câu)
              </Typography>
              <Chip
                label={`${answeredCount}/${questionsData.length}`}
                color={
                  answeredCount === questionsData.length ? "success" : "primary"
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
                  Đã trả lời: {answeredCount}/{questionsData.length} câu hỏi
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => openConfirmDialog(e)}
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
      <div className="col-span-4 h-screen overflow-y-scroll">
        {questionsData?.map((question: any, index: number) => (
          <Card key={question.id} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <div className="flex items-start gap-x-1">
                  <Typography
                    className="underline"
                    sx={{ fontWeight: 550 }}
                    fontSize={14}
                  >
                    Câu {index + 1}:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ flex: 1, fontSize: "14px", fontWeight: 500 }}
                    dangerouslySetInnerHTML={{ __html: question.content }}
                  />
                </div>
                <Chip
                  icon={
                    question.type === "MultipleChoice" ? (
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
                          <>
                            {/* <Typography
                              variant="body2"
                              sx={{ fontSize: "13px" }}
                              dangerouslySetInnerHTML={{
                                __html: answer.content,
                              }}
                            /> */}
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px" }}
                            >
                              {answer.content}
                            </Typography>
                          </>
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
                          <>
                            {/* <Typography
                              variant="body2"
                              sx={{ fontSize: "13px" }}
                              dangerouslySetInnerHTML={{
                                __html: answer.content,
                              }}
                            /> */}
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px" }}
                            >
                              {answer.content}
                            </Typography>
                          </>
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
