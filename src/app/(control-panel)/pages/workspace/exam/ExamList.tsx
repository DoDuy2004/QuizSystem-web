import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import withReducer from "../../../../../store/withReducer";
import SearchIcon from "@mui/icons-material/Search";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect } from "../../../../../hooks";
// import FullscreenLoader from "../../../../../components/FullscreenLoader";
import { useRef } from "react";
import CircularLoading from "../../../../../components/CircularLoading";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router-dom";
import ExamListItem from "./components/ExamListItem";
import {
  getExams,
  resetExamState,
  selectExams,
} from "../../../../../store/slices/examSlice";
import { debounce } from "lodash";

const ExamList = () => {
  const exams = useSelector(selectExams);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //   console.log({ questionBanks });
  const [searchText, setSearchText] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length >= 3 || text.length === 0) {
          setLoading(true);
          dispatch(getExams(text))
            .unwrap()
            .finally(() => setLoading(false));
        }
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    setLoading(true);
    dispatch(getExams(""))
      .unwrap()
      .then((res: any) => {
        console.log({ res });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  if (loading) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Quản lý đề thi
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 px-6 py-4 border-gray-200 flex items-center justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {exams?.length}
              </span>{" "}
              Đề thi
            </Typography>
            <TextField
              placeholder="Tìm kiếm..."
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
              return <ExamListItem data={item} key={index} />;
            })}
        </div>
      </div>
    </>
  );
};

export default ExamList;
