import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect, useThemeMediaQuery } from "../../../../../hooks";
// import FullscreenLoader from "../../../../../components/FullscreenLoader";
import { useRef } from "react";
// import reducer from "./store";
import CircularLoading from "../../../../../components/CircularLoading";
import {
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router-dom";
// import ExamListItem from "./components/ExamListItem";
import { getRoomExamResults } from "../../../../../store/slices/roomExamSlice";
import { selectUser } from "../../../../../store/slices/userSlice";
import { debounce } from "lodash";
// import ExamResultItem from "./components/ExamResultItem";

const ExamResult = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [examResults, setExamResults] = useState([]);
  const [endRoomExams, setEndRoomExams] = useState([]);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

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

  useDeepCompareEffect(() => {
    setLoading(true);
    fetchRoomExams();
  }, [dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length >= 3 || text.length === 0) {
          fetchRoomExams(text);
        }
      }, 500),
    []
  );

  const fetchRoomExams = (search = "") => {
    setLoading(true);
    dispatch(getRoomExamResults(search))
      .unwrap()
      .then((res) => {
        if (user?.role === "STUDENT") setExamResults(res.data);
        else setEndRoomExams(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  if (loading) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Kết quả thi
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 md:px-6 px-4 py-4 border-gray-200 flex items-center justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {user?.role === "STUDENT"
                  ? examResults?.length
                  : endRoomExams?.length || 0}
              </span>{" "}
              {user?.role === "STUDENT" ? "bài thi" : "kỳ thi"}
            </Typography>
            <TextField
              placeholder="Tìm kiếm kỳ thi..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton>
              <FilterAltOutlinedIcon />
            </IconButton>
          </div>
        </div>
        <div className="w-full">
          {user?.role === "STUDENT" ? (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #e0e0e0",
              }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    padding: !isMobile ? "16px 24px" : "16px", // Tăng padding cho các cell
                    fontSize: "0.875rem",
                    borderColor: "#f0f0f0",
                  },
                  "& .MuiTableHead-root .MuiTableCell-root": {
                    fontWeight: 600,
                    backgroundColor: "#f9fafb",
                    color: "#374151",
                  },
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: "#f9fafb",
                  },
                }}
                size="medium"
                aria-label="subject table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        paddingLeft: "32px", // Thêm padding left cho ô đầu tiên
                      }}
                    >
                      Kỳ thi
                    </TableCell>
                    <TableCell align="left">Môn học</TableCell>
                    <TableCell align="left">Thời gian bắt đầu</TableCell>
                    <TableCell align="left">Thời gian làm bài</TableCell>
                    <TableCell>Điểm số</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examResults?.map((row: any) => (
                    <TableRow
                      key={row?.id}
                      // onClick={() => {
                      //   dispatch(openAddStudentDialog());
                      //   navigate(`/workspace/student/${row.id}/edit`);
                      // }}
                      sx={{
                        "&:last-child td": {
                          borderBottom: "none", // Bỏ border bottom cho hàng cuối
                        },
                        // "&:last-child td:first-of-type": {
                        //   borderBottomLeftRadius: "8px", // Bo góc trái dưới
                        // },
                        // "&:last-child td:last-child": {
                        //   borderBottomRightRadius: "8px", // Bo góc phải dưới
                        // },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ paddingLeft: "32px" }}
                      >
                        {row?.exam?.name}
                      </TableCell>
                      <TableCell align="left">
                        {row?.roomExam?.subject}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {formatVietnamTime(row?.roomExam?.startDate)}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row?.exam?.durationMinutes} phút
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row?.grade}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #e0e0e0",
              }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    padding: "16px 24px", // Tăng padding cho các cell
                    fontSize: "0.875rem",
                    borderColor: "#f0f0f0",
                  },
                  "& .MuiTableHead-root .MuiTableCell-root": {
                    fontWeight: 600,
                    backgroundColor: "#f9fafb",
                    color: "#374151",
                  },
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: "#f9fafb",
                  },
                }}
                size="medium"
                aria-label="subject table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        paddingLeft: "32px", // Thêm padding left cho ô đầu tiên
                      }}
                    >
                      Kỳ thi
                    </TableCell>
                    <TableCell align="left">Môn học</TableCell>
                    <TableCell align="left">Thời gian bắt đầu</TableCell>
                    <TableCell align="left">Thời gian kết thúc</TableCell>
                    <TableCell>Số bài làm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {endRoomExams?.map((row: any) => (
                    <TableRow
                      key={row?.roomExamId}
                      onClick={() => {
                        // console.log({ id: row?.roomExamId });
                        navigate(
                          `/workspace/room-exam/${row?.roomExamId}/student-exams`
                        );
                      }}
                      sx={{
                        "&:last-child td": {
                          borderBottom: "none", // Bỏ border bottom cho hàng cuối
                        },
                        // "&:last-child td:first-of-type": {
                        //   borderBottomLeftRadius: "8px", // Bo góc trái dưới
                        // },
                        // "&:last-child td:last-child": {
                        //   borderBottomRightRadius: "8px", // Bo góc phải dưới
                        // },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ paddingLeft: "32px" }}
                      >
                        {row?.roomExamName}
                      </TableCell>
                      <TableCell align="left">{row?.subject}</TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {formatVietnamTime(row?.startDate)}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {formatVietnamTime(row?.endDate)}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row?.totalStudentExams}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default ExamResult;
