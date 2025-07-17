import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Chip,
  LinearProgress,
  Divider,
  Avatar,
  Paper,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Close,
  Quiz,
  Check,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoading from "../../../../../../components/CircularLoading";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import { getStudentExamDetail } from "../../../../../../store/slices/roomExamSlice";

interface Question {
  id: string;
  content: string;
  type: "SingleChoice" | "MultipleChoice";
  answers: Answer[];
  correctAnswerIds: string[];
}

interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
}

interface ExamResultData {
  exam: {
    id: string;
    name: string;
    subject: {
      name: string;
    };
    durationMinutes: number;
  };
  student: {
    id: string;
    fullName: string;
    email: string;
  };
  submittedAt: string;
  durationTaken: number;
  grade: number; // Thêm trường grade từ API
  questions: Question[];
  studentAnswers: {
    [questionId: string]: string[];
  };
}

const StudentExamDetail = () => {
  const [loading, setLoading] = useState(true);
  const [examResult, setExamResult] = useState<ExamResultData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!routeParams?.studentId || !routeParams?.studentExamId) {
          throw new Error("Thiếu thông tin sinh viên hoặc bài thi");
        }

        const resultAction = await dispatch(
          getStudentExamDetail({
            studentId: routeParams.studentId,
            studentExamId: routeParams.studentExamId,
          })
        );

        if (getStudentExamDetail.fulfilled.match(resultAction)) {
          setExamResult(resultAction.payload);
        } else {
          throw new Error(resultAction.error?.message || "Lỗi khi tải dữ liệu");
        }
      } catch (error) {
        console.error("Fetch exam detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, routeParams?.studentId, routeParams?.studentExamId]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Chưa nộp";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = Math.floor(absMinutes % 60);
    const seconds = Math.round((absMinutes % 1) * 60); // Lấy phần thập phân và chuyển thành giây
    let result = "";
    if (hours > 0) result += `${hours} giờ `;
    result += `${mins} phút `;
    result += `${seconds} giây`;
    return result.trim();
  };

  const getCorrectCount = () => {
    if (!examResult) return 0;

    return examResult.questions.filter((question) => {
      const studentAnswerIds = examResult.studentAnswers[question.id] || [];
      return (
        question.correctAnswerIds.every((id) =>
          studentAnswerIds.includes(id)
        ) &&
        studentAnswerIds.every((id) => question.correctAnswerIds.includes(id))
      );
    }).length;
  };

  if (loading) return <CircularLoading />;
  if (!examResult) return <div>Không tìm thấy dữ liệu bài thi</div>;

  const score = examResult.grade; // Sử dụng grade từ API thay vì tính toán
  const correctCount = getCorrectCount();

  return (
    <>
      <div className="flex items-center gap-x-4">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Chi tiết bài làm
        </Typography>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {/* Phần thông tin bên trái */}
        <div className="col-span-2 h-fit">
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <div className="flex flex-col gap-y-1.5 h-fit">
                <div className="flex items-center gap-x-2">
                  <Quiz sx={{ fontSize: 24, color: "primary.main" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {examResult.exam.name}
                  </Typography>
                </div>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Môn: {examResult.exam.subject.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Thời gian làm bài: {examResult.exam.durationMinutes} phút
                </Typography>
              </div>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: 24,
                  }}
                >
                  {examResult.student.fullName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {examResult.student.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {examResult.student.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Thời gian nộp bài:</strong>{" "}
                  {formatDateTime(examResult.submittedAt)}
                </Typography>
                <Typography variant="body2">
                  <strong>Thời gian làm bài thực tế:</strong>{" "}
                  {formatDuration(examResult.durationTaken)}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Điểm số
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color:
                      score >= 8
                        ? "success.main"
                        : score >= 5
                        ? "warning.main"
                        : "error.main",
                  }}
                >
                  {score.toFixed(1)}/10
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={score * 10}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mt: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        score >= 8
                          ? "success.main"
                          : score >= 5
                          ? "warning.main"
                          : "error.main",
                    },
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Đã làm đúng: {correctCount}/{examResult.questions.length} câu
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                  <strong>Chú thích:</strong>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    <li>✓ Đáp án đúng</li>
                    <li>✗ Đáp án sai</li>
                    <li>Viền đậm: Đáp án sinh viên chọn</li>
                  </Box>
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Phần câu hỏi và đáp án bên phải */}
        <div className="col-span-4 h-screen overflow-y-scroll">
          {examResult.questions.map((question, index) => {
            const studentAnswerIds =
              examResult.studentAnswers[question.id] || [];
            const isCorrect =
              question.correctAnswerIds.every((id) =>
                studentAnswerIds.includes(id)
              ) &&
              studentAnswerIds.every((id) =>
                question.correctAnswerIds.includes(id)
              );

            return (
              <Card
                key={question.id}
                sx={{
                  mb: 2,
                  // borderLeft: `4px solid ${isCorrect ? "#4caf50" : "#f44336"}`,
                }}
              >
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
                    {isCorrect ? (
                      <Check sx={{ color: "success.main" }} />
                    ) : (
                      <Close sx={{ color: "error.main" }} />
                    )}
                  </Box>

                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    {question.type === "SingleChoice" ? (
                      <Box>
                        {question.answers.map((answer) => {
                          const isSelected = studentAnswerIds.includes(
                            answer.id
                          );
                          const isRightAnswer =
                            question.correctAnswerIds.includes(answer.id);

                          return (
                            <FormControlLabel
                              key={answer.id}
                              value={answer.id}
                              control={
                                <Radio
                                  size="small"
                                  checked={isSelected}
                                  sx={{
                                    color: isRightAnswer
                                      ? "success.main"
                                      : isSelected
                                      ? "error.main"
                                      : "default",
                                    "&.Mui-checked": {
                                      color: isRightAnswer
                                        ? "success.main"
                                        : "error.main",
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "13px",
                                    color: isRightAnswer
                                      ? "success.main"
                                      : isSelected && !isRightAnswer
                                      ? "error.main"
                                      : "inherit",
                                  }}
                                >
                                  {answer.content}
                                </Typography>
                              }
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                                p: 0.5,
                                borderRadius: 1,
                                backgroundColor: isRightAnswer
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : isSelected && !isRightAnswer
                                  ? "rgba(244, 67, 54, 0.1)"
                                  : "transparent",
                                border: isSelected
                                  ? "2px solid #1976d2"
                                  : "1px solid transparent",
                                position: "relative",
                                "&:after": {
                                  position: "absolute",
                                  right: 8,
                                  ...(isRightAnswer
                                    ? {
                                        content: '"✓"',
                                        color: "success.main",
                                      }
                                    : isSelected && !isRightAnswer
                                    ? {
                                        content: '"✗"',
                                        color: "error.main",
                                      }
                                    : {}),
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    ) : (
                      <Box>
                        {question.answers.map((answer) => {
                          const isSelected = studentAnswerIds.includes(
                            answer.id
                          );
                          const isRightAnswer =
                            question.correctAnswerIds.includes(answer.id);

                          return (
                            <FormControlLabel
                              key={answer.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={isSelected}
                                  sx={{
                                    color: isRightAnswer
                                      ? "success.main"
                                      : isSelected
                                      ? "error.main"
                                      : "default",
                                    "&.Mui-checked": {
                                      color: isRightAnswer
                                        ? "success.main"
                                        : "error.main",
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "13px",
                                    color: isRightAnswer
                                      ? "success.main"
                                      : isSelected && !isRightAnswer
                                      ? "error.main"
                                      : "inherit",
                                  }}
                                >
                                  {answer.content}
                                </Typography>
                              }
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                                p: 0.5,
                                borderRadius: 1,
                                backgroundColor: isRightAnswer
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : isSelected && !isRightAnswer
                                  ? "rgba(244, 67, 54, 0.1)"
                                  : "transparent",
                                border: isSelected
                                  ? "2px solid #1976d2"
                                  : "1px solid transparent",
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </FormControl>

                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1,
                      backgroundColor: isCorrect
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(244, 67, 54, 0.1)",
                      borderRadius: 1,
                      border: `1px solid ${isCorrect ? "#4caf50" : "#f44336"}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "12px", fontWeight: 500 }}
                      color={isCorrect ? "success.main" : "error.main"}
                    >
                      {isCorrect ? "✓ Câu trả lời đúng" : "✗ Câu trả lời sai"}
                    </Typography>
                    {!isCorrect && question.correctAnswerIds.length > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "12px", mt: 1 }}
                      >
                        <strong>Đáp án đúng:</strong>{" "}
                        {question.answers
                          .filter((a) =>
                            question.correctAnswerIds.includes(a.id)
                          )
                          .map((a) => a.content)
                          .join(", ")}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StudentExamDetail;
