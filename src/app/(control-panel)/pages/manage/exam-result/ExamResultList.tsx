import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "../../../../../store/withReducer";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect } from "../../../../../hooks";
// import FullscreenLoader from "../../../../../components/FullscreenLoader";
import { useRef } from "react";
// import reducer from "./store";
import CircularLoading from "../../../../../components/CircularLoading";
import { Button, IconButton, Typography } from "@mui/material";
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
                {exams?.length}
              </span>{" "}
              bài thi
            </Typography>
            <SearchInput />
            <IconButton>
              <FilterAltOutlinedIcon />
            </IconButton>
          </div>
          <Button
            onClick={() => navigate("/workspace/exam/new")}
            sx={{
              marginLeft: "auto",
              padding: "6px 10px",
              background: "linear-gradient(to right, #3b82f6, #a855f7)",
              borderRadius: "4px",
              textTransform: "none",
              color: "white",
              fontSize: "14px",
            }}
          >
            Thêm mới
          </Button>
        </div>
        <div className="grid xl:grid-cols-5 sm:grid-cols-4 gap-8 p-6 grid-cols-1 lg:gap-4">
          {exams &&
            exams?.length > 0 &&
            exams?.map((item: any, index: number) => {
              return <ExamResultItem data={item} key={index} />;
            })}
        </div>
      </div>
    </>
  );
};

export default ExamResult;
