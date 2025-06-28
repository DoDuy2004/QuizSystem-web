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
import { Button, IconButton, Typography } from "@mui/material";
import { openAddClassDialog } from "../../../../../store/slices/globalSlice";
import CircularLoading from "../../../../../components/CircularLoading";

const ClassList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const classes = useSelector(selectClasses);

  useDeepCompareEffect(() => {
    setLoading(true);
    dispatch(getClasses(user?.id))
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) return <CircularLoading />;

  return (
    <>
      <div className="flex items-center justify-between pr-10">
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Lớp học của tôi
        </Typography>

        <Button
          startIcon={<AddIcon />}
          sx={{ textTransform: "none" }}
          variant="outlined"
          onClick={() => dispatch(openAddClassDialog("new"))}
        >
          Thêm lớp học
        </Button>
      </div>
      <div className="grid xl:grid-cols-5 sm:grid-cols-4 gap-8 grid-cols-1 lg:gap-4">
        {classes && classes?.length > 0 ? (
          classes?.map((item: any, index: number) => {
            return <ClassItem key={index} data={{ ...item, teacher: user }} />;
          })
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
    </>
  );
};

export default ClassList;
