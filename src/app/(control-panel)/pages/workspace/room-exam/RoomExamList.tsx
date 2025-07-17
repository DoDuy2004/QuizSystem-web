import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchInput from "../../../../../components/SearchInput";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router-dom";
import RoomExamListItem from "./components/RoomExamListItem";
import SearchIcon from "@mui/icons-material/Search";
import {
  getRoomExams,
  getRoomExamsByStudent,
  selectRoomExam,
  selectRoomExams,
} from "../../../../../store/slices/roomExamSlice";
import { openAddRoomExamDialog } from "../../../../../store/slices/globalSlice";
import { selectUser } from "../../../../../store/slices/userSlice";
import { debounce } from "lodash";

const RoomExamList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const roomExams = useSelector(selectRoomExams);
  const user = useSelector(selectUser);
  const [searchText, setSearchText] = useState("");
  //   console.log({ questionBanks });

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length >= 3 || text.length === 0) {
          fetchRoomExams(text);
        }
      }, 500),
    [user]
  );

  const fetchRoomExams = (search = "") => {
    setLoading(true);
    if (user?.role === "TEACHER") {
      dispatch(getRoomExams(search))
        .unwrap()
        .finally(() => setLoading(false));
    } else {
      dispatch(getRoomExamsByStudent({ id: user?.id, search }))
        .unwrap()
        .finally(() => setLoading(false));
    }
  };

  useDeepCompareEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchRoomExams();
  }, [dispatch, user?.role, user?.id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  if (loading || (!roomExams?.length && !hasFetched.current)) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        {user?.role === "TEACHER" ? "Quản lý kỳ thi" : "Kỳ thi của bạn"}
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 md:px-6 px-3 py-4 border-gray-200 flex items-center justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {roomExams?.length}
              </span>{" "}
              kỳ thi
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
          {user?.role === "TEACHER" && (
            <Button
              onClick={() => {
                navigate("/workspace/room-exam/new");
                dispatch(openAddRoomExamDialog());
              }}
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
          )}
        </div>
        <div className="grid xl:grid-cols-5 sm:grid-cols-4 md:gap-8 gap-4 md:p-6 p-4 grid-cols-1 lg:gap-4">
          {roomExams &&
            roomExams?.length > 0 &&
            roomExams?.map((item: any, index: number) => {
              return <RoomExamListItem data={item} key={index} />;
            })}
        </div>
      </div>
    </>
  );
};

export default RoomExamList;
