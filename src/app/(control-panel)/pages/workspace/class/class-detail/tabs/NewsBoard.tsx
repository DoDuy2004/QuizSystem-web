import {
  Avatar,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useState } from "react";
import RichTextEditor from "../../../../../../../components/RichTextEditor/RichTextEditor";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../../store/slices/userSlice";

const backgrounds = [
  "/assets/images/backgrounds/Honors.jpg",
  "/assets/images/backgrounds/img_backtoschool.jpg",
  "/assets/images/backgrounds/img_breakfast.jpg",
  "/assets/images/backgrounds/img_learnlanguage.jpg",
  "/assets/images/backgrounds/img_reachout.jpg",
  "/assets/images/backgrounds/img_read.jpg",
];

const schema = yup.object().shape({
  content: yup.string().required("Nội dung là bắt buộc"),
});

const NewsBoard = ({ data }: any) => {
  const [isNewNoti, setIsNewNoti] = useState(false);
  const [randomBackground, setRandomBackground] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );
  const user = useSelector(selectUser);

  const { watch, control } = useForm({
    mode: "onChange",
    defaultValues: {
      content: "",
    },
    resolver: yupResolver(schema),
  });

  const handlePost = () => {};

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-6">
      <div
        className="flex items-start justify-end flex-col border-b-1 border-gray-200 p-6 bg-cover h-56 rounded-lg"
        style={{
          backgroundImage: `url(${randomBackground})`,
        }}
      >
        <Tooltip title={data?.name}>
          <Typography variant="h4" className="truncate max-w-full text-white">
            {data?.name || "DATN - CDTH22"}
          </Typography>
        </Tooltip>

        <Typography
          component={"p"}
          fontSize={20}
          className="truncate max-w-full text-white"
        >
          {data?.description || "HKII (24-25)"}
        </Typography>
      </div>
      {user?.role === "TEACHER" && (
        <div
          className="flex items-center gap-x-4 px-6 py-4 rounded-lg"
          style={{ boxShadow: "0 0 6px rgba(3, 3, 3, 0.2)" }}
          onClick={() => setIsNewNoti(true)}
        >
          {!isNewNoti && user?.role === "TEACHER" ? (
            <>
              <Avatar sx={{ width: 40, height: 40 }}>N</Avatar>
              <Typography className="text-gray-500" fontSize={14}>
                Thông báo nội dung nào đó cho lớp học của bạn
              </Typography>
            </>
          ) : (
            <div className="w-full flex flex-col gap-y-1">
              <Typography color="primary" fontSize={14}>
                Thông báo nội dung nào đó cho lớp học của bạn
              </Typography>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Bạn chưa nhập nội dung" }}
                render={({ field }) => (
                  <div>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      label={""}
                    />
                  </div>
                )}
              />
              <div className="w-fit ml-auto flex items-center gap-1">
                <Button
                  variant="text"
                  sx={{ textTransform: "none" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNewNoti(false);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={handlePost}
                  disabled={watch("content").length < 1}
                >
                  Đăng
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-y-3 py-4 rounded-lg border-1 border-gray-200">
        <div className="flex items-center gap-x-4 px-6">
          <Avatar sx={{ width: 40, height: 40 }}>N</Avatar>
          <Typography
            className="text-gray-1000 flex flex-col gap-y-0.5"
            fontSize={14}
          >
            Nguyễn Đức Duy
            <span className="text-md">26 th 6</span>
          </Typography>
        </div>
        <Typography fontSize={13} className="text-black px-6">
          Chào cả lớp, chúng ta sẽ trao đổi tài liệu học tập và thông báo của
          lớp ở đây
        </Typography>
        <Divider />
        <div className="px-6 py-2 flex justify-between items-center gap-x-5">
          <Avatar sx={{ width: 32, height: 32 }}>D</Avatar>
          <TextField
            size="small"
            placeholder="Thêm nhận xét trong lớp học"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                fontSize: "14px",
              },
              "& input::placeholder": {
                fontSize: "13px",
                opacity: 0.7,
              },
            }}
          />

          <IconButton>
            <SendOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default NewsBoard;
