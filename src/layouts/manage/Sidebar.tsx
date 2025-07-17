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
  Drawer,
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
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useThemeMediaQuery } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import { Link } from "react-router-dom";
import { closeSidebar, selectSidebar } from "../../store/slices/globalSlice";
import { type AppDispatch } from "../../store/store";

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
  const sidebar = useSelector(selectSidebar);
  const dispatch = useDispatch<AppDispatch>();

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
  ];

  const managementItems = [
    // {
    //   icon: <AssessmentOutlinedIcon />,
    //   label: "Thống kê",
    //   path: "/workspace/dashboard",
    //   roles: ["ADMIN"],
    // },
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
      icon: <MeetingRoomIcon />,
      label: "Kỳ thi",
      path: "/workspace/room-exam",
      roles: ["TEACHER", "STUDENT"],
    },
    {
      icon: <AssignmentTurnedIn />,
      label: "Kết quả thi",
      path: "/workspace/exam-result",
      roles: ["TEACHER"],
    },
    // { icon: <Category />, label: "Môn học" },
    {
      icon: <EmojiEvents />,
      label: "Ngân hàng câu hỏi",
      path: "/workspace/question-bank",
      roles: ["TEACHER"],
    },
    // { icon: <Settings />, label: "Cài đặt" },
    {
      icon: <School />,
      label: "Giảng viên",
      path: "/workspace/teacher",
      roles: ["ADMIN"],
    },
    {
      icon: <Person />,
      label: "Sinh viên",
      path: "/workspace/student",
      roles: ["ADMIN"],
    },
    {
      icon: <SubjectOutlinedIcon />,
      label: "Môn học",
      path: "/workspace/subject",
      roles: ["ADMIN"],
    },
  ];

  // if (isMobile) return;

  // console.log({ user });

  console.log({ sidebar });

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor="left"
          open={sidebar?.isOpen}
          onClose={() => dispatch(closeSidebar())}
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
          {user?.role !== "ADMIN" ? (
            <>
              <List sx={{ paddingX: 1 }}>
                <ListItem
                  sx={{ paddingRight: 0 }}
                  component="button"
                  onClick={(e) => {
                    if (!collapsed && !isAnimating)
                      setOpenPersonal(!openPersonal);
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
                        <Link
                          to={item.path}
                          key={i}
                          onClick={() => dispatch(closeSidebar())}
                        >
                          <ListItem
                            component="button"
                            sx={{
                              pl: 4,
                              "&:hover .MuiSvgIcon-root": {
                                color: "#3E65FE", // Màu khi hover
                              },
                            }}
                            className="hover:bg-[#f0f3ff] hover:text-[#3E65FE]"
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 36,
                              }}
                            >
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
                        <Link
                          to={item.path}
                          key={i}
                          onClick={() => dispatch(closeSidebar())}
                        >
                          <ListItem
                            component="button"
                            key={i}
                            sx={{
                              pl: 4,
                              "&:hover .MuiSvgIcon-root": {
                                color: "#3E65FE", // Màu khi hover
                              },
                            }}
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
            </>
          ) : (
            <>
              <List sx={{ paddingX: 1 }}>
                <ListItem
                  sx={{ paddingRight: 0 }}
                  component="button"
                  onClick={(e) => {
                    if (!collapsed && !isAnimating)
                      setOpenPersonal(!openPersonal);
                    else handleClick(e, personalItems);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ManageSearchOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="flex items-center justify-between w-full">
                        {!collapsed && !isAnimating && (
                          <Typography>Quản lý</Typography>
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
                    {managementItems
                      .filter((item) => item.roles.includes(user?.role))
                      .map((item, i) => (
                        <Link
                          to={item.path}
                          key={i}
                          onClick={() => dispatch(closeSidebar())}
                        >
                          <ListItem
                            component="button"
                            sx={{
                              pl: 4,
                              "&:hover .MuiSvgIcon-root": {
                                color: "#3E65FE", // Màu khi hover
                              },
                            }}
                            className="hover:bg-[#f0f3ff] hover:text-[#3E65FE]"
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 36,
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                          </ListItem>
                        </Link>
                      ))}
                  </List>
                </Collapse>
              </List>
            </>
          )}

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
        </Drawer>
      ) : (
        // </motion.div>
        <motion.div
          animate={{ width: collapsed ? 80 : 320 }}
          initial={false}
          transition={{ duration: 0.3 }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          style={
            {
              height: "100vh",
              background: "#fff",
              borderRight: "1px solid #f3f1f1",
              position: "relative",
              display: "flex",
              paddingRight: 0,
              flexDirection: "column",
            } as React.CSSProperties
          }
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
          {user?.role !== "ADMIN" ? (
            <>
              <List sx={{ paddingX: 1 }}>
                <ListItem
                  sx={{ paddingRight: 0 }}
                  component="button"
                  onClick={(e) => {
                    if (!collapsed && !isAnimating)
                      setOpenPersonal(!openPersonal);
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
                            sx={{
                              pl: 4,
                              "&:hover .MuiSvgIcon-root": {
                                color: "#3E65FE", // Màu khi hover
                              },
                            }}
                            className="hover:bg-[#f0f3ff] hover:text-[#3E65FE]"
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 36,
                              }}
                            >
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
                            sx={{
                              pl: 4,
                              "&:hover .MuiSvgIcon-root": {
                                color: "#3E65FE", // Màu khi hover
                              },
                            }}
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
            </>
          ) : (
            <>
              <List sx={{ paddingX: 1 }}>
                <ListItem
                  sx={{ paddingRight: 0 }}
                  component="button"
                  onClick={(e) => {
                    if (!collapsed && !isAnimating)
                      setOpenPersonal(!openPersonal);
                    else handleClick(e, personalItems);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ManageSearchOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="flex items-center justify-between w-full">
                        {!collapsed && !isAnimating && (
                          <Typography>Quản lý</Typography>
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
                    {managementItems
                      .filter((item) => item.roles.includes(user?.role))
                      .map((item, i) => (
                        <Link to={item.path} key={i}>
                          <ListItem
                            component="button"
                            sx={{
                              pl: 4,
                              "&:hover .MuiSvgIcon-root": {
                                color: "#3E65FE", // Màu khi hover
                              },
                            }}
                            className="hover:bg-[#f0f3ff] hover:text-[#3E65FE]"
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 36,
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                          </ListItem>
                        </Link>
                      ))}
                  </List>
                </Collapse>
              </List>
            </>
          )}

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
      )}
    </>
  );
};

export default Sidebar;
