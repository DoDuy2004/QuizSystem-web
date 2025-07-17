import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { use, useEffect, useState } from "react";
import RichTextEditor from "../../../../../../../components/RichTextEditor/RichTextEditor";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../../../../store/slices/userSlice";
import { Route, useParams } from "react-router-dom";
import { type AppDispatch } from "../../../../../../../store/store";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  addMessage,
  createNotification,
  deleteMessage,
  deleteNoti,
  fetchMessages,
  fetchNotification,
  selectNotifications,
} from "../../../../../../../store/slices/notificationSlice";
import {
  getTeacherByClass,
  selectClass,
} from "../../../../../../../store/slices/classSlice";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import _ from "lodash";
import CircularLoading from "../../../../../../../components/CircularLoading";
import { openConfirmationDialog } from "../../../../../../../store/slices/confirmationSlice";

interface CommentItemProps {
  fullName: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  messId: string;
  notiId: string;
  userId: string;
}

const CommentItem = ({
  fullName,
  avatarUrl,
  content,
  createdAt,
  userId,
  messId,
  notiId,
}: CommentItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  const openConfirmDialog = (e: any) => {
    e.stopPropagation();
    handleClose(e);
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteMessage({ notiId, messId }));
          },
          dialogContent: "Bạn có chắc muốn xóa bình luận này này",
          titleContent: "Lưu trữ lớp học",
          agreeText: "Xác nhận",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  return (
    <div className="flex items-start justify-between px-6 py-2 group">
      <div className="flex items-center gap-3">
        <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl}>
          {fullName.charAt(0)}
        </Avatar>
        <div className="flex flex-col gap-y-1.5">
          <Typography variant="body2">
            {fullName}
            <span className="text-gray-600 ml-2 text-sm">{createdAt}</span>
          </Typography>
          <Typography variant="body2">{content}</Typography>
        </div>
      </div>

      {user?.id === userId && (
        <div className="invisible group-hover:visible">
          <IconButton onClick={handleClick}>
            <MoreVertOutlinedIcon className="w-fit ml-auto" />
          </IconButton>
        </div>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
        PaperProps={{ sx: { px: 1, boxShadow: 1 } }}
      >
        <MenuItem sx={{ paddingY: 0 }} onClick={(e) => openConfirmDialog(e)}>
          <ListItemText primaryTypographyProps={{ fontSize: "12px" }}>
            Xóa
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

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
  const routeParams = useParams();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);
  const courseClass = useSelector(selectClass);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({});

  const handleClick = (event: any, notiId: string) => {
    setAnchorEls((prev) => ({
      ...prev,
      [notiId]: event.currentTarget,
    }));
    event.stopPropagation();
  };
  const handleClose = (event: any, notiId: string) => {
    setAnchorEls((prev) => ({
      ...prev,
      [notiId]: null,
    }));
    event.stopPropagation();
  };

  const { watch, control, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      content: "",
    },
    resolver: yupResolver(schema),
  });

  function formatVietnamTime(dateString: string): string {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const toggleExpanded = (notiId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [notiId]: !prev[notiId],
    }));
  };
  // console.log({ notifications });

  useEffect(() => {
    dispatch(fetchNotification(routeParams?.id as string))
      .unwrap()
      .then((res) => {
        if (res.data.length > 0) {
          res?.data?.map((item: any) => dispatch(fetchMessages(item?.id)));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routeParams?.id]);

  useDeepCompareEffect(() => {
    const fetchData = async () => {
      if (!routeParams.id) {
        setLoading(false);
        return;
      }
      if (routeParams?.id && _.isEmpty(courseClass?.teacher)) {
        try {
          await Promise.all([
            dispatch(getTeacherByClass(routeParams?.id)).unwrap(),
          ]);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, routeParams?.id]);
  const form = watch();

  const handlePost = () => {
    setSubmitLoading(true);
    dispatch(
      createNotification({
        courseClassId: routeParams?.id as string,
        content: form.content,
      })
    )
      .unwrap()
      .then(() => {
        setValue("content", "", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setIsNewNoti(false);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleComment = (notiId: string) => {
    const message = comments[notiId]?.trim();
    if (!message) return;

    setCommentLoading(true);
    dispatch(
      addMessage({
        notificationId: notiId,
        message,
      })
    )
      .unwrap()
      .then(() => {
        // clear comment input for this noti
        setComments((prev) => ({
          ...prev,
          [notiId]: "",
        }));
        toggleExpanded(notiId);
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  const openConfirmDialog = (e: any, id: any) => {
    e.stopPropagation();
    handleClose(e, id);
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteNoti(id));
          },
          dialogContent: "Bạn có chắc muốn xóa thông báo này",
          titleContent: "Lưu trữ lớp học",
          agreeText: "Xác nhận",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  if (loading) return <CircularLoading />;

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
          className="flex items-center gap-x-4 px-4 py-4 rounded-lg"
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
              {/* <Typography color="primary" fontSize={14}>
                Thông báo nội dung nào đó cho lớp học của bạn
              </Typography> */}
              <Controller
                name="content"
                control={control}
                rules={{ required: "Bạn chưa nhập nội dung" }}
                render={({ field }) => (
                  <div>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      label={"Thông báo nội dung nào đó cho lớp học của bạn"}
                    />
                  </div>
                )}
              />
              <div className="w-fit ml-auto flex items-center gap-1">
                <Button
                  variant="text"
                  sx={{ textTransform: "none" }}
                  disabled={submitLoading}
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
                  loading={submitLoading}
                >
                  Đăng
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {notifications?.length > 0 ? (
        notifications?.map((item: any, index: number) => (
          <div
            key={index}
            className="flex flex-col gap-y-3 py-4 rounded-lg border-1 border-gray-200"
          >
            <div className="flex items-center gap-x-4 px-6">
              <Avatar sx={{ width: 40, height: 40 }}>N</Avatar>
              <Typography
                className="text-gray-1000 flex flex-col gap-y-0.5"
                fontSize={14}
              >
                {courseClass?.teacher.fullName}
                <span className="text-md">
                  {formatVietnamTime(item?.createAt)}
                </span>
              </Typography>
              <div className="block w-fit ml-auto">
                {user?.role === "TEACHER" && (
                  <IconButton onClick={(e) => handleClick(e, item?.id)}>
                    <MoreVertOutlinedIcon />
                  </IconButton>
                )}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEls[item.id]}
                  open={Boolean(anchorEls[item.id])}
                  onClose={(e) => handleClose(e, item.id)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                  PaperProps={{
                    sx: {
                      px: 1,
                      boxShadow: 1,
                    },
                  }}
                >
                  <MenuItem
                    sx={{ paddingY: 0 }}
                    onClick={(e) => openConfirmDialog(e, item?.id)}
                  >
                    <ListItemText primaryTypographyProps={{ fontSize: "12px" }}>
                      Xóa
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <Typography
              variant="body1"
              sx={{ flex: 1, fontSize: "14px", fontWeight: 500, paddingX: 4 }}
              dangerouslySetInnerHTML={{ __html: item?.content }}
            />
            <Divider />
            <div className="flex flex-col gap-y-4">
              {item?.messages?.length > 0 && (
                <div className="flex flex-col gap-y-4">
                  <div
                    className="px-6 flex items-center gap-2 cursor-pointer text-blue-600"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <PeopleAltOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      {item.messages.length} nhận xét về lớp học
                    </Typography>
                  </div>
                  {expandedComments[item.id] ? (
                    item.messages.map((msg: any, idx: number) => (
                      <CommentItem
                        key={idx}
                        fullName={msg?.user?.fullName || "Người dùng"}
                        avatarUrl={msg?.user?.avatarUrl}
                        content={msg?.content}
                        createdAt={formatVietnamTime(msg?.createAt)}
                        messId={msg?.id}
                        notiId={item?.id}
                        userId={msg?.userId}
                      />
                    ))
                  ) : (
                    <CommentItem
                      key={item.messages[0]?.id}
                      fullName={
                        item.messages[0]?.user?.fullName || "Người dùng"
                      }
                      avatarUrl={item.messages[0]?.user?.avatarUrl}
                      content={item.messages[0]?.content}
                      createdAt={formatVietnamTime(item.messages[0]?.createAt)}
                      messId={item.messages[0]?.id}
                      notiId={item?.id}
                      userId={item.messages[0]?.userId}
                    />
                  )}
                </div>
              )}
              <div className="px-6 py-1.5 flex justify-between items-center gap-x-5">
                <Avatar sx={{ width: 32, height: 32 }}>D</Avatar>
                <TextField
                  name="comment"
                  size="small"
                  placeholder="Thêm nhận xét trong lớp học"
                  fullWidth
                  // autoFocus
                  value={comments[item?.id] || ""}
                  onChange={(e) =>
                    setComments((prev: any) => ({
                      ...prev,
                      [item?.id]: e.target.value,
                    }))
                  }
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
                <IconButton
                  onClick={() => handleComment(item?.id)}
                  disabled={!comments[item.id]?.trim() || commentLoading}
                >
                  <SendOutlinedIcon />
                </IconButton>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <Typography fontSize={18}>
            Chưa có thông báo nào trong lớp học của bạn
          </Typography>
        </>
      )}
    </div>
  );
};

export default NewsBoard;
