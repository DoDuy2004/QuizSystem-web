import {
  Avatar,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../../store/store";
import { openAddStudentsToClassDialog } from "../../../../../../../store/slices/globalSlice";
import { selectUser } from "../../../../../../../store/slices/userSlice";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import { useParams } from "react-router-dom";
import {
  getStudentsByClass,
  selectClass,
} from "../../../../../../../store/slices/classSlice";

const UserItem = ({ name }: { name: string }) => (
  <>
    <div className="flex items-center gap-x-5">
      <Avatar sx={{ width: 32, height: 32 }}>{name.charAt(0)}</Avatar>
      <Typography>{name}</Typography>
    </div>
  </>
);

const PeopleTab = () => {
  const students = Array(20).fill({ name: "Nguyễn Đức Duy" });
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const [loading, setLoading] = useState(true);
  const courseClass = useSelector(selectClass);

  useDeepCompareEffect(() => {
    if (routeParams?.id) {
      dispatch(getStudentsByClass(routeParams?.id))
        .unwrap()
        .finally(() => {
          setLoading(true);
        });
    }
  }, [dispatch, routeParams?.id]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-y-10">
      {/* Giảng viên */}
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" fontSize={32}>
            Giảng viên
          </Typography>
        </div>
        <Divider />
        <UserItem name={user?.fullName} />
      </div>

      {/* Sinh viên */}
      <div className="flex flex-col gap-y-4 mt-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" fontSize={32}>
            Sinh viên
          </Typography>
          <Tooltip title="Mời sinh viên">
            <IconButton
              onClick={() => dispatch(openAddStudentsToClassDialog())}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider />
        {courseClass?.students?.length === 0 ? (
          <Typography>Không có sinh viên nào trong lớp</Typography>
        ) : (
          <>
            {courseClass?.students?.map((student: any, index: number) => (
              <>
                <UserItem key={index} name={student?.fullName} />
                {index < courseClass?.students?.length - 1 && <Divider />}
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PeopleTab;
