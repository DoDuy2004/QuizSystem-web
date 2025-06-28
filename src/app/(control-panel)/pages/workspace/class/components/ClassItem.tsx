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
  const [randomBackground, setRandomBackground] = useState(backgrounds[Math.floor(Math.random() * backgrounds.length)])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (e: any) => {
    e.stopPropagation();
    handleClose();
  };

//   console.log({ data }); 

  const openConfirmDialog = (id: any, e: any) => {
    e.stopPropagation();
    handleClose();
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteClass({ id }));
          },
          dialogContent: "Bạn có chắc muốn xóa ngân hàng câu hỏi này",
          titleContent: "Xóa ngân hàng câu hỏi",
          agreeText: "Xóa",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  return (
    <div className="col-span-1 hover:cursor-pointer rounded-md border-1 border-gray-200 overflow-hidden ">
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
              Đăng xuất
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
      <div className="h-36 relative bg-white">
        <Avatar
          sx={{ width: 75, height: 75 }}
          className="absolute -top-1/4 left-[65%]"
        >
          {data?.teacher?.fullName[0]}
        </Avatar>
      </div>
    </div>
  );
};

export default ClassItem;
