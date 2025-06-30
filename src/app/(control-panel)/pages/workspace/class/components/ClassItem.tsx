import {
  Avatar,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import { openConfirmationDialog } from "../../../../../../store/slices/confirmationSlice";
import { deleteClass } from "../../../../../../store/slices/classSlice";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useNavigate } from "react-router-dom";
import { openAddClassDialog } from "../../../../../../store/slices/globalSlice";

const backgrounds = [
  "/assets/images/backgrounds/Honors.jpg",
  "/assets/images/backgrounds/img_backtoschool.jpg",
  "/assets/images/backgrounds/img_breakfast.jpg",
  "/assets/images/backgrounds/img_learnlanguage.jpg",
  "/assets/images/backgrounds/img_reachout.jpg",
  "/assets/images/backgrounds/img_read.jpg",
];

const ClassItem = ({ data }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [randomBackground, setRandomBackground] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  const handleUpdate = (e: any) => {
    e.stopPropagation();
    navigate(`/workspace/class/${data?.id}/edit`);
    dispatch(openAddClassDialog("edit"));
    handleClose(e);
  };

  //   console.log({ data });

  const openConfirmDialog = (e: any, id: any) => {
    e.stopPropagation();
    handleClose(e);
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteClass({ id }));
          },
          dialogContent: "Bạn có chắc muốn lưu trữ lớp học này này",
          titleContent: "Lưu trữ lớp học",
          agreeText: "Xác nhận",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  return (
    <div
      className="col-span-1 hover:cursor-pointer hover:shadow-md rounded-md border-1 border-gray-200 overflow-hidden "
      onClick={() => navigate(`/workspace/class/${data?.id}`)}
    >
      <div
        className="flex items-start justify-between border-b-1 border-gray-200 p-3 bg-cover"
        style={{
          backgroundImage: `url(${randomBackground})`,
        }}
      >
        <div className="flex flex-col gap-y-0.5">
          <Tooltip title={data?.name}>
            <Typography
              component={"h6"}
              fontSize={14}
              className="truncate max-w-full text-white"
            >
              {data?.name}
            </Typography>
          </Tooltip>

          <Typography
            component={"p"}
            fontSize={12}
            className="truncate max-w-full text-white"
          >
            {data?.description}
          </Typography>
          <Typography
            component={"p"}
            fontSize={12}
            className="truncate max-w-full text-white"
          >
            {data?.teacher?.fullName}
          </Typography>
        </div>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0, color: "white" }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
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
          <MenuItem sx={{ paddingY: 0 }} onClick={(e) => handleUpdate(e)}>
            <ListItemText primaryTypographyProps={{ fontSize: "12px" }}>
              Cập nhập
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{ paddingY: 0 }}
            onClick={(e) => openConfirmDialog(e, data?.id)}
          >
            <ListItemText primaryTypographyProps={{ fontSize: "12px" }}>
              Lưu trữ
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
      <div className="h-28 relative bg-white border-b-1 border-gray-200">
        <Avatar
          sx={{ width: 75, height: 75 }}
          className="absolute -top-1/3 left-[65%]"
        >
          {data?.teacher?.fullName[0]}
        </Avatar>
      </div>
      <div className="w-full ml-auto flex items-center justify-end px-3 gap-x-2 py-1 bg-white">
        <Tooltip title="Học sinh">
          <IconButton size="small">
            <GroupOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bảng tin">
          <IconButton size="small">
            <AssignmentOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default ClassItem;
