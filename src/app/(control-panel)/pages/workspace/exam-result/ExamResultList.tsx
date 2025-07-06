import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "../../../../../store/withReducer";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect } from "../../../../../hooks";
// import FullscreenLoader from "../../../../../components/FullscreenLoader";
import { useRef } from "react";
// import reducer from "./store";
import CircularLoading from "../../../../../components/CircularLoading";
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
import SearchInput from "../../../../../components/SearchInput";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router-dom";
// import ExamListItem from "./components/ExamListItem";
import {
  getExams,
  resetExamState,
  selectExams,
} from "../../../../../store/slices/examSlice";
import ExamResultItem from "./components/ExamResultItem";

const ExamResult = () => {
  const exams = useSelector(selectExams);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  //   console.log({ questionBanks });

  useDeepCompareEffect(() => {
    if (hasFetched.current) return;

    setLoading(true);
    hasFetched.current = true;

    dispatch(getExams()).finally(() => {
      setLoading(false);
    });

    return () => {
      dispatch(resetExamState());
    };
  }, [dispatch]);

  if (loading || (!exams?.length && !hasFetched.current)) {
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
                {exams?.length || 0}
              </span>{" "}
              kỳ thi
            </Typography>
            <SearchInput />
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
                  <TableCell align="left">Thời gian bắt đầu</TableCell>
                  <TableCell align="left">Thời gian làm bài</TableCell>
                  <TableCell>Điểm số</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {students?.map((row: any) => ( */}
                <TableRow
                  // key={row?.fullName}
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
                  ></TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      maxWidth: "300px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  ></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default ExamResult;
