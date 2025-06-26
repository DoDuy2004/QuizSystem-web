import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Home,
  AssignmentTurnedIn,
  ExpandMore,
  Description,
  School,
  EmojiEvents,
  ChevronRight,
  ChevronLeft,
  SupportAgent,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useThemeMediaQuery } from "../../hooks";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [collapsed, setCollapsed] = useState(false);
  const [openPersonal, setOpenPersonal] = useState(true);
  const [openManage, setOpenManage] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItems, setMenuItems] = useState([]);
  const user = useSelector(selectUser);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    items: any
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuItems(items);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
    setIsAnimating(true);
  };

  const personalItems = [
    {
      icon: <PersonIcon />,
      label: "Thông tin tài khoản",
      path: "/my-account/profile",
      roles: ["TEACHER", "STUDENT"],
    },
    // { icon: <Home />, label: "Thư viện của tôi" },
    // { icon: <AccessTime />, label: "Truy cập gần đây" },
    // { icon: <Favorite />, label: "Đề thi yêu thích" },
    {
      icon: <AssignmentTurnedIn />,
      label: "Kết quả thi",
      path: "/exam-result",
      roles: ["STUDENT"],
    },
  ];

  const managementItems = [
    {
      icon: <Description />,
      label: "Đề thi",
      path: "/workspace/exam",
      roles: ["TEACHER"],
    },
    {
      icon: <School />,
      label: "Lớp học tập",
      path: "/workspace/class",
      roles: ["TEACHER", "STUDENT"],
    },
    {
      icon: <Home />,
      label: "Phòng thi",
      path: "/workspace/exam-room",
      roles: ["TEACHER", "STUDENT"],
    },
    // { icon: <Category />, label: "Môn học" },
    {
      icon: <EmojiEvents />,
      label: "Ngân hàng câu hỏi",
      path: "/workspace/question-bank",
      roles: ["TEACHER"],
    },
    // { icon: <Settings />, label: "Cài đặt" },
  ];

  if (isMobile) return;

  console.log({ user });

  return (
    <>
      <motion.div
        animate={{ width: collapsed ? 80 : 320 }}
        initial={false}
        transition={{ duration: 0.3 }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{
          height: "100vh",
          background: "#fff",
          borderRight: "1px solid #f3f1f1",
          position: "relative",
          display: "flex",
          paddingRight: 0,
          flexDirection: "column",
        }}
      >
        <div className={`flex items-center px-3 gap-x-2 py-1`}>
          <img
            src="/assets/images/logo_128x128.webp"
            className="w-11 h-11"
            alt=""
          />
          {!collapsed && !isAnimating && (
            <Typography sx={{ fontSize: "25.6px", fontWeight: 600 }}>
              EduQuiz
            </Typography>
          )}
        </div>
        <List sx={{ paddingX: 1 }}>
          <ListItem
            sx={{ paddingRight: 0 }}
            component="button"
            onClick={(e) => {
              if (!collapsed && !isAnimating) setOpenPersonal(!openPersonal);
              else handleClick(e, personalItems);
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Person />
            </ListItemIcon>
            <ListItemText
              primary={
                <div className="flex items-center justify-between w-full">
                  {!collapsed && !isAnimating && (
                    <Typography>Cá nhân</Typography>
                  )}
                  {openPersonal ? (
                    <ExpandMore sx={{ fontSize: 18 }} />
                  ) : (
                    <ChevronRight sx={{ fontSize: 18 }} />
                  )}
                </div>
              }
            />
          </ListItem>

          <Collapse
            in={!collapsed && !isAnimating && openPersonal}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {personalItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item, i) => (
                  <Link to={item.path} key={i}>
                    <ListItem
                      component="button"
                      sx={{ pl: 4 }}
                      className="hover:bg-[#f0f3ff] hover:text-[#3E65FE]"
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  </Link>
                ))}
            </List>
          </Collapse>
        </List>

        <Divider />

        <List sx={{ paddingX: 1 }}>
          <ListItem
            component="button"
            sx={{ paddingRight: 0 }}
            onClick={(e) => {
              if (!collapsed && !isAnimating) setOpenManage(!openManage);
              else handleClick(e, managementItems);
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <School />
            </ListItemIcon>
            <ListItemText
              primary={
                <div className="flex items-center justify-between w-full">
                  {!collapsed && !isAnimating && (
                    <Typography>Lớp học</Typography>
                  )}
                  {openManage ? (
                    <ExpandMore sx={{ fontSize: 18 }} />
                  ) : (
                    <ChevronRight sx={{ fontSize: 18 }} />
                  )}
                </div>
              }
            />
          </ListItem>

          <Collapse
            in={!collapsed && !isAnimating && openManage}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {managementItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item, i) => (
                  <Link to={item.path} key={i}>
                    <ListItem
                      component="button"
                      key={i}
                      sx={{ pl: 4 }}
                      className="hover:bg-[#f0f3ff] hover:text-[#3E65FE]"
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  </Link>
                ))}
            </List>
          </Collapse>
        </List>

        <Box flexGrow={1} />
        <Divider />

        <Box p={2}>
          <SupportAgent color="warning" />
          {!collapsed && !isAnimating && (
            <>
              <Typography variant="body2" mt={1}>
                Hỗ trợ tư vấn
              </Typography>
              <Typography variant="caption" display="block" mt={2}>
                © EduQuiz 2022 - 2025
              </Typography>
            </>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={handleCollapsed}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translate(50%, -50%)",
            background: "#fff",
            border: "1px solid #ddd",
            boxShadow: 1,
            "&:hover": { background: "#f0f0f0" },
            zIndex: 50,
          }}
        >
          {collapsed ? (
            <ChevronRight fontSize="medium" />
          ) : (
            <ChevronLeft fontSize="medium" />
          )}
        </IconButton>
      </motion.div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
        PaperProps={{
          sx: {
            px: 1.5,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {menuItems.map((item: any, index) => (
          <MenuItem sx={{ paddingY: 1.5 }} onClick={handleClose} key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Sidebar;
