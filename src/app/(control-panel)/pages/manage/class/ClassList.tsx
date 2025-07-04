import React, { useState } from "react";
import ClassItem from "./components/ClassItem";
import { useDeepCompareEffect } from "../../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../store/store";
import AddIcon from "@mui/icons-material/Add";
import {
  getClasses,
  selectClasses,
} from "../../../../../store/slices/classSlice";
import { selectUser } from "../../../../../store/slices/userSlice";
import { Button, Typography } from "@mui/material";
import { openAddClassDialog } from "../../../../../store/slices/globalSlice";
import CircularLoading from "../../../../../components/CircularLoading";
import { useNavigate } from "react-router-dom";

const ClassList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true); // loading true từ đầu
  const [hasFetched, setHasFetched] = useState(false); // đánh dấu đã fetch xong
  const user = useSelector(selectUser);
  const classes = useSelector(selectClasses);
  const navigate = useNavigate();

  useDeepCompareEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    dispatch(getClasses())
      .unwrap()
      .finally(() => {
        setLoading(false);
        setHasFetched(true);
      });
  }, [dispatch, user?.id]);

  const handleAddClass = () => {
    dispatch(openAddClassDialog("new"));
    navigate("/workspace/class/new");
  };

  return (
    <div className="px-8 py-4">
      <div className="flex items-center justify-between pr-10">
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>Lớp học</Typography>

        {user?.role !== "STUDENT" && (
          <Button
            startIcon={<AddIcon />}
            sx={{ textTransform: "none" }}
            variant="outlined"
            onClick={handleAddClass}
          >
            Thêm lớp học
          </Button>
        )}
      </div>

      {loading && !hasFetched ? (
        <CircularLoading />
      ) : (
        <div className="grid xl:grid-cols-5 sm:grid-cols-4 gap-8 grid-cols-1 lg:gap-4 mt-6">
          {classes && classes.length > 0 ? (
            classes.map((item: any, index: number) => (
              <ClassItem key={index} data={{ ...item, teacher: user }} />
            ))
          ) : (
            <Typography
              fontSize={16}
              fontWeight={550}
              className="text-center col-span-5"
            >
              Chưa có lớp học nào
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassList;
