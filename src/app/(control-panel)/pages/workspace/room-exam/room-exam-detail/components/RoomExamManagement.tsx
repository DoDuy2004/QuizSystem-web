import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Quiz,
  People,
  AccessTime,
  CheckCircle,
  HourglassEmpty,
  Visibility,
  Refresh,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoading from "../../../../../../../components/CircularLoading";
import type { AppDispatch } from "../../../../../../../store/store";
import { getStudentStatus } from "../../../../../../../store/slices/roomExamSlice";
import signalrConnection from "../../../../../../../utils/signalR";
import { showMessage } from "../../../../../../../components/FuseMessage/fuseMessageSlice";
import { successAnchor } from "../../../../../../../constants/confirm";

const RoomExamManagement = ({ examInfo, roomExam, timeRemaining }: any) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  // const roomExam = useSelector((state: any) => state.roomExam);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  // const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const routeParams = useParams();
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(roomExam?.data?.startDate);

    if (now.getTime() >= startDate.getTime()) {
      setIsStart(true);
    }
  }, [timeRemaining, roomExam?.data?.startDate]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  function formatVietnamTime(dateString: string): string {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          // Gọi API lấy thông tin phòng thi
          // await dispatch(getRoomExambyId({ id }));
          dispatch(getStudentStatus(routeParams?.id as string))
            .unwrap()
            .then((res) => {
              setStudents(res.data);
            });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  const getStatusCount = (status: string) => {
    return students.filter((s: any) => s.submitStatus === status).length;
  };

  // const handleRefresh = () => {
  //   setLoading(true);
  //   setTimeout(() => setLoading(false), 1000);
  // };

  // console.log({ roomExam });
  // console.log({ examInfo });

  useEffect(() => {
    const connectSignalR = async () => {
      try {
        if (signalrConnection.state === "Disconnected") {
          await signalrConnection.start();
          console.log("SignalR connected");
        }

        signalrConnection.on(
          "ReceiveStatusChange",
          (studentId, fullName, status, submitAt) => {
            let message = "";

            console.log({ studentId, fullName, status, submitAt });

            if (status === "InProgress") {
              message = `${fullName} đã vào phòng thi`;
            } else if (status === "Submitted") {
              message = `${fullName} đã nộp bài thi`;
            }

            dispatch(
              showMessage({
                message,
                ...successAnchor,
              })
            );

            setStudents((prev) =>
              prev.map((s) =>
                s.id === studentId
                  ? { ...s, submitStatus: status, submittedAt: submitAt }
                  : s
              )
            );
          }
        );
      } catch (error) {
        console.error("SignalR connection error:", error);
      }
    };

    connectSignalR();

    return () => {
      signalrConnection.off("ReceiveStatusChange");
    };
  }, []);

  if (loading) return <CircularLoading />;

  return (
    <div className="flex flex-col gap-4">
      {/* Thông tin phòng thi */}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-y-1.5">
            <div className="flex items-center gap-3">
              <Quiz className="text-2xl text-blue-500" />
              <Typography variant="h6" fontWeight="bold">
                {examInfo?.name || "Bài thi"}
              </Typography>
            </div>
            {/* <Chip
              label={`Mã phòng: ${id}`}
              color="primary"
              variant="outlined"
            /> */}
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 16 }}>
              Môn: {examInfo?.subject?.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 16 }}>
              Lớp: {roomExam?.data?.course?.name}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Paper className="p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <People className="text-gray-500" />
                <Typography variant="body2">Tổng sinh viên</Typography>
              </div>
              <Typography variant="h5" fontWeight="bold">
                {students.length}
              </Typography>
            </Paper>

            <Paper className="p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AccessTime className="text-gray-500" />
                <Typography variant="body2">Thời gian nộp bài</Typography>
              </div>
              <Typography variant="h5" fontWeight="bold">
                {roomExam?.data?.durationMinutes || 0} phút
              </Typography>
            </Paper>

            <Paper className="p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <HourglassEmpty className="text-gray-500" />
                <Typography variant="body2">
                  {isStart ? "Thời gian còn lại" : "Đếm ngược bắt đầu"}
                </Typography>
              </div>
              <Typography variant="h5" fontWeight="bold">
                {formatTime(timeRemaining)}
              </Typography>
            </Paper>
          </div>

          <Divider />

          <div className="flex flex-wrap gap-4">
            {/* Box trạng thái sinh viên */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                border: "1px solid #ddd",
                borderRadius: 1,
                minWidth: 180,
              }}
            >
              <HourglassEmpty color="disabled" />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {getStatusCount("NotSubmitted")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chưa tham gia
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                border: "1px solid #ff9800",
                borderRadius: 1,
                minWidth: 180,
              }}
            >
              <AccessTime color="warning" />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {getStatusCount("InProgress")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đang làm bài
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                border: "1px solid #4caf50",
                borderRadius: 1,
                minWidth: 180,
              }}
            >
              <CheckCircle color="success" />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {getStatusCount("Submitted")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã nộp bài
                </Typography>
              </Box>
            </Box>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách sinh viên */}
      <Card>
        <CardContent>
          {/* <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" fontWeight="bold">
              Danh sách sinh viên
            </Typography>
            <div className="flex gap-2">
              <Tooltip title="Làm mới">
                <IconButton onClick={handleRefresh}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Button variant="outlined" size="small">
                Xuất báo cáo
              </Button>
            </div>
          </div> */}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Sinh viên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Thời gian nộp bài</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student: any, index: number) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={student.avatar}
                          alt={student.fullName}
                        ></Avatar>
                        <Typography>{student.fullName}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2">
                          {student.email}%
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          student.submitStatus === "NotSubmitted"
                            ? "Chưa tham gia"
                            : student.submitStatus === "InProgress"
                            ? "Đang làm bài"
                            : "Đã nộp bài"
                        }
                        color={
                          student.submitStatus === "NotSubmitted"
                            ? "default"
                            : student.submitStatus === "InProgress"
                            ? "warning"
                            : "success"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {student?.submitStatus === "Submitted"
                        ? formatVietnamTime(student.submittedAt)
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem bài làm">
                        <IconButton
                          onClick={() => {
                            navigate(
                              `/workspace/room-exam/${routeParams.id}/student-exams/${student?.studentExamId}/detail/${student.id}`
                            );
                          }}
                          disabled={student.submitStatus !== "Submitted"}
                        >
                          <Visibility
                            color={
                              student.submitStatus === "Submitted"
                                ? "primary"
                                : "disabled"
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomExamManagement;
