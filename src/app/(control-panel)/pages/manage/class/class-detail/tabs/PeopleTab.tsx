import {
  Avatar,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const UserItem = ({ name }: { name: string }) => (
  <>
    <div className="flex items-center gap-x-5">
      <Avatar sx={{ width: 32, height: 32 }}>{name.charAt(0)}</Avatar>
      <Typography>{name}</Typography>
    </div>
  </>
);

const PeopleTab = () => {
  const teacher = { name: "Nguyễn Đức Duy" };
  const students = Array(20).fill({ name: "Nguyễn Đức Duy" });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-y-10">
      {/* Giảng viên */}
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" fontSize={32}>
            Giảng viên
          </Typography>
          <Tooltip title="Mời giáo viên">
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider />
        <UserItem name={teacher.name} />
      </div>

      {/* Sinh viên */}
      <div className="flex flex-col gap-y-4 mt-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" fontSize={32}>
            Sinh viên
          </Typography>
          <Tooltip title="Mời sinh viên">
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider />
        {students.map((student, index) => (
          <>
            <UserItem key={index} name={student.name} />
            <Divider />
          </>
        ))}
      </div>
    </div>
  );
};

export default PeopleTab;
