import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
// import React from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RoomExamListItem = ({ data }: any) => {
  const navigate = useNavigate();

  function formatVietnamTime(dateString: string): string {
    return new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const handleJoinRoomExam = () => {
    navigate(`/workspace/room-exam/${data?.id}`);
  };

  return (
    <div
      className="col-span-1 shadow-sm p-4 flex flex-col gap-y-4  hover:cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-200 ease-in-out"
      onClick={handleJoinRoomExam}
    >
      <Typography
        component={"h6"}
        fontSize={14}
        color="primary"
        className="truncate max-w-ful"
      >
        {data?.name}
      </Typography>

      {/* <Tooltip title={data?.subject?.name}>
        <Typography
          component={"p"}
          fontSize={12}
          className="truncate max-w-full"
        >
          Môn: {data?.subject?.name}
        </Typography>
      </Tooltip> */}
      <Typography
        component={"p"}
        fontSize={12}
        className="flex items-center gap-x-2"
      >
        Bắt đầu: {formatVietnamTime(data?.startDate)}
      </Typography>
      <Typography
        component={"p"}
        fontSize={12}
        className="flex items-center gap-x-2"
      >
        Kết thúc: {formatVietnamTime(data?.endDate)}
      </Typography>
    </div>
  );
};

export default RoomExamListItem;
