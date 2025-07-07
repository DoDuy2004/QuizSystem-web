import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import FullscreenLoader from "../../../../../components/FullscreenLoader";
import { useRef } from "react";
// import reducer from "./store";
import {
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "../../../../../../store/store";
import { selectUser } from "../../../../../../store/slices/userSlice";
import { useDeepCompareEffect } from "../../../../../../hooks";
import CircularLoading from "../../../../../../components/CircularLoading";
import { getStudentExamsByRoom } from "../../../../../../store/slices/roomExamSlice";
// import ExamListItem from "./components/ExamListItem";";

const ExamResultDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [examResults, setExamResults] = useState([]);
  const user = useSelector(selectUser);
  const routeParams = useParams();
  //   console.log({ questionBanks });

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
    dispatch(getStudentExamsByRoom(routeParams?.id as string))
      .unwrap()
      .then((res) => {
        console.log({ res });
        setExamResults(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Kết quả thi
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 px-6 py-4 border-gray-200 flex items-center justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {examResults?.length || 0}
              </span>{" "}
              bài thi
            </Typography>
            {/* <SearchInput /> */}
            <IconButton>
              <FilterAltOutlinedIcon />
            </IconButton>
          </div>
        </div>
        <div className="w-full">
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
                  <TableCell align="left">Họ tên</TableCell>
                  <TableCell align="left">email</TableCell>
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
                      {row?.roomExam?.subjectName}
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
                      {row?.student?.fullName}
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
                      {row?.student?.email}
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
          {examResults?.length === 0 && (
            <Typography className="py-6 text-center">
              Kỳ thi chưa có bài làm nào
            </Typography>
          )}
        </div>
      </div>
    </>
  );
};

export default ExamResultDetail;
