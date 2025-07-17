import { Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import { selectUser } from "../../../../../../store/slices/userSlice";

const RoomExamListItem = ({ data }: any) => {
  const navigate = useNavigate();

  // ⚠️ Convert UTC ISO string về đúng giờ Việt Nam (UTC+7)
  // function toVietnamTime(dateString: string): Date {
  //   const date = new Date(dateString);
  //   const offset = 7 * 60 * 60 * 1000; // UTC+7
  //   return new Date(date.getTime() + offset);
  // }

  // ✅ Format thời gian theo giờ Việt Nam
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

  // ✅ Tính giờ bắt đầu và kết thúc theo giờ VN
  const startDate = new Date(data?.startDate);
  const duration = data?.exams?.[0]?.durationMinutes || 0;
  const endDate = new Date(startDate.getTime() + duration * 60000);
  const now = new Date();
  const user = useSelector(selectUser);
  const isStarted = now >= startDate;
  const expired = now > endDate;

  const handleJoinRoomExam = () => {
    navigate(`/workspace/room-exam/${data?.id}`);
  };

  return (
    <div className="col-span-1 shadow-sm p-4 flex flex-col gap-y-4 hover:cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-200 ease-in-out">
      <Typography
        component={"h6"}
        fontSize={14}
        color="primary"
        className="truncate max-w-full"
      >
        {data?.name}
      </Typography>

      <Tooltip title={data?.subject?.name}>
        <Typography fontSize={12} className="truncate max-w-full">
          <span className="font-semibold">Môn:</span> {data?.subject?.name}
        </Typography>
      </Tooltip>

      <Tooltip title={data?.course?.name}>
        <Typography fontSize={12} className="truncate max-w-full">
          <span className="font-semibold">Lớp:</span> {data?.course?.name}
        </Typography>
      </Tooltip>

      <Typography fontSize={12} className="flex items-center gap-x-2">
        <span className="font-semibold">Bắt đầu:</span>{" "}
        {formatVietnamTime(data?.startDate)}
      </Typography>

      <Typography fontSize={12} className="flex items-center gap-x-2">
        <span className="font-semibold">Thời gian làm bài:</span> {duration}{" "}
        phút
      </Typography>

      {user?.role === "STUDENT" ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isStarted && !expired) handleJoinRoomExam();
          }}
          disabled={!isStarted || expired}
          className={`w-full py-1.5 px-3 text-sm rounded font-semibold transition ${
            expired
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : !isStarted
              ? "bg-yellow-300 text-yellow-800 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {expired
            ? "Đã kết thúc"
            : !isStarted
            ? "Chưa bắt đầu"
            : "Vào phòng thi"}
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!expired) handleJoinRoomExam();
          }}
          disabled={expired}
          className={`w-full py-1.5 px-3 text-sm rounded font-semibold transition ${
            expired
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {expired ? "Đã kết thúc" : "Quản lý kỳ thi"}
        </button>
      )}
    </div>
  );
};

export default RoomExamListItem;
